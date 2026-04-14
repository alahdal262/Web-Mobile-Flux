<?php
/**
 * Webhook dispatcher — fires webhooks to the SaaS platform on content changes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MobileWP_Webhooks {

	/** Collect events during a single request to debounce bulk operations. */
	private static array $pending_events = [];
	private static bool  $shutdown_registered = false;

	public static function init(): void {
		$webhook_url = get_option( 'mobilewp_webhook_url', '' );
		if ( empty( $webhook_url ) ) {
			return;
		}

		// Post/page lifecycle
		add_action( 'transition_post_status', [ __CLASS__, 'on_post_status_change' ], 10, 3 );
		add_action( 'before_delete_post', [ __CLASS__, 'on_post_deleted' ], 10, 2 );

		// Taxonomy
		add_action( 'created_category', [ __CLASS__, 'on_category_created' ], 10, 2 );
		add_action( 'edited_category', [ __CLASS__, 'on_category_edited' ], 10, 2 );
		add_action( 'delete_category', [ __CLASS__, 'on_category_deleted' ], 10, 4 );

		// Menus
		add_action( 'wp_update_nav_menu', [ __CLASS__, 'on_menu_updated' ], 10, 1 );

		// Media
		add_action( 'add_attachment', [ __CLASS__, 'on_media_uploaded' ], 10, 1 );
		add_action( 'delete_attachment', [ __CLASS__, 'on_media_deleted' ], 10, 1 );

		// Site settings
		add_action( 'update_option_blogname', [ __CLASS__, 'on_site_settings_changed' ] );
		add_action( 'update_option_blogdescription', [ __CLASS__, 'on_site_settings_changed' ] );
		add_action( 'update_option_site_icon', [ __CLASS__, 'on_site_settings_changed' ] );

		// Theme
		add_action( 'switch_theme', [ __CLASS__, 'on_theme_switched' ], 10, 3 );
	}

	// ──────────────────────────────────────────────
	// Hook handlers
	// ──────────────────────────────────────────────

	/**
	 * Handle post status transitions (covers create, update, trash, untrash).
	 */
	public static function on_post_status_change( string $new_status, string $old_status, WP_Post $post ): void {
		// Skip auto-saves, revisions, and non-public types
		if ( wp_is_post_autosave( $post ) || wp_is_post_revision( $post ) ) {
			return;
		}

		$allowed_types = [ 'post', 'page' ];
		if ( ! in_array( $post->post_type, $allowed_types, true ) ) {
			return;
		}

		$type_prefix = $post->post_type; // 'post' or 'page'

		if ( $old_status === 'auto-draft' && $new_status === 'publish' ) {
			self::queue_event( "{$type_prefix}.created", MobileWP_Sync::format_post( $post ) );
		} elseif ( $new_status === 'publish' && $old_status === 'publish' ) {
			self::queue_event( "{$type_prefix}.updated", MobileWP_Sync::format_post( $post ) );
		} elseif ( $new_status === 'trash' ) {
			self::queue_event( "{$type_prefix}.trashed", [
				'id'    => $post->ID,
				'title' => get_the_title( $post ),
				'type'  => $post->post_type,
			] );
		} elseif ( $old_status !== 'publish' && $new_status === 'publish' ) {
			// Untrash or draft → publish
			self::queue_event( "{$type_prefix}.created", MobileWP_Sync::format_post( $post ) );
		}
	}

	/**
	 * Handle permanent post deletion.
	 */
	public static function on_post_deleted( int $post_id, WP_Post $post ): void {
		$allowed_types = [ 'post', 'page' ];
		if ( ! in_array( $post->post_type, $allowed_types, true ) ) {
			return;
		}

		self::queue_event( "{$post->post_type}.deleted", [
			'id'    => $post_id,
			'title' => get_the_title( $post ),
			'type'  => $post->post_type,
		] );
	}

	public static function on_category_created( int $term_id, int $tt_id ): void {
		$term = get_term( $term_id, 'category' );
		if ( $term && ! is_wp_error( $term ) ) {
			self::queue_event( 'category.created', MobileWP_Sync::format_category( $term ) );
		}
	}

	public static function on_category_edited( int $term_id, int $tt_id ): void {
		$term = get_term( $term_id, 'category' );
		if ( $term && ! is_wp_error( $term ) ) {
			self::queue_event( 'category.updated', MobileWP_Sync::format_category( $term ) );
		}
	}

	public static function on_category_deleted( int $term_id, int $tt_id, WP_Term $term, array $object_ids ): void {
		self::queue_event( 'category.deleted', [
			'id'   => $term_id,
			'name' => $term->name,
			'slug' => $term->slug,
		] );
	}

	public static function on_menu_updated( int $menu_id ): void {
		$menu = wp_get_nav_menu_object( $menu_id );
		if ( $menu ) {
			self::queue_event( 'menu.updated', MobileWP_Sync::format_menu( $menu ) );
		}
	}

	public static function on_media_uploaded( int $attachment_id ): void {
		$attachment = get_post( $attachment_id );
		if ( $attachment ) {
			self::queue_event( 'media.uploaded', MobileWP_Sync::format_media( $attachment ) );
		}
	}

	public static function on_media_deleted( int $attachment_id ): void {
		self::queue_event( 'media.deleted', [
			'id'  => $attachment_id,
			'url' => wp_get_attachment_url( $attachment_id ) ?: '',
		] );
	}

	public static function on_site_settings_changed(): void {
		// Debounce: only fire once even if multiple options change in the same request
		static $already_queued = false;
		if ( $already_queued ) {
			return;
		}
		$already_queued = true;

		self::queue_event( 'site.settings_updated', MobileWP_Sync::format_site_info() );
	}

	public static function on_theme_switched( string $new_name, WP_Theme $new_theme, WP_Theme $old_theme ): void {
		self::queue_event( 'theme.switched', [
			'old_theme' => $old_theme->get_stylesheet(),
			'new_theme' => $new_theme->get_stylesheet(),
		] );
	}

	// ──────────────────────────────────────────────
	// Dispatch engine
	// ──────────────────────────────────────────────

	/**
	 * Queue an event for dispatch at shutdown (debouncing).
	 */
	private static function queue_event( string $event, array $payload ): void {
		self::$pending_events[] = [ 'event' => $event, 'payload' => $payload ];

		if ( ! self::$shutdown_registered ) {
			add_action( 'shutdown', [ __CLASS__, 'flush_events' ] );
			self::$shutdown_registered = true;
		}
	}

	/**
	 * Send all queued events at the end of the request.
	 */
	public static function flush_events(): void {
		foreach ( self::$pending_events as $item ) {
			self::dispatch( $item['event'], $item['payload'] );
		}
		self::$pending_events = [];
	}

	/**
	 * Send a single webhook to the configured URL.
	 *
	 * @return array{success: bool, status_code: int, event: string, error?: string}
	 */
	public static function dispatch( string $event, array $payload ): array {
		$webhook_url = get_option( 'mobilewp_webhook_url', '' );
		$api_key     = get_option( 'mobilewp_site_api_key', '' );

		if ( empty( $webhook_url ) ) {
			return [ 'success' => false, 'status_code' => 0, 'event' => $event, 'error' => 'No webhook URL configured' ];
		}

		$body = wp_json_encode( [
			'event'     => $event,
			'siteUrl'   => get_site_url(),
			'siteId'    => get_option( 'mobilewp_site_id', '' ),
			'timestamp' => gmdate( 'c' ),
			'payload'   => $payload,
		] );

		$signature   = MobileWP_Auth::sign_payload( $body );
		$delivery_id = wp_generate_uuid4();

		$response = wp_remote_post( $webhook_url, [
			'headers' => [
				'Content-Type'          => 'application/json',
				'Authorization'         => 'Bearer ' . $api_key,
				'X-MobileWP-Signature'  => 'sha256=' . $signature,
				'X-MobileWP-Event'      => $event,
				'X-MobileWP-Delivery'   => $delivery_id,
				'User-Agent'            => 'MobileWP-Connector/' . MOBILEWP_VERSION,
			],
			'body'      => $body,
			'timeout'   => 15,
			'sslverify' => true,
		] );

		$is_error    = is_wp_error( $response );
		$status_code = $is_error ? 0 : (int) wp_remote_retrieve_response_code( $response );
		$success     = ! $is_error && $status_code >= 200 && $status_code < 300;
		$error_msg   = $is_error ? $response->get_error_message() : null;

		// Log delivery
		self::log_delivery( $event, $success, $status_code, $error_msg );

		// Track consecutive failures
		if ( ! $success ) {
			$fails = (int) get_option( 'mobilewp_consecutive_failures', 0 );
			update_option( 'mobilewp_consecutive_failures', $fails + 1, false );
			if ( $fails >= 10 ) {
				update_option( 'mobilewp_connection_status', 'degraded', false );
			}
		} else {
			update_option( 'mobilewp_consecutive_failures', 0, false );
			update_option( 'mobilewp_connection_status', 'connected', false );
		}

		return [
			'success'     => $success,
			'status_code' => $status_code,
			'event'       => $event,
			'error'       => $error_msg,
		];
	}

	/**
	 * Log a webhook delivery to the circular buffer.
	 */
	private static function log_delivery( string $event, bool $success, int $status, ?string $error ): void {
		$logs = get_option( 'mobilewp_webhook_logs', [] );
		if ( ! is_array( $logs ) ) {
			$logs = [];
		}

		array_unshift( $logs, [
			'event'     => $event,
			'success'   => $success,
			'status'    => $status,
			'error'     => $error,
			'timestamp' => current_time( 'mysql' ),
		] );

		// Keep last 50
		$logs = array_slice( $logs, 0, 50 );
		update_option( 'mobilewp_webhook_logs', $logs, false );
	}

	/**
	 * Send a test webhook event.
	 */
	public static function send_test(): array {
		return self::dispatch( 'test.ping', [
			'message'   => __( 'Test webhook from Mobile-WP Connector', 'mobilewp-connector' ),
			'timestamp' => gmdate( 'c' ),
			'site_url'  => get_site_url(),
		] );
	}
}

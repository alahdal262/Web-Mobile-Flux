<?php
/**
 * Admin settings page controller.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MobileWP_Admin {

	private static string $page_hook = '';

	public static function init(): void {
		add_action( 'admin_menu', [ __CLASS__, 'add_menu' ] );
		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_assets' ] );
		add_filter( 'plugin_action_links_' . MOBILEWP_PLUGIN_BASENAME, [ __CLASS__, 'add_settings_link' ] );

		// AJAX handlers
		add_action( 'wp_ajax_mobilewp_save_settings', [ __CLASS__, 'ajax_save_settings' ] );
		add_action( 'wp_ajax_mobilewp_test_webhook', [ __CLASS__, 'ajax_test_webhook' ] );
		add_action( 'wp_ajax_mobilewp_regenerate_keys', [ __CLASS__, 'ajax_regenerate_keys' ] );
		add_action( 'wp_ajax_mobilewp_clear_logs', [ __CLASS__, 'ajax_clear_logs' ] );
	}

	public static function add_menu(): void {
		self::$page_hook = add_menu_page(
			__( 'Mobile-WP Connector', 'mobilewp-connector' ),
			__( 'MobileWP', 'mobilewp-connector' ),
			'manage_options',
			'mobilewp-connector',
			[ __CLASS__, 'render_page' ],
			'dashicons-smartphone',
			80
		);
	}

	public static function render_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Unauthorized access.', 'mobilewp-connector' ) );
		}
		include MOBILEWP_PLUGIN_DIR . 'admin/settings-page.php';
	}

	public static function enqueue_assets( string $hook ): void {
		if ( $hook !== self::$page_hook ) {
			return;
		}

		wp_enqueue_style(
			'mobilewp-admin',
			MOBILEWP_PLUGIN_URL . 'admin/css/admin.css',
			[],
			MOBILEWP_VERSION
		);

		wp_enqueue_script(
			'mobilewp-admin',
			MOBILEWP_PLUGIN_URL . 'assets/js/admin.js',
			[],
			MOBILEWP_VERSION,
			true
		);

		wp_localize_script( 'mobilewp-admin', 'mobilewp_params', [
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'nonce'    => wp_create_nonce( 'mobilewp_admin_nonce' ),
		] );
	}

	/**
	 * Add "Settings" link on the Plugins page.
	 */
	public static function add_settings_link( array $links ): array {
		$url  = admin_url( 'admin.php?page=mobilewp-connector' );
		$link = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Settings', 'mobilewp-connector' ) . '</a>';
		array_unshift( $links, $link );
		return $links;
	}

	// ──────────────────────────────────────────────
	// AJAX Handlers
	// ──────────────────────────────────────────────

	public static function ajax_save_settings(): void {
		check_ajax_referer( 'mobilewp_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => __( 'Unauthorized.', 'mobilewp-connector' ) ] );
		}

		$fields = [
			'mobilewp_platform_api_key',
			'mobilewp_site_api_key',
			'mobilewp_webhook_url',
			'mobilewp_site_id',
		];

		foreach ( $fields as $field ) {
			if ( isset( $_POST[ $field ] ) ) {
				update_option( $field, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
			}
		}

		// Update connection status
		$platform_key = get_option( 'mobilewp_platform_api_key', '' );
		$webhook_url  = get_option( 'mobilewp_webhook_url', '' );
		$connected    = ! empty( $platform_key ) && ! empty( $webhook_url );
		update_option( 'mobilewp_connected', $connected );
		if ( $connected ) {
			update_option( 'mobilewp_connection_status', 'connected' );
		}

		wp_send_json_success( [ 'message' => __( 'Settings saved successfully.', 'mobilewp-connector' ) ] );
	}

	public static function ajax_test_webhook(): void {
		check_ajax_referer( 'mobilewp_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => __( 'Unauthorized.', 'mobilewp-connector' ) ] );
		}

		$result = MobileWP_Webhooks::send_test();

		if ( $result['success'] ) {
			wp_send_json_success( [
				'message'     => __( 'Test webhook sent successfully!', 'mobilewp-connector' ),
				'status_code' => $result['status_code'],
			] );
		} else {
			wp_send_json_error( [
				'message'     => sprintf(
					/* translators: %s: error message */
					__( 'Webhook failed: %s', 'mobilewp-connector' ),
					$result['error'] ?? __( 'Unknown error', 'mobilewp-connector' )
				),
				'status_code' => $result['status_code'],
			] );
		}
	}

	public static function ajax_regenerate_keys(): void {
		check_ajax_referer( 'mobilewp_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => __( 'Unauthorized.', 'mobilewp-connector' ) ] );
		}

		$keys = MobileWP_Auth::regenerate_keys();

		wp_send_json_success( [
			'message'      => __( 'API keys regenerated successfully.', 'mobilewp-connector' ),
			'platform_key' => $keys['platform_key'],
			'site_key'     => $keys['site_key'],
		] );
	}

	public static function ajax_clear_logs(): void {
		check_ajax_referer( 'mobilewp_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => __( 'Unauthorized.', 'mobilewp-connector' ) ] );
		}

		update_option( 'mobilewp_webhook_logs', [] );
		update_option( 'mobilewp_consecutive_failures', 0 );

		wp_send_json_success( [ 'message' => __( 'Webhook logs cleared.', 'mobilewp-connector' ) ] );
	}

	/**
	 * Get current site info for admin display.
	 */
	public static function get_site_info(): array {
		return [
			'wordpress_version' => get_bloginfo( 'version' ),
			'php_version'       => PHP_VERSION,
			'theme'             => wp_get_theme()->get( 'Name' ),
			'woocommerce'       => class_exists( 'WooCommerce' ) ? ( defined( 'WC_VERSION' ) ? WC_VERSION : __( 'Active', 'mobilewp-connector' ) ) : __( 'Not installed', 'mobilewp-connector' ),
			'locale'            => get_locale(),
			'permalink'         => get_option( 'permalink_structure', '' ) ?: __( 'Plain', 'mobilewp-connector' ),
			'multisite'         => is_multisite() ? __( 'Yes', 'mobilewp-connector' ) : __( 'No', 'mobilewp-connector' ),
			'rest_url'          => get_rest_url( null, MOBILEWP_REST_NAMESPACE ),
			'plugin_version'    => MOBILEWP_VERSION,
		];
	}
}

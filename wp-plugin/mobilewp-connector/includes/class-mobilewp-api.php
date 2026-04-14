<?php
/**
 * REST API endpoint registration and handlers.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MobileWP_API {

	public static function init(): void {
		add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
	}

	/**
	 * Register all REST routes.
	 */
	public static function register_routes(): void {
		$ns = MOBILEWP_REST_NAMESPACE;

		// Public endpoint (no auth) — used to detect plugin is installed
		register_rest_route( $ns, '/status', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_status' ],
			'permission_callback' => '__return_true',
		] );

		// Authenticated endpoints
		register_rest_route( $ns, '/site-info', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_site_info' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
		] );

		register_rest_route( $ns, '/posts', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_posts' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => self::get_posts_args(),
		] );

		register_rest_route( $ns, '/posts/(?P<id>\d+)', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_single_post' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => [
				'id' => [
					'required'          => true,
					'validate_callback' => fn( $v ) => is_numeric( $v ) && (int) $v > 0,
					'sanitize_callback' => 'absint',
				],
			],
		] );

		register_rest_route( $ns, '/pages', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_pages' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => self::get_pagination_args(),
		] );

		register_rest_route( $ns, '/categories', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_categories' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => [
				'parent'     => [
					'default'           => null,
					'sanitize_callback' => fn( $v ) => $v !== null ? absint( $v ) : null,
				],
				'hide_empty' => [
					'default'           => false,
					'sanitize_callback' => 'rest_sanitize_boolean',
				],
			],
		] );

		register_rest_route( $ns, '/tags', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_tags' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => self::get_pagination_args(),
		] );

		register_rest_route( $ns, '/media', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_media' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => array_merge( self::get_pagination_args(), [
				'mime_type' => [
					'default'           => null,
					'sanitize_callback' => 'sanitize_mime_type',
				],
			] ),
		] );

		register_rest_route( $ns, '/menus', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_menus' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
		] );

		register_rest_route( $ns, '/search', [
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => [ __CLASS__, 'handle_search' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => [
				'query' => [
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				],
				'page'     => [
					'default'           => 1,
					'sanitize_callback' => 'absint',
				],
				'per_page' => [
					'default'           => 20,
					'sanitize_callback' => 'absint',
				],
			],
		] );
	}

	// ──────────────────────────────────────────────
	// Handlers
	// ──────────────────────────────────────────────

	/**
	 * GET /status — public, no auth
	 */
	public static function handle_status(): WP_REST_Response {
		$woo_active  = class_exists( 'WooCommerce' );
		$woo_version = $woo_active && defined( 'WC_VERSION' ) ? WC_VERSION : null;

		return new WP_REST_Response( [
			'status'              => 'active',
			'plugin_version'      => MOBILEWP_VERSION,
			'wordpress_version'   => get_bloginfo( 'version' ),
			'php_version'         => PHP_VERSION,
			'woocommerce_active'  => $woo_active,
			'woocommerce_version' => $woo_version,
			'site_url'            => get_site_url(),
			'locale'              => get_locale(),
			'timezone'            => wp_timezone_string(),
			'multisite'           => is_multisite(),
			'permalink_structure' => get_option( 'permalink_structure', '' ),
			'theme'               => get_stylesheet(),
			'connected'           => (bool) get_option( 'mobilewp_connected', false ),
			'timestamp'           => gmdate( 'c' ),
		] );
	}

	/**
	 * GET /site-info
	 */
	public static function handle_site_info(): WP_REST_Response {
		return new WP_REST_Response( MobileWP_Sync::format_site_info() );
	}

	/**
	 * GET /posts
	 */
	public static function handle_posts( WP_REST_Request $request ): WP_REST_Response {
		$page     = max( 1, $request->get_param( 'page' ) );
		$per_page = min( 100, max( 1, $request->get_param( 'per_page' ) ) );

		$args = [
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'paged'          => $page,
			'orderby'        => sanitize_text_field( $request->get_param( 'orderby' ) ?: 'date' ),
			'order'          => strtoupper( sanitize_text_field( $request->get_param( 'order' ) ?: 'DESC' ) ),
		];

		// Category filter
		$categories = $request->get_param( 'categories' );
		if ( $categories ) {
			$args['cat'] = sanitize_text_field( $categories );
		}

		// Tag filter
		$tags = $request->get_param( 'tags' );
		if ( $tags ) {
			$args['tag_id'] = absint( $tags );
		}

		// Search filter
		$search = $request->get_param( 'search' );
		if ( $search ) {
			$args['s'] = sanitize_text_field( $search );
		}

		// Date filter
		$after = $request->get_param( 'after' );
		if ( $after ) {
			$args['date_query'] = [
				[ 'after' => sanitize_text_field( $after ), 'inclusive' => true ],
			];
		}

		$query = new WP_Query( $args );
		$posts = array_map( [ MobileWP_Sync::class, 'format_post' ], $query->posts );

		return new WP_REST_Response( [
			'data'       => $posts,
			'pagination' => MobileWP_Sync::build_pagination( $query, $page, $per_page ),
		] );
	}

	/**
	 * GET /posts/{id}
	 */
	public static function handle_single_post( WP_REST_Request $request ): WP_REST_Response {
		$post = get_post( $request->get_param( 'id' ) );

		if ( ! $post || $post->post_status !== 'publish' ) {
			return new WP_REST_Response(
				[ 'error' => __( 'Post not found.', 'mobilewp-connector' ) ],
				404
			);
		}

		return new WP_REST_Response( MobileWP_Sync::format_post( $post ) );
	}

	/**
	 * GET /pages
	 */
	public static function handle_pages( WP_REST_Request $request ): WP_REST_Response {
		$page     = max( 1, $request->get_param( 'page' ) );
		$per_page = min( 100, max( 1, $request->get_param( 'per_page' ) ) );

		$query = new WP_Query( [
			'post_type'      => 'page',
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'paged'          => $page,
			'orderby'        => 'menu_order title',
			'order'          => 'ASC',
		] );

		$pages = array_map( [ MobileWP_Sync::class, 'format_page' ], $query->posts );

		return new WP_REST_Response( [
			'data'       => $pages,
			'pagination' => MobileWP_Sync::build_pagination( $query, $page, $per_page ),
		] );
	}

	/**
	 * GET /categories — returns tree structure
	 */
	public static function handle_categories( WP_REST_Request $request ): WP_REST_Response {
		$args = [
			'taxonomy'   => 'category',
			'hide_empty' => (bool) $request->get_param( 'hide_empty' ),
		];

		$parent = $request->get_param( 'parent' );
		if ( $parent !== null ) {
			$args['parent'] = (int) $parent;
		}

		$terms = get_terms( $args );

		if ( is_wp_error( $terms ) ) {
			return new WP_REST_Response(
				[ 'error' => $terms->get_error_message() ],
				500
			);
		}

		// Build hierarchical tree if no parent filter
		if ( $parent === null ) {
			$data = MobileWP_Sync::build_category_tree( $terms, 0 );
		} else {
			$data = array_map( [ MobileWP_Sync::class, 'format_category' ], $terms );
		}

		return new WP_REST_Response( [ 'data' => $data ] );
	}

	/**
	 * GET /tags
	 */
	public static function handle_tags( WP_REST_Request $request ): WP_REST_Response {
		$per_page = min( 100, max( 1, $request->get_param( 'per_page' ) ) );

		$terms = get_terms( [
			'taxonomy'   => 'post_tag',
			'hide_empty' => true,
			'number'     => $per_page,
			'offset'     => ( max( 1, $request->get_param( 'page' ) ) - 1 ) * $per_page,
		] );

		if ( is_wp_error( $terms ) ) {
			return new WP_REST_Response( [ 'error' => $terms->get_error_message() ], 500 );
		}

		return new WP_REST_Response( [
			'data' => array_map( [ MobileWP_Sync::class, 'format_tag' ], $terms ),
		] );
	}

	/**
	 * GET /media
	 */
	public static function handle_media( WP_REST_Request $request ): WP_REST_Response {
		$page     = max( 1, $request->get_param( 'page' ) );
		$per_page = min( 100, max( 1, $request->get_param( 'per_page' ) ) );

		$args = [
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'posts_per_page' => $per_page,
			'paged'          => $page,
			'orderby'        => 'date',
			'order'          => 'DESC',
		];

		$mime = $request->get_param( 'mime_type' );
		if ( $mime ) {
			$args['post_mime_type'] = $mime;
		}

		$query = new WP_Query( $args );
		$media = array_map( [ MobileWP_Sync::class, 'format_media' ], $query->posts );

		return new WP_REST_Response( [
			'data'       => $media,
			'pagination' => MobileWP_Sync::build_pagination( $query, $page, $per_page ),
		] );
	}

	/**
	 * GET /menus
	 */
	public static function handle_menus(): WP_REST_Response {
		$menus = wp_get_nav_menus();

		if ( empty( $menus ) ) {
			return new WP_REST_Response( [ 'data' => [] ] );
		}

		$data = array_map( [ MobileWP_Sync::class, 'format_menu' ], $menus );

		return new WP_REST_Response( [ 'data' => $data ] );
	}

	/**
	 * POST /search
	 */
	public static function handle_search( WP_REST_Request $request ): WP_REST_Response {
		$search_query = $request->get_param( 'query' );
		$page         = max( 1, $request->get_param( 'page' ) );
		$per_page     = min( 100, max( 1, $request->get_param( 'per_page' ) ) );

		$query = new WP_Query( [
			'post_type'      => [ 'post', 'page' ],
			'post_status'    => 'publish',
			's'              => $search_query,
			'posts_per_page' => $per_page,
			'paged'          => $page,
		] );

		$results = array_map( function ( WP_Post $post ) {
			if ( $post->post_type === 'page' ) {
				return MobileWP_Sync::format_page( $post );
			}
			return MobileWP_Sync::format_post( $post );
		}, $query->posts );

		return new WP_REST_Response( [
			'data'       => $results,
			'query'      => $search_query,
			'pagination' => MobileWP_Sync::build_pagination( $query, $page, $per_page ),
		] );
	}

	// ──────────────────────────────────────────────
	// Argument definitions
	// ──────────────────────────────────────────────

	private static function get_pagination_args(): array {
		return [
			'page'     => [
				'default'           => 1,
				'sanitize_callback' => 'absint',
			],
			'per_page' => [
				'default'           => 20,
				'sanitize_callback' => 'absint',
			],
		];
	}

	private static function get_posts_args(): array {
		return array_merge( self::get_pagination_args(), [
			'categories' => [
				'default'           => null,
				'sanitize_callback' => 'sanitize_text_field',
			],
			'tags' => [
				'default'           => null,
				'sanitize_callback' => 'absint',
			],
			'search' => [
				'default'           => null,
				'sanitize_callback' => 'sanitize_text_field',
			],
			'after' => [
				'default'           => null,
				'sanitize_callback' => 'sanitize_text_field',
			],
			'orderby' => [
				'default'           => 'date',
				'sanitize_callback' => 'sanitize_text_field',
			],
			'order' => [
				'default'           => 'DESC',
				'sanitize_callback' => 'sanitize_text_field',
			],
		] );
	}
}

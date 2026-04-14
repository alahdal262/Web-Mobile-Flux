<?php
/**
 * WooCommerce integration — only loaded when WooCommerce is active.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MobileWP_Woo {

	public static function init(): void {
		add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );

		// Product webhooks
		add_action( 'woocommerce_new_product', [ __CLASS__, 'on_product_created' ], 10, 1 );
		add_action( 'woocommerce_update_product', [ __CLASS__, 'on_product_updated' ], 10, 1 );
		add_action( 'woocommerce_trash_product', [ __CLASS__, 'on_product_trashed' ], 10, 1 );

		// Order webhooks
		add_action( 'woocommerce_new_order', [ __CLASS__, 'on_order_created' ], 10, 1 );
		add_action( 'woocommerce_order_status_changed', [ __CLASS__, 'on_order_status_changed' ], 10, 4 );
	}

	public static function register_routes(): void {
		$ns = MOBILEWP_REST_NAMESPACE;

		register_rest_route( $ns, '/products', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_products' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => [
				'page'     => [ 'default' => 1, 'sanitize_callback' => 'absint' ],
				'per_page' => [ 'default' => 20, 'sanitize_callback' => 'absint' ],
				'category' => [ 'default' => null, 'sanitize_callback' => 'absint' ],
				'on_sale'  => [ 'default' => null, 'sanitize_callback' => 'rest_sanitize_boolean' ],
				'featured' => [ 'default' => null, 'sanitize_callback' => 'rest_sanitize_boolean' ],
				'search'   => [ 'default' => null, 'sanitize_callback' => 'sanitize_text_field' ],
				'orderby'  => [ 'default' => 'date', 'sanitize_callback' => 'sanitize_text_field' ],
				'order'    => [ 'default' => 'DESC', 'sanitize_callback' => 'sanitize_text_field' ],
			],
		] );

		register_rest_route( $ns, '/products/(?P<id>\d+)', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_single_product' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => [
				'id' => [
					'required'          => true,
					'validate_callback' => fn( $v ) => is_numeric( $v ) && (int) $v > 0,
					'sanitize_callback' => 'absint',
				],
			],
		] );

		register_rest_route( $ns, '/product-categories', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'handle_product_categories' ],
			'permission_callback' => [ MobileWP_Auth::class, 'permission_callback' ],
			'args'                => [
				'parent'     => [ 'default' => null, 'sanitize_callback' => fn( $v ) => $v !== null ? absint( $v ) : null ],
				'hide_empty' => [ 'default' => false, 'sanitize_callback' => 'rest_sanitize_boolean' ],
			],
		] );
	}

	// ──────────────────────────────────────────────
	// Handlers
	// ──────────────────────────────────────────────

	public static function handle_products( WP_REST_Request $request ): WP_REST_Response {
		$page     = max( 1, $request->get_param( 'page' ) );
		$per_page = min( 100, max( 1, $request->get_param( 'per_page' ) ) );

		$args = [
			'status'  => 'publish',
			'limit'   => $per_page,
			'page'    => $page,
			'orderby' => sanitize_text_field( $request->get_param( 'orderby' ) ),
			'order'   => strtoupper( sanitize_text_field( $request->get_param( 'order' ) ) ),
			'return'  => 'objects',
		];

		$category = $request->get_param( 'category' );
		if ( $category ) {
			$args['category'] = [ (int) $category ];
		}

		$on_sale = $request->get_param( 'on_sale' );
		if ( $on_sale !== null ) {
			$args['on_sale'] = $on_sale;
		}

		$featured = $request->get_param( 'featured' );
		if ( $featured !== null ) {
			$args['featured'] = $featured;
		}

		$search = $request->get_param( 'search' );
		if ( $search ) {
			$args['s'] = $search;
		}

		$products = wc_get_products( $args );
		$data     = array_map( [ __CLASS__, 'format_product' ], $products );

		// Get total count for pagination
		$count_args          = $args;
		$count_args['limit'] = -1;
		$count_args['return'] = 'ids';
		$total               = count( wc_get_products( $count_args ) );

		return new WP_REST_Response( [
			'data'       => $data,
			'pagination' => [
				'page'        => $page,
				'per_page'    => $per_page,
				'total'       => $total,
				'total_pages' => (int) ceil( $total / $per_page ),
			],
		] );
	}

	public static function handle_single_product( WP_REST_Request $request ): WP_REST_Response {
		$product = wc_get_product( $request->get_param( 'id' ) );

		if ( ! $product || $product->get_status() !== 'publish' ) {
			return new WP_REST_Response(
				[ 'error' => __( 'Product not found.', 'mobilewp-connector' ) ],
				404
			);
		}

		return new WP_REST_Response( self::format_product( $product ) );
	}

	public static function handle_product_categories( WP_REST_Request $request ): WP_REST_Response {
		$args = [
			'taxonomy'   => 'product_cat',
			'hide_empty' => (bool) $request->get_param( 'hide_empty' ),
		];

		$parent = $request->get_param( 'parent' );
		if ( $parent !== null ) {
			$args['parent'] = (int) $parent;
		}

		$terms = get_terms( $args );

		if ( is_wp_error( $terms ) ) {
			return new WP_REST_Response( [ 'error' => $terms->get_error_message() ], 500 );
		}

		// Build tree
		$data = [];
		if ( $parent === null ) {
			$data = self::build_product_cat_tree( $terms, 0 );
		} else {
			$data = array_map( [ __CLASS__, 'format_product_category' ], $terms );
		}

		return new WP_REST_Response( [ 'data' => $data ] );
	}

	// ──────────────────────────────────────────────
	// Formatters
	// ──────────────────────────────────────────────

	public static function format_product( WC_Product $product ): array {
		$images = [];
		$image_id = $product->get_image_id();
		if ( $image_id ) {
			$images[] = self::format_product_image( $image_id );
		}
		foreach ( $product->get_gallery_image_ids() as $gallery_id ) {
			$images[] = self::format_product_image( $gallery_id );
		}

		$categories = [];
		foreach ( $product->get_category_ids() as $cat_id ) {
			$term = get_term( $cat_id, 'product_cat' );
			if ( $term && ! is_wp_error( $term ) ) {
				$categories[] = [ 'id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug ];
			}
		}

		$attributes = [];
		foreach ( $product->get_attributes() as $attr ) {
			if ( $attr instanceof WC_Product_Attribute ) {
				$attributes[] = [
					'name'      => wc_attribute_label( $attr->get_name() ),
					'options'   => $attr->get_options(),
					'visible'   => $attr->get_visible(),
					'variation' => $attr->get_variation(),
				];
			}
		}

		$variations = [];
		if ( $product->is_type( 'variable' ) ) {
			foreach ( $product->get_children() as $variation_id ) {
				$variation = wc_get_product( $variation_id );
				if ( $variation ) {
					$variations[] = self::format_variation( $variation );
				}
			}
		}

		return [
			'id'                => $product->get_id(),
			'name'              => $product->get_name(),
			'slug'              => $product->get_slug(),
			'type'              => $product->get_type(),
			'status'            => $product->get_status(),
			'permalink'         => $product->get_permalink(),
			'description'       => $product->get_description(),
			'short_description' => $product->get_short_description(),
			'sku'               => $product->get_sku(),
			'price'             => $product->get_price(),
			'regular_price'     => $product->get_regular_price(),
			'sale_price'        => $product->get_sale_price(),
			'on_sale'           => $product->is_on_sale(),
			'stock_status'      => $product->get_stock_status(),
			'stock_quantity'    => $product->get_stock_quantity(),
			'manage_stock'      => $product->get_manage_stock(),
			'weight'            => $product->get_weight(),
			'dimensions'        => [
				'length' => $product->get_length(),
				'width'  => $product->get_width(),
				'height' => $product->get_height(),
			],
			'categories'        => $categories,
			'images'            => $images,
			'attributes'        => $attributes,
			'variations'        => $variations,
			'average_rating'    => $product->get_average_rating(),
			'review_count'      => $product->get_review_count(),
			'date_created'      => $product->get_date_created()?->date( 'c' ),
			'date_modified'     => $product->get_date_modified()?->date( 'c' ),
		];
	}

	private static function format_variation( WC_Product $variation ): array {
		$image_id = $variation->get_image_id();

		return [
			'id'            => $variation->get_id(),
			'sku'           => $variation->get_sku(),
			'price'         => $variation->get_price(),
			'regular_price' => $variation->get_regular_price(),
			'sale_price'    => $variation->get_sale_price(),
			'on_sale'       => $variation->is_on_sale(),
			'stock_status'  => $variation->get_stock_status(),
			'stock_quantity' => $variation->get_stock_quantity(),
			'attributes'    => $variation->get_attributes(),
			'image'         => $image_id ? self::format_product_image( $image_id ) : null,
		];
	}

	private static function format_product_image( int $attachment_id ): array {
		return [
			'id'  => $attachment_id,
			'src' => wp_get_attachment_url( $attachment_id ) ?: '',
			'alt' => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) ?: '',
		];
	}

	private static function format_product_category( object $term ): array {
		$thumbnail_id = get_term_meta( $term->term_id, 'thumbnail_id', true );

		return [
			'id'          => $term->term_id,
			'name'        => $term->name,
			'slug'        => $term->slug,
			'description' => $term->description ?? '',
			'parent'      => (int) ( $term->parent ?? 0 ),
			'count'       => (int) ( $term->count ?? 0 ),
			'image'       => $thumbnail_id ? wp_get_attachment_url( (int) $thumbnail_id ) : null,
		];
	}

	private static function build_product_cat_tree( array $terms, int $parent_id ): array {
		$tree = [];
		foreach ( $terms as $term ) {
			if ( (int) $term->parent === $parent_id ) {
				$formatted             = self::format_product_category( $term );
				$formatted['children'] = self::build_product_cat_tree( $terms, $term->term_id );
				$tree[]                = $formatted;
			}
		}
		return $tree;
	}

	// ──────────────────────────────────────────────
	// Webhook handlers
	// ──────────────────────────────────────────────

	public static function on_product_created( int $product_id ): void {
		$product = wc_get_product( $product_id );
		if ( $product && $product->get_status() === 'publish' ) {
			MobileWP_Webhooks::dispatch( 'product.created', self::format_product( $product ) );
		}
	}

	public static function on_product_updated( int $product_id ): void {
		$product = wc_get_product( $product_id );
		if ( $product && $product->get_status() === 'publish' ) {
			MobileWP_Webhooks::dispatch( 'product.updated', self::format_product( $product ) );
		}
	}

	public static function on_product_trashed( int $product_id ): void {
		MobileWP_Webhooks::dispatch( 'product.deleted', [
			'id'   => $product_id,
			'type' => 'product',
		] );
	}

	public static function on_order_created( int $order_id ): void {
		MobileWP_Webhooks::dispatch( 'order.created', [
			'id'     => $order_id,
			'status' => wc_get_order( $order_id )?->get_status() ?? 'unknown',
		] );
	}

	public static function on_order_status_changed( int $order_id, string $old_status, string $new_status, WC_Order $order ): void {
		MobileWP_Webhooks::dispatch( 'order.status_changed', [
			'id'         => $order_id,
			'old_status' => $old_status,
			'new_status' => $new_status,
			'total'      => $order->get_total(),
		] );
	}
}

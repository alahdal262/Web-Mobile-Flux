<?php
/**
 * Data formatters — transforms WordPress objects into clean JSON structures.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MobileWP_Sync {

	/**
	 * Format a WP_Post into the standard post JSON shape.
	 */
	public static function format_post( WP_Post $post ): array {
		$featured_id = (int) get_post_thumbnail_id( $post->ID );

		return [
			'id'             => $post->ID,
			'title'          => get_the_title( $post ),
			'slug'           => $post->post_name,
			'excerpt'        => get_the_excerpt( $post ),
			'content'        => apply_filters( 'the_content', $post->post_content ),
			'status'         => $post->post_status,
			'type'           => $post->post_type,
			'date'           => get_the_date( 'c', $post ),
			'modified'       => get_the_modified_date( 'c', $post ),
			'link'           => get_permalink( $post ),
			'featured_image' => $featured_id ? self::format_image( $featured_id ) : null,
			'categories'     => self::format_terms( $post->ID, 'category' ),
			'tags'           => self::format_terms( $post->ID, 'post_tag' ),
			'author'         => self::format_author( (int) $post->post_author ),
			'comment_count'  => (int) $post->comment_count,
			'format'         => get_post_format( $post ) ?: 'standard',
		];
	}

	/**
	 * Format a page (includes parent and menu_order).
	 */
	public static function format_page( WP_Post $page ): array {
		$data = self::format_post( $page );

		$data['parent']     = (int) $page->post_parent;
		$data['menu_order'] = (int) $page->menu_order;
		$data['template']   = get_page_template_slug( $page->ID ) ?: 'default';

		// Pages don't use categories/tags in the same way
		unset( $data['categories'], $data['tags'], $data['format'] );

		return $data;
	}

	/**
	 * Format an attachment image with all registered sizes.
	 */
	public static function format_image( int $attachment_id ): ?array {
		$url = wp_get_attachment_url( $attachment_id );
		if ( ! $url ) {
			return null;
		}

		$sizes = [];
		foreach ( [ 'thumbnail', 'medium', 'medium_large', 'large', 'full' ] as $size ) {
			$img = wp_get_attachment_image_src( $attachment_id, $size );
			if ( $img ) {
				$sizes[ $size ] = [
					'url'    => $img[0],
					'width'  => (int) $img[1],
					'height' => (int) $img[2],
				];
			}
		}

		return [
			'id'    => $attachment_id,
			'url'   => $url,
			'alt'   => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) ?: '',
			'sizes' => $sizes,
		];
	}

	/**
	 * Format terms (categories or tags) for a given post.
	 */
	public static function format_terms( int $post_id, string $taxonomy ): array {
		$terms = wp_get_post_terms( $post_id, $taxonomy );
		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			return [];
		}

		return array_map( function ( WP_Term $term ) {
			return [
				'id'   => $term->term_id,
				'name' => $term->name,
				'slug' => $term->slug,
			];
		}, $terms );
	}

	/**
	 * Format a single category/taxonomy term with optional image.
	 */
	public static function format_category( object $term ): array {
		$image = '';
		// Support popular category image plugins
		if ( function_exists( 'z_taxonomy_image_url' ) ) {
			$image = z_taxonomy_image_url( $term->term_id );
		} elseif ( function_exists( 'get_term_meta' ) ) {
			$image = get_term_meta( $term->term_id, 'thumbnail_id', true );
			if ( $image ) {
				$image = wp_get_attachment_url( (int) $image ) ?: '';
			}
		}

		return [
			'id'          => $term->term_id,
			'name'        => $term->name,
			'slug'        => $term->slug,
			'description' => $term->description ?? '',
			'parent'      => (int) ( $term->parent ?? 0 ),
			'count'       => (int) ( $term->count ?? 0 ),
			'image'       => $image ?: null,
		];
	}

	/**
	 * Format a tag.
	 */
	public static function format_tag( object $term ): array {
		return [
			'id'    => $term->term_id,
			'name'  => $term->name,
			'slug'  => $term->slug,
			'count' => (int) ( $term->count ?? 0 ),
		];
	}

	/**
	 * Format an author.
	 */
	public static function format_author( int $user_id ): array {
		return [
			'id'     => $user_id,
			'name'   => get_the_author_meta( 'display_name', $user_id ),
			'avatar' => get_avatar_url( $user_id, [ 'size' => 96 ] ),
		];
	}

	/**
	 * Format a media attachment.
	 */
	public static function format_media( WP_Post $attachment ): array {
		$metadata = wp_get_attachment_metadata( $attachment->ID );

		$sizes = [];
		if ( ! empty( $metadata['sizes'] ) ) {
			$upload_dir = wp_get_upload_dir();
			$base_url   = trailingslashit( $upload_dir['baseurl'] );
			$subdir     = ! empty( $metadata['file'] ) ? trailingslashit( dirname( $metadata['file'] ) ) : '';

			foreach ( $metadata['sizes'] as $size_name => $size_data ) {
				$sizes[ $size_name ] = [
					'url'    => $base_url . $subdir . $size_data['file'],
					'width'  => (int) $size_data['width'],
					'height' => (int) $size_data['height'],
				];
			}
		}

		return [
			'id'        => $attachment->ID,
			'url'       => wp_get_attachment_url( $attachment->ID ),
			'title'     => get_the_title( $attachment ),
			'alt'       => get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true ) ?: '',
			'caption'   => $attachment->post_excerpt,
			'mime_type' => $attachment->post_mime_type,
			'width'     => (int) ( $metadata['width'] ?? 0 ),
			'height'    => (int) ( $metadata['height'] ?? 0 ),
			'sizes'     => $sizes,
		];
	}

	/**
	 * Format a navigation menu with nested items.
	 */
	public static function format_menu( WP_Term $menu ): array {
		$items     = wp_get_nav_menu_items( $menu->term_id );
		$locations = get_nav_menu_locations();
		$location  = '';

		foreach ( $locations as $loc_name => $menu_id ) {
			if ( $menu_id === $menu->term_id ) {
				$location = $loc_name;
				break;
			}
		}

		$formatted_items = [];
		if ( $items ) {
			$formatted_items = self::build_menu_tree( $items );
		}

		return [
			'id'       => $menu->term_id,
			'name'     => $menu->name,
			'slug'     => $menu->slug,
			'location' => $location,
			'items'    => $formatted_items,
		];
	}

	/**
	 * Build a hierarchical menu tree from flat menu items.
	 */
	private static function build_menu_tree( array $items, int $parent_id = 0 ): array {
		$tree = [];
		foreach ( $items as $item ) {
			if ( (int) $item->menu_item_parent === $parent_id ) {
				$children = self::build_menu_tree( $items, $item->ID );
				$tree[]   = [
					'id'        => $item->ID,
					'title'     => $item->title,
					'url'       => $item->url,
					'type'      => $item->type,
					'object'    => $item->object,
					'object_id' => (int) $item->object_id,
					'parent'    => (int) $item->menu_item_parent,
					'order'     => (int) $item->menu_order,
					'target'    => $item->target ?: '_self',
					'children'  => $children,
				];
			}
		}

		return $tree;
	}

	/**
	 * Format site information.
	 */
	public static function format_site_info(): array {
		$custom_logo_id = get_theme_mod( 'custom_logo' );
		$logo_url       = $custom_logo_id ? wp_get_attachment_url( $custom_logo_id ) : '';
		$site_icon_id   = get_option( 'site_icon' );
		$favicon_url    = $site_icon_id ? wp_get_attachment_url( $site_icon_id ) : '';

		return [
			'name'        => get_bloginfo( 'name' ),
			'description' => get_bloginfo( 'description' ),
			'url'         => get_site_url(),
			'home_url'    => get_home_url(),
			'logo'        => $logo_url ?: null,
			'favicon'     => $favicon_url ?: null,
			'language'    => get_bloginfo( 'language' ),
			'rtl'         => is_rtl(),
			'timezone'    => wp_timezone_string(),
			'date_format' => get_option( 'date_format' ),
			'time_format' => get_option( 'time_format' ),
		];
	}

	/**
	 * Build pagination metadata.
	 */
	public static function build_pagination( WP_Query $query, int $page, int $per_page ): array {
		return [
			'page'        => $page,
			'per_page'    => $per_page,
			'total'       => (int) $query->found_posts,
			'total_pages' => (int) $query->max_num_pages,
		];
	}

	/**
	 * Build categories as a tree structure.
	 */
	public static function build_category_tree( array $terms, int $parent_id = 0 ): array {
		$tree = [];
		foreach ( $terms as $term ) {
			if ( (int) $term->parent === $parent_id ) {
				$formatted             = self::format_category( $term );
				$formatted['children'] = self::build_category_tree( $terms, $term->term_id );
				$tree[]                = $formatted;
			}
		}

		return $tree;
	}
}

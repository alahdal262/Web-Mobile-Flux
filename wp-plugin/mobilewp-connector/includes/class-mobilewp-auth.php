<?php
/**
 * Authentication and API key management.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MobileWP_Auth {

	/**
	 * Validate an incoming REST request by checking the API key header.
	 */
	public static function validate_request( WP_REST_Request $request ): bool {
		$provided_key = $request->get_header( 'X-MobileWP-Platform-Key' );
		$stored_key   = get_option( 'mobilewp_platform_api_key', '' );

		if ( empty( $stored_key ) || empty( $provided_key ) ) {
			return false;
		}

		return hash_equals( $stored_key, $provided_key );
	}

	/**
	 * Permission callback for authenticated REST routes.
	 */
	public static function permission_callback( WP_REST_Request $request ): bool|WP_Error {
		// Rate limiting
		$rate_check = self::check_rate_limit( $request );
		if ( is_wp_error( $rate_check ) ) {
			return $rate_check;
		}

		if ( ! self::validate_request( $request ) ) {
			return new WP_Error(
				'mobilewp_unauthorized',
				__( 'Invalid or missing API key.', 'mobilewp-connector' ),
				[ 'status' => 401 ]
			);
		}

		return true;
	}

	/**
	 * Check rate limit (60 requests per minute per key).
	 */
	private static function check_rate_limit( WP_REST_Request $request ): bool|WP_Error {
		$key       = $request->get_header( 'X-MobileWP-Platform-Key' ) ?? 'anonymous';
		$cache_key = 'mobilewp_rate_' . md5( $key );
		$count     = (int) get_transient( $cache_key );

		if ( $count >= 60 ) {
			return new WP_Error(
				'mobilewp_rate_limited',
				__( 'Rate limit exceeded. Maximum 60 requests per minute.', 'mobilewp-connector' ),
				[ 'status' => 429 ]
			);
		}

		set_transient( $cache_key, $count + 1, 60 );

		return true;
	}

	/**
	 * Generate HMAC-SHA256 signature for outgoing webhook payloads.
	 */
	public static function sign_payload( string $payload ): string {
		$secret = get_option( 'mobilewp_site_api_key', '' );

		return hash_hmac( 'sha256', $payload, $secret );
	}

	/**
	 * Generate a random API key.
	 */
	public static function generate_key( int $length = 40 ): string {
		return bin2hex( random_bytes( $length / 2 ) );
	}

	/**
	 * Generate and store new API keys.
	 */
	public static function regenerate_keys(): array {
		$platform_key = self::generate_key( 40 );
		$site_key     = self::generate_key( 40 );

		update_option( 'mobilewp_platform_api_key', $platform_key );
		update_option( 'mobilewp_site_api_key', $site_key );

		return [
			'platform_key' => $platform_key,
			'site_key'     => $site_key,
		];
	}
}

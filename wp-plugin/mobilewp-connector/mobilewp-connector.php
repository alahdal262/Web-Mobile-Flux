<?php
/**
 * Plugin Name: Mobile-WP Connector
 * Plugin URI: https://infragatesolutions.com/
 * Description: Connect your WordPress site to Mobile-WP app builder. Exposes REST API endpoints and webhooks for mobile app integration.
 * Version: 1.0.0
 * Author: Infragate Solutions LTD
 * Author URI: https://infragatesolutions.com/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: mobilewp-connector
 * Domain Path: /languages
 * Requires PHP: 8.1
 * Requires at least: 6.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// PHP version check
if ( PHP_VERSION_ID < 80100 ) {
	add_action( 'admin_notices', function () {
		echo '<div class="notice notice-error"><p>';
		echo esc_html__( 'Mobile-WP Connector requires PHP 8.1 or higher. Please upgrade your PHP version.', 'mobilewp-connector' );
		echo '</p></div>';
	} );
	return;
}

define( 'MOBILEWP_VERSION', '1.0.0' );
define( 'MOBILEWP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MOBILEWP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'MOBILEWP_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
define( 'MOBILEWP_REST_NAMESPACE', 'mobilewp/v1' );

// Load classes
require_once MOBILEWP_PLUGIN_DIR . 'includes/class-mobilewp-auth.php';
require_once MOBILEWP_PLUGIN_DIR . 'includes/class-mobilewp-sync.php';
require_once MOBILEWP_PLUGIN_DIR . 'includes/class-mobilewp-api.php';
require_once MOBILEWP_PLUGIN_DIR . 'includes/class-mobilewp-webhooks.php';
require_once MOBILEWP_PLUGIN_DIR . 'includes/class-mobilewp-admin.php';

// Conditionally load WooCommerce integration
add_action( 'plugins_loaded', function () {
	if ( class_exists( 'WooCommerce' ) ) {
		require_once MOBILEWP_PLUGIN_DIR . 'includes/class-mobilewp-woo.php';
		MobileWP_Woo::init();
	}
}, 20 );

// Initialize core modules
add_action( 'plugins_loaded', function () {
	load_plugin_textdomain( 'mobilewp-connector', false, dirname( MOBILEWP_PLUGIN_BASENAME ) . '/languages' );
	MobileWP_Admin::init();
	MobileWP_API::init();
	MobileWP_Webhooks::init();
}, 10 );

// Activation
register_activation_hook( __FILE__, function () {
	if ( ! get_option( 'mobilewp_platform_api_key' ) ) {
		update_option( 'mobilewp_platform_api_key', '' );
	}
	if ( ! get_option( 'mobilewp_site_api_key' ) ) {
		update_option( 'mobilewp_site_api_key', '' );
	}
	if ( ! get_option( 'mobilewp_webhook_url' ) ) {
		update_option( 'mobilewp_webhook_url', '' );
	}
	if ( ! get_option( 'mobilewp_site_id' ) ) {
		update_option( 'mobilewp_site_id', '' );
	}
	if ( ! get_option( 'mobilewp_connected' ) ) {
		update_option( 'mobilewp_connected', false );
	}
	if ( ! get_option( 'mobilewp_webhook_logs' ) ) {
		update_option( 'mobilewp_webhook_logs', [] );
	}
	update_option( 'mobilewp_connection_status', 'disconnected' );
	update_option( 'mobilewp_consecutive_failures', 0 );
	flush_rewrite_rules();
} );

// Deactivation
register_deactivation_hook( __FILE__, function () {
	flush_rewrite_rules();
} );

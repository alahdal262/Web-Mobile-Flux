<?php
/**
 * Cleanup on plugin deletion.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Remove all plugin options
$options = [
	'mobilewp_platform_api_key',
	'mobilewp_site_api_key',
	'mobilewp_webhook_url',
	'mobilewp_site_id',
	'mobilewp_connected',
	'mobilewp_connection_status',
	'mobilewp_consecutive_failures',
	'mobilewp_webhook_logs',
];

foreach ( $options as $option ) {
	delete_option( $option );
}

// Clean up transients
global $wpdb;
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_mobilewp_%'" );
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_mobilewp_%'" );

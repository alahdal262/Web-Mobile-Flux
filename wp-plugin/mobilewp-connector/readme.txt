=== Mobile-WP Connector ===
Contributors: infragatesolutions
Tags: mobile app, wordpress, rest api, woocommerce, flutter
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 8.1
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Connect your WordPress site to the Mobile-WP app builder platform. Expose REST API endpoints and fire webhooks for real-time mobile app integration.

== Description ==

Mobile-WP Connector bridges your WordPress site with the Mobile-WP visual app builder, enabling you to create native mobile apps from your WordPress content.

**Features:**

* Custom REST API endpoints for posts, pages, categories, menus, and media
* Real-time webhooks on content changes (create, update, delete)
* WooCommerce integration (products, categories, orders)
* HMAC-SHA256 signed webhook payloads for security
* API key authentication for all endpoints
* Rate limiting (60 requests/minute)
* Admin settings page with connection status and webhook logs
* RTL and multilingual content support

**REST API Endpoints:**

* `GET /mobilewp/v1/status` - Plugin and site health check (no auth)
* `GET /mobilewp/v1/posts` - Paginated posts with metadata
* `GET /mobilewp/v1/pages` - Pages with hierarchy
* `GET /mobilewp/v1/categories` - Category tree
* `GET /mobilewp/v1/menus` - Navigation menus with items
* `GET /mobilewp/v1/media` - Media library
* `POST /mobilewp/v1/search` - Full-text search
* `GET /mobilewp/v1/products` - WooCommerce products (if active)
* `GET /mobilewp/v1/product-categories` - Product category tree (if active)

== Installation ==

1. Upload the `mobilewp-connector` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu
3. Go to MobileWP in the admin sidebar
4. Generate API keys and configure your webhook URL
5. Share the Platform API Key with your Mobile-WP dashboard

== Frequently Asked Questions ==

= Does this plugin require WooCommerce? =
No. WooCommerce integration is optional and only activates if WooCommerce is installed.

= Is my data secure? =
Yes. All endpoints (except /status) require API key authentication. Webhooks are signed with HMAC-SHA256.

= What WordPress versions are supported? =
WordPress 6.0 and above with PHP 8.1+.

== Changelog ==

= 1.0.0 =
* Initial release
* REST API endpoints for posts, pages, categories, menus, media
* Webhook dispatcher for content changes
* WooCommerce product and order integration
* Admin settings page with webhook log

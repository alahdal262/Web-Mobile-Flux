<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$site_info   = MobileWP_Admin::get_site_info();
$connected   = (bool) get_option( 'mobilewp_connected', false );
$conn_status = get_option( 'mobilewp_connection_status', 'disconnected' );
$logs        = get_option( 'mobilewp_webhook_logs', [] );
if ( ! is_array( $logs ) ) {
	$logs = [];
}
?>
<div class="wrap mobilewp-admin">
	<h1>
		<?php esc_html_e( 'Mobile-WP Connector', 'mobilewp-connector' ); ?>
		<span class="mobilewp-badge">v<?php echo esc_html( MOBILEWP_VERSION ); ?></span>
	</h1>

	<div id="mobilewp-notice" style="display:none;"></div>

	<!-- Connection Status -->
	<div class="mobilewp-card">
		<h2 class="mobilewp-section-title"><?php esc_html_e( 'Connection Status', 'mobilewp-connector' ); ?></h2>
		<p>
			<span class="mobilewp-status-dot <?php echo $connected ? 'connected' : 'disconnected'; ?>"></span>
			<strong id="mobilewp-conn-status">
				<?php
				if ( $conn_status === 'connected' ) {
					esc_html_e( 'Connected', 'mobilewp-connector' );
				} elseif ( $conn_status === 'degraded' ) {
					esc_html_e( 'Degraded (webhook delivery issues)', 'mobilewp-connector' );
				} else {
					esc_html_e( 'Not Connected', 'mobilewp-connector' );
				}
				?>
			</strong>
		</p>
		<?php
		$webhook_url = get_option( 'mobilewp_webhook_url', '' );
		if ( $webhook_url ) :
			?>
			<p><small><?php esc_html_e( 'Webhook URL:', 'mobilewp-connector' ); ?> <code><?php echo esc_url( $webhook_url ); ?></code></small></p>
		<?php endif; ?>
		<?php
		$site_id = get_option( 'mobilewp_site_id', '' );
		if ( $site_id ) :
			?>
			<p><small><?php esc_html_e( 'Site ID:', 'mobilewp-connector' ); ?> <code><?php echo esc_html( $site_id ); ?></code></small></p>
		<?php endif; ?>
	</div>

	<!-- API Keys -->
	<div class="mobilewp-card">
		<h2 class="mobilewp-section-title"><?php esc_html_e( 'API Keys', 'mobilewp-connector' ); ?></h2>
		<p class="description"><?php esc_html_e( 'Share the Platform API Key with the Mobile-WP dashboard. Keep the Site API Key secret — it is used to sign webhooks.', 'mobilewp-connector' ); ?></p>

		<table class="form-table">
			<tr>
				<th scope="row"><label for="mobilewp_platform_api_key"><?php esc_html_e( 'Platform API Key', 'mobilewp-connector' ); ?></label></th>
				<td>
					<input type="text" id="mobilewp_platform_api_key" name="mobilewp_platform_api_key"
						   class="regular-text mobilewp-key-field"
						   value="<?php echo esc_attr( get_option( 'mobilewp_platform_api_key', '' ) ); ?>"
						   readonly />
					<button type="button" class="button" onclick="mobilewpCopyField('mobilewp_platform_api_key')"><?php esc_html_e( 'Copy', 'mobilewp-connector' ); ?></button>
				</td>
			</tr>
			<tr>
				<th scope="row"><label for="mobilewp_site_api_key"><?php esc_html_e( 'Site API Key (Webhook Secret)', 'mobilewp-connector' ); ?></label></th>
				<td>
					<input type="text" id="mobilewp_site_api_key" name="mobilewp_site_api_key"
						   class="regular-text mobilewp-key-field"
						   value="<?php echo esc_attr( get_option( 'mobilewp_site_api_key', '' ) ); ?>"
						   readonly />
					<button type="button" class="button" onclick="mobilewpCopyField('mobilewp_site_api_key')"><?php esc_html_e( 'Copy', 'mobilewp-connector' ); ?></button>
				</td>
			</tr>
		</table>
		<p>
			<button type="button" class="button button-secondary" onclick="mobilewpRegenerateKeys()">
				<?php esc_html_e( 'Generate New Keys', 'mobilewp-connector' ); ?>
			</button>
		</p>
	</div>

	<!-- Webhook Configuration -->
	<div class="mobilewp-card">
		<h2 class="mobilewp-section-title"><?php esc_html_e( 'Webhook Configuration', 'mobilewp-connector' ); ?></h2>

		<table class="form-table">
			<tr>
				<th scope="row"><label for="mobilewp_webhook_url"><?php esc_html_e( 'Webhook URL', 'mobilewp-connector' ); ?></label></th>
				<td>
					<input type="url" id="mobilewp_webhook_url" name="mobilewp_webhook_url"
						   class="regular-text"
						   value="<?php echo esc_url( get_option( 'mobilewp_webhook_url', '' ) ); ?>"
						   placeholder="https://webhook.site/your-unique-url" />
					<p class="description"><?php esc_html_e( 'URL where content change notifications will be sent. Use webhook.site for testing.', 'mobilewp-connector' ); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row"><label for="mobilewp_site_id"><?php esc_html_e( 'Site ID', 'mobilewp-connector' ); ?></label></th>
				<td>
					<input type="text" id="mobilewp_site_id" name="mobilewp_site_id"
						   class="regular-text"
						   value="<?php echo esc_attr( get_option( 'mobilewp_site_id', '' ) ); ?>"
						   placeholder="site_abc123" />
					<p class="description"><?php esc_html_e( 'Your site identifier on the Mobile-WP platform.', 'mobilewp-connector' ); ?></p>
				</td>
			</tr>
		</table>
		<p>
			<button type="button" class="button button-primary" onclick="mobilewpSaveSettings()">
				<?php esc_html_e( 'Save Settings', 'mobilewp-connector' ); ?>
			</button>
			<button type="button" class="button button-secondary" onclick="mobilewpTestWebhook()">
				<?php esc_html_e( 'Test Webhook', 'mobilewp-connector' ); ?>
			</button>
		</p>
	</div>

	<!-- Site Information -->
	<div class="mobilewp-card">
		<h2 class="mobilewp-section-title"><?php esc_html_e( 'Site Information', 'mobilewp-connector' ); ?></h2>
		<div class="mobilewp-site-info">
			<?php foreach ( $site_info as $label => $value ) : ?>
				<div class="mobilewp-info-item">
					<span class="mobilewp-info-label"><?php echo esc_html( ucwords( str_replace( '_', ' ', $label ) ) ); ?></span>
					<span class="mobilewp-info-value"><?php echo esc_html( $value ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>
	</div>

	<!-- Webhook Delivery Log -->
	<div class="mobilewp-card">
		<h2 class="mobilewp-section-title">
			<?php esc_html_e( 'Webhook Delivery Log', 'mobilewp-connector' ); ?>
			<?php if ( ! empty( $logs ) ) : ?>
				<button type="button" class="button button-small" onclick="mobilewpClearLogs()" style="margin-left: 10px;">
					<?php esc_html_e( 'Clear Log', 'mobilewp-connector' ); ?>
				</button>
			<?php endif; ?>
		</h2>

		<?php if ( empty( $logs ) ) : ?>
			<p class="description"><?php esc_html_e( 'No webhook deliveries yet.', 'mobilewp-connector' ); ?></p>
		<?php else : ?>
			<table class="widefat striped" id="mobilewp-log-table">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Event', 'mobilewp-connector' ); ?></th>
						<th><?php esc_html_e( 'Status', 'mobilewp-connector' ); ?></th>
						<th><?php esc_html_e( 'HTTP Code', 'mobilewp-connector' ); ?></th>
						<th><?php esc_html_e( 'Error', 'mobilewp-connector' ); ?></th>
						<th><?php esc_html_e( 'Time', 'mobilewp-connector' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( array_slice( $logs, 0, 20 ) as $log ) : ?>
						<tr>
							<td><code><?php echo esc_html( $log['event'] ?? '' ); ?></code></td>
							<td>
								<?php if ( ! empty( $log['success'] ) ) : ?>
									<span class="mobilewp-log-success"><?php esc_html_e( 'OK', 'mobilewp-connector' ); ?></span>
								<?php else : ?>
									<span class="mobilewp-log-failed"><?php esc_html_e( 'Failed', 'mobilewp-connector' ); ?></span>
								<?php endif; ?>
							</td>
							<td><?php echo esc_html( $log['status'] ?? '—' ); ?></td>
							<td><?php echo esc_html( $log['error'] ?? '—' ); ?></td>
							<td><?php echo esc_html( $log['timestamp'] ?? '' ); ?></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
	</div>

	<!-- REST API Info -->
	<div class="mobilewp-card">
		<h2 class="mobilewp-section-title"><?php esc_html_e( 'REST API Endpoints', 'mobilewp-connector' ); ?></h2>
		<p class="description"><?php esc_html_e( 'These endpoints are available for the Mobile-WP platform:', 'mobilewp-connector' ); ?></p>
		<table class="widefat striped">
			<thead>
				<tr>
					<th><?php esc_html_e( 'Endpoint', 'mobilewp-connector' ); ?></th>
					<th><?php esc_html_e( 'Method', 'mobilewp-connector' ); ?></th>
					<th><?php esc_html_e( 'Auth', 'mobilewp-connector' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php
				$endpoints = [
					[ '/mobilewp/v1/status', 'GET', __( 'No', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/site-info', 'GET', __( 'Yes', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/posts', 'GET', __( 'Yes', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/posts/{id}', 'GET', __( 'Yes', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/pages', 'GET', __( 'Yes', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/categories', 'GET', __( 'Yes', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/tags', 'GET', __( 'Yes', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/media', 'GET', __( 'Yes', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/menus', 'GET', __( 'Yes', 'mobilewp-connector' ) ],
					[ '/mobilewp/v1/search', 'POST', __( 'Yes', 'mobilewp-connector' ) ],
				];

				if ( class_exists( 'WooCommerce' ) ) {
					$endpoints[] = [ '/mobilewp/v1/products', 'GET', __( 'Yes', 'mobilewp-connector' ) ];
					$endpoints[] = [ '/mobilewp/v1/products/{id}', 'GET', __( 'Yes', 'mobilewp-connector' ) ];
					$endpoints[] = [ '/mobilewp/v1/product-categories', 'GET', __( 'Yes', 'mobilewp-connector' ) ];
				}

				foreach ( $endpoints as $ep ) :
					?>
					<tr>
						<td><code><?php echo esc_html( $ep[0] ); ?></code></td>
						<td><?php echo esc_html( $ep[1] ); ?></td>
						<td><?php echo esc_html( $ep[2] ); ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
</div>

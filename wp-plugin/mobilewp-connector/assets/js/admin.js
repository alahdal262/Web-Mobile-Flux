/**
 * MobileWP Connector — Admin JavaScript
 */
(function () {
	'use strict';

	function showNotice(message, type) {
		const el = document.getElementById('mobilewp-notice');
		if (!el) return;
		el.className = 'notice notice-' + (type || 'success') + ' is-dismissible';
		el.innerHTML = '<p>' + message + '</p><button type="button" class="notice-dismiss" onclick="this.parentElement.style.display=\'none\'"><span class="screen-reader-text">Dismiss</span></button>';
		el.style.display = 'block';
		el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}

	function ajaxPost(action, extraData) {
		const params = window.mobilewp_params || {};
		const body = new URLSearchParams();
		body.append('action', action);
		body.append('nonce', params.nonce || '');
		if (extraData) {
			Object.keys(extraData).forEach(function (key) {
				body.append(key, extraData[key]);
			});
		}
		return fetch(params.ajax_url || '/wp-admin/admin-ajax.php', {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: body.toString(),
		}).then(function (r) { return r.json(); });
	}

	// Save settings
	window.mobilewpSaveSettings = function () {
		var data = {};
		['mobilewp_platform_api_key', 'mobilewp_site_api_key', 'mobilewp_webhook_url', 'mobilewp_site_id'].forEach(function (id) {
			var el = document.getElementById(id);
			if (el) data[id] = el.value;
		});
		ajaxPost('mobilewp_save_settings', data).then(function (res) {
			if (res.success) {
				showNotice(res.data.message, 'success');
			} else {
				showNotice(res.data.message || 'Save failed.', 'error');
			}
		}).catch(function () {
			showNotice('Network error. Please try again.', 'error');
		});
	};

	// Test webhook
	window.mobilewpTestWebhook = function () {
		showNotice('Sending test webhook...', 'info');
		ajaxPost('mobilewp_test_webhook').then(function (res) {
			if (res.success) {
				showNotice(res.data.message + ' (HTTP ' + res.data.status_code + ')', 'success');
			} else {
				showNotice(res.data.message, 'error');
			}
		}).catch(function () {
			showNotice('Network error.', 'error');
		});
	};

	// Regenerate keys
	window.mobilewpRegenerateKeys = function () {
		if (!confirm('This will generate new API keys. The old keys will stop working immediately. Continue?')) {
			return;
		}
		ajaxPost('mobilewp_regenerate_keys').then(function (res) {
			if (res.success) {
				var pkEl = document.getElementById('mobilewp_platform_api_key');
				var skEl = document.getElementById('mobilewp_site_api_key');
				if (pkEl) pkEl.value = res.data.platform_key;
				if (skEl) skEl.value = res.data.site_key;
				showNotice(res.data.message, 'success');
			} else {
				showNotice(res.data.message || 'Failed to regenerate keys.', 'error');
			}
		}).catch(function () {
			showNotice('Network error.', 'error');
		});
	};

	// Clear logs
	window.mobilewpClearLogs = function () {
		ajaxPost('mobilewp_clear_logs').then(function (res) {
			if (res.success) {
				var table = document.getElementById('mobilewp-log-table');
				if (table) {
					table.querySelector('tbody').innerHTML = '<tr><td colspan="5">Log cleared.</td></tr>';
				}
				showNotice(res.data.message, 'success');
			}
		}).catch(function () {
			showNotice('Network error.', 'error');
		});
	};

	// Copy field value
	window.mobilewpCopyField = function (fieldId) {
		var el = document.getElementById(fieldId);
		if (!el || !el.value) return;
		navigator.clipboard.writeText(el.value).then(function () {
			showNotice('Copied to clipboard!', 'success');
		}).catch(function () {
			el.select();
			document.execCommand('copy');
			showNotice('Copied to clipboard!', 'success');
		});
	};
})();

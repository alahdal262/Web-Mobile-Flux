# API Reference

Complete API reference for the Mobile-WP backend.

## Base URL

| Environment | URL |
|-------------|-----|
| **Production** | `https://flutter.streamtvlive.cloud/api` |
| **Local** | `http://localhost:3001/api` |

## Authentication

Mobile-WP uses **HttpOnly cookie sessions** for authentication. After calling `/auth/signup` or `/auth/login`, the server sets a session cookie that you must include in subsequent requests.

```bash
# Save cookies to a file
curl -c cookies.txt -X POST ...

# Reuse them in subsequent requests
curl -b cookies.txt -X GET ...
```

---

## Endpoints

### Health

#### `GET /healthz`

Check if the API is running.

**Request:**
```bash
curl https://flutter.streamtvlive.cloud/api/healthz
```

**Response:** `200 OK`
```json
{
  "status": "ok"
}
```

---

### Authentication

#### `POST /auth/signup`

Create a new user account.

**Request:**
```bash
curl -X POST https://flutter.streamtvlive.cloud/api/auth/signup \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "fullName": "Jane Doe"
  }'
```

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `email` | string | yes | Valid email format |
| `password` | string | yes | Min 8 characters |
| `fullName` | string | no | 1–255 characters |

**Response:** `201 Created`
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "user@example.com",
  "fullName": "Jane Doe"
}
```

**Errors:**

| Status | Error | Cause |
|--------|-------|-------|
| `400` | `validation_error` | Missing or invalid fields |
| `409` | `email_exists` | Email already registered |

---

#### `POST /auth/login`

Log in an existing user.

**Request:**
```bash
curl -X POST https://flutter.streamtvlive.cloud/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:** `200 OK`
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "user@example.com",
  "fullName": "Jane Doe"
}
```

**Errors:**

| Status | Error | Cause |
|--------|-------|-------|
| `400` | `validation_error` | Missing fields |
| `401` | `invalid_credentials` | Wrong email or password |

---

#### `POST /auth/logout`

End the current session.

**Request:**
```bash
curl -X POST https://flutter.streamtvlive.cloud/api/auth/logout \
  -b cookies.txt
```

**Response:** `204 No Content`

---

#### `GET /auth/me`

Get the currently authenticated user.

**Request:**
```bash
curl https://flutter.streamtvlive.cloud/api/auth/me \
  -b cookies.txt
```

**Response:** `200 OK`
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "user@example.com",
  "fullName": "Jane Doe"
}
```

**Errors:**

| Status | Error | Cause |
|--------|-------|-------|
| `401` | `unauthorized` | Not logged in |

---

### Apps

All `/apps` endpoints require authentication.

#### `GET /apps`

List all apps belonging to the current user.

**Request:**
```bash
curl https://flutter.streamtvlive.cloud/api/apps \
  -b cookies.txt
```

**Response:** `200 OK`
```json
{
  "apps": [
    {
      "id": "app-uuid-1",
      "userId": "user-uuid",
      "appName": "My News App",
      "websiteUrl": "https://example.com",
      "templateId": "news-classic",
      "primaryColor": "#2563eb",
      "featureState": { "widgets": [...] },
      "createdAt": "2026-04-11T14:00:00Z",
      "updatedAt": "2026-04-11T14:00:00Z"
    }
  ]
}
```

---

#### `POST /apps`

Create a new app.

**Request:**
```bash
curl -X POST https://flutter.streamtvlive.cloud/api/apps \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "appName": "My News App",
    "websiteUrl": "https://example.com",
    "templateId": "news-classic",
    "primaryColor": "#2563eb"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `appName` | string | yes | App display name |
| `websiteUrl` | string | no | Source WordPress URL |
| `templateId` | string | no | Template to apply |
| `primaryColor` | string | no | Brand color (hex) |

**Response:** `201 Created`
```json
{
  "id": "new-app-uuid",
  "userId": "user-uuid",
  "appName": "My News App",
  "websiteUrl": "https://example.com",
  "templateId": "news-classic",
  "primaryColor": "#2563eb",
  "featureState": {},
  "createdAt": "2026-04-11T14:00:00Z",
  "updatedAt": "2026-04-11T14:00:00Z"
}
```

---

#### `GET /apps/:id`

Get a specific app by ID.

**Request:**
```bash
curl https://flutter.streamtvlive.cloud/api/apps/app-uuid \
  -b cookies.txt
```

**Response:** `200 OK` — same shape as `POST /apps`

**Errors:**

| Status | Error | Cause |
|--------|-------|-------|
| `403` | `forbidden` | App belongs to another user |
| `404` | `not_found` | App doesn't exist |

---

#### `PATCH /apps/:id`

Update an app.

**Request:**
```bash
curl -X PATCH https://flutter.streamtvlive.cloud/api/apps/app-uuid \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "appName": "Updated Name",
    "featureState": {
      "widgets": [{"id": "w1", "type": "banner", "config": {...}}]
    }
  }'
```

Any field from `POST /apps` can be updated. Only the fields you send are modified.

**Response:** `200 OK` — updated app object

---

#### `DELETE /apps/:id`

Delete an app.

**Request:**
```bash
curl -X DELETE https://flutter.streamtvlive.cloud/api/apps/app-uuid \
  -b cookies.txt
```

**Response:** `204 No Content`

---

## WordPress Plugin API

The `mobilewp-connector` WordPress plugin exposes its own REST API under `/wp-json/mobilewp/v1/`. These endpoints are consumed by the Mobile-WP backend to fetch content from customer sites.

### Plugin Authentication

All endpoints except `/status` require the `X-MobileWP-Platform-Key` header:

```bash
curl -H "X-MobileWP-Platform-Key: YOUR_API_KEY" \
  https://customersite.com/wp-json/mobilewp/v1/posts
```

### Plugin Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/status` | Health check + version info | No |
| GET | `/site-info` | Site branding and settings | Yes |
| GET | `/posts` | Paginated posts | Yes |
| GET | `/posts/{id}` | Single post | Yes |
| GET | `/pages` | Pages with hierarchy | Yes |
| GET | `/categories` | Category tree | Yes |
| GET | `/tags` | Tag list | Yes |
| GET | `/media` | Media library | Yes |
| GET | `/menus` | Navigation menus | Yes |
| POST | `/search` | Full-text search | Yes |
| GET | `/products` | WooCommerce products (if active) | Yes |
| GET | `/products/{id}` | Single product | Yes |
| GET | `/product-categories` | Product category tree | Yes |

See the [plugin source code](../wp-plugin/mobilewp-connector/includes/class-mobilewp-api.php) for full details.

### Plugin Webhooks

The plugin fires signed HMAC-SHA256 webhooks on content changes. Configure the webhook URL in the plugin's admin settings.

**Events:**
- `post.created`, `post.updated`, `post.deleted`, `post.trashed`
- `page.created`, `page.updated`, `page.deleted`
- `category.created`, `category.updated`, `category.deleted`
- `tag.created`, `tag.updated`, `tag.deleted`
- `menu.updated`
- `media.uploaded`, `media.deleted`
- `product.created`, `product.updated`, `product.deleted` (WooCommerce)
- `order.created`, `order.updated` (WooCommerce)
- `site.settings_changed`

**Webhook format:**
```http
POST /webhooks/wordpress HTTP/1.1
Host: flutter.streamtvlive.cloud
Content-Type: application/json
X-MobileWP-Signature: sha256=abc123...
X-MobileWP-Event: post.updated

{
  "event": "post.updated",
  "site_id": "site-uuid",
  "timestamp": "2026-04-11T14:00:00Z",
  "data": { "id": 123, "title": "...", "content": "..." }
}
```

**Verification:**
```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
```

---

## Rate Limiting

Currently no rate limiting is enforced. This will be added in Phase 2 with:
- **60 req/min** for unauthenticated endpoints
- **300 req/min** for authenticated endpoints
- **1000 req/min** for webhook endpoints (per site)

Rate limit headers will be returned:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1712851200
```

---

## Error Format

All errors follow a consistent format:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Email is required",
    "details": {
      "field": "email"
    }
  }
}
```

| Field | Description |
|-------|-------------|
| `error.code` | Machine-readable error code |
| `error.message` | Human-readable message |
| `error.details` | Optional structured details |

---

## CORS

The API accepts requests from:
- `https://flutter.streamtvlive.cloud` (production)
- `http://localhost:5173` (local dev)

To add additional origins, edit `artifacts/api-server/src/app.ts` and restart the server.

---

## OpenAPI Schema

A machine-readable OpenAPI 3.0 schema is available at:

```
fluxbuilder-project/lib/api-spec/openapi.yaml
```

This is used to generate the typed React client in `lib/api-client-react/` via Orval.

---

## Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) — How the API fits into the system
- [DATABASE.md](./DATABASE.md) — Data model details
- [SETUP.md](./SETUP.md) — Running the API locally

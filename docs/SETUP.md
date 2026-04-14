# Local Development Setup

This guide walks you through setting up Mobile-WP on your local machine for development.

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org) |
| **pnpm** | 10+ | `npm install -g pnpm` |
| **PostgreSQL** | 14+ | [postgresql.org](https://postgresql.org) or Docker |
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com) |
| **PHP** | 8.1+ (optional) | For WordPress plugin dev |

### Verify installation

```bash
node --version    # v20.0.0 or higher
pnpm --version    # 10.0.0 or higher
psql --version    # 14.0 or higher
git --version     # 2.40.0 or higher
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/alahdal262/Web-Mobile-Flux.git
cd Web-Mobile-Flux
```

## 2. Install Dependencies

```bash
cd fluxbuilder-project
pnpm install
```

This installs all dependencies for the monorepo (frontend, backend, shared packages).

**Expected output:** ~1,800 packages installed in 2–5 minutes.

### Troubleshooting

**Error:** `ERR_PNPM_UNSUPPORTED_ENGINE`
**Fix:** Update Node.js to v20+

**Error:** `EACCES permission denied`
**Fix:** Don't use sudo. Fix npm permissions: [docs.npmjs.com/fix-eacces-errors](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

**Error:** `@rollup/rollup-darwin-arm64 not found`
**Fix:** The monorepo has cross-platform rollup overrides. Run `pnpm install --no-frozen-lockfile`.

---

## 3. Set Up PostgreSQL

### Option A: Docker (recommended)

```bash
docker run -d \
  --name mobilewp-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mobilewp \
  -p 5432:5432 \
  postgres:16
```

### Option B: Native installation

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16
createdb mobilewp

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb mobilewp
```

### Verify connection

```bash
psql postgresql://postgres:postgres@localhost:5432/mobilewp -c "SELECT version();"
```

---

## 4. Configure Environment

```bash
cd fluxbuilder-project
cp .env.example .env
```

Edit `.env` with your database credentials:

```bash
# Backend
API_PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mobilewp
NODE_ENV=development
LOG_LEVEL=debug
SESSION_SECRET=your_random_64_char_hex_string

# Frontend
PORT=5173
BASE_PATH=/
```

**Generate a session secret:**

```bash
openssl rand -hex 32
```

---

## 5. Run Database Migrations

```bash
pnpm --filter @workspace/db run db:push
```

This creates the `users` and `apps` tables in your database.

**Verify:**

```bash
psql mobilewp -c "\dt"
```

Expected output:
```
        List of relations
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 public | apps  | table | postgres
 public | users | table | postgres
```

---

## 6. Start the Development Servers

You'll need **two terminals** running simultaneously.

### Terminal 1: Backend API

```bash
cd fluxbuilder-project
pnpm --filter @workspace/api-server run dev
```

**Expected output:**
```
api-server listening on port 3001
```

### Terminal 2: Frontend Builder

```bash
cd fluxbuilder-project
PORT=5173 BASE_PATH=/ API_PORT=3001 pnpm --filter @workspace/fluxbuilder run dev
```

**Expected output:**
```
VITE v7.3.0  ready in 1234 ms
  → Local:   http://localhost:5173/
  → Network: http://192.168.1.x:5173/
```

---

## 7. Open the App

Open your browser to [http://localhost:5173](http://localhost:5173)

You should see the Mobile-WP landing page. Click **Get Started** to sign up and try the builder.

---

## Development Workflow

### Hot Reload

Both servers support hot reload:
- **Frontend:** Vite HMR — changes reflect instantly in the browser
- **Backend:** tsx watch — API restarts automatically on file changes

### Running Tests

```bash
# Unit tests (when added)
pnpm --filter @workspace/fluxbuilder run test

# Type checking
pnpm --filter @workspace/fluxbuilder run typecheck
```

### Building for Production

```bash
PORT=3090 API_PORT=3001 BASE_PATH=/ pnpm --filter @workspace/fluxbuilder run build
```

Output goes to `artifacts/fluxbuilder/dist/`.

### Cleaning Up

```bash
# Remove node_modules
pnpm -r exec -- rm -rf node_modules

# Reinstall
pnpm install
```

---

## WordPress Plugin Development

If you're working on the WordPress plugin, set up a local WordPress instance:

### Docker WordPress

```bash
docker run -d \
  --name wp-dev \
  -p 8080:80 \
  -e WORDPRESS_DB_HOST=host.docker.internal:5432 \
  -e WORDPRESS_DB_USER=postgres \
  -e WORDPRESS_DB_PASSWORD=postgres \
  -e WORDPRESS_DB_NAME=wordpress \
  wordpress:latest
```

### Symlink the Plugin

```bash
# Get the path to your clone
cd ~/Web-Mobile-Flux/wp-plugin

# Symlink into WordPress
ln -s $(pwd)/mobilewp-connector /path/to/wordpress/wp-content/plugins/mobilewp-connector
```

### Activate

1. Open [http://localhost:8080/wp-admin](http://localhost:8080/wp-admin)
2. Go to **Plugins**
3. Activate **Mobile-WP Connector**
4. Navigate to **MobileWP** in the sidebar
5. Generate API keys and set the webhook URL to `http://localhost:3001/webhooks/wordpress`

### Test the Plugin API

```bash
# Status check (no auth)
curl http://localhost:8080/wp-json/mobilewp/v1/status

# Posts (requires API key)
curl -H "X-MobileWP-Platform-Key: YOUR_KEY" \
  http://localhost:8080/wp-json/mobilewp/v1/posts
```

---

## Common Issues

### Port already in use

```bash
# Find the process
lsof -i :5173
lsof -i :3001

# Kill it
kill -9 <PID>
```

### Database connection refused

```bash
# Check PostgreSQL is running
pg_isready

# Docker: check container is running
docker ps | grep postgres

# Restart PostgreSQL
brew services restart postgresql@16  # macOS
sudo systemctl restart postgresql    # Linux
docker restart mobilewp-postgres     # Docker
```

### Vite build fails with "Cannot find module"

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall
rm -rf node_modules
pnpm install
```

### Dark mode toggle not working

The `next-themes` package requires a `ThemeProvider` wrapper. This is already set up in `App.tsx` — if you're creating a new page, it inherits the theme context automatically.

---

## Next Steps

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Understand the codebase structure
- **[DATABASE.md](./DATABASE.md)** — Database schema details
- **[API.md](./API.md)** — Complete API reference
- **[../CONTRIBUTING.md](../CONTRIBUTING.md)** — How to contribute your first PR

---

**Stuck?** Open an [issue](https://github.com/alahdal262/Web-Mobile-Flux/issues) or a [discussion](https://github.com/alahdal262/Web-Mobile-Flux/discussions).

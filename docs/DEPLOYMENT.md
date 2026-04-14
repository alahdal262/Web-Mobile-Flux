# Deployment Guide

Complete guide to deploying Mobile-WP to production.

## Table of Contents

- [Overview](#overview)
- [VPS Requirements](#vps-requirements)
- [Initial Setup](#initial-setup)
- [Production Deployment](#production-deployment)
- [SSL / TLS](#ssl-tls)
- [Process Management](#process-management)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Overview

Mobile-WP is deployed as a stack of services on a single Linux VPS:

```
Internet
    │
    ▼ HTTPS (443)
┌─────────────────┐
│   Cloudflare    │ ← CDN, DDoS protection
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Traefik     │ ← TLS termination, reverse proxy
│   (Docker)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      nginx      │ ← Static files (Vite bundle)
│   (port 3090)   │
└────────┬────────┘
         │ /api/*
         ▼
┌─────────────────┐
│  Express API    │ ← Auth, CRUD, webhooks
│  PM2 (port 3001)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │ ← Persistent data
│   (Docker)      │
└─────────────────┘
```

The live deployment runs at **[flutter.streamtvlive.cloud](https://flutter.streamtvlive.cloud)**.

---

## VPS Requirements

### Minimum specs

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **CPU** | 2 vCPU | 4+ vCPU |
| **RAM** | 4 GB | 16+ GB |
| **Disk** | 40 GB SSD | 200+ GB SSD |
| **Bandwidth** | 1 TB/month | Unlimited |
| **OS** | Ubuntu 22.04+ / Debian 12+ | Ubuntu 24.04 |

### Software

| Tool | Version |
|------|---------|
| Docker | 24+ |
| Docker Compose | 2.20+ |
| Node.js | 20+ |
| pnpm | 10+ |
| PM2 | 5+ |
| nginx | 1.20+ |

---

## Initial Setup

### 1. Provision the VPS

SSH into your server:

```bash
ssh root@YOUR_VPS_IP
```

### 2. Install dependencies

```bash
# Update
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install nginx
apt install -y nginx
```

### 3. Set up Docker services

Create the Docker stack:

```bash
mkdir -p /projects/orchestrator
cd /projects/orchestrator

cat > docker-compose.yml <<'EOF'
services:
  postgres:
    image: postgres:16
    container_name: orchestrator-postgres-1
    restart: unless-stopped
    environment:
      POSTGRES_USER: orchestrator
      POSTGRES_PASSWORD: CHANGE_ME
      POSTGRES_DB: orchestrator
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    container_name: orchestrator-redis-1
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  traefik:
    image: traefik:v3.2
    container_name: orchestrator-traefik-1
    restart: unless-stopped
    command:
      - --api.dashboard=true
      - --providers.docker=true
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.le.acme.email=you@example.com
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt

volumes:
  postgres-data:
  redis-data:
  letsencrypt:
EOF

docker compose up -d
```

### 4. Create the Mobile-WP database

```bash
docker exec orchestrator-postgres-1 psql -U orchestrator <<EOF
CREATE DATABASE fluxbuilder;
EOF
```

---

## Production Deployment

### 1. Clone the repository

```bash
mkdir -p /projects
cd /projects
git clone https://github.com/alahdal262/Web-Mobile-Flux.git fluxbuilder
cd fluxbuilder/fluxbuilder-project
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
cat > .env <<EOF
API_PORT=3001
DATABASE_URL=postgresql://orchestrator:CHANGE_ME@localhost:5432/fluxbuilder
NODE_ENV=production
LOG_LEVEL=info
SESSION_SECRET=$(openssl rand -hex 32)
EOF

chmod 600 .env
```

### 4. Run migrations

```bash
pnpm --filter @workspace/db run db:push
```

### 5. Build the frontend

```bash
PORT=3090 API_PORT=3001 BASE_PATH=/ \
  pnpm --filter @workspace/fluxbuilder run build
```

Output: `artifacts/fluxbuilder/dist/`

### 6. Build the backend

```bash
pnpm --filter @workspace/api-server run build
```

Output: `artifacts/api-server/dist/index.mjs`

### 7. Configure nginx

```bash
cat > /etc/nginx/sites-available/mobilewp <<'EOF'
server {
    listen 3090;
    server_name _;

    root /projects/fluxbuilder/fluxbuilder-project/artifacts/fluxbuilder/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -s /etc/nginx/sites-available/mobilewp /etc/nginx/sites-enabled/mobilewp
nginx -t && systemctl reload nginx
```

### 8. Start with PM2

```bash
cd /projects/fluxbuilder/fluxbuilder-project
pm2 start artifacts/api-server/dist/index.mjs \
  --name fluxbuilder-api \
  --env production

pm2 save
pm2 startup
```

### 9. Verify

```bash
curl -sI http://localhost:3090 | head -3
curl -s http://localhost:3001/healthz
```

---

## SSL / TLS

Traefik automatically provisions Let's Encrypt certificates. Add a label to your nginx service (if running in Docker) or configure Traefik with a file provider:

### File provider for host-network nginx

```bash
cat > /projects/orchestrator/traefik-dynamic.yml <<'EOF'
http:
  routers:
    mobilewp:
      rule: "Host(`yourdomain.com`)"
      entryPoints:
        - websecure
      tls:
        certResolver: le
      service: mobilewp

  services:
    mobilewp:
      loadBalancer:
        servers:
          - url: "http://host.docker.internal:3090"
EOF
```

Add to docker-compose.yml:
```yaml
traefik:
  command:
    - --providers.file.filename=/etc/traefik/dynamic.yml
  volumes:
    - ./traefik-dynamic.yml:/etc/traefik/dynamic.yml
```

---

## Process Management

### PM2 commands

```bash
pm2 list                        # List all processes
pm2 logs fluxbuilder-api        # View logs
pm2 logs fluxbuilder-api --lines 100
pm2 restart fluxbuilder-api     # Restart
pm2 stop fluxbuilder-api        # Stop
pm2 delete fluxbuilder-api      # Remove
pm2 monit                       # Interactive monitor
```

### PM2 cluster mode (for more CPU cores)

```bash
pm2 start artifacts/api-server/dist/index.mjs \
  --name fluxbuilder-api \
  --instances max \
  --exec-mode cluster
```

### Auto-restart on OOM

```bash
pm2 start ... --max-memory-restart 1G
```

---

## Zero-Downtime Deployment

For production updates without downtime:

```bash
#!/bin/bash
# deploy.sh

set -e

cd /projects/fluxbuilder

# Pull latest
git fetch origin main
git reset --hard origin/main

# Install deps
cd fluxbuilder-project
pnpm install --frozen-lockfile

# Run migrations (forward-compatible only)
pnpm --filter @workspace/db run db:push

# Build
PORT=3090 API_PORT=3001 BASE_PATH=/ \
  pnpm --filter @workspace/fluxbuilder run build

pnpm --filter @workspace/api-server run build

# Graceful restart (no downtime)
pm2 reload fluxbuilder-api

# Verify
sleep 2
curl -sf http://localhost:3001/healthz || { echo "Health check failed"; exit 1; }

echo "Deployed successfully"
```

Run with:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Monitoring

### Logs

```bash
# Application logs
pm2 logs fluxbuilder-api

# nginx access logs
tail -f /var/log/nginx/access.log

# nginx error logs
tail -f /var/log/nginx/error.log

# Docker logs
docker logs -f orchestrator-postgres-1
docker logs -f orchestrator-traefik-1
```

### Health checks

```bash
# API
curl https://yourdomain.com/api/healthz

# Database
docker exec orchestrator-postgres-1 pg_isready -U orchestrator

# Redis
docker exec orchestrator-redis-1 redis-cli ping
```

### Metrics (optional)

Install PM2 Plus for real-time metrics:
```bash
pm2 link YOUR_KEY YOUR_SECRET
```

Or set up Prometheus + Grafana for custom dashboards.

---

## Troubleshooting

### 502 Bad Gateway

Backend is down. Check:
```bash
pm2 list
pm2 logs fluxbuilder-api --lines 50
```

Restart:
```bash
pm2 restart fluxbuilder-api
```

### Database connection errors

```bash
# Test connection
docker exec orchestrator-postgres-1 pg_isready

# Check credentials
grep DATABASE_URL /projects/fluxbuilder/fluxbuilder-project/.env

# Connect manually
docker exec -it orchestrator-postgres-1 psql -U orchestrator -d fluxbuilder
```

### High memory usage

```bash
# Check process memory
pm2 monit

# Check system memory
free -h

# Restart leaky process
pm2 restart fluxbuilder-api
```

### SSL certificate expired

Traefik auto-renews certificates 30 days before expiry. If renewal fails:

```bash
# Check Traefik logs
docker logs orchestrator-traefik-1 --tail 100

# Manually trigger renewal
docker restart orchestrator-traefik-1
```

### Slow queries

Check PostgreSQL slow query log:
```bash
docker exec orchestrator-postgres-1 psql -U orchestrator -d fluxbuilder -c "
  SELECT query, calls, total_exec_time, mean_exec_time
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;
"
```

---

## Rollback

If a deployment breaks production:

```bash
cd /projects/fluxbuilder
git log --oneline -5          # Find the last good commit
git reset --hard <commit>     # Roll back code

cd fluxbuilder-project
pnpm install --frozen-lockfile
PORT=3090 API_PORT=3001 BASE_PATH=/ pnpm --filter @workspace/fluxbuilder run build
pnpm --filter @workspace/api-server run build
pm2 reload fluxbuilder-api
```

---

## Scaling Beyond a Single VPS

When you outgrow one VPS:

1. **Separate database** — Move PostgreSQL to managed service (AWS RDS, Supabase)
2. **Load balancer** — Cloudflare or AWS ALB in front of multiple app servers
3. **Redis cluster** — Use Upstash or managed Redis
4. **Object storage** — Move uploads to S3/R2
5. **CDN for static assets** — Cloudflare R2 or AWS CloudFront

---

## Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [DATABASE.md](./DATABASE.md) — Database details
- [SETUP.md](./SETUP.md) — Local development

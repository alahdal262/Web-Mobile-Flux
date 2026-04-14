# Architecture

This document explains how Mobile-WP is architected, the design decisions behind each layer, and how the pieces fit together.

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [The Five Layers](#the-five-layers)
- [Data Flow](#data-flow)
- [Technology Decisions](#technology-decisions)
- [Database Schema](#database-schema)
- [Deployment Architecture](#deployment-architecture)
- [Integration with Other Services](#integration-with-other-services)

---

## High-Level Overview

Mobile-WP is a SaaS platform that transforms WordPress sites into native mobile apps. It follows a **config-driven architecture** where a visual builder produces JSON configuration that a mobile runtime consumes at runtime.

```
┌──────────────────────────────────────────────────────────────┐
│                     User's Browser                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  React Builder UI (Vite SPA)                           │  │
│  │  - Drag-and-drop widgets                               │  │
│  │  - 25 business templates                               │  │
│  │  - Real-time phone preview                             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTPS
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Cloudflare / Traefik                     │
│                       (TLS termination)                     │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                        VPS (Hostinger)                      │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Express    │  │  MPAOP      │  │  WordPress Sites    │  │
│  │  API        │  │  Platform   │  │  (customer sites)   │  │
│  │  (:3001)    │  │  (:3002)    │  │  + mobilewp-conn.   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                    │              │
│         ▼                ▼                    │              │
│  ┌─────────────────────────────────┐          │              │
│  │  PostgreSQL (shared)            │          │              │
│  │  - fluxbuilder DB               │          │              │
│  │  - mpaop_platform DB            │          │              │
│  │  - orchestrator DB              │          │              │
│  └─────────────────────────────────┘          │              │
│                                                │              │
│  ┌─────────────────────────────────┐          │              │
│  │  Redis (shared cache/sessions)  │          │              │
│  └─────────────────────────────────┘          │              │
└────────────────────────────────────────────────┼──────────────┘
                                                 │
                                                 │ Webhooks
                                                 ▼
                                    ┌──────────────────────┐
                                    │  WordPress Customer  │
                                    │  Site (any host)     │
                                    └──────────────────────┘
```

---

## The Five Layers

### Layer 1: SaaS Control Plane

Handles authentication, multi-tenancy, billing, and audit logging.

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Auth Service** | Express + scrypt + cookies | Signup, login, sessions |
| **Project Management** | Express + Drizzle ORM | CRUD for apps, user workspace |
| **Audit Log** | PostgreSQL | Track all mutations |
| **Admin API** | Express routes | Internal admin operations |

**Key files:**
- `fluxbuilder-project/artifacts/api-server/src/routes/auth.ts`
- `fluxbuilder-project/artifacts/api-server/src/routes/apps.ts`
- `fluxbuilder-project/artifacts/api-server/src/lib/auth.ts`

### Layer 2: Content Connectors

Bridges the platform to external content sources (WordPress is the primary connector).

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **WordPress Plugin** | PHP 8.1+ | REST API endpoints, webhook dispatcher |
| **Sync Service** | Express workers | Process webhook events, cache content |
| **Webhook Receiver** | Express + HMAC verification | Secure webhook ingestion |

**Key files:**
- `wp-plugin/mobilewp-connector/includes/class-mobilewp-api.php`
- `wp-plugin/mobilewp-connector/includes/class-mobilewp-webhooks.php`

### Layer 3: App Config & Design Schema

The visual builder and the JSON configuration it produces.

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Visual Builder** | React 19 + Vite | Drag-and-drop editor UI |
| **Widget Library** | @dnd-kit | 12 widget types, sortable canvas |
| **Template System** | TypeScript | 25 business templates |
| **Schema Engine** | JSON Schema | Config validation |

**Key files:**
- `fluxbuilder-project/artifacts/fluxbuilder/src/pages/Dashboard/WidgetBuilder.tsx`
- `fluxbuilder-project/artifacts/fluxbuilder/src/pages/Dashboard/data/templates.ts`
- `fluxbuilder-project/artifacts/fluxbuilder/src/pages/Dashboard/DesignPanel/TemplatesPanel.tsx`

### Layer 4: Mobile Runtime

The Flutter app that consumes the JSON config and renders native widgets (Phase 2 — not yet implemented).

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Flutter Shell** | Dart + Flutter | App container, navigation |
| **Widget Factory** | Dart | Map JSON → native widgets |
| **Config Service** | Dio HTTP + Hive cache | Fetch + cache config from CDN |
| **WordPress Client** | Dio HTTP | Fetch content from WP plugin API |

### Layer 5: Build & Release System

CI/CD pipeline for compiling and publishing mobile apps (Phase 2).

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Build Queue** | BullMQ / Redis | Queue build jobs |
| **Build Runner** | Codemagic / GitHub Actions | Flutter compilation |
| **Signing** | Fastlane | App signing, credentials |
| **Store Publishing** | Play Console + App Store Connect API | Automated releases |

---

## Data Flow

### User Creates a Mobile App

```
1. User signs up → POST /api/auth/signup
   └─> Backend hashes password with scrypt
   └─> Creates user in PostgreSQL
   └─> Returns session cookie (HttpOnly, Secure)

2. User enters website URL → POST /api/apps
   └─> Backend validates domain
   └─> Creates app record in database
   └─> Returns app ID

3. User installs mobilewp-connector plugin on their WordPress site
   └─> Plugin generates API keys
   └─> User copies keys to Mobile-WP dashboard

4. User selects a template → GET templates data
   └─> Builder loads 25 templates from `data/templates.ts`
   └─> User clicks "Use Template" → confirmation dialog
   └─> Template widgets loaded into WidgetBuilder canvas

5. User customizes widgets via drag-and-drop
   └─> Each widget has configurable properties
   └─> Real-time preview in iPhone/Android frame
   └─> Config auto-saves to database

6. User clicks "Build" → triggers build pipeline (Phase 2)
   └─> Build config sent to Flutter runtime repo
   └─> Codemagic/GitHub Actions compiles APK/IPA
   └─> Artifact stored, user notified
```

### Content Updates Flow

```
1. WordPress user publishes a new post
2. mobilewp-connector plugin fires `post.created` webhook
3. Backend receives webhook → verifies HMAC signature
4. Content cached in local PostgreSQL for fast mobile queries
5. Mobile app fetches updated content on next launch
6. No app rebuild needed — content is dynamic
```

---

## Technology Decisions

### Why React 19?

- **Concurrent features** for smoother drag-and-drop interactions
- **Server components** (future) for faster initial loads
- **Best-in-class DX** with Vite + HMR
- Largest ecosystem for component libraries

### Why Tailwind CSS v4?

- **Zero runtime** — all styles compiled at build time
- **Dark mode** with zero configuration
- **Mobile-first** responsive utilities
- **Consistency** across the entire design system

### Why Drizzle ORM over Prisma?

- **Lighter bundle** — critical for serverless deployment
- **SQL-first** — no hidden magic
- **Better TypeScript** — types derived directly from schema
- **Faster migrations** — no separate schema file
- **Prisma is used by MPAOP** — intentional diversification in the ecosystem

### Why Express 5 over NestJS?

- **Simplicity** — easier for contributors to understand
- **Flexibility** — no framework lock-in
- **Performance** — minimal overhead
- **Ecosystem** — most NPM middleware is Express-compatible

### Why @dnd-kit?

- **Modern React** — hooks-based, no HOCs
- **Accessible** — screen reader support out of the box
- **Performant** — uses CSS transforms, not layout
- **Sortable** — perfect for reordering widgets

### Why a Custom WordPress Plugin?

- **Full control** over the API surface
- **Secure by design** — HMAC signing, rate limiting
- **No plugin dependencies** — works on any WordPress site
- **WooCommerce integration** — conditional, only loads if WC is active

---

## Database Schema

### Core Tables (fluxbuilder database)

```sql
-- Users: authentication and identity
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Apps: mobile apps created by users
CREATE TABLE apps (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  app_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  template_id VARCHAR(100),
  primary_color VARCHAR(20),
  feature_state JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Location:** `fluxbuilder-project/lib/db/src/schema/index.ts`

---

## Deployment Architecture

### Production VPS Layout

```
Hostinger VPS (Linux x86_64, 32GB RAM)
│
├─ Docker (orchestrator stack)
│  ├─ PostgreSQL (shared across all projects)
│  │  ├─ fluxbuilder DB
│  │  ├─ orchestrator DB
│  │  ├─ mpaop_platform DB
│  │  └─ proj_* DBs (per-project)
│  ├─ Redis (shared cache + sessions)
│  └─ Traefik (TLS termination, reverse proxy)
│
├─ PM2 (process manager)
│  ├─ fluxbuilder-api (Express :3001)
│  ├─ mpaop-web (Next.js :3002)
│  ├─ mpaop-api (Express)
│  └─ mpaop-worker (background jobs)
│
└─ nginx (static file server, port 3090)
   └─ Serves compiled Vite bundle
```

### Request Flow

```
User Browser
    ↓ HTTPS
Cloudflare CDN
    ↓
Traefik (port 443, TLS)
    ↓
nginx (port 3090, static files)
    ↓ /api/*
Express API (port 3001)
    ↓
PostgreSQL (port 5432, internal)
```

---

## Integration with Other Services

Mobile-WP is part of a larger ecosystem of services running on the same VPS. This section explains how they connect.

### Related Projects

| Project | Role | Database | Port |
|---------|------|----------|------|
| **Mobile-WP** (this project) | Mobile app builder | `fluxbuilder` | 3001 |
| **MPAOP Platform** | Project orchestration & CI/CD | `mpaop_platform` | 3002 |
| **Orchestrator** | Docker + database manager | `orchestrator` | 3000 |

### Shared Infrastructure

All projects share:
- **PostgreSQL** — one Docker container, multiple databases (one per project)
- **Redis** — for caching, sessions, and background job queues
- **Traefik** — single ingress for all services with automatic TLS
- **Cloudflare** — CDN and DNS for all domains

### Database Connection

On the VPS, Mobile-WP connects to PostgreSQL via:

```bash
DATABASE_URL=postgresql://orchestrator:PASSWORD@localhost:5432/fluxbuilder
```

The `orchestrator` user has access to all project databases. Each project is isolated in its own database (row-level isolation is NOT used — full database separation provides better security).

### Service Discovery

Currently, services find each other via **localhost + known ports** (PM2 registers each process with a named identifier). In the future, this will move to:
- **Traefik service names** for HTTP-based routing
- **Redis pub/sub** for event-driven communication between services

### Why Share Infrastructure?

1. **Cost efficiency** — one VPS, multiple projects
2. **Unified monitoring** — PM2 shows all services in one dashboard
3. **Easy backup** — single PostgreSQL backup covers everything
4. **Rapid iteration** — new projects inherit the existing setup

### Future: Service Mesh

Phase 3 of the roadmap introduces a proper service mesh:
- **API Gateway** — single entry point for all services
- **Service Registry** — automatic service discovery
- **Distributed Tracing** — OpenTelemetry across all services
- **Circuit Breakers** — automatic failover

---

## Further Reading

- [SETUP.md](./SETUP.md) — Local development setup
- [DATABASE.md](./DATABASE.md) — Database connection details
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Production deployment guide
- [API.md](./API.md) — Complete API reference
- [../CONTRIBUTING.md](../CONTRIBUTING.md) — How to contribute

# Database Guide

Complete reference for the Mobile-WP database schema, migrations, and integration with other services.

## Table of Contents

- [Overview](#overview)
- [Schema](#schema)
- [Connection String](#connection-string)
- [Migrations](#migrations)
- [Shared Infrastructure](#shared-infrastructure)
- [Backup and Restore](#backup-and-restore)

---

## Overview

Mobile-WP uses **PostgreSQL 14+** as its primary database, accessed via **Drizzle ORM** for type-safe queries.

**Why PostgreSQL?**
- Mature, battle-tested, ACID-compliant
- `JSONB` support for flexible widget configurations
- Row-level security (future multi-tenancy)
- Full-text search (future content search)
- Shared across multiple services on the same VPS

**Why Drizzle ORM?**
- Zero runtime overhead (no query engine)
- Types derived directly from schema
- SQL-first — no hidden magic
- Smaller bundle than Prisma

---

## Schema

### `users` table

Stores user authentication and profile data.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `email` | `varchar(255)` | NO | — | Unique email address |
| `password_hash` | `text` | NO | — | scrypt hash + salt |
| `full_name` | `varchar(255)` | YES | — | User's full name |
| `created_at` | `timestamp` | NO | `NOW()` | Account creation time |

**Indexes:**
- `users_pkey` on `id`
- `users_email_idx` on `email` (unique)

### `apps` table

Stores user-created mobile apps and their configuration.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | NO | — | Foreign key → `users.id` |
| `app_name` | `varchar(255)` | NO | — | App display name |
| `website_url` | `varchar(500)` | YES | — | Source WordPress URL |
| `template_id` | `varchar(100)` | YES | — | Applied template |
| `primary_color` | `varchar(20)` | YES | — | Brand color (hex) |
| `feature_state` | `jsonb` | YES | `{}` | Widget configuration tree |
| `created_at` | `timestamp` | NO | `NOW()` | Creation time |
| `updated_at` | `timestamp` | NO | `NOW()` | Last modification |

**Indexes:**
- `apps_pkey` on `id`
- `apps_user_id_idx` on `user_id`

**Feature state example:**

```json
{
  "widgets": [
    {
      "id": "w1",
      "type": "banner",
      "config": {
        "title": "Welcome",
        "backgroundColor": "#1e3a5f",
        "imageUrl": "https://example.com/hero.jpg"
      }
    },
    {
      "id": "w2",
      "type": "blogPosts",
      "config": {
        "count": 10,
        "showImage": true
      }
    }
  ],
  "theme": {
    "mode": "light",
    "primaryColor": "#2563eb"
  }
}
```

---

## Connection String

### Local Development

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mobilewp
```

### Production (VPS)

```bash
DATABASE_URL=postgresql://orchestrator:PASSWORD@localhost:5432/fluxbuilder
```

The production database uses:
- **User:** `orchestrator` (has access to multiple project databases)
- **Database:** `fluxbuilder` (isolated from other services)
- **Host:** `localhost` (PostgreSQL runs in Docker on the same VPS)
- **Port:** `5432` (standard PostgreSQL port)

### Connection Pooling

In production, connection pooling is handled by the Express API layer (node-postgres with a pool size of 20). For heavy workloads, consider adding **PgBouncer** as a middleware.

---

## Migrations

Mobile-WP uses Drizzle's schema-first migration approach. Schemas are defined in TypeScript and pushed directly to the database.

### Location

```
fluxbuilder-project/lib/db/src/schema/index.ts
```

### Making Schema Changes

1. **Edit the schema file:**

   ```typescript
   // lib/db/src/schema/index.ts
   export const users = pgTable('users', {
     id: uuid('id').primaryKey().defaultRandom(),
     email: varchar('email', { length: 255 }).notNull().unique(),
     // ... add new columns here
     avatar: varchar('avatar', { length: 500 }),
   });
   ```

2. **Push to the database:**

   ```bash
   cd fluxbuilder-project
   pnpm --filter @workspace/db run db:push
   ```

3. **Regenerate TypeScript types:**

   The `db:push` command also updates `dist/` with the new types.

### Generating SQL Migrations (advanced)

For production migrations that need to be reviewed or applied manually:

```bash
pnpm --filter @workspace/db run db:generate
```

This creates a timestamped SQL file in `lib/db/drizzle/` that can be reviewed and applied with:

```bash
psql $DATABASE_URL < lib/db/drizzle/0001_add_avatar.sql
```

---

## Shared Infrastructure

On the production VPS, Mobile-WP shares a single PostgreSQL instance with several other services. Each service has its own isolated database.

### Database Layout

```
PostgreSQL (Docker: orchestrator-postgres-1)
├── fluxbuilder           ← Mobile-WP (this project)
├── orchestrator          ← Docker orchestrator
├── mpaop_platform        ← MPAOP project orchestrator
├── proj_final_test       ← Test project workspace
└── postgres              ← Default admin DB
```

### Why Share One PostgreSQL?

1. **Resource efficiency** — one container, multiple DBs
2. **Unified backups** — `pg_dumpall` backs up everything
3. **Simpler ops** — one service to monitor
4. **Low overhead** — each database is isolated at the PostgreSQL level

### Isolation Guarantees

Each project database has:
- Its own schema (no shared tables)
- Its own user (principle of least privilege)
- No cross-database references
- Independent backup/restore capability

### Accessing the Production Database

```bash
# SSH to the VPS
ssh root@72.61.107.121

# Connect to fluxbuilder DB
docker exec -it orchestrator-postgres-1 psql -U orchestrator -d fluxbuilder

# Run a query
\dt                          # list tables
SELECT * FROM users LIMIT 5; # query
\q                           # quit
```

---

## Integration with Other Services

### MPAOP Platform Integration (future)

The MPAOP Platform (at [github.com/alahdal262/mpaop-platform](https://github.com/alahdal262/mpaop-platform)) manages project lifecycles including Mobile-WP deployments. Integration points:

| MPAOP → Mobile-WP | Mobile-WP → MPAOP |
|-------------------|-------------------|
| Create new app project | Report build status |
| Provision database | Report deployment events |
| Trigger build pipeline | Request Flutter builds |
| Manage environment vars | Sync user workspace |

**Current state:** Mobile-WP runs as a standalone service. MPAOP integration is planned for Phase 3.

### Orchestrator Integration

The Orchestrator (at `/projects/orchestrator`) provides:
- Automated PostgreSQL database provisioning
- Container lifecycle management
- Traefik route registration
- SSL certificate management

Mobile-WP registers with the Orchestrator at deployment time to get its database credentials and ingress routes.

---

## Backup and Restore

### Full Backup

```bash
# From the VPS
docker exec orchestrator-postgres-1 pg_dump -U orchestrator fluxbuilder > \
  backups/fluxbuilder-$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
# Drop and recreate
docker exec orchestrator-postgres-1 psql -U orchestrator -c "DROP DATABASE fluxbuilder;"
docker exec orchestrator-postgres-1 psql -U orchestrator -c "CREATE DATABASE fluxbuilder;"

# Restore
cat backups/fluxbuilder-20260411.sql | \
  docker exec -i orchestrator-postgres-1 psql -U orchestrator -d fluxbuilder
```

### Automated Backups

For production, set up a daily backup via cron:

```bash
# /etc/cron.d/fluxbuilder-backup
0 3 * * * root docker exec orchestrator-postgres-1 pg_dump -U orchestrator fluxbuilder | gzip > /backups/fluxbuilder-$(date +\%Y\%m\%d).sql.gz
```

Keep 7 days of daily backups + 4 weeks of weekly backups.

---

## Data Types Reference

Drizzle ORM to PostgreSQL type mapping:

| TypeScript | PostgreSQL | Notes |
|-----------|-----------|-------|
| `uuid()` | `UUID` | Auto-generated with `gen_random_uuid()` |
| `varchar({ length })` | `VARCHAR(n)` | Fixed-length string |
| `text()` | `TEXT` | Unlimited-length string |
| `integer()` | `INTEGER` | 32-bit signed |
| `bigint()` | `BIGINT` | 64-bit signed |
| `boolean()` | `BOOLEAN` | true/false |
| `timestamp()` | `TIMESTAMP` | Date + time (no timezone by default) |
| `jsonb()` | `JSONB` | Binary JSON (queryable, indexable) |
| `json()` | `JSON` | Text JSON (not queryable) |

---

## Performance Tips

### Use JSONB for flexible data

Widget configurations are stored in a single `feature_state` JSONB column. This lets you:
- Query specific widget types: `WHERE feature_state @> '{"widgets":[{"type":"banner"}]}'`
- Index JSONB keys for fast lookups: `CREATE INDEX ON apps USING gin (feature_state);`

### Limit cascading reads

When fetching apps, don't always join the full user table. Use joins sparingly and select only the columns you need.

### Use prepared statements

Drizzle automatically uses parameterized queries, preventing SQL injection and enabling query plan caching.

---

## Troubleshooting

### "permission denied for table apps"

The database user doesn't have access. Grant permissions:

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO orchestrator;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO orchestrator;
```

### "relation users does not exist"

The schema hasn't been pushed. Run:

```bash
pnpm --filter @workspace/db run db:push
```

### "password authentication failed"

Check your `DATABASE_URL` — the password may contain special characters that need URL encoding (e.g., `@` → `%40`).

### "connection refused"

PostgreSQL isn't running or the port is wrong. Verify:

```bash
pg_isready -h localhost -p 5432
docker ps | grep postgres
```

---

## Further Reading

- [Drizzle ORM docs](https://orm.drizzle.team)
- [PostgreSQL docs](https://www.postgresql.org/docs/)
- [ARCHITECTURE.md](./ARCHITECTURE.md) — How the database fits into the overall system
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Production database setup

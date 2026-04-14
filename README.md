# Mobile-WP

**A visual mobile app builder platform for WordPress sites.**

Build native-quality mobile apps from your WordPress content with a drag-and-drop visual builder, real-time phone preview, 25+ business-specific templates, and one-click cloud builds.

> **Live Demo:** [flutter.streamtvlive.cloud](https://flutter.streamtvlive.cloud)

---

## Overview

Mobile-WP is a SaaS platform that lets website owners convert their WordPress sites into mobile apps without writing code. It follows the same architecture as [FluxBuilder](https://web.fluxbuilder.com) — a visual builder that outputs JSON configuration consumed by a Flutter runtime.

### Key Features

- **Visual Drag-and-Drop Builder** — 12 widget types (Banner, Image Slider, Product Grid, Category List, Search Bar, Text Block, Video Player, Button, Divider, HTML Block, Blog Posts, Map)
- **25 Business Templates** — News, Blog, E-Commerce, Restaurant, Portfolio, Education, Service, Media — each with unique widget layouts
- **Realistic Phone Preview** — iPhone 15 Pro and Android device frames with SVG status bars, Dynamic Island, device switcher
- **WordPress Plugin** — REST API endpoints + webhook dispatcher for real-time content sync
- **WooCommerce Support** — Products, categories, orders integration (conditional)
- **Dark Mode** — Full dark theme support across all panels
- **Mobile Responsive** — Collapsible sidebar, hamburger menu, responsive at all breakpoints
- **Auth System** — Signup, login, session management with cookie-based auth
- **Cloud Build Pipeline** — Stepped build progress (5 stages), build history, artifact management

---

## Architecture

```
Mobile-WP/
├── fluxbuilder-project/          # Main SaaS application (monorepo)
│   ├── artifacts/
│   │   ├── fluxbuilder/          # React frontend (builder UI)
│   │   └── api-server/           # Express.js backend API
│   └── lib/
│       ├── db/                   # Database schema (Drizzle ORM + PostgreSQL)
│       ├── api-zod/              # API schema definitions
│       ├── api-client-react/     # Generated React API client
│       └── api-spec/             # OpenAPI specification
│
└── wp-plugin/
    └── mobilewp-connector/       # WordPress plugin (PHP)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite 7.3 + Tailwind CSS v4 |
| **UI Components** | 57 shadcn/ui (Radix UI) components + Lucide icons |
| **Drag & Drop** | @dnd-kit/core + @dnd-kit/sortable |
| **Routing** | Wouter |
| **State** | TanStack React Query + useState |
| **Animations** | Framer Motion |
| **Backend** | Express 5 + cookie-parser |
| **Database** | PostgreSQL + Drizzle ORM |
| **Auth** | crypto.scrypt password hashing + cookie sessions |
| **Monorepo** | pnpm workspaces |
| **WordPress Plugin** | PHP 8.1+ with custom REST API + webhooks |

---

## Getting Started

### Prerequisites

- **Node.js** 20+ 
- **pnpm** 10+
- **PostgreSQL** 14+ (for backend)
- **WordPress** 6.0+ with PHP 8.1+ (for plugin testing)

### 1. Clone the Repository

```bash
git clone https://github.com/alahdal262/Mobile-WP.git
cd Mobile-WP
```

### 2. Install Dependencies

```bash
cd fluxbuilder-project
pnpm install
```

### 3. Set Up Environment

```bash
# For the frontend builder
export PORT=5173
export BASE_PATH=/
export API_PORT=3001

# For the backend API
export DATABASE_URL=postgresql://user:password@localhost:5432/mobilewp
export PORT=3001
```

### 4. Run Development Servers

```bash
# Frontend builder (in one terminal)
pnpm --filter @workspace/fluxbuilder run dev

# Backend API (in another terminal)
pnpm --filter @workspace/api-server run dev
```

The builder will be available at `http://localhost:5173`.

### 5. Build for Production

```bash
PORT=3090 API_PORT=3001 BASE_PATH=/ pnpm --filter @workspace/fluxbuilder run build
```

---

## Project Structure

### Frontend Builder (`artifacts/fluxbuilder/`)

```
src/
├── App.tsx                          # Router + auth guard
├── main.tsx                         # Entry point
├── index.css                        # Tailwind + theme + animations
├── pages/
│   ├── Home.tsx                     # Landing page (hero, features, pricing)
│   ├── Auth.tsx                     # Login / signup
│   ├── Blog.tsx                     # Blog listing
│   ├── Docs.tsx                     # Documentation
│   ├── CreateApp.tsx                # App creation wizard
│   └── Dashboard/                   # Main builder dashboard
│       ├── index.tsx                # Dashboard shell + routing
│       ├── types.tsx                # Shared types + constants
│       ├── WidgetBuilder.tsx        # Drag-and-drop visual builder
│       ├── data/
│       │   └── templates.ts         # 25 template configurations
│       ├── components/
│       │   ├── TopBar.tsx           # Auth-aware top bar
│       │   ├── LeftSidebar.tsx      # Navigation sidebar
│       │   ├── PhonePreview.tsx     # iPhone/Android device frame
│       │   ├── RightPanel.tsx       # Property inspector
│       │   ├── PageCardsPanel.tsx   # Tab page cards
│       │   ├── BottomToolbar.tsx    # Action toolbar
│       │   ├── NavStyles.tsx        # Nav bar style previews
│       │   └── TemplateScreens.tsx  # Template preview renderers
│       ├── DesignPanel/
│       │   ├── TemplatesPanel.tsx   # Template browser + apply
│       │   ├── AppBarPanel.tsx      # App bar configuration
│       │   ├── TabBarPanel.tsx      # Tab bar configuration
│       │   ├── SideMenuPanel.tsx    # Side menu builder
│       │   └── LayoutsPanel.tsx     # Layout configuration
│       ├── FeaturesPanel.tsx        # Feature toggles
│       ├── BuildPanel.tsx           # Build pipeline + history
│       ├── ChatPanel.tsx            # Support chat
│       ├── DynamicLinksPanel.tsx     # Dynamic links
│       ├── ProductLicensePanel.tsx   # License management
│       └── DashboardOverviewPanel.tsx
├── components/
│   ├── ui/                          # 57 shadcn/ui components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.tsx
└── lib/
    └── utils.ts
```

### Backend API (`artifacts/api-server/`)

```
src/
├── app.ts                           # Express setup + middleware
├── index.ts                         # Server startup
├── routes/
│   ├── auth.ts                      # POST /signup, /login, /logout, GET /me
│   ├── apps.ts                      # CRUD /apps endpoints
│   ├── health.ts                    # GET /healthz
│   └── index.ts                     # Route aggregator
└── lib/
    ├── auth.ts                      # Password hashing + sessions
    └── logger.ts                    # Pino logger
```

### WordPress Plugin (`wp-plugin/mobilewp-connector/`)

```
mobilewp-connector/
├── mobilewp-connector.php           # Plugin entry point
├── includes/
│   ├── class-mobilewp-auth.php      # API key validation + HMAC signing
│   ├── class-mobilewp-api.php       # 10 REST endpoints
│   ├── class-mobilewp-webhooks.php  # Webhook dispatcher (15+ events)
│   ├── class-mobilewp-sync.php      # Data formatters
│   ├── class-mobilewp-woo.php       # WooCommerce integration
│   └── class-mobilewp-admin.php     # Settings page
├── admin/
│   ├── settings-page.php            # Admin UI template
│   └── css/admin.css                # Admin styles
├── assets/js/admin.js               # Admin JavaScript
├── uninstall.php                    # Cleanup on deletion
└── readme.txt                       # WordPress.org listing
```

---

## Widget Builder

The visual builder supports 12 widget types organized by category:

| Category | Widgets |
|----------|---------|
| **Layout** | Banner, Image Slider, Divider |
| **Content** | Text Block, HTML Block, Blog Posts |
| **Commerce** | Product Grid, Category List |
| **Media** | Video Player, Map |
| **Interactive** | Search Bar, Button |

Each widget has configurable properties (colors, text, sizes, toggles) with real-time preview in the phone canvas.

---

## Templates

25 business-specific templates across 9 categories:

| Category | Count | Examples |
|----------|-------|---------|
| **News** | 4 | News Classic, Tech News, Magazine, Minimal Reader |
| **Blog** | 3 | Personal Blog, Travel Blog, Lifestyle Blog |
| **E-Commerce** | 4 | General Store, Fashion Store, Grocery, Digital Products |
| **Restaurant** | 3 | Restaurant Menu, Food Delivery, Recipe App |
| **Portfolio** | 3 | Clean Portfolio, Photography, Agency |
| **Education** | 2 | Online Courses, School App |
| **Service** | 3 | Local Service, Consulting, Real Estate |
| **Media** | 3 | Streaming, Podcast, Events |

Each template pre-loads a unique set of widgets into the builder canvas when applied.

---

## WordPress Plugin

### REST API Endpoints

All under `/wp-json/mobilewp/v1/`:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/status` | GET | No | Plugin health check + version info |
| `/site-info` | GET | Yes | Site branding and settings |
| `/posts` | GET | Yes | Paginated posts with metadata |
| `/posts/{id}` | GET | Yes | Single post detail |
| `/pages` | GET | Yes | Pages with hierarchy |
| `/categories` | GET | Yes | Category tree |
| `/tags` | GET | Yes | Tag list |
| `/media` | GET | Yes | Media library |
| `/menus` | GET | Yes | Navigation menus |
| `/search` | POST | Yes | Full-text search |
| `/products` | GET | Yes | WooCommerce products (if active) |
| `/products/{id}` | GET | Yes | Single product with variations |
| `/product-categories` | GET | Yes | Product category tree |

### Webhook Events

The plugin fires webhooks on content changes:

- `post.created`, `post.updated`, `post.deleted`, `post.trashed`
- `page.created`, `page.updated`, `page.deleted`
- `category.created`, `category.updated`, `category.deleted`
- `menu.updated`
- `media.uploaded`, `media.deleted`
- `product.created`, `product.updated`, `product.deleted` (WooCommerce)
- `order.created`, `order.status_changed` (WooCommerce)
- `site.settings_updated`, `theme.switched`

### Plugin Installation

1. Zip the `wp-plugin/mobilewp-connector/` directory
2. Upload via WordPress Admin > Plugins > Add New > Upload
3. Activate the plugin
4. Go to MobileWP in the admin sidebar
5. Generate API keys and configure webhook URL

---

## Deployment

### Production Stack

```
Internet --> Traefik (Docker, TLS) --> nginx (port 3090) --> Express API (port 3001) --> PostgreSQL
```

### Deploy to VPS

```bash
# SSH into server
ssh root@YOUR_VPS_IP

# Build
cd /projects/fluxbuilder
pnpm install
PORT=3090 API_PORT=3001 BASE_PATH=/ pnpm --filter @workspace/fluxbuilder run build

# Restart
pm2 restart fluxbuilder-api

# Verify
curl https://your-domain.com/api/healthz
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Frontend dev server port | `5173` |
| `API_PORT` | Backend API port | `3001` |
| `BASE_PATH` | URL base path | `/` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NODE_ENV` | Environment | `development` |
| `LOG_LEVEL` | Pino log level | `info` |

---

## Development Guide

### Adding a New Widget Type

1. Add the type to `WidgetType` union in `WidgetBuilder.tsx`
2. Add default config to `DEFAULT_CONFIGS`
3. Add the widget definition to `WIDGET_CATALOG`
4. Create a preview renderer in the `WidgetPreview` section
5. Create a properties panel component
6. Register in the `WidgetPropertySwitch`

### Adding a New Template

1. Open `data/templates.ts`
2. Add a new `TemplateConfig` with a unique `templateId`
3. Define `homeWidgets` array using existing widget types
4. Add the config to the `TEMPLATE_CONFIGS` export array
5. Add the template to `ALL_TEMPLATES` in `TemplatesPanel.tsx` with a preview component

### Adding a WordPress Endpoint

1. Open `includes/class-mobilewp-api.php`
2. Add route in `register_routes()`
3. Create handler method
4. Use `MobileWP_Sync` formatters for response data
5. Add auth via `permission_callback`

---

## API Reference

### Authentication

```bash
# Sign up
curl -X POST /api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!","fullName":"John Doe"}'

# Login
curl -X POST /api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'

# Get current user
curl /api/auth/me -H "Cookie: session=<token>"

# Logout
curl -X POST /api/auth/logout -H "Cookie: session=<token>"
```

### Apps

```bash
# List apps
curl /api/apps -H "Cookie: session=<token>"

# Create app
curl -X POST /api/apps \
  -H "Content-Type: application/json" \
  -H "Cookie: session=<token>" \
  -d '{"appName":"My App","websiteUrl":"https://example.com"}'

# Update app
curl -X PATCH /api/apps/:id \
  -H "Content-Type: application/json" \
  -H "Cookie: session=<token>" \
  -d '{"appName":"Updated Name"}'

# Delete app
curl -X DELETE /api/apps/:id -H "Cookie: session=<token>"
```

---

## Roadmap

### Phase 1 (Current) -- MVP
- [x] Visual drag-and-drop builder with 12 widgets
- [x] 25 business templates
- [x] WordPress plugin with REST API + webhooks
- [x] Auth system (signup/login/logout)
- [x] Dark mode
- [x] Mobile responsive dashboard
- [x] Realistic phone preview (iPhone/Android)
- [x] Build pipeline UI with stepped progress

### Phase 2 -- Product-Market Fit
- [ ] Flutter mobile runtime (JSON config consumer)
- [ ] Automated cloud builds via Codemagic
- [ ] WooCommerce checkout (WebView)
- [ ] Config publishing to CDN
- [ ] Billing (Stripe integration)
- [ ] Analytics dashboard

### Phase 3 -- Scale
- [ ] White-label / agency mode
- [ ] Template marketplace
- [ ] Custom connector framework (Shopify, Webflow)
- [ ] Multi-language builder
- [ ] SSO / enterprise auth
- [ ] Advanced release workflows

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode, no `any` types
- **React**: Functional components, hooks only
- **CSS**: Tailwind utility classes only
- **PHP**: WordPress Coding Standards (WPCS)
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by [FluxBuilder](https://web.fluxbuilder.com)
- Built with [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)
- Drag and drop by [@dnd-kit](https://dndkit.com)

---

**Built with Claude Code**

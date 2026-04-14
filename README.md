<p align="center">
  <img src="fluxbuilder-project/artifacts/fluxbuilder/public/favicon.svg" width="80" height="80" alt="Mobile-WP" />
</p>

<h1 align="center">Mobile-WP</h1>

<p align="center">
  <strong>A full-stack SaaS platform that turns any WordPress site into a native mobile app — without writing a single line of mobile code.</strong>
</p>

<p align="center">
  <a href="https://flutter.streamtvlive.cloud">Live Demo</a> &nbsp;&bull;&nbsp;
  <a href="#architecture">Architecture</a> &nbsp;&bull;&nbsp;
  <a href="#features">Features</a> &nbsp;&bull;&nbsp;
  <a href="#getting-started">Getting Started</a> &nbsp;&bull;&nbsp;
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/WordPress-Plugin-21759B?logo=wordpress&logoColor=white" alt="WordPress" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## The Vision

> *"WordPress powers 43% of the web, but turning a WordPress site into a real mobile app still costs $10,000+ and takes months. I built Mobile-WP to change that — a platform where any website owner can create a professional, native-quality mobile app in minutes, not months."*
>
> **&mdash; Abdel, Creator & Lead Architect**

I designed, architected, and built this entire platform from scratch &mdash; the visual builder, the backend API, the WordPress plugin, the template system, and the deployment infrastructure. This isn't a wrapper around someone else's tool. Every component, every API endpoint, every drag-and-drop interaction was conceived and engineered by me to solve a real problem I saw in the market.

---

## What Makes This Different

Most "WordPress to app" tools either:
- Wrap your website in a WebView (rejected by Apple, terrible UX)
- Require you to learn Flutter/React Native (defeats the purpose)
- Cost $299/month and lock you into their platform

**Mobile-WP takes a different approach:**

1. **JSON-driven architecture** &mdash; The builder outputs a declarative JSON schema, not code. This means the mobile app can update instantly without App Store resubmission (Apple-compliant).
2. **Real widget rendering** &mdash; Not a WebView. The Flutter runtime interprets the JSON and renders actual native widgets at 60fps.
3. **WordPress-native** &mdash; A custom plugin that deeply integrates with WordPress and WooCommerce, not just scraping your site's HTML.
4. **Template-first** &mdash; 25 business-specific templates so users start with a working app, not a blank canvas.

---

## Features

### Visual Drag-and-Drop Builder
12 widget types across 5 categories, all configurable with real-time preview:

| Category | Widgets |
|----------|---------|
| **Layout** | Banner, Image Slider, Divider |
| **Content** | Text Block, HTML Block, Blog Posts |
| **Commerce** | Product Grid, Category List |
| **Media** | Video Player, Map |
| **Interactive** | Search Bar, Button |

### 25 Business Templates
Purpose-built for real businesses, not generic placeholders:

| Category | Templates |
|----------|-----------|
| **News & Magazine** | News Classic, Tech News, Magazine, Minimal Reader |
| **Blog** | Personal Blog, Travel Blog, Lifestyle Blog |
| **E-Commerce** | General Store, Fashion, Grocery, Digital Products |
| **Restaurant & Food** | Restaurant Menu, Food Delivery, Recipe App |
| **Portfolio** | Clean Portfolio, Photography, Agency |
| **Education** | Online Courses, School App |
| **Service Business** | Local Service, Consulting, Real Estate |
| **Entertainment** | Streaming, Podcast, Events |

### Realistic Phone Preview
- iPhone 15 Pro frame with Dynamic Island, SVG status bar icons, home indicator
- Android frame with punch-hole camera, navigation bar
- Device switcher toggle
- Multi-layer box shadows for premium look

### WordPress Plugin
Custom PHP plugin (`mobilewp-connector`) with:
- 13 REST API endpoints for content, products, menus, media
- 15+ webhook events for real-time content sync
- WooCommerce integration (conditional)
- HMAC-SHA256 signed webhooks
- Admin settings page with webhook logs

### Full Auth System
- Signup, login, logout with session cookies
- Auth-aware TopBar with user avatar, initials, dropdown menu
- Protected routes with automatic redirect

### Dark Mode
Complete dark theme with zinc-950/900/800 palette across every panel.

### Mobile Responsive
Collapsible sidebar with hamburger menu, hidden right panel on mobile, responsive at all breakpoints.

### Build Pipeline
Stepped 5-stage progress (Fetch Dependencies &rarr; Compile &rarr; Package &rarr; Sign &rarr; Upload) with build history table and status badges.

---

<a id="architecture"></a>
## Architecture

I designed a clean 5-layer architecture that separates concerns and scales independently:

```
                    LAYER 1: SaaS Control Plane
            Auth | Projects | Billing | Admin | Audit
                            |
                    LAYER 2: Content Connectors
          WordPress Plugin <-> Sync Service | Webhooks
                            |
                LAYER 3: App Config & Design Schema
          Visual Builder | Schema Engine | Templates | Preview
                            |
                    LAYER 4: Mobile Runtime
       Flutter Shell | Widget Factory | Data Layer | Hybrid Nav
                            |
                LAYER 5: Build & Release System
           Build Queue | Signing | CI/CD | Store Publishing
```

### Tech Stack

| Layer | Technology | Why I Chose It |
|-------|-----------|----------------|
| **Frontend** | React 19 + Vite 7.3 | Concurrent features, fastest build tool |
| **Styling** | Tailwind CSS v4 | Utility-first, dark mode, zero runtime |
| **Components** | 57 shadcn/ui (Radix) | Accessible, composable, unstyled base |
| **Drag & Drop** | @dnd-kit | Best React DnD library, sortable + droppable |
| **Routing** | Wouter | 2KB router, perfect for SPA |
| **State** | TanStack Query | Server state management, cache, refetch |
| **Animations** | Framer Motion | Declarative, performant, gesture support |
| **Backend** | Express 5 | Mature, minimal, TypeScript-compatible |
| **Database** | PostgreSQL + Drizzle ORM | JSONB for schemas, type-safe queries |
| **Auth** | crypto.scrypt + cookies | No vendor lock-in, full control |
| **Monorepo** | pnpm workspaces | Fast, disk-efficient, native workspaces |
| **WordPress** | Custom PHP plugin | Full control over API surface |

---

## Project Structure

```
Mobile-WP/
├── fluxbuilder-project/              # Main SaaS application
│   ├── artifacts/
│   │   ├── fluxbuilder/              # React frontend (13,800+ lines)
│   │   │   └── src/
│   │   │       ├── pages/Dashboard/  # 21 modular components
│   │   │       │   ├── WidgetBuilder.tsx    # Drag-and-drop builder (1,718 lines)
│   │   │       │   ├── data/templates.ts    # 25 template configs
│   │   │       │   ├── components/          # 8 UI components
│   │   │       │   └── DesignPanel/         # 5 design editors
│   │   │       ├── pages/Home.tsx           # Landing page
│   │   │       └── components/ui/           # 57 shadcn components
│   │   └── api-server/               # Express backend (350 lines)
│   │       └── src/routes/            # Auth + Apps + Health
│   └── lib/                          # Shared packages
│       ├── db/                        # PostgreSQL schema
│       ├── api-zod/                   # API validation
│       └── api-client-react/          # Generated client
│
└── wp-plugin/
    └── mobilewp-connector/           # WordPress plugin (2,200 lines)
        ├── includes/                  # 6 PHP classes
        ├── admin/                     # Settings UI
        └── assets/                    # JS + CSS
```

**Total: ~16,400 lines of hand-crafted code across 167 files.**

---

<a id="getting-started"></a>
## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 10+
- PostgreSQL 14+ (for backend)

### Quick Start

```bash
# Clone
git clone https://github.com/alahdal262/Web-Mobile-Flux.git
cd Web-Mobile-Flux/fluxbuilder-project

# Install
pnpm install

# Run frontend
PORT=5173 BASE_PATH=/ API_PORT=3001 pnpm --filter @workspace/fluxbuilder run dev

# Run backend (separate terminal)
DATABASE_URL=postgresql://user:pass@localhost:5432/mobilewp pnpm --filter @workspace/api-server run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
PORT=3090 API_PORT=3001 BASE_PATH=/ pnpm --filter @workspace/fluxbuilder run build
```

---

## WordPress Plugin Setup

```bash
# From the repo root
cd wp-plugin
zip -r mobilewp-connector.zip mobilewp-connector/
```

1. Upload `mobilewp-connector.zip` via WP Admin > Plugins > Add New > Upload
2. Activate the plugin
3. Go to **MobileWP** in the sidebar
4. Generate API keys
5. Set webhook URL
6. Test: `curl https://yoursite.com/wp-json/mobilewp/v1/status`

### Plugin API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mobilewp/v1/status` | GET | Health check (no auth) |
| `/mobilewp/v1/posts` | GET | Paginated posts |
| `/mobilewp/v1/categories` | GET | Category tree |
| `/mobilewp/v1/menus` | GET | Nav menus with items |
| `/mobilewp/v1/products` | GET | WooCommerce products |
| `/mobilewp/v1/search` | POST | Full-text search |

[See full API reference in the source](wp-plugin/mobilewp-connector/readme.txt)

---

## Deployment

The live instance runs on a Hostinger VPS:

```
Internet -> Traefik (TLS) -> nginx (:3090) -> Express (:3001) -> PostgreSQL
```

```bash
ssh root@your-vps
cd /projects/fluxbuilder
pnpm install
PORT=3090 API_PORT=3001 BASE_PATH=/ pnpm --filter @workspace/fluxbuilder run build
pm2 restart fluxbuilder-api
```

---

<a id="roadmap"></a>
## Roadmap

### Phase 1 &mdash; MVP (Complete)
- [x] Visual drag-and-drop builder (12 widgets)
- [x] 25 business templates with one-click apply
- [x] WordPress plugin (REST API + webhooks + WooCommerce)
- [x] Auth system (signup/login/sessions)
- [x] Realistic phone preview (iPhone/Android)
- [x] Dark mode across all panels
- [x] Mobile responsive dashboard
- [x] Build pipeline UI
- [x] Live deployment at flutter.streamtvlive.cloud

### Phase 2 &mdash; Mobile Runtime
- [ ] Flutter runtime consuming JSON config
- [ ] Cloud builds via Codemagic
- [ ] Config publishing to CDN
- [ ] WooCommerce checkout (WebView)
- [ ] Stripe billing integration
- [ ] Analytics dashboard

### Phase 3 &mdash; Scale
- [ ] White-label / agency mode
- [ ] Template marketplace
- [ ] Custom connectors (Shopify, Webflow)
- [ ] Multi-language support
- [ ] Enterprise SSO

---

## Developer Guide

### Adding a Widget Type
1. Add to `WidgetType` union in `WidgetBuilder.tsx`
2. Add default config in `DEFAULT_CONFIGS`
3. Add to `WIDGET_CATALOG`
4. Create preview renderer + property panel
5. Register in the widget factory

### Adding a Template
1. Add config to `data/templates.ts`
2. Add entry to `ALL_TEMPLATES` in `TemplatesPanel.tsx`
3. Each template must use different widget combinations

### Adding a WordPress Endpoint
1. Register route in `class-mobilewp-api.php`
2. Create handler with `MobileWP_Sync` formatters
3. Add `permission_callback` for auth

---

## About the Creator

<table>
  <tr>
    <td width="120">
      <img src="https://github.com/alahdal262.png" width="100" style="border-radius: 50%;" alt="Abdel" />
    </td>
    <td>
      <strong>Abdel</strong><br/>
      Founder & Lead Architect<br/>
      <a href="https://salamnoor.com">salamnoor.com</a> &nbsp;|&nbsp; <a href="https://github.com/alahdal262">GitHub</a><br/><br/>
      Full-stack developer and entrepreneur based in the United Kingdom. Founder of <strong>Noor Web LTD</strong>. I conceived, designed, and built Mobile-WP from the ground up &mdash; from the initial product vision to the architecture design, from the React builder to the WordPress plugin, from the database schema to the production deployment.<br/><br/>
      This project represents my approach to software engineering: <strong>think big, ship fast, build things that solve real problems.</strong>
    </td>
  </tr>
</table>

---

## License

MIT License &mdash; see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Conceived, designed, and built by <a href="https://github.com/alahdal262">Abdel</a></strong><br/>
  <sub>16,400+ lines of code &nbsp;|&nbsp; 167 files &nbsp;|&nbsp; 25 templates &nbsp;|&nbsp; 1 vision</sub>
</p>

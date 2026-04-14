<p align="center">
  <img src="fluxbuilder-project/artifacts/fluxbuilder/public/favicon.svg" width="80" height="80" alt="Mobile-WP" />
</p>

<h1 align="center">Mobile-WP</h1>

<p align="center">
  <strong>A full-stack SaaS platform that turns any WordPress site into a native mobile app &mdash; without writing a single line of mobile code.</strong>
</p>

<p align="center">
  <a href="https://flutter.streamtvlive.cloud"><strong>Live Demo</strong></a> &nbsp;&bull;&nbsp;
  <a href="./docs/ARCHITECTURE.md">Architecture</a> &nbsp;&bull;&nbsp;
  <a href="./docs/SETUP.md">Setup</a> &nbsp;&bull;&nbsp;
  <a href="./docs/API.md">API Docs</a> &nbsp;&bull;&nbsp;
  <a href="./CONTRIBUTING.md">Contribute</a>
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
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs welcome" />
</p>

---

## The Vision

> *"WordPress powers 43% of the web, but turning a WordPress site into a real mobile app still costs $10,000+ and takes months. I built Mobile-WP to change that &mdash; a platform where any website owner can create a professional, native-quality mobile app in minutes, not months."*
>
> **&mdash; [Abdel](https://github.com/alahdal262), Creator & Lead Architect**

I designed, architected, and built this entire platform from scratch &mdash; the visual builder, the backend API, the WordPress plugin, the template system, and the deployment infrastructure. Every component, every API endpoint, every drag-and-drop interaction was conceived and engineered by me to solve a real problem I saw in the market.

---

## What Makes This Different

Most "WordPress to app" tools either:
- Wrap your website in a WebView (rejected by Apple, terrible UX)
- Require you to learn Flutter/React Native (defeats the purpose)
- Cost $299/month and lock you into their platform

**Mobile-WP takes a different approach:**

| Feature | Why It Matters |
|---------|----------------|
| **JSON-driven architecture** | The builder outputs declarative JSON, not code. Mobile apps can update instantly without App Store resubmission &mdash; Apple-compliant. |
| **Real widget rendering** | Not a WebView. The Flutter runtime interprets JSON and renders actual native widgets at 60fps. |
| **WordPress-native** | Custom plugin that deeply integrates with WordPress and WooCommerce, not just scraping your site's HTML. |
| **Template-first** | 25 business-specific templates so users start with a working app, not a blank canvas. |

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

### Complete SaaS Stack
- Auth system (signup, login, logout, sessions)
- Auth-aware TopBar with user avatar and dropdown
- Dark mode across all panels (zinc-950/900/800)
- Mobile responsive with collapsible sidebar
- Stepped build pipeline with 5-stage progress
- Build history with status badges

---

## Architecture

I designed a clean 5-layer architecture that separates concerns and scales independently:

```
                    LAYER 1: SaaS Control Plane
            Auth | Projects | Billing | Admin | Audit
                            │
                    LAYER 2: Content Connectors
          WordPress Plugin <-> Sync Service | Webhooks
                            │
                LAYER 3: App Config & Design Schema
          Visual Builder | Schema Engine | Templates
                            │
                    LAYER 4: Mobile Runtime
       Flutter Shell | Widget Factory | Data Layer
                            │
                LAYER 5: Build & Release System
           Build Queue | Signing | CI/CD | Publishing
```

See **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** for the full technical breakdown.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 7.3 + TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui (57 components) |
| **Drag & Drop** | @dnd-kit/core + @dnd-kit/sortable |
| **Routing** | Wouter (2KB router) |
| **State** | TanStack Query |
| **Animations** | Framer Motion |
| **Backend** | Express 5 + TypeScript |
| **Database** | PostgreSQL 16 + Drizzle ORM |
| **Auth** | crypto.scrypt + HttpOnly cookies |
| **Monorepo** | pnpm workspaces |
| **WordPress** | Custom PHP 8.1+ plugin |

---

## Project Structure

```
Mobile-WP/
├── README.md                          # You are here
├── CONTRIBUTING.md                    # How to contribute
├── LICENSE                            # MIT License
├── docs/                              # Full documentation
│   ├── ARCHITECTURE.md                #   System design
│   ├── SETUP.md                       #   Local dev setup
│   ├── DATABASE.md                    #   DB schema + migrations
│   ├── DEPLOYMENT.md                  #   Production deployment
│   └── API.md                         #   Complete API reference
│
├── fluxbuilder-project/               # Main SaaS application (monorepo)
│   ├── .env.example                   #   Environment template
│   ├── artifacts/
│   │   ├── fluxbuilder/               #   React frontend (13,800+ lines)
│   │   │   └── src/pages/Dashboard/   #     21 modular components
│   │   │       ├── WidgetBuilder.tsx  #     Drag-and-drop builder (1,718 lines)
│   │   │       ├── data/templates.ts  #     25 template configs
│   │   │       └── components/        #     Phone preview, sidebar, etc.
│   │   └── api-server/                #   Express backend
│   └── lib/                           #   Shared packages (db, types)
│
└── wp-plugin/
    └── mobilewp-connector/            # WordPress plugin (2,200 lines)
        ├── includes/                  #   6 PHP classes
        ├── admin/                     #   Settings UI
        └── assets/                    #   JS + CSS
```

**Total: ~16,400 lines of hand-crafted code across 167 files.**

---

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 10+
- PostgreSQL 14+ (for backend, optional for frontend-only dev)

### Install & Run

```bash
# Clone
git clone https://github.com/alahdal262/Web-Mobile-Flux.git
cd Web-Mobile-Flux/fluxbuilder-project

# Install
pnpm install

# Copy environment template
cp .env.example .env
# Edit .env with your database credentials

# Push database schema
pnpm --filter @workspace/db run db:push

# Run frontend (Terminal 1)
PORT=5173 BASE_PATH=/ API_PORT=3001 pnpm --filter @workspace/fluxbuilder run dev

# Run backend (Terminal 2)
pnpm --filter @workspace/api-server run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Need more detail?** See **[docs/SETUP.md](./docs/SETUP.md)** for the complete setup guide.

---

## Production Deployment

The live instance runs on a Hostinger VPS:

```
Internet -> Cloudflare -> Traefik (TLS) -> nginx (:3090) -> Express (:3001) -> PostgreSQL
```

```bash
ssh root@your-vps
cd /projects/fluxbuilder/fluxbuilder-project
pnpm install --frozen-lockfile
PORT=3090 API_PORT=3001 BASE_PATH=/ pnpm --filter @workspace/fluxbuilder run build
pm2 reload fluxbuilder-api
```

See **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** for the full production deployment guide.

---

## WordPress Plugin

### Installation

```bash
cd wp-plugin
zip -r mobilewp-connector.zip mobilewp-connector/
```

1. Upload `mobilewp-connector.zip` via WP Admin > Plugins > Add New > Upload
2. Activate the plugin
3. Navigate to **MobileWP** in the sidebar
4. Generate API keys
5. Set the webhook URL to your Mobile-WP instance

### Test the Plugin

```bash
# Status check (no auth required)
curl https://yoursite.com/wp-json/mobilewp/v1/status

# Get posts (requires API key)
curl -H "X-MobileWP-Platform-Key: YOUR_KEY" \
  https://yoursite.com/wp-json/mobilewp/v1/posts
```

See **[docs/API.md](./docs/API.md)** for the complete plugin API reference.

---

## Documentation

| Document | Description |
|----------|-------------|
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | System design, 5-layer architecture, technology decisions |
| **[SETUP.md](./docs/SETUP.md)** | Local development setup with troubleshooting |
| **[DATABASE.md](./docs/DATABASE.md)** | Schema, migrations, connection strings, backup/restore |
| **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** | Production deployment on a VPS with Traefik + nginx + PM2 |
| **[API.md](./docs/API.md)** | Complete REST API reference with curl examples |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | How to contribute your first PR |

---

## Roadmap

### Phase 1 &mdash; MVP (Complete)
- [x] Visual drag-and-drop builder with 12 widgets
- [x] 25 business templates with one-click apply
- [x] WordPress plugin (REST API + webhooks + WooCommerce)
- [x] Auth system (signup/login/sessions)
- [x] Realistic phone preview (iPhone/Android)
- [x] Dark mode across all panels
- [x] Mobile responsive dashboard
- [x] Build pipeline UI
- [x] Live deployment at [flutter.streamtvlive.cloud](https://flutter.streamtvlive.cloud)
- [x] Full documentation suite

### Phase 2 &mdash; Mobile Runtime
- [ ] Flutter runtime consuming JSON config
- [ ] Cloud builds via Codemagic
- [ ] Config publishing to CDN
- [ ] WooCommerce checkout integration
- [ ] Stripe billing
- [ ] Analytics dashboard

### Phase 3 &mdash; Scale
- [ ] White-label / agency mode
- [ ] Template marketplace
- [ ] Custom connectors (Shopify, Webflow)
- [ ] Multi-language support
- [ ] Enterprise SSO
- [ ] MPAOP Platform integration

---

## Contributing

**Contributions are welcome and appreciated!** Mobile-WP is built to grow with community input.

### How to Contribute

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit with [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add carousel widget"`
4. Push and open a PR

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/alahdal262/Web-Mobile-Flux/labels/good%20first%20issue) &mdash; these are specifically selected for new contributors.

### Areas We Need Help With

| Area | Skills Needed |
|------|--------------|
| **Flutter Runtime** | Dart, Flutter, state management |
| **New Widget Types** | React, TypeScript, CSS |
| **Template Designs** | UI/UX, Tailwind CSS |
| **WordPress Plugin** | PHP, WordPress API |
| **WooCommerce** | PHP, WooCommerce internals |
| **Documentation** | Technical writing |
| **Tests** | Jest, React Testing Library |
| **Accessibility** | WCAG, ARIA, screen readers |
| **Internationalization** | i18n, translations |

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the full contribution guide.

---

## Related Projects

Mobile-WP is part of a larger ecosystem of open-source SaaS infrastructure I'm building:

| Project | Description |
|---------|-------------|
| **[Mobile-WP](https://github.com/alahdal262/Web-Mobile-Flux)** | Visual mobile app builder (this project) |
| **MPAOP Platform** | Multi-project AI orchestration layer with Claude Code + MCP |
| **yemen-tv-app** | Flutter mobile app for Yemen TV news network |
| **yemen-tv-ai-assistant** | AI editorial assistant WordPress plugin |
| **yementv-native-suite** | WordPress plugin suite for Yemen TV |

All these projects share the same VPS infrastructure (PostgreSQL, Redis, Traefik) and demonstrate different facets of the same architectural philosophy: **config-driven, multi-tenant, cloud-native SaaS.**

---

## About the Creator

<table>
  <tr>
    <td width="120">
      <img src="https://github.com/alahdal262.png" width="100" style="border-radius: 50%;" alt="Abdel" />
    </td>
    <td>
      <strong>Abdel</strong><br/>
      <em>Founder & Lead Architect</em><br/><br/>
      <a href="https://salamnoor.com">salamnoor.com</a> &nbsp;|&nbsp;
      <a href="https://github.com/alahdal262">GitHub</a> &nbsp;|&nbsp;
      Based in the United Kingdom<br/><br/>
      Full-stack developer and founder of <strong>Infragate Solutions LTD</strong>. I conceived, designed, and built Mobile-WP from the ground up &mdash; from the initial product vision to the architecture design, from the React builder to the WordPress plugin, from the database schema to the production deployment.<br/><br/>
      <strong>My philosophy:</strong> think big, ship fast, build things that solve real problems.
    </td>
  </tr>
</table>

### Get in Touch

- **GitHub:** [@alahdal262](https://github.com/alahdal262)
- **Website:** [salamnoor.com](https://salamnoor.com)
- **Issues:** [Report a bug or request a feature](https://github.com/alahdal262/Web-Mobile-Flux/issues)
- **Discussions:** [Ask a question](https://github.com/alahdal262/Web-Mobile-Flux/discussions)

---

## License

MIT License &mdash; see [LICENSE](LICENSE) for details.

You are free to use, modify, and distribute this software for any purpose, including commercial use. Attribution to the original author is appreciated but not required.

---

## Acknowledgments

This project stands on the shoulders of giants:
- [React](https://react.dev) &mdash; UI framework
- [Vite](https://vitejs.dev) &mdash; Build tool
- [Tailwind CSS](https://tailwindcss.com) &mdash; Styling
- [shadcn/ui](https://ui.shadcn.com) &mdash; Component library
- [Lucide](https://lucide.dev) &mdash; Icons
- [@dnd-kit](https://dndkit.com) &mdash; Drag and drop
- [Drizzle ORM](https://orm.drizzle.team) &mdash; Database ORM
- [Express](https://expressjs.com) &mdash; Backend framework
- [PostgreSQL](https://postgresql.org) &mdash; Database
- [WordPress](https://wordpress.org) &mdash; CMS integration target

---

<p align="center">
  <strong>Conceived, designed, and built by <a href="https://github.com/alahdal262">Abdel</a></strong><br/>
  <sub>16,400+ lines of code &nbsp;|&nbsp; 167 files &nbsp;|&nbsp; 25 templates &nbsp;|&nbsp; 1 vision</sub>
</p>

<p align="center">
  <sub>If this project helps you, consider giving it a &#11088; on GitHub</sub>
</p>

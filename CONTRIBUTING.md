# Contributing to Mobile-WP

First off, thank you for considering contributing to Mobile-WP! This is a community-driven project, and every contribution makes a difference.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Need Help?](#need-help)

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### Report Bugs

Found a bug? Open an [issue](https://github.com/alahdal262/Web-Mobile-Flux/issues/new?template=bug_report.md) with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS information

### Suggest Features

Have an idea? Open a [feature request](https://github.com/alahdal262/Web-Mobile-Flux/issues/new?template=feature_request.md) with:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

### Areas We Need Help With

| Area | Skills Needed | Difficulty |
|------|--------------|------------|
| **Flutter Runtime** | Dart, Flutter, state management | Hard |
| **New Widget Types** | React, TypeScript, CSS | Medium |
| **Template Designs** | UI/UX, Tailwind CSS | Easy-Medium |
| **WordPress Plugin** | PHP, WordPress API | Medium |
| **WooCommerce Integration** | PHP, WooCommerce | Medium |
| **Documentation** | Technical writing | Easy |
| **Testing** | Jest, React Testing Library | Medium |
| **Accessibility** | WCAG, ARIA, screen readers | Medium |
| **Internationalization** | i18n, translation | Easy |
| **CI/CD Pipeline** | GitHub Actions, Docker | Medium |
| **Performance** | React profiling, Lighthouse | Medium |

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/alahdal262/Web-Mobile-Flux/labels/good%20first%20issue) — these are specifically selected for new contributors.

---

## Development Setup

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | JavaScript runtime |
| pnpm | 10+ | Package manager |
| PostgreSQL | 14+ | Database (backend) |
| Git | 2.40+ | Version control |
| PHP | 8.1+ | WordPress plugin dev (optional) |

### Quick Start

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/Web-Mobile-Flux.git
cd Web-Mobile-Flux

# 2. Install dependencies
cd fluxbuilder-project
pnpm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Run database migrations
pnpm --filter @workspace/api-server run db:push

# 5. Start development servers
# Terminal 1: Frontend
PORT=5173 BASE_PATH=/ API_PORT=3001 pnpm --filter @workspace/fluxbuilder run dev

# Terminal 2: Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/mobilewp pnpm --filter @workspace/api-server run dev
```

### Without a Database

You can work on the frontend builder without PostgreSQL:

```bash
PORT=5173 BASE_PATH=/ API_PORT=3001 pnpm --filter @workspace/fluxbuilder run dev
```

The builder UI, widget system, templates, and phone preview all work without a backend connection. Auth features will show login redirects, but the builder itself is fully functional.

### WordPress Plugin Development

```bash
# Set up a local WordPress instance (Docker recommended)
docker run -d --name wp-dev -p 8080:80 \
  -e WORDPRESS_DB_HOST=host.docker.internal:5432 \
  wordpress:latest

# Symlink the plugin into WordPress
ln -s $(pwd)/wp-plugin/mobilewp-connector /path/to/wordpress/wp-content/plugins/

# Activate via WP Admin > Plugins
```

---

## Project Architecture

```
Web-Mobile-Flux/
├── fluxbuilder-project/           # Main SaaS application
│   ├── artifacts/fluxbuilder/     # React frontend builder
│   ├── artifacts/api-server/      # Express.js backend
│   └── lib/                       # Shared packages (DB, types)
├── wp-plugin/                     # WordPress plugin
│   └── mobilewp-connector/        # PHP plugin source
├── docs/                          # Documentation
└── .github/                       # GitHub templates & workflows
```

### Key Files for Contributors

| If you want to... | Look at... |
|---|---|
| Add a new widget type | `artifacts/fluxbuilder/src/pages/Dashboard/WidgetBuilder.tsx` |
| Add a new template | `artifacts/fluxbuilder/src/pages/Dashboard/data/templates.ts` |
| Modify the sidebar | `artifacts/fluxbuilder/src/pages/Dashboard/components/LeftSidebar.tsx` |
| Change the phone preview | `artifacts/fluxbuilder/src/pages/Dashboard/components/PhonePreview.tsx` |
| Add an API endpoint | `artifacts/api-server/src/routes/` |
| Add a WordPress REST endpoint | `wp-plugin/mobilewp-connector/includes/class-mobilewp-api.php` |
| Modify the landing page | `artifacts/fluxbuilder/src/pages/Home.tsx` |
| Change theme/colors | `artifacts/fluxbuilder/src/index.css` |
| Add shared types | `artifacts/fluxbuilder/src/pages/Dashboard/types.tsx` |

---

## Making Changes

### Branch Naming

```
feature/add-carousel-widget
fix/dark-mode-sidebar-border
docs/improve-setup-guide
refactor/extract-phone-frame
```

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add carousel widget type to builder
fix: dark mode border color on sidebar active item
docs: add WordPress plugin setup instructions
refactor: extract phone frame into reusable component
style: adjust spacing in template cards
test: add unit tests for auth service
chore: update pnpm lockfile
```

---

## Pull Request Process

1. **Fork** the repository and create your branch from `main`
2. **Make** your changes with clear, focused commits
3. **Test** your changes locally (build must pass)
4. **Update** documentation if you changed APIs or added features
5. **Submit** your PR with a clear description

### PR Checklist

- [ ] My code follows the project's coding standards
- [ ] I have tested my changes locally
- [ ] `pnpm --filter @workspace/fluxbuilder run build` passes
- [ ] I have updated documentation where necessary
- [ ] My changes don't break existing functionality
- [ ] I have added dark mode support for any new UI elements

### PR Review

- PRs are reviewed by maintainers within 48 hours
- Small, focused PRs are reviewed faster
- Include screenshots for UI changes

---

## Coding Standards

### TypeScript / React

```typescript
// DO: Use TypeScript strict mode
const widget: Widget = { id: generateId(), type: "banner", config: {} };

// DON'T: Use 'any'
const widget: any = {};  // Never do this

// DO: Use functional components with hooks
export function MyComponent({ title }: { title: string }) {
  const [state, setState] = useState(false);
  return <div>{title}</div>;
}

// DON'T: Use class components
class MyComponent extends React.Component {}  // Never do this
```

### CSS / Tailwind

```tsx
// DO: Use Tailwind utility classes
<div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl p-4">

// DON'T: Use inline styles (except for dynamic values)
<div style={{ display: 'flex', backgroundColor: 'white' }}>

// DO: Support dark mode on every new element
<p className="text-gray-900 dark:text-gray-100">

// DON'T: Forget dark mode
<p className="text-gray-900">  // Missing dark variant
```

### PHP (WordPress Plugin)

```php
// DO: Follow WordPress Coding Standards
function mobilewp_get_posts( WP_REST_Request $request ): WP_REST_Response {
    $page = absint( $request->get_param( 'page' ) );
    $posts = new WP_Query( [ 'posts_per_page' => 20, 'paged' => $page ] );
    return new WP_REST_Response( [ 'data' => $formatted ] );
}

// DO: Sanitize all input, escape all output
$title = sanitize_text_field( $request->get_param( 'title' ) );
echo esc_html( $title );

// DON'T: Use direct database queries
$wpdb->query( "SELECT * FROM ..." );  // Use WP_Query instead
```

---

## Need Help?

- **Questions?** Open a [Discussion](https://github.com/alahdal262/Web-Mobile-Flux/discussions)
- **Bug?** Open an [Issue](https://github.com/alahdal262/Web-Mobile-Flux/issues)
- **Company:** [Infragate Solutions LTD](https://infragatesolutions.com/) — the team maintaining Mobile-WP

---

**Thank you for contributing to Mobile-WP!** Every PR, issue, and suggestion helps make this platform better for everyone.

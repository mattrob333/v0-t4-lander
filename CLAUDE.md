# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
# Development
pnpm dev                # Start development server
pnpm dev:turbo          # Start with Turbo mode
pnpm build              # Build for production
pnpm start              # Run production server
pnpm lint               # Run ESLint

# Performance & Optimization
pnpm optimize:images           # Optimize images in public/images
pnpm performance:check        # Run performance monitoring
pnpm performance:lighthouse   # Run Lighthouse audit
pnpm bundle:analyze          # Analyze bundle with webpack-bundle-analyzer
pnpm sitemap:generate        # Generate sitemap files
pnpm validate:schema         # Validate structured data schemas

# Lighthouse CI
pnpm lighthouse:ci           # Run Lighthouse CI
pnpm lighthouse:ci:mobile    # Run mobile-specific Lighthouse CI
pnpm lighthouse:ci:full      # Run full site Lighthouse CI audit
```

---

## Architecture

This is a high-performance Next.js 15 landing page for **Tier 4 Intelligence**, focused on AI consulting services with a 5-day POC offering.
The site emphasizes **conversion optimization, SEO, and performance**.

### Core Systems

**Conversion Optimization Suite** (`components/conversion-optimization-suite.tsx`)

* Exit intent popups with AI readiness assessment
* Multi-step lead forms with industry customization
* Social proof system with live activity notifications
* Urgency/scarcity system with limited spots counter
* Trust signals and risk reduction components
* A/B testing framework for continuous optimization

**SEO & Performance Infrastructure**

* Programmatic page generation for AI solutions by industry/use-case (`app/ai-solutions/`)
* Comprehensive structured data implementation (`components/schema/`)
* Advanced image optimization pipeline with WebP/AVIF formats
* Internal linking system for SEO authority distribution
* Performance monitoring and Web Vitals tracking

**Analytics & Monitoring** (`lib/analytics/`, `components/analytics-monitoring-dashboard.tsx`)

* Conversion funnel tracking
* Google Analytics 4 integration
* Search Console integration
* Real-time performance monitoring
* Automated reporting system

---

## Front-End Modification Workflow (with Playwright MCP)

When Claude Code needs to make **adjustments to the website front-end**, it must use the **Playwright MCP server**.

Playwright MCP enables:

* Taking **screenshots** of the site during modifications
* Inspecting **DOM elements** for accurate CSS/HTML changes
* Validating UI/UX fixes in real time
* Running end-to-end tests on the updated front-end

**Configuration:**

```bash
claude mcp add playwright -s project -- cmd /c npx -y @modelcontextprotocol/server-playwright
```

When modifying UI components, Claude should:

1. Use Playwright MCP to open the local dev server.
2. Capture screenshots of affected components.
3. Apply changes in `.tsx` or `.css` files.
4. Verify adjustments visually with updated screenshots before finalizing.

---

## Backend: Chatbot & Contact Form Integration

The repository will also include a **chatbot backend** and **database integration**:

* **Chatbot Backend** (`app/api/chatbot/route.ts`)

  * Provides an API endpoint for website chatbot messages.
  * Connects to LLM (Claude via API) for conversation handling.
  * Can be extended with memory (session storage, DB, Redis).

* **Contact Form Integration** (`app/actions/submit-contact.ts`)

  * Captures `name`, `email`, `message`.
  * Writes submissions into the database (`prisma/lead.ts` or Supabase).
  * Connects chatbot and contact form into the same **leads table** for unified CRM.

**Database Table: `leads`**

| Column       | Type      | Description                 |
| ------------ | --------- | --------------------------- |
| `id`         | UUID/PK   | Unique identifier           |
| `name`       | String    | Name from contact form      |
| `email`      | String    | Email address               |
| `message`    | Text      | Contact form message        |
| `source`     | Enum      | `contact_form` or `chatbot` |
| `created_at` | Timestamp | Auto-generated              |

This ensures all inbound leads (manual form + chatbot interactions) are centralized for follow-up.

---

## Key Technical Decisions

* **ESLint/TypeScript errors ignored in builds** – set in `next.config.mjs` for rapid iteration
* **Image optimization** – custom pipeline with multiple formats and responsive sizes
* **Bundle splitting** – aggressive code splitting for vendors, UI components, and common chunks
* **Caching strategy** – immutable cache headers for static assets (1 year TTL)
* **Security headers** – CSP, X-Frame-Options, and other security headers configured

---

## Component Patterns

* **OptimizedImage** (`components/ui/optimized-image.tsx`) – use for all images with responsive srcsets
* **LazyLoader** (`components/ui/lazy-loader.tsx`) – wrap non-critical components for lazy loading
* **Server Actions** – all form submissions use server actions (see `app/actions/submit-lead.ts`)
* **Theme-aware components** – use CSS variables for dark/light mode compatibility
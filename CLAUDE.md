# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev             # Start development server (port 3000)
npm run dev:turbo       # Start with Turbo mode
npm run build           # Build for production
npm run start           # Run production server
npm run lint            # Run ESLint

# Testing
npm test                # Run Jest tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
npm run test:ci         # Run tests for CI environments

# Performance & Optimization
npm run optimize:images         # Optimize images in public/images
npm run performance:check       # Run performance monitoring
npm run performance:lighthouse  # Run Lighthouse audit
npm run bundle:analyze          # Analyze bundle with webpack-bundle-analyzer
npm run bundle:report           # Generate bundle report
npm run sitemap:generate        # Generate sitemap files
npm run validate:schema         # Validate structured data schemas
npm run preload:fonts          # Preload font optimization

# Lighthouse CI
npm run lighthouse:ci           # Run Lighthouse CI
npm run lighthouse:ci:mobile    # Run mobile-specific Lighthouse CI
npm run lighthouse:ci:full      # Run full site Lighthouse CI audit
npm run lighthouse:generate-config  # Generate Lighthouse configuration
```

## Architecture

This is a high-performance Next.js 15 landing page for **Tier 4 Intelligence**, focused on AI consulting services with a 5-day POC offering. The site emphasizes **conversion optimization, SEO, and performance**.

### Route Structure

- `/` - Main landing page with hero, services, testimonials
- `/ai-solutions/[industry]/[usecase]` - Programmatic pages for industry-specific AI solutions
- `/solutions/[category]/[solution]` - Solution-specific pages
- `/contact` - Contact form page
- `/api/chatbot` - Chatbot API endpoint
- `/api/airtable` - Airtable integration for lead management

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



## Technical Implementation Details

**Build Configuration** (`next.config.mjs`)
* ESLint/TypeScript errors ignored in builds for rapid iteration
* Standalone output mode for optimized Docker deployments
* Image optimization pipeline with WebP/AVIF conversion
* Aggressive bundle splitting for vendors, UI components, and common chunks
* Immutable cache headers for static assets (1 year TTL)
* Security headers configured in `_headers` file

## Testing Strategy

* Jest configured with React Testing Library
* Test files: `**/__tests__/**/*.(ts|tsx)` or `**/*.(test|spec).(ts|tsx)`
* Coverage thresholds: 80% lines, 70% branches/functions
* Run single test: `npm test -- path/to/test.spec.tsx`

## Key Components and Patterns

* **OptimizedImage** (`components/ui/optimized-image.tsx`) - Responsive image component with srcset
* **LazyLoader** (`components/ui/lazy-loader.tsx`) - Component lazy loading wrapper
* **ConversionOptimizationSuite** (`components/conversion-optimization-suite.tsx`) - Core CRO components
* **Server Actions** (`app/actions/`) - Form submissions and data mutations
* **Schema Components** (`components/schema/`) - Structured data for SEO
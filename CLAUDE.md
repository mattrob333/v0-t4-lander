# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 15 landing page for Tier 4, built with v0.app and deployed on Vercel. The project uses React 19, TypeScript, Tailwind CSS, and shadcn/ui components.

## Common Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# Lint code
pnpm lint
```

## Architecture & Structure

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Forms**: react-hook-form with Zod validation
- **Icons**: lucide-react
- **Theme**: next-themes for dark/light mode support

### Directory Structure
- `/app` - Next.js App Router pages and layouts
  - `/actions` - Server actions for form submissions
  - `layout.tsx` - Root layout with ThemeProvider and Toaster
  - `page.tsx` - Main landing page
- `/components` - React components
  - Business components (hero, header, case-studies, etc.)
  - `/ui` - shadcn/ui primitive components
- `/lib` - Utility functions (utils.ts)
- `/hooks` - Custom React hooks (use-toast)
- `/public/images` - Static assets

### Key Architectural Patterns
1. **Server Actions**: Form submissions use Next.js server actions (see `submit-lead.ts`)
2. **Component Organization**: Business logic components at root level, UI primitives in `/ui`
3. **Path Aliases**: Use `@/` prefix for imports from project root
4. **Theme System**: CSS variables-based theming with dark/light mode support
5. **Toast Notifications**: Global toast system via Toaster component in root layout

### Important Configuration
- TypeScript configured with strict mode and bundler module resolution
- Path aliases configured: `@/*` maps to project root
- Tailwind CSS uses `app/globals.css` as entry point
- shadcn/ui components configured via `components.json`

## Deployment
- Automatically synced with v0.app deployments
- Deployed on Vercel at: https://vercel.com/matts-projects-fb383d6a/v0-tier-4-landing-page
- Changes made in v0.app are automatically pushed to this repository
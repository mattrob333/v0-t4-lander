**Thread title suggestion:** **T4I Solutions IA & Build Brief (v1.0)**

Matt — below is a crisp, “hand‑to‑code” brief you can drop into your repo for Claude Code. It defines the information architecture, copy, routing, components, and acceptance tests to ship a **Solutions** system modeled after Tier4 Advisors’ site but tailored to **Tier 4 Intelligence** (dark theme; green/black/white).

---

## 0) Objectives (what we’re building)

* A **Solutions** dropdown in the top header (mega‑menu) mirroring the Tier4 Advisors pattern.
* A **Solutions landing section** on the **Home** page (“Our Areas of Expertise”) with 6 clickable tiles.
* A full **/solutions** landing page with the same 6 categories + intros.
* **/solutions/\[category]** pages listing the solutions inside each category (cards).
* Content is **data‑driven** (single source of truth), so adding/changing a solution is one line of JSON/TS.

**Primary CTA everywhere:** “Book an AI Opportunity Scan” (Audit → Pilot → Retainer).

---

## 1) Information Architecture (IA) & Taxonomy

We’ll use six categories to match the Tier4 Advisors 6‑box layout and to keep breadth without clutter.

### Category set (tiles on Home + /solutions)

1. **Customer Self‑Service**
   *Automate high‑volume requests across chat, voice, email, SMS & social.*
2. **Agent & Employee Copilots**
   *Real‑time assistance, auto‑summary, and AI drafting to boost productivity.*
3. **Analytics & Quality Intelligence**
   *Mine every conversation for insights, QA, compliance, and prediction.*
4. **Automation & Orchestration**
   *Zapier/Make + RPA + Document AI + routing to remove manual work.*
5. **LLM, Platforms & Integration**
   *Model strategy, RAG, vector search, security, and platform integrations.*
6. **Advisory, Training & Managed AI**
   *Blueprints, POCs, Fractional CAO, training, and ongoing management.*

### Solutions under each category (slugged, 1‑liner)

**1) Customer Self‑Service**

* `website-chatbot` — Website chatbot with live‑agent handoff.
* `multichannel-virtual-agent` — Unified bot across web, mobile, SMS, WhatsApp, FB, Slack.
* `voicebot-ivr` — Voicebot & IVR modernization with natural speech.
* `email-triage` — AI email triage & auto‑responses with approval workflows.
* `social-automation` — DM/comment responders and escalation flows.
* `appointment-bot` — Scheduling bot for meetings, demos, or service calls.
* `order-billing-bot` — Order status, returns, billing & payments assistant.
* `knowledge-faq` — FAQ automation & knowledge surfacing.
* `idv-secure-bot` — Identity verification & secure task flows.
* `multilingual-self-service` — Self‑service in 100+ languages, consistent tone.

**2) Agent & Employee Copilots**

* `agent-assist` — Real‑time next‑best‑action and suggested replies.
* `auto-summary` — Auto‑summary & disposition into CRM/ticketing.
* `knowledge-copilot` — Semantic knowledge search inside any tool.
* `sales-coach` — Sales call coach & script assist with objection handling.
* `comm-drafting` — Draft emails/chats/proposals in your brand voice.
* `meeting-notetaker` — Live meeting notes, tasks, and follow‑ups.
* `translation-realtime` — Bi‑directional chat/voice translation.
* `audio-enhancement` — Noise suppression & accent softening.
* `crm-copilot` — CRM data entry and enrichment copilots.
* `hr-copilot` — HR assistant for FAQs, policies, onboarding.
* `it-helpdesk-copilot` — IT support copilot for L1 triage & fixes.
* `finance-ops-copilot` — AP/AR and reconciliations copilot.

**3) Analytics & Quality Intelligence**

* `conversation-intelligence` — Topic, sentiment, and intent analytics.
* `quality-scoring` — AI auto‑QA on 100% of interactions.
* `predictive-csat` — Predict CSAT/NPS and churn risk without surveys.
* `topic-trend` — Trend & root‑cause analysis on contact drivers.
* `voc-dashboard` — Voice‑of‑Customer dashboards for leaders.
* `compliance-monitoring` — PII/redaction & policy checks in real time.
* `promise-tracking` — Track commitments made in conversations.
* `revenue-intelligence` — Revenue moments & pipeline signals from calls.
* `marketing-attribution` — Tie calls/chats back to campaigns.
* `deflection-analytics` — Self‑service vs. agent deflection insights.

**4) Automation & Orchestration**

* `zapier-make` — Workflow automation hub (Zapier/Make/Workato).
* `rpa` — RPA for back office + desktop tasks (UiPath/Power Automate).
* `document-ai` — Document intake, OCR, extraction & e‑signature.
* `routing-triage` — Smart routing for tickets/leads/cases.
* `etl-sync` — Data pipelines, ETL, and system sync.
* `lead-enrichment` — Capture, enrich, score, and route leads.
* `sms-ai` — AI SMS campaigns with compliant auto‑replies.
* `ai-dialer` — Voice outreach robots & follow‑ups (compliance‑first).
* `social-publishing` — Auto‑publish, listen, and respond.
* `billing-invoices` — Billing, invoicing & dunning automation.
* `scheduling-dispatch` — Field service scheduling & dispatching.
* `reporting-dashboards` — Automated reports & exec dashboards.

**5) LLM, Platforms & Integration**

* `llm-strategy` — Model selection (OpenAI/Anthropic/Gemini/etc.) & cost/quality tradeoffs.
* `rag` — Retrieval‑Augmented Generation over private knowledge.
* `on-device-llm` — Private/offline LLMs for iPad/edge devices.
* `vector-db-enterprise-search` — Vector DBs & enterprise semantic search.
* `ccaas-ucaas-crm` — Deep integrations to CCaaS/UCaaS/CRM stacks.
* `api-middleware` — API/middleware/webhooks to glue systems.
* `kb-engineering` — Knowledge base cleanup, chunking, and policy tags.
* `promptops-evals` — Prompt libraries, eval harnesses & guardrails.
* `mlops-hosting` — Model hosting, CI/CD, canary & rollback.
* `ai-security` — Privacy, security, and governance for AI.
* `ai-observability` — Traces, metrics, cost & quality monitoring.

**6) Advisory, Training & Managed AI**

* `opportunity-scan` — AI Opportunity Scan & Blueprint (discovery → PRDs).
* `poc-sprint` — Proof‑of‑Concept sprint with KPIs in 2–4 weeks.
* `fractional-cao` — Fractional Chief Automation Officer service.
* `executive-workshops` — Executive workshops & team training.
* `change-management-playbooks` — Adoption & enablement playbooks.
* `ai-policy` — AI policy, ethics & regulatory compliance.
* `data-readiness` — Data discovery, governance & quality audits.
* `aicoe` — Build an internal AI Center of Excellence.
* `managed-ai` — Managed AI & automations (SLA, monitoring).
* `industry-playbooks` — Verticalized templates & agents.
* `business-dna-map` — Business DNA Map (process/context mapping).
* `orgarchitect` — Auto‑generated org charts & role prompts.
* `ai-transformation-navigator` — Interactive sales discovery tool.
* `promptmart` — PromptMart™ library of vetted prompts/agents.

> **Note:** We can add/remove solutions by editing one data file; routing and UI update automatically.

---

## 2) UX & Visual Spec (match T4 Advisors feel, modernized)

* **Top nav:** “Solutions” opens a **mega‑menu** on hover/focus; 2 columns × 3 rows of **Category** links. Right side shows 3–4 **featured solutions** from the hovered category + “View all”.
* **Home page** section (below the fold): header “**Our Areas of Expertise**” + 6 tiles (cards).

  * Tiles: icon, title, 1‑line description, chevron.
  * Click → `/solutions/[category]`.
* **/solutions** page: hero (“AI‑Powered Solutions to Transform Your Business”) + 6 category cards (same as Home but larger).
* **/solutions/\[category]** page:

  * Hero: category title + 1‑sentence value prop.
  * Pill filters: “All | Popular | New” (non‑functional placeholder OK for v1).
  * Grid of **SolutionCards** (title, 1‑liner, tags, CTA).
  * Right rail (optional): “Featured Products” (Business DNA Map, OrgArchitect, PromptMart).
  * Sticky CTA bar on mobile: “Book Opportunity Scan”.
* **Branding:** dark mode default; green/black/white; respect existing tokens.

  * Example tokens: `--t4i-green`, `--t4i-black`, `--t4i-white`.
* **Icons:** Lucide (e.g., `Bot`, `UserRoundCog`, `LineChart`, `Workflow`, `Boxes`, `GraduationCap`).

**Accessibility:**

* Menu is keyboard navigable (Esc closes, arrow keys cycle).
* ARIA: `role="menu"` & `aria-expanded` for mega‑menu; links have `aria-label`.
* Color contrast ≥ 4.5:1.

---

## 3) Routes & File Structure (Next.js App Router, TS, Tailwind, shadcn)

```
/app
  /(marketing)
    /page.tsx                         // Home (add Expertise section)
    /solutions/page.tsx               // Solutions landing
    /solutions/[category]/page.tsx    // Category page
/components
  /nav/SolutionsMegaMenu.tsx
  /solutions/SolutionsTileGrid.tsx
  /solutions/CategoryHero.tsx
  /solutions/SolutionCard.tsx
  /solutions/FeaturedProducts.tsx
/content
  /solutions.ts                       // single source of truth (see below)
  /featuredProducts.ts
/styles
  /tokens.css                         // --t4i-green, etc.
```

---

## 4) Data Model (single source of truth)

**`/content/solutions.ts`**

```ts
// Types
export type Solution = {
  title: string;
  slug: string;          // kebab-case
  summary: string;       // 1-liner for cards
  tags?: string[];       // ["Chat", "Voice", "CRM"]
};

export type Category = {
  title: string;
  slug: string;          // kebab-case; must match route
  tagline: string;       // 1-liner for category hero & tiles
  icon: string;          // lucide icon name
  solutions: Solution[];
};

// Data
export const CATEGORIES: Category[] = [
  {
    title: "Customer Self‑Service",
    slug: "customer-self-service",
    tagline: "Automate high‑volume requests across chat, voice, email, SMS & social.",
    icon: "Bot",
    solutions: [
      { title: "Website Chatbot & Handoff", slug: "website-chatbot",
        summary: "Conversational web bot with seamless live‑agent escalation.", tags:["Chat","Web"] },
      { title: "Multichannel Virtual Agent", slug: "multichannel-virtual-agent",
        summary: "One bot across SMS, WhatsApp, FB, Slack, and mobile.", tags:["Omnichannel"] },
      { title: "Voicebot & IVR Modernization", slug: "voicebot-ivr",
        summary: "Natural speech IVR with intent routing and tasks.", tags:["Voice"] },
      { title: "Email Triage & Autoresponse", slug: "email-triage",
        summary: "Prioritize & draft replies; human in the loop.", tags:["Email"] },
      { title: "Social DM & Comment Automation", slug: "social-automation",
        summary: "Handle DMs/comments, escalate when needed.", tags:["Social"] },
      { title: "Appointment Scheduling Bot", slug: "appointment-bot",
        summary: "Book, reschedule, remind—calendar integrated.", tags:["Scheduling"] },
      { title: "Order, Returns & Billing Assistant", slug: "order-billing-bot",
        summary: "Self‑service order status, returns & payments.", tags:["E‑commerce"] },
      { title: "Knowledgebase & FAQ Automation", slug: "knowledge-faq",
        summary: "Auto‑answer from curated knowledge.", tags:["Knowledge"] },
      { title: "Identity Verification Flows", slug: "idv-secure-bot",
        summary: "IDV + secure actions inside the bot.", tags:["Security"] },
      { title: "Multilingual Self‑Service", slug: "multilingual-self-service",
        summary: "Serve customers in 100+ languages.", tags:["Localization"] },
    ],
  },
  {
    title: "Agent & Employee Copilots",
    slug: "agent-employee-copilots",
    tagline: "Real‑time assistance, summaries and drafting to boost productivity.",
    icon: "UserRoundCog",
    solutions: [
      { title: "Agent Assist (Live)", slug: "agent-assist",
        summary: "Next‑best‑action & reply suggestions during calls/chats." },
      { title: "Auto‑Summary & Disposition", slug: "auto-summary",
        summary: "Instant summaries & CRM/ticket updates." },
      { title: "Knowledge Copilot", slug: "knowledge-copilot",
        summary: "Semantic search of KB, SOPs, and past cases." },
      { title: "Sales Coach & Script Assist", slug: "sales-coach",
        summary: "Live cues, objection handling, and talk‑track guidance." },
      { title: "Email/Chat Drafting Copilot", slug: "comm-drafting",
        summary: "Drafts responses in brand voice with citations." },
      { title: "Meeting Notetaker & Tasks", slug: "meeting-notetaker",
        summary: "Real‑time notes, action items, and follow‑ups." },
      { title: "Real‑time Translation", slug: "translation-realtime",
        summary: "Bi‑directional translation for chat/voice." },
      { title: "Audio Enhancement", slug: "audio-enhancement",
        summary: "Noise suppression and accent softening." },
      { title: "CRM Copilot", slug: "crm-copilot",
        summary: "Auto‑update fields, dedupe, and enrich." },
      { title: "HR Copilot", slug: "hr-copilot",
        summary: "Policy Q&A, onboarding help, pulse checks." },
      { title: "IT Helpdesk Copilot", slug: "it-helpdesk-copilot",
        summary: "L1 troubleshooting and ticket updates." },
      { title: "Finance Ops Copilot", slug: "finance-ops-copilot",
        summary: "AP/AR assistance and reconciliations." },
    ],
  },
  {
    title: "Analytics & Quality Intelligence",
    slug: "analytics-quality-intelligence",
    tagline: "Mine every interaction for QA, compliance, and business insight.",
    icon: "LineChart",
    solutions: [
      { title: "Conversation Intelligence", slug: "conversation-intelligence",
        summary: "Topics, intents, moments and sentiment at scale." },
      { title: "AI Quality Scoring", slug: "quality-scoring",
        summary: "Auto‑QA on 100% of calls/chats with scorecards." },
      { title: "Predictive CSAT & Churn", slug: "predictive-csat",
        summary: "Predict satisfaction and churn without surveys." },
      { title: "Topic/Trend & Root‑Cause", slug: "topic-trend",
        summary: "Discover drivers and anomalies automatically." },
      { title: "Voice of Customer Dashboards", slug: "voc-dashboard",
        summary: "Leadership‑ready insights & drill‑downs." },
      { title: "Compliance Monitoring", slug: "compliance-monitoring",
        summary: "PII/redaction and policy checks in real time." },
      { title: "Promise Management", slug: "promise-tracking",
        summary: "Track commitments and follow‑through." },
      { title: "Revenue Intelligence", slug: "revenue-intelligence",
        summary: "Sales signals & pipeline moments from calls." },
      { title: "Marketing Attribution", slug: "marketing-attribution",
        summary: "Map interactions back to campaigns." },
      { title: "Deflection Analytics", slug: "deflection-analytics",
        summary: "Measure containment & deflection to self‑service." },
    ],
  },
  {
    title: "Automation & Orchestration",
    slug: "automation-orchestration",
    tagline: "Zapier/Make, RPA and routing to eliminate manual work.",
    icon: "Workflow",
    solutions: [
      { title: "Workflow Automation Hub", slug: "zapier-make",
        summary: "No‑code workflows across your SaaS stack." },
      { title: "RPA for Back Office", slug: "rpa",
        summary: "Automate desktop & legacy system tasks." },
      { title: "Document AI & E‑signature", slug: "document-ai",
        summary: "OCR/extract data and route for sign‑off." },
      { title: "Smart Routing & Triage", slug: "routing-triage",
        summary: "Auto‑assign tickets/leads/cases at intake." },
      { title: "Data Pipelines & Sync", slug: "etl-sync",
        summary: "ETL to warehouses, CRMs, and data lakes." },
      { title: "Lead Capture & Enrichment", slug: "lead-enrichment",
        summary: "Forms, enrichment, scoring & notify reps." },
      { title: "AI SMS Campaigns", slug: "sms-ai",
        summary: "Outbound & conversational replies with guardrails." },
      { title: "AI Voice Outreach", slug: "ai-dialer",
        summary: "Compliant voice bots for reminders/offers." },
      { title: "Social Publishing & Listening", slug: "social-publishing",
        summary: "Plan, post, monitor, respond." },
      { title: "Billing & Invoice Automation", slug: "billing-invoices",
        summary: "Create, send, reconcile & chase dunning." },
      { title: "Scheduling & Dispatch", slug: "scheduling-dispatch",
        summary: "Optimize field service schedules." },
      { title: "Reporting & Dashboards", slug: "reporting-dashboards",
        summary: "Auto‑generate reports for stakeholders." },
    ],
  },
  {
    title: "LLM, Platforms & Integration",
    slug: "llm-platforms-integration",
    tagline: "Model strategy, RAG, search, security, and deep integrations.",
    icon: "Boxes",
    solutions: [
      { title: "LLM Strategy & Model Fit", slug: "llm-strategy",
        summary: "Choose models based on cost/quality/risk." },
      { title: "RAG Knowledge Systems", slug: "rag",
        summary: "Grounded answers from your private data." },
      { title: "Private/On‑Device Models", slug: "on-device-llm",
        summary: "Edge/offline LLMs for iPad & secure sites." },
      { title: "Vector DB & Enterprise Search", slug: "vector-db-enterprise-search",
        summary: "Semantic search across files, chats, and apps." },
      { title: "CCaaS/UCaaS/CRM Integrations", slug: "ccaas-ucaas-crm",
        summary: "Embed AI into your comms & CRM stack." },
      { title: "API Middleware & Webhooks", slug: "api-middleware",
        summary: "Glue systems together reliably." },
      { title: "Knowledge Base Engineering", slug: "kb-engineering",
        summary: "Chunking, metadata, and freshness policies." },
      { title: "PromptOps & Evals", slug: "promptops-evals",
        summary: "Prompt libraries, tests and guardrails." },
      { title: "MLOps & Hosting", slug: "mlops-hosting",
        summary: "Deploy, version and roll back safely." },
      { title: "AI Security & Governance", slug: "ai-security",
        summary: "Privacy, redaction, and policy control." },
      { title: "AI Observability", slug: "ai-observability",
        summary: "Traces, costs, drift & quality dashboards." },
    ],
  },
  {
    title: "Advisory, Training & Managed AI",
    slug: "advisory-training-managed-ai",
    tagline: "Blueprints, POCs, Fractional CAO, and enablement.",
    icon: "GraduationCap",
    solutions: [
      { title: "AI Opportunity Scan & Blueprint", slug: "opportunity-scan",
        summary: "Discovery → developer‑ready PRDs with ROI targets." },
      { title: "POC Sprint", slug: "poc-sprint",
        summary: "2–4 week PoC to prove value fast." },
      { title: "Fractional CAO", slug: "fractional-cao",
        summary: "Lead automation as a service." },
      { title: "Executive Workshops & Training", slug: "executive-workshops",
        summary: "C‑suite to team training with hands‑on labs." },
      { title: "Change‑Management Playbooks", slug: "change-management-playbooks",
        summary: "Adoption plans & enablement assets." },
      { title: "AI Policy, Ethics & Compliance", slug: "ai-policy",
        summary: "Policies aligned to legal & risk." },
      { title: "Data Readiness Assessment", slug: "data-readiness",
        summary: "Data inventory, quality, governance gaps." },
      { title: "AI Center of Excellence", slug: "aicoe",
        summary: "Stand up internal AI capabilities." },
      { title: "Managed AI Services", slug: "managed-ai",
        summary: "SLAs, monitoring, updates & support." },
      { title: "Industry Playbooks", slug: "industry-playbooks",
        summary: "Verticalized templates & agents." },
      { title: "Business DNA Map™", slug: "business-dna-map",
        summary: "Map processes, data and decision DNA." },
      { title: "OrgArchitect", slug: "orgarchitect",
        summary: "Auto org chart + role prompts & docs." },
      { title: "AI Transformation Navigator", slug: "ai-transformation-navigator",
        summary: "Interactive discovery & opportunity mapping." },
      { title: "PromptMart™", slug: "promptmart",
        summary: "Curated prompts/agents for rapid wins." },
    ],
  },
];
```

**`/content/featuredProducts.ts`** (optional right rail)

```ts
export const FEATURED_PRODUCTS = [
  { title: "Business DNA Map™", slug: "business-dna-map", blurb: "Process & context mapping for AI readiness." },
  { title: "OrgArchitect", slug: "orgarchitect", blurb: "Auto‑generated org charts + role prompts." },
  { title: "PromptMart™", slug: "promptmart", blurb: "Deploy vetted prompts and agents quickly." },
];
```

---

## 5) Components (contracts & behavior)

* **`SolutionsMegaMenu.tsx`**

  * Props: `{ categories: Category[] }`
  * Hover/focus “Solutions” → 2×3 grid of category links; right panel shows first 3 solutions for hovered category + “View all”.
  * Keyboard: Tab/Shift+Tab, Arrow keys; Esc closes.
* **`SolutionsTileGrid.tsx`**

  * Props: `{ categories: Category[], variant: "home" | "landing" }`
  * Renders 6 tiles. Home variant = compact; landing = larger with summary lines.
* **`CategoryHero.tsx`**

  * Props: `{ title: string, tagline: string, ctaHref: string }`
* **`SolutionCard.tsx`**

  * Props: `{ solution: Solution, href: string }`
  * Card => title, summary, tags (optional), CTA chevron.
* **`FeaturedProducts.tsx`** (optional)

  * Props: `{ items: {title:string; slug:string; blurb:string}[] }`

---

## 6) Pages

**Home (`/(marketing)/page.tsx`)**

* Insert `<SolutionsTileGrid variant="home" categories={CATEGORIES} />` under a section header: “**Our Areas of Expertise**”.

**Solutions landing (`/solutions/page.tsx`)**

* Hero: “**AI‑Powered Solutions to Transform Your Business**”
  Sub: “We design and implement AI that removes bottlenecks and proves ROI—fast.”
* `<SolutionsTileGrid variant="landing" categories={CATEGORIES} />`
* CTA banner: “**Book an AI Opportunity Scan**”.

**Category page (`/solutions/[category]/page.tsx`)**

* Find category by slug; 404 if not found.
* Render `<CategoryHero />`, filter pills, then map `category.solutions` to `<SolutionCard />`.
* Optional right rail `<FeaturedProducts />`.
* CTA footer with Proof‑First model: “Audit → Pilot → Retainer”.

> **Note:** We are **not** building `/solutions/[category]/[solution]` pages yet. All cards link to a contact/CTA or anchor on the category page for v1. (Future‑proof: we can add detail pages later with the same dataset.)

---

## 7) Navigation & Styles

* Update header to include **Solutions** with mega‑menu.
* Styles: dark mode; hover states use `--t4i-green`.
* Cards: border radius 12px, subtle shadow, hover lift + outline in `--t4i-green`.
* Mobile: mega‑menu collapses into an accordion list.

---

## 8) Analytics, SEO, Compliance

* Fire events on:

  * `solutions_menu_open`, `solutions_category_click`, `solutions_solution_click`, `cta_opportunity_scan_click`.
* **Breadcrumb JSON‑LD** on `/solutions` and category pages.
* Titles/Descriptions:

  * `/solutions` → Title: “Solutions | Tier 4 Intelligence”
  * `/solutions/[category]` → Title: “{Category} Solutions | Tier 4 Intelligence”
* Compliance notes:

  * For `ai-dialer` and `sms-ai`, include “Compliance‑first (TCPA/CAN‑SPAM)” in copy.

---

## 9) Acceptance Criteria (QA list)

* Header **Solutions** opens/closes with mouse and keyboard; Esc closes.
* Home page section shows **exactly 6 tiles**, responsive from 1×6 (mobile) to 3×2 (desktop).
* `/solutions` lists the same 6 categories with consistent titles, taglines, and links.
* Each category page renders **all solutions** from the dataset, with working anchors/links.
* Lighthouse ≥ 95 (Performance/Best Practices/SEO), a11y ≥ 90.
* All CTAs route to **/contact** or **/book** (placeholder ok).
* No dead links; 404 for invalid category slugs.

---

## 10) Copy blocks (ready to paste)

* **Global CTA blurb:** “No more AI guesswork. Start with a low‑risk Opportunity Scan that delivers developer‑ready PRDs and a ROI‑focused pilot plan.”
* **Category hero taglines** are in the dataset (`tagline` field).
* **Footer CTA (all solution pages):** “Audit → Pilot → Retainer. Prove value in weeks—not quarters.”

---

## 11) Implementation Steps for Claude Code (checklist)

1. **Create data files**: `/content/solutions.ts` and `/content/featuredProducts.ts` with the content above.
2. **Add design tokens** in `/styles/tokens.css` (`--t4i-green`, `--t4i-black`, `--t4i-white`).
3. **Build components** in `/components` as specified.
4. **Wire the mega‑menu** in the header; import `CATEGORIES`.
5. **Insert Expertise section** on **Home** using `SolutionsTileGrid`.
6. **Create `/solutions`** page with hero + `SolutionsTileGrid`.
7. **Create `/solutions/[category]`** dynamic route; render `CategoryHero` + `SolutionCard` list + optional `FeaturedProducts`.
8. **Hook up CTAs** to `/contact` (or `/book`).
9. **Add analytics events** on menu open, tile clicks, and CTAs.
10. **Run Lighthouse & a11y checks**; fix contrast/focus as needed.
11. **Write unit tests** for slug lookup, 404, and rendering counts (optional).
12. **Open PR**: “feat(solutions): IA, mega‑menu, landing & category pages (v1)”.

---

## Key takeaways

* We now have a **clear, scalable** taxonomy (6 categories, \~60 solutions) that mirrors Tier 4 Advisors’ UX while speaking to **AI outcomes**.
* Content is **centralized** in a single dataset, so the site is easy to maintain and extend (future detail pages will be trivial).
* The build ships with **accessibility**, **SEO**, and **analytics** baked in.

---

## Next steps (for you)

1. Give Claude Code this brief to implement as-is.
2. After it’s live, we’ll decide which **solution detail pages** deserve their own `/solutions/[category]/[solution]` pages (start with top 6).
3. Add logos/testimonials per category once we have case study proofs.

*Want me to generate the first 6 solution detail pages’ outlines (sections, FAQs, and CTA copy) next?*

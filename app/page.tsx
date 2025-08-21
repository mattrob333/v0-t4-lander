import { Suspense } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TrustBar } from "@/components/trust-bar"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { ProcessTimeline } from "@/components/process-timeline"
import { AnalysisEngine } from "@/components/analysis-engine"
import { Differentiators } from "@/components/differentiators"
import { FractionalCao } from "@/components/fractional-cao"
import { CaseStudies } from "@/components/case-studies"
import { FaqSection } from "@/components/faq-section"
import { FinalCta } from "@/components/final-cta"
import { ChatWidget } from "@/components/chat-widget"

export const metadata = {
  title: "Tier 4 Intelligence — Rapid AI Clarity and Strategic AI Leadership",
  description:
    "Identify highest-impact AI automations, get a working PoC and verified quotes in a week, and scale with a strategic automation partner.",
  openGraph: {
    title: "Tier 4 Intelligence — Rapid AI Clarity and Strategic AI Leadership",
    description:
      "PoC in days, exec-ready validation, and a clear roadmap to scale. See your AI opportunity this week.",
    url: "https://tier4.example.com",
    type: "website",
    images: [
      { url: "https://tier4.example.com/og.jpg", width: 1200, height: 630, alt: "Tier 4 Intelligence" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tier 4 Intelligence — Rapid AI Clarity",
    description: "See your AI opportunity this week.",
    images: ["https://tier4.example.com/og.jpg"],
  },
}

function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tier 4 Intelligence",
    url: "https://tier4.example.com",
    logo: "https://tier4.example.com/logo.png",
    sameAs: [],
    department: {
      "@type": "Organization",
      name: "AI Strategy and Automation",
    },
    makesOffer: {
      "@type": "Service",
      name: "Rapid AI Assessment and Proof-of-Concept",
      areaServed: "Global",
      audience: { "@type": "Audience", audienceType: "Enterprise" },
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function Page() {
  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      <StructuredData />
      <Header />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-[#00A878]/10 blur-3xl" />
        <div className="absolute right-[-200px] top-32 h-[420px] w-[420px] rounded-full bg-black/5 blur-3xl dark:bg-white/5" />
        <div className="absolute bottom-[-160px] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/20" />
      </div>

      <Suspense>
        <Hero />
      </Suspense>

      <TrustBar />

      <Suspense>
        <ProblemSection />
      </Suspense>

      <Suspense>
        <SolutionSection />
      </Suspense>

      <section id="process" aria-label="How It Works">
        <Suspense>
          <ProcessTimeline />
        </Suspense>
      </section>

      <Suspense>
        <AnalysisEngine />
      </Suspense>

      <Suspense>
        <Differentiators />
      </Suspense>

      <Suspense>
        <FractionalCao />
      </Suspense>

      <Suspense>
        <CaseStudies />
      </Suspense>

      <Suspense>
        <FaqSection />
      </Suspense>

      <FinalCta />

      <ChatWidget />
    </main>
  )
}

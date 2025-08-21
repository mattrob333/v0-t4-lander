import { Suspense } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TrustBar } from "@/components/trust-bar"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { ProcessTimeline } from "@/components/process-timeline"
import { AnalysisEngine } from "@/components/analysis-engine"
import { Differentiators } from "@/components/differentiators"
import { StructuredData } from "@/components/schema/structured-data"
import { OrganizationSchema } from "@/components/schema/organization-schema"
import { WebSiteSchema } from "@/components/schema/website-schema"
import { ServiceSchema } from "@/components/schema/service-schema"
import { FAQSchema } from "@/components/schema/faq-schema"

export const metadata = {
  title: "5-Day AI POC | 3-4x ROI Validation | Tier 4 Intelligence",
  description: "Get AI clarity in days, not months. Vendor-neutral AI consulting delivering rapid POCs with proven ROI. No buzzwords, just results for San Francisco enterprises.",
  keywords: "AI consulting, 5-day POC, rapid AI implementation, vendor-neutral AI, AI proof of concept, AI ROI validation, executive AI strategy, San Francisco AI consulting",
  openGraph: {
    title: "5-Day AI POC with 3-4x ROI | Tier 4 Intelligence",
    description: "Rapid AI implementation without the buzzwords. Get working proof of concept in 5 days with validated ROI for your enterprise.",
    url: "https://tier4intelligence.com",
    siteName: "Tier 4 Intelligence",
    type: "website",
    images: [
      { 
        url: "https://tier4intelligence.com/images/optimized/tier4-hero-1024w.jpg", 
        width: 1200, 
        height: 630, 
        alt: "Tier 4 Intelligence - 5-Day AI POC with Validated ROI" 
      },
    ],
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "5-Day AI POC with 3-4x ROI | Tier 4 Intelligence",
    description: "Rapid AI implementation without the buzzwords. Get working proof of concept in 5 days.",
    images: ["https://tier4intelligence.com/images/optimized/tier4-hero-1024w.jpg"],
    creator: "@tier4intel",
    site: "@tier4intel"
  },
  alternates: {
    canonical: 'https://tier4intelligence.com'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export default function Page() {
  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      {/* Comprehensive Schema.org Structured Data */}
      <StructuredData pageType="homepage" />
      <OrganizationSchema />
      <WebSiteSchema />
      <ServiceSchema />
      <FAQSchema />
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

    </main>
  )
}
import { Suspense } from "react"
import { Hero } from "@/components/hero"
import { TrustBar } from "@/components/trust-bar"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { Button } from "@/components/ui/button"
import { ProcessTimeline } from "@/components/process-timeline"
import { AnalysisEngine } from "@/components/analysis-engine"
import { Differentiators } from "@/components/differentiators"
import { FractionalCao } from "@/components/fractional-cao"
import { FaqSection } from "@/components/faq-section"
import { FinalCta } from "@/components/final-cta"
import { ChatWidget } from "@/components/chat-widget"
import { StructuredData } from "@/components/schema/structured-data"
import { OrganizationSchema } from "@/components/schema/organization-schema"
import { WebSiteSchema } from "@/components/schema/website-schema"
import { ServiceSchema } from "@/components/schema/service-schema"
import { FAQSchema } from "@/components/schema/faq-schema"
import { CATEGORIES, SOLUTIONS_CONFIG } from "@/content/solutions"
import { DebugHydration } from "@/components/debug-hydration"
import Link from "next/link"
import { ArrowRight, Bot, UserRoundCog, LineChart, Workflow, Boxes, GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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

function ExpertiseSection() {
  // Use categories directly

  return (
    <section className="py-20 bg-gray-50 dark:bg-neutral-900" id="expertise">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            {SOLUTIONS_CONFIG.homePage.sectionTitle}
          </h2>
          {SOLUTIONS_CONFIG.homePage.sectionSubtitle && (
            <p className="mt-4 max-w-3xl mx-auto text-lg text-black/70 dark:text-white/70">
              {SOLUTIONS_CONFIG.homePage.sectionSubtitle}
            </p>
          )}
        </div>

        <DebugHydration name="SolutionsGrid">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {CATEGORIES.filter(cat => cat.displayConfig.showInNav)
                       .sort((a, b) => a.displayConfig.sortOrder - b.displayConfig.sortOrder)
                       .map((category) => {
              const iconMap = { Bot, UserRoundCog, LineChart, Workflow, Boxes, GraduationCap };
              const Icon = iconMap[category.icon as keyof typeof iconMap] || Bot;
              return (
                <Card key={category.slug} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <Link href={`/solutions/${category.slug}`}>
                    <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                      <div className="relative p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/50 group-hover:bg-[#00A878]/10 transition-all duration-300">
                        <Icon className="h-6 w-6 text-gray-600 dark:text-neutral-400 group-hover:text-[#00A878] transition-colors duration-300" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 group-hover:text-[#00A878] transition-colors duration-300">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed">
                          {category.tagline}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 group-hover:text-[#00A878] transition-colors duration-300">
                        {category.solutions.length} solution{category.solutions.length !== 1 ? 's' : ''}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </DebugHydration>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
          >
            <Link href="/solutions">
              {SOLUTIONS_CONFIG.ctas.secondary?.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
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

      <Suspense>
        <ExpertiseSection />
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

      <section id="faq" aria-label="Frequently Asked Questions">
        <Suspense>
          <FaqSection />
        </Suspense>
      </section>

      <Suspense>
        <FinalCta />
      </Suspense>

      <DebugHydration name="ChatWidget">
        <ChatWidget />
      </DebugHydration>

    </main>
  )
}
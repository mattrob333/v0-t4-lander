import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { CATEGORIES, SOLUTIONS_CONFIG } from "@/content/solutions"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, CheckCircle, Bot, UserRoundCog, LineChart, Workflow, Boxes, GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Icon mapping
const iconMap = {
  Bot,
  UserRoundCog,
  LineChart,
  Workflow,
  Boxes,
  GraduationCap,
};

// Generate optimized SEO metadata
const seoMetadata = {
  title: "AI Solutions & Services | Tier 4 Intelligence",
  description: "Transform your business with AI-powered solutions designed to remove bottlenecks and prove ROI fast. Expert AI consulting for rapid implementation.",
  keywords: ["AI solutions", "AI consulting", "business automation", "AI implementation"],
  canonical: "https://tier4intelligence.com/solutions"
};

export const metadata: Metadata = {
  title: seoMetadata.title,
  description: seoMetadata.description,
  keywords: seoMetadata.keywords,
  openGraph: {
    title: seoMetadata.ogTitle || seoMetadata.title,
    description: seoMetadata.ogDescription || seoMetadata.description,
    url: seoMetadata.canonical,
    siteName: "Tier 4 Intelligence",
    type: "website",
    images: [
      {
        url: seoMetadata.ogImage || "https://tier4intelligence.com/images/optimized/tier4-hero-1024w.jpg",
        width: 1200,
        height: 630,
        alt: "Tier 4 Intelligence AI Solutions Overview"
      }
    ]
  },
  alternates: {
    canonical: seoMetadata.canonical
  },
  other: {
    'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'author': 'Tier 4 Intelligence',
    'publisher': 'Tier 4 Intelligence'
  }
}

function SolutionsHero() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-[#00A878]/10 blur-3xl" />
        <div className="absolute right-[-200px] top-32 h-[420px] w-[420px] rounded-full bg-black/5 blur-3xl dark:bg-white/5" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
            {SOLUTIONS_CONFIG.landingPage.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-black/70 dark:text-white/70">
            {SOLUTIONS_CONFIG.landingPage.hero.subtitle}
          </p>
          
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
            >
              <Link href={SOLUTIONS_CONFIG.ctas.primary.href}>
                {SOLUTIONS_CONFIG.ctas.primary.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-black/20 px-8 py-3 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
            >
              <Link href="#solutions-overview">
                Browse Solutions
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function SolutionsOverview() {
  return (
    <section id="solutions-overview" className="py-20 bg-gray-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            Our Areas of Expertise
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-black/70 dark:text-white/70">
            Six comprehensive solution categories designed to transform your business operations and accelerate growth.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] || Bot;
            return (
              <Card
                key={category.slug}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-gray-200 hover:border-[#00A878] hover:shadow-[#00A878]/20 bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-[#00A878]"
              >
                <Link href={`/solutions/${category.slug}`}>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/50 group-hover:bg-[#00A878]/10 transition-all duration-300">
                      <Icon className="h-8 w-8 text-gray-600 dark:text-neutral-400 group-hover:text-[#00A878] transition-colors duration-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 group-hover:text-[#00A878] transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-base text-gray-600 dark:text-neutral-300 leading-relaxed">
                        {category.tagline}
                      </p>
                    </div>
                    {category.solutions && category.solutions.length > 0 && (
                      <div className="mt-auto pt-2 text-xs text-gray-500 dark:text-neutral-400 group-hover:text-[#00A878] transition-colors duration-300">
                        {category.solutions.length} solution{category.solutions.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  )
}

function WhyChooseUs() {
  const benefits = [
    "Rapid 5-day POC development with proven ROI",
    "Vendor-neutral recommendations",
    "24/7 support and maintenance",
    "Seamless integration with existing systems",
    "Comprehensive training and documentation",
    "Ongoing optimization and performance monitoring"
  ]

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            Why Choose Tier 4 Intelligence?
          </h2>
          <p className="mt-4 text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
            We deliver AI solutions that work. No buzzwords, no vendor lock-in, just results that transform your business operations.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white dark:bg-neutral-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#00A878] flex-shrink-0 mt-0.5" />
                <span className="text-black/80 dark:text-white/80 text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
            >
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SolutionsPage() {
  // Simplified structured data
  const enhancedStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Solutions by Tier 4 Intelligence",
    "description": "Comprehensive AI solutions for business automation and digital transformation"
  };

  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      <SolutionsHero />
      <SolutionsOverview />
      <WhyChooseUs />
    </main>
  )
}
import { Suspense } from "react"
import { Metadata } from "next"
import { Header } from "@/components/header"
import { InteractiveSolutionsTileGrid } from "@/components/solutions/InteractiveSolutionsTileGrid"
import { InteractiveFeaturedProducts } from "@/components/solutions/InteractiveFeaturedProducts"
import { Button } from "@/components/ui/button"
import { SimpleImage } from "@/components/ui/simple-image"
import { CATEGORIES, FEATURED_PRODUCTS, SOLUTIONS_CONFIG } from "@/content/solutions"
import { StructuredData } from "@/components/schema/structured-data"
import { generateComprehensiveMeta } from "@/lib/seo/programmatic-seo"
import { generateAdvancedMetaTags } from "@/lib/seo/meta-generation"
import { generateContextualLinks } from "@/lib/seo/internal-linking-strategy"
import { generateSolutionsItemListSchema } from "@/lib/seo/structured-data"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

// Convert solutions data to component-expected format
const solutionCategories = CATEGORIES.map(cat => ({
  id: cat.slug,
  name: cat.title,
  slug: cat.slug,
  tagline: cat.tagline,
  description: cat.description || cat.tagline,
  iconName: cat.icon,
  featured: cat.displayConfig.showInNav,
  sortOrder: cat.displayConfig.sortOrder,
  solutions: cat.solutions?.map(sol => ({
    id: sol.slug,
    title: sol.title,
    summary: sol.summary,
    description: sol.description,
    category: {
      id: cat.slug,
      name: cat.title,
      slug: cat.slug,
      tagline: cat.tagline,
      iconName: cat.icon,
      featured: cat.displayConfig.showInNav,
      sortOrder: cat.displayConfig.sortOrder,
      createdAt: '',
      updatedAt: ''
    },
    tags: sol.tags,
    featured: sol.flags.featured,
    iconName: sol.icon,
    createdAt: '',
    updatedAt: ''
  })) || [],
  createdAt: '',
  updatedAt: ''
}))

const featuredProducts = FEATURED_PRODUCTS.map(product => ({
  id: product.slug,
  title: product.title,
  description: product.blurb,
  ctaText: "Learn More",
  ctaUrl: product.href,
  featured: true,
  sortOrder: 1,
  createdAt: '',
  updatedAt: ''
}))

// Generate optimized SEO metadata
const seoMetadata = generateComprehensiveMeta('landing', {});

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

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <InteractiveSolutionsTileGrid
              categories={solutionCategories}
              variant="landing"
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
                Featured Solutions
              </h3>
              <InteractiveFeaturedProducts featuredProducts={featuredProducts} />
            </div>
          </div>
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
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Why Choose Tier 4 Intelligence?
            </h2>
            <p className="mt-4 text-lg text-black/70 dark:text-white/70">
              We deliver AI solutions that work. No buzzwords, no vendor lock-in, just results that transform your business operations.
            </p>
            
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#00A878] flex-shrink-0 mt-0.5" />
                  <span className="text-black/80 dark:text-white/80">{benefit}</span>
                </li>
              ))}
            </ul>

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

          <div className="relative">
            <SimpleImage
              src="tier4-hero-dna-circuit"
              alt="AI Solutions Architecture"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[#00A878]/20 to-transparent blur-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SolutionsPage() {
  // Generate contextual links for this page
  const contextualLinks = generateContextualLinks(
    'https://tier4intelligence.com/solutions',
    'landing'
  );

  // Generate enhanced structured data
  const enhancedStructuredData = generateSolutionsItemListSchema();

  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      {/* Enhanced Structured Data */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(enhancedStructuredData, null, 0)
        }}
      />
      
      <Header />
      
      <Suspense>
        <SolutionsHero />
      </Suspense>

      <Suspense>
        <SolutionsOverview />
      </Suspense>

      <Suspense>
        <WhyChooseUs />
      </Suspense>
    </main>
  )
}
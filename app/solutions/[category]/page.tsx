import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { CategoryHero } from "@/components/solutions/CategoryHero"
import { InteractiveSolutionsGrid } from "@/components/solutions/InteractiveSolutionsGrid"
import { InteractiveFeaturedProducts } from "@/components/solutions/InteractiveFeaturedProducts"
import { Button } from "@/components/ui/button"
import { CATEGORIES, FEATURED_PRODUCTS, findCategoryBySlug, generateBreadcrumbs } from "@/content/solutions"
import { StructuredData } from "@/components/schema/structured-data"
import { generateComprehensiveMeta } from "@/lib/seo/programmatic-seo"
import { generateContextualLinks } from "@/lib/seo/internal-linking-strategy"
import { generateCategoryCollectionSchema, generateSolutionFAQSchema } from "@/lib/seo/structured-data"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

// Generate static params for all categories
export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    category: category.slug,
  }))
}

// Generate metadata for each category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = findCategoryBySlug(CATEGORIES, resolvedParams.category)
  
  if (!category) {
    return {
      title: "Category Not Found | Tier 4 Intelligence",
      description: "The requested solutions category could not be found."
    }
  }

  // Generate optimized SEO metadata
  const seoMetadata = generateComprehensiveMeta('category', { category });

  return {
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
          alt: `${category.title} Solutions | Tier 4 Intelligence`
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
}

function Breadcrumbs({ categorySlug }: { categorySlug: string }) {
  const breadcrumbs = generateBreadcrumbs(categorySlug)
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-black/60 dark:text-white/60 mb-8" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-black dark:text-white" aria-current="page">
              {item.name}
            </span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-[#00A878] transition-colors"
              aria-label={`Navigate to ${item.name}`}
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}


function CategoryContent({ category }: { category: any }) {
  // Convert category to component-expected format
  const categoryData = {
    id: category.slug,
    name: category.title,
    slug: category.slug,
    tagline: category.tagline,
    description: category.description || category.tagline,
    iconName: category.icon,
    featured: category.displayConfig.showInNav,
    sortOrder: category.displayConfig.sortOrder,
    solutions: category.solutions,
    createdAt: '',
    updatedAt: ''
  }

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs categorySlug={category.slug} />
      
      <CategoryHero
        category={categoryData}
        showBreadcrumb={false}
        ctaText="Book Discovery Call"
        ctaUrl="/contact"
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              Available Solutions
            </h2>
            <p className="text-black/70 dark:text-white/70">
              {category.solutions.length} solution{category.solutions.length !== 1 ? 's' : ''} available in this category
            </p>
          </div>
          
          <InteractiveSolutionsGrid category={category} />
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
            >
              <Link href="/contact">
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-black/20 px-8 py-3 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
            >
              <Link href="/solutions">
                <ArrowLeft className="mr-2 h-5 w-5" />
                All Solutions
              </Link>
            </Button>
          </div>
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
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = findCategoryBySlug(CATEGORIES, resolvedParams.category)

  if (!category) {
    notFound()
  }

  // Generate contextual links for this category page
  const contextualLinks = generateContextualLinks(
    `https://tier4intelligence.com/solutions/${category.slug}`,
    'category',
    category
  );

  // Generate enhanced structured data
  const enhancedStructuredData = generateCategoryCollectionSchema(category);
  
  // Generate FAQ schema for featured solutions
  const featuredSolution = category.solutions.find(s => s.flags.featured);
  const faqSchema = featuredSolution 
    ? generateSolutionFAQSchema(featuredSolution, category)
    : null;

  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      {/* Enhanced Structured Data */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(enhancedStructuredData, null, 0)
        }}
      />
      
      {/* FAQ Schema for Featured Solution */}
      {faqSchema && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema, null, 0)
          }}
        />
      )}
      
      <Header />
      
      <Suspense>
        <CategoryContent category={category} />
      </Suspense>
    </main>
  )
}
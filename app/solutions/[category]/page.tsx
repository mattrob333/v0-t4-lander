import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { CATEGORIES, FEATURED_PRODUCTS, findCategoryBySlug, generateBreadcrumbs } from "@/content/solutions"
import { StructuredData } from "@/components/schema/structured-data"
import { generateCategoryCollectionSchema, generateSolutionFAQSchema } from "@/lib/seo/structured-data"
import { CategoryPageClient } from "@/components/solutions/CategoryPageClient"

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

  // Generate simple SEO metadata
  const seoMetadata = {
    title: `${category.title} AI Solutions | Tier 4 Intelligence - San Francisco`,
    description: category.description || category.tagline,
    keywords: category.seo?.keywords || [],
    canonical: `https://tier4intelligence.com/solutions/${category.slug}`
  };

  return {
    title: seoMetadata.title,
    description: seoMetadata.description,
    keywords: seoMetadata.keywords,
    openGraph: {
      title: seoMetadata.ogTitle || seoMetadata.title,
      description: seoMetadata.ogDescription || seoMetadata.description,
      url: seoMetadata.canonical,
      siteName: 'Tier 4 Intelligence',
      images: [
        {
          url: `/images/solutions/${resolvedParams.category}-hero.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.title} Solutions | Tier 4 Intelligence`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: seoMetadata.ogTitle || seoMetadata.title,
      description: seoMetadata.ogDescription || seoMetadata.description,
      images: [`/images/solutions/${resolvedParams.category}-hero.jpg`]
    },
    alternates: {
      canonical: seoMetadata.canonical
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = findCategoryBySlug(CATEGORIES, resolvedParams.category)

  if (!category) {
    notFound()
  }


  // Prepare featured products
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
    <>
      <CategoryPageClient 
        category={category} 
        featuredProducts={featuredProducts}
      />

      {/* Schema.org structured data */}
      <StructuredData 
        schema={generateCategoryCollectionSchema(category)}
        id={`category-${category.slug}-collection`}
      />
      
      {/* FAQ Schema if category has solutions */}
      {category.solutions.length > 0 && (
        <StructuredData 
          schema={generateSolutionFAQSchema(category.solutions[0], category)}
          id={`category-${category.slug}-faq`}
        />
      )}

    </>
  )
}
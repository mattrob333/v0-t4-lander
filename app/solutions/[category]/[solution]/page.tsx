import { Metadata } from "next"
import { notFound } from "next/navigation"
import { CATEGORIES } from "@/content/solutions"
import { SolutionDetailClient } from "@/components/solutions/SolutionDetailClient"

interface SolutionPageProps {
  params: Promise<{ category: string; solution: string }>
}

// Generate static params for all solutions
export async function generateStaticParams() {
  const params: Array<{ category: string; solution: string }> = []
  
  CATEGORIES.forEach(category => {
    category.solutions.forEach(solution => {
      params.push({
        category: category.slug,
        solution: solution.slug
      })
    })
  })
  
  return params
}

// Generate metadata for each solution
export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { category: categorySlug, solution: solutionSlug } = await params
  
  const category = CATEGORIES.find(cat => cat.slug === categorySlug)
  const solution = category?.solutions.find(sol => sol.slug === solutionSlug)
  
  if (!solution) {
    return {
      title: 'Solution Not Found',
      description: 'The requested solution could not be found.'
    }
  }
  
  return {
    title: solution.seo.title,
    description: solution.seo.description,
    keywords: solution.seo.keywords,
    openGraph: {
      title: solution.seo.ogTitle || solution.seo.title,
      description: solution.seo.ogDescription || solution.seo.description,
      type: 'website',
    },
  }
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { category: categorySlug, solution: solutionSlug } = await params
  
  const category = CATEGORIES.find(cat => cat.slug === categorySlug)
  const solution = category?.solutions.find(sol => sol.slug === solutionSlug)
  
  if (!solution || !category) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-background">
      <SolutionDetailClient 
        solution={solution} 
        categorySlug={categorySlug}
      />
    </div>
  )
}

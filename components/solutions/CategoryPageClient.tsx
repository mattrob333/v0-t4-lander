'use client'

import { useState } from "react"
import { CategoryHero } from "@/components/solutions/CategoryHero"
import { InteractiveSolutionsGrid } from "@/components/solutions/InteractiveSolutionsGrid"
import { InteractiveFeaturedProducts } from "@/components/solutions/InteractiveFeaturedProducts"
import { Button } from "@/components/ui/button"
import { ScheduleDialog } from "@/components/schedule-dialog"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface CategoryPageClientProps {
  category: any
  featuredProducts: any[]
}

function Breadcrumbs({ categorySlug }: { categorySlug: string }) {
  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-black/60 dark:text-white/60">
        <li>
          <Link href="/" className="hover:text-[#00A878] transition-colors">
            Home
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href="/solutions" className="hover:text-[#00A878] transition-colors">
            Solutions
          </Link>
        </li>
        <li>/</li>
        <li className="text-black dark:text-white font-medium">
          {categorySlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </li>
      </ol>
    </nav>
  )
}

export function CategoryPageClient({ category, featuredProducts }: CategoryPageClientProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs categorySlug={category.slug} />
      
      <CategoryHero
        category={categoryData}
        showBreadcrumb={false}
        ctaText="Book Discovery Call"
        onCtaClick={() => setShowScheduleDialog(true)}
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
              size="lg"
              className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
              onClick={() => setShowScheduleDialog(true)}
            >
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
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
      
      <ScheduleDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog} />
    </div>
  )
}
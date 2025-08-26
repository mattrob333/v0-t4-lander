/**
 * SEO-Optimized Expertise Section for Homepage
 * 
 * Enhanced version of the expertise section with:
 * - Semantic HTML structure for better SEO
 * - Structured data for Services
 * - Internal linking optimization
 * - Keyword-rich content
 * - Performance optimization
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SimpleImage } from '@/components/ui/simple-image'
import { ArrowRight, Star, CheckCircle, TrendingUp } from 'lucide-react'
import { CATEGORIES, SOLUTIONS_CONFIG } from '@/content/solutions'
import { generateContextualLinks } from '@/lib/seo/internal-linking-strategy'
import type { Category } from '@/types/solutions'

interface ExpertiseCardProps {
  category: Category;
  index: number;
  onCategoryClick?: (category: Category) => void;
}

/**
 * Individual expertise category card with SEO optimization
 */
function ExpertiseCard({ category, index, onCategoryClick }: ExpertiseCardProps) {
  const featuredSolutions = category.solutions.filter(s => s.flags.featured).slice(0, 3);
  const isPopular = category.solutions.some(s => s.flags.popular);
  const isNew = category.solutions.some(s => s.flags.new);

  return (
    <article 
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* SEO-optimized header */}
      <header className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {/* Category icon with semantic meaning */}
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${category.color || '#00A878'}15` }}
              aria-hidden="true"
            >
              <div className="h-6 w-6" style={{ color: category.color || '#00A878' }}>
                {/* Icon would be rendered here based on category.icon */}
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" />
                </svg>
              </div>
            </div>
            
            {/* Status badges */}
            <div className="flex gap-1">
              {isPopular && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium">
                  <Star className="h-3 w-3" />
                  Popular
                </span>
              )}
              {isNew && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium">
                  <TrendingUp className="h-3 w-3" />
                  New
                </span>
              )}
            </div>
          </div>

          {/* SEO-optimized title */}
          <h3 
            className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-[#00A878] transition-colors"
            itemProp="name"
          >
            <Link 
              href={`/solutions/${category.slug}`}
              className="hover:underline"
              title={`Explore ${category.title} AI solutions`}
            >
              {category.title}
            </Link>
          </h3>

          {/* SEO-optimized description */}
          <p 
            className="text-black/70 dark:text-white/70 text-sm leading-relaxed mb-4"
            itemProp="description"
          >
            {category.tagline}
          </p>
        </div>
      </header>

      {/* Featured solutions list with internal links */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-black/80 dark:text-white/80 mb-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-[#00A878]" />
          Key Solutions:
        </h4>
        <ul className="space-y-2">
          {featuredSolutions.map((solution, solIndex) => (
            <li key={solution.slug}>
              <Link
                href={`/solutions/${category.slug}/${solution.slug}`}
                className="text-sm text-black/60 dark:text-white/60 hover:text-[#00A878] transition-colors flex items-center gap-2 group/solution"
                title={solution.summary}
              >
                <span className="w-1 h-1 bg-[#00A878] rounded-full group-hover/solution:w-2 transition-all" />
                {solution.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ROI metrics */}
      <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-[#00A878]">
              {Math.min(...category.solutions.map(s => s.metrics.implementationWeeks))}w
            </div>
            <div className="text-xs text-black/60 dark:text-white/60">
              Min Implementation
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#00A878]">
              {Math.min(...category.solutions.map(s => s.metrics.roiTimelineMonths))}m
            </div>
            <div className="text-xs text-black/60 dark:text-white/60">
              Fastest ROI
            </div>
          </div>
        </div>
      </div>

      {/* CTA with structured data */}
      <footer>
        <Button
          asChild
          variant="outline"
          className="w-full group-hover:bg-[#00A878] group-hover:text-white group-hover:border-[#00A878] transition-all"
          onClick={() => onCategoryClick?.(category)}
        >
          <Link 
            href={`/solutions/${category.slug}`}
            className="flex items-center justify-center gap-2"
            itemProp="url"
          >
            Explore Solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </footer>

      {/* Hidden structured data */}
      <meta itemProp="serviceType" content={category.title} />
      <meta itemProp="provider" content="Tier 4 Intelligence" />
      <meta itemProp="areaServed" content="United States" />
    </article>
  );
}

/**
 * Enhanced expertise section with comprehensive SEO optimization
 */
export function ExpertiseSectionEnhanced() {
  const [contextualLinks, setContextualLinks] = useState<any[]>([]);

  // Generate contextual links for internal linking
  useEffect(() => {
    const links = generateContextualLinks(
      'https://tier4intelligence.com/#expertise',
      'landing'
    );
    setContextualLinks(links.slice(0, 3)); // Limit to avoid over-optimization
  }, []);

  // Get featured categories for display
  const featuredCategories = CATEGORIES
    .filter(cat => cat.displayConfig.showInNav)
    .sort((a, b) => a.displayConfig.sortOrder - b.displayConfig.sortOrder);

  return (
    <section 
      className="py-20 bg-gray-50 dark:bg-neutral-900" 
      id="expertise"
      aria-labelledby="expertise-heading"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SEO-optimized header */}
        <header className="text-center mb-16">
          <h2 
            id="expertise-heading"
            className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl"
            itemProp="name"
          >
            {SOLUTIONS_CONFIG.homePage.sectionTitle}
          </h2>
          {SOLUTIONS_CONFIG.homePage.sectionSubtitle && (
            <p 
              className="mt-4 max-w-3xl mx-auto text-lg text-black/70 dark:text-white/70"
              itemProp="description"
            >
              {SOLUTIONS_CONFIG.homePage.sectionSubtitle}
            </p>
          )}

          {/* Value proposition with keywords */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-black/60 dark:text-white/60">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#00A878]" />
              <span>5-Day AI Proof of Concept</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#00A878]" />
              <span>3-4x ROI Validation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#00A878]" />
              <span>Vendor-Neutral Consulting</span>
            </div>
          </div>
        </header>

        {/* Category grid with semantic structure */}
        <div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          itemProp="itemListElement"
        >
          {featuredCategories.map((category, index) => (
            <div key={category.slug} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <meta itemProp="position" content={String(index + 1)} />
              <ExpertiseCard
                category={category}
                index={index}
                onCategoryClick={(cat) => {
                  // Analytics tracking would go here
                  console.log('Category clicked:', cat.title);
                }}
              />
            </div>
          ))}
        </div>

        {/* Contextual internal links */}
        {contextualLinks.length > 0 && (
          <nav className="mt-12 text-center" aria-label="Related solutions">
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              Explore related AI solutions:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {contextualLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-sm text-[#00A878] hover:underline"
                  title={link.title}
                >
                  {link.anchor}
                </Link>
              ))}
            </div>
          </nav>
        )}

        {/* CTA section */}
        <footer className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              Ready to Transform Your Business with AI?
            </h3>
            <p className="text-black/70 dark:text-white/70 mb-8">
              Get a free 30-minute AI opportunity scan. No buzzwords, just a clear roadmap to 3-4x ROI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
              >
                <Link href="/contact">
                  Book AI Opportunity Scan
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
                  Browse All Solutions
                </Link>
              </Button>
            </div>
          </div>
        </footer>
      </div>

      {/* Hidden SEO metadata */}
      <meta itemProp="numberOfItems" content={String(featuredCategories.length)} />
      <meta itemProp="itemListOrder" content="https://schema.org/ItemListOrderAscending" />
    </section>
  );
}

export default ExpertiseSectionEnhanced;
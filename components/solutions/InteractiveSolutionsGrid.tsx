'use client';

import { SolutionCard } from './SolutionCard';
import Link from 'next/link';

interface InteractiveSolutionsGridProps {
  category: any;
}

export function InteractiveSolutionsGrid({ category }: InteractiveSolutionsGridProps) {
  // Convert solutions data to component-expected format
  const solutions = category.solutions.map((sol: any) => ({
    id: sol.slug,
    title: sol.title,
    summary: sol.summary,
    description: sol.description,
    category: {
      id: category.slug,
      name: category.title,
      slug: category.slug,
      tagline: category.tagline,
      iconName: category.icon,
      featured: category.displayConfig.showInNav,
      sortOrder: category.displayConfig.sortOrder,
      createdAt: '',
      updatedAt: ''
    },
    tags: sol.tags,
    featured: sol.flags.featured,
    iconName: sol.icon,
    ctaText: "Learn More",
    createdAt: '',
    updatedAt: ''
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {solutions.map((solution: any) => {
        const solutionUrl = `/solutions/${category.slug}/${solution.id}`;
        return (
          <Link 
            key={solution.id}
            href={solutionUrl}
            className="block"
          >
            <SolutionCard
              solution={solution}
              className="h-full cursor-pointer hover:shadow-lg transition-all duration-300"
            />
          </Link>
        );
      })}
    </div>
  )
}
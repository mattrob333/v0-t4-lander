'use client';

import { SolutionCard } from './SolutionCard';

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
    ctaUrl: `/solutions/${category.slug}/${sol.slug}`,
    createdAt: '',
    updatedAt: ''
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {solutions.map((solution: any) => (
        <SolutionCard
          key={solution.id}
          solution={solution}
          onClick={(sol) => {
            // Make Learn More buttons non-functional to prevent 404s
            // They now do nothing when clicked
            console.log('Learn more clicked for:', sol.title)
          }}
        />
      ))}
    </div>
  )
}
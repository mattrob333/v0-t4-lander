'use client';

import { SolutionsMegaMenu } from './SolutionsMegaMenu';

interface InteractiveSolutionsMegaMenuProps {
  categories: any[];
  featuredSolutions: any[];
  className?: string;
}

export function InteractiveSolutionsMegaMenu({ 
  categories, 
  featuredSolutions, 
  className 
}: InteractiveSolutionsMegaMenuProps) {
  return (
    <SolutionsMegaMenu
      categories={categories}
      featuredSolutions={featuredSolutions}
      onCategoryClick={(category) => {
        window.location.href = `/solutions/${category.slug}`
      }}
      onSolutionClick={(solution) => {
        // Make Learn More buttons non-functional to prevent 404s
        // They now do nothing when clicked
        console.log('Learn more clicked for:', solution.title)
      }}
      className={className}
    />
  )
}
'use client';

import { SolutionsTileGrid } from './SolutionsTileGrid';

interface InteractiveSolutionsTileGridProps {
  categories: any[];
  variant?: 'home' | 'landing';
  className?: string;
}

export function InteractiveSolutionsTileGrid({ 
  categories, 
  variant = 'landing', 
  className 
}: InteractiveSolutionsTileGridProps) {
  return (
    <SolutionsTileGrid
      categories={categories}
      variant={variant}
      onCategoryClick={(category) => {
        window.location.href = `/solutions/${category.slug}`
      }}
      className={className}
    />
  )
}
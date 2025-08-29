'use client';

import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  
  return (
    <SolutionsTileGrid
      categories={categories}
      variant={variant}
      onCategoryClick={(category) => {
        router.push(`/solutions/${category.slug}`)
      }}
      className={className}
    />
  )
}
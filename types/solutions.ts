
// Solutions System TypeScript Interfaces
// Based on Airtable schema architecture

export interface Solution {
  id: string;
  title: string;
  summary: string;
  description?: string;
  category: SolutionCategory;
  tags: string[];
  featured: boolean;
  ctaText?: string;
  ctaUrl?: string;
  iconName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SolutionCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  iconName: string;
  featured: boolean;
  sortOrder: number;
  solutions?: Solution[];
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedProduct {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Component Props Interfaces
export interface SolutionCardProps {
  solution: Solution;
  variant?: 'compact' | 'default';
  onClick?: (solution: Solution) => void;
  className?: string;
}

export interface SolutionsTileGridProps {
  categories: SolutionCategory[];
  variant?: 'home' | 'landing';
  className?: string;
  onCategoryClick?: (category: SolutionCategory) => void;
}

export interface SolutionsMegaMenuProps {
  categories: SolutionCategory[];
  featuredSolutions: Solution[];
  className?: string;
  onSolutionClick?: (solution: Solution) => void;
  onCategoryClick?: (category: SolutionCategory) => void;
}

export interface CategoryHeroProps {
  category: SolutionCategory;
  showBreadcrumb?: boolean;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

export interface FeaturedProductsProps {
  products: FeaturedProduct[];
  className?: string;
  onProductClick?: (product: FeaturedProduct) => void;
}

// Icon mapping type
export type IconName = 
  | 'Bot'
  | 'UserRoundCog' 
  | 'LineChart'
  | 'Workflow'
  | 'Boxes'
  | 'GraduationCap';
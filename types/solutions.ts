
// Solutions System TypeScript Interfaces
// Based on content/solutions.ts structure

/**
 * SEO metadata interface for optimized search visibility
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}

/**
 * Analytics tracking configuration
 */
export interface AnalyticsConfig {
  category: string;
  action: string;
  label?: string;
  value?: number;
  customDimensions?: Record<string, string | number>;
}

/**
 * Solution priority and visibility flags
 */
export interface SolutionFlags {
  featured: boolean;           // Show in featured sections
  popular: boolean;           // Mark as popular solution
  new: boolean;              // Mark as new solution
  enterprise: boolean;        // Enterprise-focused solution
  priority: 1 | 2 | 3;       // Display priority (1 = highest)
}

/**
 * Solution complexity and engagement metrics
 */
export interface SolutionMetrics {
  implementationWeeks: number;  // Typical implementation time
  roiTimelineMonths: number;   // Expected ROI timeline
  complexity: 'low' | 'medium' | 'high';
  industryFit: string[];       // Best-fit industries
}

/**
 * Individual AI Solution definition
 */
export interface Solution {
  // Core identifiers
  title: string;
  slug: string;                // URL-safe identifier
  
  // Content
  summary: string;             // 1-line description for cards
  description?: string;        // Longer description for detail pages
  
  // Categorization
  tags: string[];             // Filterable tags ["Chat", "Voice", "CRM"]
  category: string;           // Parent category slug
  
  // UI & UX
  icon?: string;              // Lucide icon name
  color?: string;             // Theme color override
  
  // Flags & Priority
  flags: SolutionFlags;
  metrics: SolutionMetrics;
  
  // SEO & Marketing
  seo: SEOMetadata;
  
  // Analytics
  analytics: AnalyticsConfig;
  
  // Future extensibility
  features?: string[];        // Key feature list
  benefits?: string[];        // Business benefits
  useCases?: string[];        // Specific use cases
  integrations?: string[];    // Compatible integrations
  pricing?: {
    model: 'fixed' | 'usage' | 'subscription' | 'custom';
    startingPrice?: number;
    currency?: string;
  };
  
  // Content for future detail pages
  content?: {
    hero?: {
      headline: string;
      subheadline: string;
      backgroundImage?: string;
    };
    sections?: Array<{
      type: 'features' | 'benefits' | 'process' | 'faq' | 'cta';
      title: string;
      content: any;
    }>;
  };
}

/**
 * Solution Category definition
 */
export interface Category {
  // Core identifiers
  title: string;
  slug: string;                // Must match route parameter
  
  // Content
  tagline: string;            // 1-line description
  description?: string;       // Longer description for landing page
  
  // UI
  icon: string;               // Lucide icon name
  color?: string;             // Theme color
  gradient?: {
    from: string;
    to: string;
  };
  
  // Solutions
  solutions: Solution[];
  
  // SEO
  seo: SEOMetadata;
  
  // Analytics
  analytics: AnalyticsConfig;
  
  // Display configuration
  displayConfig: {
    featuredSolutionsCount: number;  // How many to show in mega-menu
    gridLayout: '2x3' | '3x2' | '1x6';  // Preferred layout
    showInNav: boolean;              // Include in main navigation
    sortOrder: number;               // Display order
  };
  
  // Future extensibility
  heroContent?: {
    headline: string;
    subheadline: string;
    backgroundImage?: string;
    ctaText: string;
    ctaHref: string;
  };
}

/**
 * Featured products configuration for right rail/sidebar
 */
export interface FeaturedProduct {
  title: string;
  slug: string;
  blurb: string;
  icon?: string;
  href: string;
  analytics: AnalyticsConfig;
}

/**
 * Global solutions configuration
 */
export interface SolutionsConfig {
  // Mega-menu configuration
  megaMenu: {
    columnsCount: number;
    featuredSolutionsCount: number;
    showViewAllLink: boolean;
  };
  
  // Home page configuration
  homePage: {
    sectionTitle: string;
    sectionSubtitle?: string;
    tilesLayout: '2x3' | '3x2' | '1x6';
  };
  
  // Solutions landing configuration
  landingPage: {
    hero: {
      title: string;
      subtitle: string;
      backgroundImage?: string;
    };
    cardsLayout: '2x3' | '3x2' | '1x6';
  };
  
  // Global CTAs
  ctas: {
    primary: {
      text: string;
      href: string;
      analytics: AnalyticsConfig;
    };
    secondary?: {
      text: string;
      href: string;
      analytics: AnalyticsConfig;
    };
  };
  
  // Analytics configuration
  analytics: {
    categoryPrefix: string;
    trackingEvents: {
      menuOpen: string;
      categoryClick: string;
      solutionClick: string;
      ctaClick: string;
    };
  };
}

// Component Props Interfaces
export interface SolutionCardProps {
  solution: Solution;
  variant?: 'compact' | 'default';
  onClick?: (solution: Solution) => void;
  className?: string;
}

export interface SolutionsTileGridProps {
  categories: Category[];
  variant?: 'home' | 'landing';
  className?: string;
  onCategoryClick?: (category: Category) => void;
}

export interface SolutionsMegaMenuProps {
  categories: Category[];
  featuredSolutions: Solution[];
  className?: string;
  onSolutionClick?: (solution: Solution) => void;
  onCategoryClick?: (category: Category) => void;
}

export interface CategoryHeroProps {
  category: Category;
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

// Additional type exports for compatibility
export type SolutionCategory = Category;
export type SolutionTag = string;
export type IndustryTag = string;
export type ComplexityLevel = 'low' | 'medium' | 'high';
export type PriorityLevel = 1 | 2 | 3;

// Icon mapping type
export type IconName = 
  | 'Bot'
  | 'UserRoundCog' 
  | 'LineChart'
  | 'Workflow'
  | 'Boxes'
  | 'GraduationCap'
  | 'MessageSquare'
  | 'Smartphone'
  | 'Phone'
  | 'Mail'
  | 'MessageCircle'
  | 'Calendar'
  | 'Headphones'
  | 'FileText'
  | 'Brain'
  | 'Zap'
  | 'Target'
  | 'Search'
  | 'Crown'
  | 'GitBranch'
  | 'Users'
  | 'ShoppingBag';
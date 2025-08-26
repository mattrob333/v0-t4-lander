/**
 * Solutions Library - Main Export File
 * 
 * Centralized exports for all solutions-related utilities, data, and functions.
 * Provides clean imports for components and pages throughout the application.
 */

// ============================================================================
// DATA EXPORTS
// ============================================================================

export {
  // Core data
  CATEGORIES,
  FEATURED_PRODUCTS, 
  SOLUTIONS_CONFIG,
  
  // Constants
  SOLUTION_TAGS,
  INDUSTRY_TAGS,
  COMPLEXITY_LEVELS,
  PRIORITY_LEVELS,
  
  // Core functions from data file
  generateSlug,
  getFeaturedSolutions,
  getSolutionsByTag,
  findCategoryBySlug,
  findSolution,
  generateBreadcrumbs
} from '@/content/solutions';

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export {
  // Data access utilities
  getAllCategories,
  getAllSolutions,
  getPopularSolutions,
  getNewSolutions,
  getSolutionsByIndustry,
  getSolutionsByComplexity,
  
  // Filtering & search utilities
  filterSolutions,
  searchSolutions,
  
  // Analytics utilities  
  createSolutionAnalyticsEvent,
  createCategoryAnalyticsEvent,
  
  // UI utilities
  getAllTags,
  getAllIndustries,
  getComplexityLevels,
  getCategoryStats,
  
  // Validation utilities
  validateSolutionSlug,
  validateCategorySlug
} from './utils';

// ============================================================================
// SEO EXPORTS
// ============================================================================

export {
  // Meta generation
  generateSolutionsLandingMeta,
  generateCategoryMeta,
  generateSolutionMeta,
  
  // Structured data
  generateSolutionStructuredData,
  generateCategoryStructuredData,
  generateFAQStructuredData,
  
  // Sitemap & robots
  generateSolutionsSitemap,
  generateSolutionsRobotsEntries,
  
  // URL utilities
  generateCanonicalUrl,
  generateHreflangTags,
  
  // Meta tag utilities
  generateMetaTags,
  validateSEOMetadata
} from './seo';

// ============================================================================
// ANALYTICS EXPORTS
// ============================================================================

export {
  // Event constants
  SOLUTIONS_EVENTS,
  
  // Tracking functions
  trackMenuInteraction,
  trackSolutionPageView,
  trackSolutionInteraction,
  trackCategoryInteraction,
  trackSolutionSearch,
  trackConversionEvent,
  
  // Performance & monitoring
  trackPerformanceMetrics,
  trackError,
  
  // Utility functions
  calculateSolutionValue,
  getSessionId,
  getUserId,
  getUserJourneyStep
} from './analytics';

// ============================================================================
// TYPE RE-EXPORTS
// ============================================================================

export type {
  // Core types
  Solution,
  Category,
  FeaturedProduct,
  SolutionsConfig,
  SEOMetadata,
  AnalyticsConfig,
  SolutionFlags,
  SolutionMetrics,
  
  // Component prop types
  SolutionsMegaMenuProps,
  SolutionsTileGridProps,
  CategoryHeroProps,
  SolutionCardProps,
  FeaturedProductsProps,
  SolutionFiltersProps,
  SolutionGridProps,
  
  // Page component types
  SolutionsPageProps,
  CategoryPageProps,
  SolutionPageProps,
  
  // Analytics types
  SolutionsAnalyticsEvents,
  CustomAnalyticsConfig,
  
  // API response types
  SolutionsAPIResponse,
  FilteredSolutionsResponse,
  
  // Utility types
  SolutionPreview,
  CategoryPreview,
  SolutionSearchResult,
  BreadcrumbItem,
  SolutionsNavItem,
  
  // Form types
  SolutionFormData,
  SolutionFormErrors,
  
  // State types
  MegaMenuState,
  SolutionsFilterState,
  SolutionsViewState,
  
  // Tag types
  SolutionTag,
  IndustryTag,
  ComplexityLevel,
  PriorityLevel
} from '@/types/solutions';

// ============================================================================
// HOOK EXPORTS (for future custom hooks)
// ============================================================================

// Note: These would be implemented in separate hook files as needed
// export { useSolutions, useSolutionSearch, useSolutionAnalytics } from './hooks';

// ============================================================================
// CONFIGURATION EXPORTS
// ============================================================================

/**
 * Default configuration for solutions components
 */
export const SOLUTIONS_DEFAULTS = {
  // Mega menu defaults
  megaMenu: {
    featuredSolutionsCount: 4,
    showViewAllLink: true,
    keyboardNavigation: true
  },
  
  // Card defaults
  solutionCard: {
    showTags: true,
    showMetrics: false,
    variant: 'default' as const,
    truncateAt: 120
  },
  
  // Grid defaults
  solutionGrid: {
    itemsPerPage: 12,
    showFilters: true,
    showPagination: true,
    variant: 'grid' as const
  },
  
  // Search defaults
  search: {
    minQueryLength: 2,
    maxResults: 10,
    debounceMs: 300,
    highlightMatches: true
  },
  
  // Analytics defaults
  analytics: {
    enableTracking: true,
    enablePerformanceMonitoring: true,
    enableErrorTracking: true,
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  }
} as const;

/**
 * URL patterns for solutions system
 */
export const SOLUTIONS_ROUTES = {
  landing: '/solutions',
  category: '/solutions/[category]',
  solution: '/solutions/[category]/[solution]',
  
  // API routes
  api: {
    solutions: '/api/solutions',
    search: '/api/solutions/search',
    analytics: '/api/analytics/track'
  }
} as const;

/**
 * Cache keys for solutions data
 */
export const SOLUTIONS_CACHE_KEYS = {
  allSolutions: 'solutions:all',
  allCategories: 'solutions:categories',
  featuredSolutions: 'solutions:featured',
  popularSolutions: 'solutions:popular',
  searchIndex: 'solutions:search-index',
  analytics: 'solutions:analytics'
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if solutions system is available
 */
export function isSolutionsAvailable(): boolean {
  return CATEGORIES.length > 0;
}

/**
 * Get solutions system statistics
 */
export function getSolutionsStats() {
  const allSolutions = getAllSolutions();
  const featuredCount = allSolutions.filter(s => s.flags.featured).length;
  const popularCount = allSolutions.filter(s => s.flags.popular).length;
  const newCount = allSolutions.filter(s => s.flags.new).length;
  
  return {
    totalCategories: CATEGORIES.length,
    totalSolutions: allSolutions.length,
    featuredSolutions: featuredCount,
    popularSolutions: popularCount,
    newSolutions: newCount,
    averageImplementationWeeks: allSolutions.reduce((sum, s) => sum + s.metrics.implementationWeeks, 0) / allSolutions.length,
    averageROIMonths: allSolutions.reduce((sum, s) => sum + s.metrics.roiTimelineMonths, 0) / allSolutions.length,
    complexityDistribution: {
      low: allSolutions.filter(s => s.metrics.complexity === 'low').length,
      medium: allSolutions.filter(s => s.metrics.complexity === 'medium').length,
      high: allSolutions.filter(s => s.metrics.complexity === 'high').length
    },
    uniqueTags: getAllTags().length,
    uniqueIndustries: getAllIndustries().length
  };
}

/**
 * Validate solutions data integrity
 */
export function validateSolutionsData(): Array<{type: 'error' | 'warning'; message: string; context?: any}> {
  const issues = [];
  
  // Check for duplicate category slugs
  const categorySlugCounts = new Map();
  CATEGORIES.forEach(cat => {
    const count = categorySlugCounts.get(cat.slug) || 0;
    categorySlugCounts.set(cat.slug, count + 1);
  });
  
  categorySlugCounts.forEach((count, slug) => {
    if (count > 1) {
      issues.push({
        type: 'error' as const,
        message: `Duplicate category slug found: ${slug}`,
        context: { slug, count }
      });
    }
  });
  
  // Check for duplicate solution slugs within categories
  CATEGORIES.forEach(category => {
    const solutionSlugCounts = new Map();
    category.solutions.forEach(sol => {
      const count = solutionSlugCounts.get(sol.slug) || 0;
      solutionSlugCounts.set(sol.slug, count + 1);
    });
    
    solutionSlugCounts.forEach((count, slug) => {
      if (count > 1) {
        issues.push({
          type: 'error' as const,
          message: `Duplicate solution slug found in category ${category.slug}: ${slug}`,
          context: { categorySlug: category.slug, solutionSlug: slug, count }
        });
      }
    });
  });
  
  // Check for missing required fields
  CATEGORIES.forEach(category => {
    if (!category.title || !category.slug || !category.tagline || !category.icon) {
      issues.push({
        type: 'error' as const,
        message: `Category missing required fields: ${category.slug}`,
        context: { category: category.slug }
      });
    }
    
    category.solutions.forEach(solution => {
      if (!solution.title || !solution.slug || !solution.summary || !solution.category) {
        issues.push({
          type: 'error' as const,
          message: `Solution missing required fields: ${solution.slug}`,
          context: { categorySlug: category.slug, solutionSlug: solution.slug }
        });
      }
      
      // Warn about missing SEO data
      if (!solution.seo.title || !solution.seo.description) {
        issues.push({
          type: 'warning' as const,
          message: `Solution missing SEO data: ${solution.slug}`,
          context: { categorySlug: category.slug, solutionSlug: solution.slug }
        });
      }
    });
  });
  
  return issues;
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Data
  CATEGORIES,
  FEATURED_PRODUCTS,
  SOLUTIONS_CONFIG,
  SOLUTIONS_DEFAULTS,
  SOLUTIONS_ROUTES,
  SOLUTIONS_CACHE_KEYS,
  
  // Functions
  getAllCategories,
  getAllSolutions,
  findCategoryBySlug,
  findSolution,
  searchSolutions,
  filterSolutions,
  
  // SEO
  generateSolutionsLandingMeta,
  generateCategoryMeta,
  generateSolutionMeta,
  
  // Analytics
  trackSolutionInteraction,
  trackCategoryInteraction,
  trackConversionEvent,
  
  // Utilities
  getSolutionsStats,
  validateSolutionsData,
  isSolutionsAvailable
};
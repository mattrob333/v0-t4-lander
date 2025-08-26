/**
 * Solutions Utility Functions
 * 
 * Helper functions for working with solutions data, filtering, searching,
 * and generating derived data for UI components and SEO optimization.
 */

import type { 
  Solution, 
  Category, 
  SolutionSearchResult, 
  BreadcrumbItem,
  SolutionsFilterState 
} from '@/types/solutions';
import { CATEGORIES, FEATURED_PRODUCTS } from '@/content/solutions';

// ============================================================================
// DATA ACCESS UTILITIES
// ============================================================================

/**
 * Get all categories sorted by display order
 */
export function getAllCategories(): Category[] {
  return CATEGORIES.sort((a, b) => a.displayConfig.sortOrder - b.displayConfig.sortOrder);
}

/**
 * Get all solutions across all categories
 */
export function getAllSolutions(): Solution[] {
  return CATEGORIES.flatMap(category => category.solutions);
}

/**
 * Find category by slug
 */
export function findCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(category => category.slug === slug);
}

/**
 * Find solution by category and solution slugs
 */
export function findSolution(categorySlug: string, solutionSlug: string): {
  solution: Solution;
  category: Category;
} | undefined {
  const category = findCategoryBySlug(categorySlug);
  if (!category) return undefined;
  
  const solution = category.solutions.find(sol => sol.slug === solutionSlug);
  if (!solution) return undefined;
  
  return { solution, category };
}

/**
 * Get featured solutions across all categories
 */
export function getFeaturedSolutions(limit?: number): Array<{solution: Solution; category: Category}> {
  const featured = CATEGORIES.flatMap(category =>
    category.solutions
      .filter(solution => solution.flags.featured)
      .map(solution => ({ solution, category }))
  );
  
  const sorted = featured.sort((a, b) => a.solution.flags.priority - b.solution.flags.priority);
  
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get popular solutions across all categories
 */
export function getPopularSolutions(limit?: number): Array<{solution: Solution; category: Category}> {
  const popular = CATEGORIES.flatMap(category =>
    category.solutions
      .filter(solution => solution.flags.popular)
      .map(solution => ({ solution, category }))
  );
  
  const sorted = popular.sort((a, b) => a.solution.flags.priority - b.solution.flags.priority);
  
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get new solutions across all categories
 */
export function getNewSolutions(limit?: number): Array<{solution: Solution; category: Category}> {
  const newSolutions = CATEGORIES.flatMap(category =>
    category.solutions
      .filter(solution => solution.flags.new)
      .map(solution => ({ solution, category }))
  );
  
  const sorted = newSolutions.sort((a, b) => a.solution.flags.priority - b.solution.flags.priority);
  
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get solutions by tag
 */
export function getSolutionsByTag(tag: string): Array<{solution: Solution; category: Category}> {
  return CATEGORIES.flatMap(category =>
    category.solutions
      .filter(solution => solution.tags.includes(tag))
      .map(solution => ({ solution, category }))
  );
}

/**
 * Get solutions by industry fit
 */
export function getSolutionsByIndustry(industry: string): Array<{solution: Solution; category: Category}> {
  return CATEGORIES.flatMap(category =>
    category.solutions
      .filter(solution => solution.metrics.industryFit.includes(industry))
      .map(solution => ({ solution, category }))
  );
}

/**
 * Get solutions by complexity level
 */
export function getSolutionsByComplexity(complexity: 'low' | 'medium' | 'high'): Array<{solution: Solution; category: Category}> {
  return CATEGORIES.flatMap(category =>
    category.solutions
      .filter(solution => solution.metrics.complexity === complexity)
      .map(solution => ({ solution, category }))
  );
}

// ============================================================================
// FILTERING & SEARCH UTILITIES
// ============================================================================

/**
 * Filter solutions based on multiple criteria
 */
export function filterSolutions(filterState: SolutionsFilterState): Array<{solution: Solution; category: Category}> {
  let results = getAllSolutions().map(solution => ({
    solution,
    category: CATEGORIES.find(cat => cat.slug === solution.category)!
  }));

  // Filter by categories
  if (filterState.selectedCategories.length > 0) {
    results = results.filter(({ category }) =>
      filterState.selectedCategories.includes(category.slug)
    );
  }

  // Filter by tags
  if (filterState.selectedTags.length > 0) {
    results = results.filter(({ solution }) =>
      filterState.selectedTags.some(tag => solution.tags.includes(tag))
    );
  }

  // Filter by complexity
  if (filterState.selectedComplexity.length > 0) {
    results = results.filter(({ solution }) =>
      filterState.selectedComplexity.includes(solution.metrics.complexity)
    );
  }

  // Filter by industries
  if (filterState.selectedIndustries.length > 0) {
    results = results.filter(({ solution }) =>
      filterState.selectedIndustries.some(industry => 
        solution.metrics.industryFit.includes(industry)
      )
    );
  }

  // Filter by search query
  if (filterState.searchQuery.trim()) {
    const query = filterState.searchQuery.toLowerCase().trim();
    results = results.filter(({ solution, category }) => 
      solution.title.toLowerCase().includes(query) ||
      solution.summary.toLowerCase().includes(query) ||
      solution.description?.toLowerCase().includes(query) ||
      solution.tags.some(tag => tag.toLowerCase().includes(query)) ||
      category.title.toLowerCase().includes(query)
    );
  }

  // Sort results
  results.sort((a, b) => {
    const { sortBy, sortDirection } = filterState;
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.solution.title.localeCompare(b.solution.title);
        break;
      case 'priority':
        comparison = a.solution.flags.priority - b.solution.flags.priority;
        break;
      case 'popularity':
        // Popular solutions first, then by priority
        if (a.solution.flags.popular && !b.solution.flags.popular) comparison = -1;
        else if (!a.solution.flags.popular && b.solution.flags.popular) comparison = 1;
        else comparison = a.solution.flags.priority - b.solution.flags.priority;
        break;
      case 'newest':
        // New solutions first, then by priority
        if (a.solution.flags.new && !b.solution.flags.new) comparison = -1;
        else if (!a.solution.flags.new && b.solution.flags.new) comparison = 1;
        else comparison = a.solution.flags.priority - b.solution.flags.priority;
        break;
      default:
        comparison = a.solution.flags.priority - b.solution.flags.priority;
    }

    return sortDirection === 'desc' ? -comparison : comparison;
  });

  return results;
}

/**
 * Advanced search with scoring and highlighting
 */
export function searchSolutions(query: string, limit = 10): SolutionSearchResult[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase().trim();
  const results: SolutionSearchResult[] = [];

  CATEGORIES.forEach(category => {
    category.solutions.forEach(solution => {
      let matchScore = 0;
      const matchedFields: Array<'title' | 'summary' | 'description' | 'tags'> = [];
      const highlightedText: any = {};

      // Title match (highest weight)
      if (solution.title.toLowerCase().includes(searchTerm)) {
        matchScore += 10;
        matchedFields.push('title');
        highlightedText.title = highlightText(solution.title, searchTerm);
      }

      // Summary match (high weight)
      if (solution.summary.toLowerCase().includes(searchTerm)) {
        matchScore += 7;
        matchedFields.push('summary');
        highlightedText.summary = highlightText(solution.summary, searchTerm);
      }

      // Description match (medium weight)
      if (solution.description?.toLowerCase().includes(searchTerm)) {
        matchScore += 5;
        matchedFields.push('description');
        highlightedText.description = highlightText(solution.description, searchTerm);
      }

      // Tags match (medium weight)
      const matchingTags = solution.tags.filter(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
      if (matchingTags.length > 0) {
        matchScore += matchingTags.length * 3;
        matchedFields.push('tags');
      }

      // Category match (low weight)
      if (category.title.toLowerCase().includes(searchTerm)) {
        matchScore += 2;
      }

      // Boost score for featured/popular solutions
      if (solution.flags.featured) matchScore += 2;
      if (solution.flags.popular) matchScore += 1;
      
      // Boost score based on priority
      matchScore += (4 - solution.flags.priority);

      if (matchScore > 0) {
        results.push({
          solution,
          category,
          matchScore,
          matchedFields,
          highlightedText
        });
      }
    });
  });

  // Sort by match score (highest first) and return top results
  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Highlight search terms in text
 */
function highlightText(text: string, searchTerm: string): string {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// ============================================================================
// ANALYTICS & TRACKING UTILITIES
// ============================================================================

/**
 * Generate analytics event data for solution interaction
 */
export function createSolutionAnalyticsEvent(
  eventType: 'view' | 'click' | 'cta_click',
  solution: Solution,
  category: Category,
  additionalData: Record<string, any> = {}
) {
  return {
    event: `solution_${eventType}`,
    solution_slug: solution.slug,
    solution_title: solution.title,
    category_slug: category.slug,
    category_title: category.title,
    solution_priority: solution.flags.priority,
    solution_featured: solution.flags.featured,
    solution_popular: solution.flags.popular,
    solution_complexity: solution.metrics.complexity,
    solution_implementation_weeks: solution.metrics.implementationWeeks,
    solution_roi_months: solution.metrics.roiTimelineMonths,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
}

/**
 * Generate analytics event for category interaction
 */
export function createCategoryAnalyticsEvent(
  eventType: 'view' | 'click' | 'hover',
  category: Category,
  additionalData: Record<string, any> = {}
) {
  return {
    event: `category_${eventType}`,
    category_slug: category.slug,
    category_title: category.title,
    category_sort_order: category.displayConfig.sortOrder,
    solutions_count: category.solutions.length,
    featured_solutions_count: category.solutions.filter(s => s.flags.featured).length,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
}

// ============================================================================
// SEO & METADATA UTILITIES
// ============================================================================

/**
 * Generate breadcrumbs for navigation
 */
export function generateBreadcrumbs(
  categorySlug?: string,
  solutionSlug?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Solutions', href: '/solutions' }
  ];

  if (categorySlug) {
    const category = findCategoryBySlug(categorySlug);
    if (category) {
      breadcrumbs.push({
        name: category.title,
        href: `/solutions/${categorySlug}`,
        current: !solutionSlug
      });
    }
  }

  if (solutionSlug && categorySlug) {
    const result = findSolution(categorySlug, solutionSlug);
    if (result) {
      breadcrumbs.push({
        name: result.solution.title,
        href: `/solutions/${categorySlug}/${solutionSlug}`,
        current: true
      });
    }
  }

  return breadcrumbs;
}

/**
 * Generate structured data for SEO
 */
export function generateSolutionStructuredData(
  solution: Solution,
  category: Category
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": solution.title,
    "description": solution.summary,
    "provider": {
      "@type": "Organization",
      "name": "Tier 4 Intelligence",
      "url": "https://tier4intelligence.com"
    },
    "serviceType": category.title,
    "category": category.title,
    "audience": {
      "@type": "Audience",
      "audienceType": solution.metrics.industryFit
    },
    "offers": {
      "@type": "Offer",
      "url": `https://tier4intelligence.com/solutions/${category.slug}/${solution.slug}`,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "additionalType": "https://schema.org/ProfessionalService",
    "keywords": solution.tags.join(", ")
  };
}

/**
 * Generate category structured data
 */
export function generateCategoryStructuredData(category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.title} Solutions`,
    "description": category.tagline,
    "url": `https://tier4intelligence.com/solutions/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": category.solutions.length,
      "itemListElement": category.solutions.map((solution, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": solution.title,
          "description": solution.summary,
          "url": `https://tier4intelligence.com/solutions/${category.slug}/${solution.slug}`
        }
      }))
    },
    "provider": {
      "@type": "Organization",
      "name": "Tier 4 Intelligence",
      "url": "https://tier4intelligence.com"
    }
  };
}

// ============================================================================
// UI UTILITY FUNCTIONS
// ============================================================================

/**
 * Get unique tags across all solutions
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllSolutions().forEach(solution => {
    solution.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get unique industry fits across all solutions
 */
export function getAllIndustries(): string[] {
  const industries = new Set<string>();
  getAllSolutions().forEach(solution => {
    solution.metrics.industryFit.forEach(industry => industries.add(industry));
  });
  return Array.from(industries).sort();
}

/**
 * Get complexity levels with counts
 */
export function getComplexityLevels(): Array<{level: string; count: number}> {
  const complexityCounts = { low: 0, medium: 0, high: 0 };
  getAllSolutions().forEach(solution => {
    complexityCounts[solution.metrics.complexity]++;
  });

  return Object.entries(complexityCounts).map(([level, count]) => ({ level, count }));
}

/**
 * Calculate category completion statistics
 */
export function getCategoryStats() {
  return CATEGORIES.map(category => ({
    slug: category.slug,
    title: category.title,
    totalSolutions: category.solutions.length,
    featuredSolutions: category.solutions.filter(s => s.flags.featured).length,
    popularSolutions: category.solutions.filter(s => s.flags.popular).length,
    newSolutions: category.solutions.filter(s => s.flags.new).length,
    enterpriseSolutions: category.solutions.filter(s => s.flags.enterprise).length,
    averageComplexity: getAverageComplexity(category.solutions),
    averageImplementationTime: getAverageImplementationTime(category.solutions),
    topTags: getTopTagsForCategory(category),
    topIndustries: getTopIndustriesForCategory(category)
  }));
}

/**
 * Calculate average complexity score for solutions
 */
function getAverageComplexity(solutions: Solution[]): number {
  const complexityScores = { low: 1, medium: 2, high: 3 };
  const total = solutions.reduce((sum, solution) => 
    sum + complexityScores[solution.metrics.complexity], 0
  );
  return total / solutions.length;
}

/**
 * Calculate average implementation time for solutions
 */
function getAverageImplementationTime(solutions: Solution[]): number {
  const total = solutions.reduce((sum, solution) => 
    sum + solution.metrics.implementationWeeks, 0
  );
  return total / solutions.length;
}

/**
 * Get top tags for a category
 */
function getTopTagsForCategory(category: Category): Array<{tag: string; count: number}> {
  const tagCounts: Record<string, number> = {};
  category.solutions.forEach(solution => {
    solution.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/**
 * Get top industries for a category
 */
function getTopIndustriesForCategory(category: Category): Array<{industry: string; count: number}> {
  const industryCounts: Record<string, number> = {};
  category.solutions.forEach(solution => {
    solution.metrics.industryFit.forEach(industry => {
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });
  });

  return Object.entries(industryCounts)
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

/**
 * Validate solution slug uniqueness
 */
export function validateSolutionSlug(slug: string, excludeSlug?: string): boolean {
  const allSolutions = getAllSolutions();
  return !allSolutions.some(solution => 
    solution.slug === slug && solution.slug !== excludeSlug
  );
}

/**
 * Validate category slug uniqueness  
 */
export function validateCategorySlug(slug: string, excludeSlug?: string): boolean {
  return !CATEGORIES.some(category => 
    category.slug === slug && category.slug !== excludeSlug
  );
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export default {
  // Data access
  getAllCategories,
  getAllSolutions,
  findCategoryBySlug,
  findSolution,
  getFeaturedSolutions,
  getPopularSolutions,
  getNewSolutions,
  getSolutionsByTag,
  getSolutionsByIndustry,
  getSolutionsByComplexity,
  
  // Filtering & search
  filterSolutions,
  searchSolutions,
  
  // Analytics
  createSolutionAnalyticsEvent,
  createCategoryAnalyticsEvent,
  
  // SEO & metadata
  generateBreadcrumbs,
  generateSolutionStructuredData,
  generateCategoryStructuredData,
  
  // UI utilities
  getAllTags,
  getAllIndustries,
  getComplexityLevels,
  getCategoryStats,
  validateSolutionSlug,
  validateCategorySlug,
  generateSlug
};
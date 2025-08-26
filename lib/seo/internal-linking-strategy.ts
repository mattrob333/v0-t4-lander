/**
 * Advanced Internal Linking Strategy System
 * 
 * Generates intelligent internal linking patterns to boost SEO authority,
 * improve user navigation, and distribute page rank effectively across
 * the solutions ecosystem.
 */

import type { Solution, Category } from '@/types/solutions';
import { CATEGORIES, FEATURED_PRODUCTS, findCategoryBySlug, findSolution } from '@/content/solutions';

// ============================================================================
// INTERNAL LINK TYPES & CONFIGURATION
// ============================================================================

export interface InternalLink {
  url: string;
  anchor: string;
  title?: string;
  context: 'contextual' | 'navigational' | 'promotional' | 'related';
  priority: 'high' | 'medium' | 'low';
  pageType: 'landing' | 'category' | 'solution' | 'service' | 'content';
  relationshipType: 'parent' | 'child' | 'sibling' | 'related' | 'cross-category';
  keywords: string[];
}

export interface LinkingStrategy {
  hubPages: string[];
  spokePages: string[];
  crossLinkingRules: Array<{
    fromPageType: string;
    toPageType: string;
    maxLinks: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  anchorTextVariations: Record<string, string[]>;
}

// ============================================================================
// LINKING STRATEGY CONFIGURATION
// ============================================================================

export const INTERNAL_LINKING_STRATEGY: LinkingStrategy = {
  // Hub pages that should receive the most internal links
  hubPages: [
    '/solutions',
    '/contact',
    '/solutions/customer-self-service',
    '/solutions/agent-employee-copilots',
    '/solutions/analytics-quality-intelligence'
  ],
  
  // Spoke pages that should link back to hubs
  spokePages: [
    '/solutions/automation-orchestration',
    '/solutions/llm-platforms-integration', 
    '/solutions/advisory-training-managed-ai'
  ],
  
  // Cross-linking rules between page types
  crossLinkingRules: [
    {
      fromPageType: 'category',
      toPageType: 'solution',
      maxLinks: 6,
      priority: 'high'
    },
    {
      fromPageType: 'solution',
      toPageType: 'category',
      maxLinks: 2,
      priority: 'medium'
    },
    {
      fromPageType: 'solution',
      toPageType: 'solution',
      maxLinks: 4,
      priority: 'medium'
    },
    {
      fromPageType: 'landing',
      toPageType: 'category',
      maxLinks: 6,
      priority: 'high'
    }
  ],
  
  // Anchor text variations to avoid over-optimization
  anchorTextVariations: {
    'ai-consulting': [
      'AI consulting services',
      'artificial intelligence consulting',
      'AI consulting experts',
      'enterprise AI consulting',
      'AI implementation consulting'
    ],
    'customer-service': [
      'customer service automation',
      'AI customer service',
      'automated customer support',
      'customer service AI solutions',
      'intelligent customer service'
    ],
    'business-automation': [
      'business process automation',
      'enterprise automation',
      'intelligent automation',
      'workflow automation',
      'business automation solutions'
    ]
  }
};

// ============================================================================
// CORE LINKING FUNCTIONS
// ============================================================================

/**
 * Generate contextual internal links for a specific page
 */
export function generateContextualLinks(
  currentPageUrl: string,
  pageType: 'landing' | 'category' | 'solution',
  category?: Category,
  solution?: Solution
): InternalLink[] {
  const links: InternalLink[] = [];
  const baseUrl = 'https://tier4intelligence.com';
  
  switch (pageType) {
    case 'landing':
      // Solutions landing page links to categories
      links.push(...generateLandingPageLinks(baseUrl));
      break;
      
    case 'category':
      if (category) {
        links.push(...generateCategoryPageLinks(category, baseUrl));
      }
      break;
      
    case 'solution':
      if (solution && category) {
        links.push(...generateSolutionPageLinks(solution, category, baseUrl));
      }
      break;
  }
  
  // Add promotional links for key services
  links.push(...generatePromotionalLinks(baseUrl, currentPageUrl));
  
  // Filter out self-referencing links
  return links.filter(link => 
    !link.url.includes(currentPageUrl.replace(baseUrl, ''))
  );
}

/**
 * Generate links for the solutions landing page
 */
function generateLandingPageLinks(baseUrl: string): InternalLink[] {
  const links: InternalLink[] = [];
  
  // Links to all categories with varied anchor text
  CATEGORIES.forEach((category, index) => {
    const anchorVariations = [
      category.title,
      `${category.title} solutions`,
      `AI-powered ${category.title.toLowerCase()}`,
      `Enterprise ${category.title.toLowerCase()}`
    ];
    
    links.push({
      url: `${baseUrl}/solutions/${category.slug}`,
      anchor: anchorVariations[index % anchorVariations.length],
      title: category.tagline,
      context: 'navigational',
      priority: category.displayConfig.showInNav ? 'high' : 'medium',
      pageType: 'category',
      relationshipType: 'child',
      keywords: [category.title.toLowerCase(), 'AI solutions', 'automation']
    });
  });
  
  // Featured solutions from each category
  CATEGORIES.slice(0, 3).forEach(category => {
    const featuredSolution = category.solutions.find(s => s.flags.featured);
    if (featuredSolution) {
      links.push({
        url: `${baseUrl}/solutions/${category.slug}/${featuredSolution.slug}`,
        anchor: `${featuredSolution.title} solution`,
        title: featuredSolution.summary,
        context: 'promotional',
        priority: 'medium',
        pageType: 'solution',
        relationshipType: 'child',
        keywords: featuredSolution.tags.map(tag => tag.toLowerCase())
      });
    }
  });
  
  return links;
}

/**
 * Generate links for category pages
 */
function generateCategoryPageLinks(category: Category, baseUrl: string): InternalLink[] {
  const links: InternalLink[] = [];
  
  // Link back to solutions landing
  links.push({
    url: `${baseUrl}/solutions`,
    anchor: 'All AI Solutions',
    title: 'Browse all AI solutions and services',
    context: 'navigational',
    priority: 'medium',
    pageType: 'landing',
    relationshipType: 'parent',
    keywords: ['AI solutions', 'services']
  });
  
  // Links to related categories (similar or complementary)
  const relatedCategories = findRelatedCategories(category);
  relatedCategories.forEach(relatedCategory => {
    links.push({
      url: `${baseUrl}/solutions/${relatedCategory.slug}`,
      anchor: `${relatedCategory.title} solutions`,
      title: relatedCategory.tagline,
      context: 'related',
      priority: 'medium',
      pageType: 'category',
      relationshipType: 'sibling',
      keywords: [relatedCategory.title.toLowerCase(), 'AI', 'automation']
    });
  });
  
  // Links to featured solutions within the category
  category.solutions
    .filter(s => s.flags.featured)
    .slice(0, 4)
    .forEach(solution => {
      links.push({
        url: `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
        anchor: solution.title,
        title: solution.summary,
        context: 'contextual',
        priority: 'high',
        pageType: 'solution',
        relationshipType: 'child',
        keywords: solution.tags.map(tag => tag.toLowerCase())
      });
    });
  
  // Cross-category solution recommendations
  const crossCategorySolutions = findCrossCategorySolutions(category);
  crossCategorySolutions.slice(0, 2).forEach(({ solution, sourceCategory }) => {
    links.push({
      url: `${baseUrl}/solutions/${sourceCategory.slug}/${solution.slug}`,
      anchor: `${solution.title} integration`,
      title: `Combine with ${solution.title} for enhanced results`,
      context: 'related',
      priority: 'low',
      pageType: 'solution',
      relationshipType: 'cross-category',
      keywords: [...solution.tags.map(tag => tag.toLowerCase()), 'integration']
    });
  });
  
  return links;
}

/**
 * Generate links for solution pages
 */
function generateSolutionPageLinks(
  solution: Solution, 
  category: Category, 
  baseUrl: string
): InternalLink[] {
  const links: InternalLink[] = [];
  
  // Link back to category
  links.push({
    url: `${baseUrl}/solutions/${category.slug}`,
    anchor: `${category.title} solutions`,
    title: `Explore all ${category.title.toLowerCase()} options`,
    context: 'navigational',
    priority: 'high',
    pageType: 'category',
    relationshipType: 'parent',
    keywords: [category.title.toLowerCase(), 'solutions']
  });
  
  // Links to sibling solutions in same category
  const siblingSolutions = category.solutions
    .filter(s => s.slug !== solution.slug)
    .sort((a, b) => a.flags.priority - b.flags.priority)
    .slice(0, 3);
    
  siblingSolutions.forEach(sibling => {
    const anchorText = sibling.flags.popular 
      ? `Popular: ${sibling.title}`
      : sibling.title;
      
    links.push({
      url: `${baseUrl}/solutions/${category.slug}/${sibling.slug}`,
      anchor: anchorText,
      title: sibling.summary,
      context: 'related',
      priority: sibling.flags.featured ? 'high' : 'medium',
      pageType: 'solution',
      relationshipType: 'sibling',
      keywords: sibling.tags.map(tag => tag.toLowerCase())
    });
  });
  
  // Links to complementary solutions from other categories
  const complementarySolutions = findComplementarySolutions(solution, category);
  complementarySolutions.slice(0, 2).forEach(({ solution: compSolution, category: compCategory }) => {
    links.push({
      url: `${baseUrl}/solutions/${compCategory.slug}/${compSolution.slug}`,
      anchor: `${compSolution.title} integration`,
      title: `Enhance ${solution.title} with ${compSolution.title}`,
      context: 'contextual',
      priority: 'medium',
      pageType: 'solution',
      relationshipType: 'related',
      keywords: ['integration', ...compSolution.tags.map(tag => tag.toLowerCase())]
    });
  });
  
  // Industry-specific recommendations
  solution.metrics.industryFit.slice(0, 2).forEach(industry => {
    links.push({
      url: `${baseUrl}/solutions/${industry}-ai`,
      anchor: `${industry.charAt(0).toUpperCase() + industry.slice(1)} AI solutions`,
      title: `AI solutions designed specifically for ${industry}`,
      context: 'contextual',
      priority: 'low',
      pageType: 'content',
      relationshipType: 'related',
      keywords: [industry, 'AI', 'solutions']
    });
  });
  
  return links;
}

/**
 * Generate promotional links for key services
 */
function generatePromotionalLinks(baseUrl: string, currentPageUrl: string): InternalLink[] {
  const links: InternalLink[] = [];
  
  // Key service pages to promote
  const keyServices = [
    {
      url: '/contact',
      anchor: 'Book AI Opportunity Scan',
      title: 'Free 30-minute AI assessment and strategy session',
      keywords: ['AI assessment', 'opportunity scan', 'consultation']
    },
    {
      url: '/services/fractional-cao',
      anchor: 'Fractional CAO services',
      title: 'Executive-level AI leadership without full-time commitment',
      keywords: ['fractional CAO', 'AI leadership', 'executive']
    },
    {
      url: '/services/5-day-poc',
      anchor: '5-day AI proof of concept',
      title: 'Rapid AI validation with guaranteed ROI metrics',
      keywords: ['POC', 'proof of concept', 'AI validation']
    }
  ];
  
  keyServices.forEach(service => {
    if (!currentPageUrl.includes(service.url)) {
      links.push({
        url: `${baseUrl}${service.url}`,
        anchor: service.anchor,
        title: service.title,
        context: 'promotional',
        priority: 'high',
        pageType: 'service',
        relationshipType: 'related',
        keywords: service.keywords
      });
    }
  });
  
  return links;
}

// ============================================================================
// INTELLIGENT LINKING ALGORITHMS
// ============================================================================

/**
 * Find related categories based on solution overlap and tags
 */
function findRelatedCategories(category: Category): Category[] {
  const currentTags = category.solutions.flatMap(s => s.tags);
  
  return CATEGORIES
    .filter(cat => cat.slug !== category.slug)
    .map(cat => ({
      category: cat,
      relevanceScore: calculateCategoryRelevance(currentTags, cat)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 2)
    .map(item => item.category);
}

/**
 * Calculate relevance score between categories
 */
function calculateCategoryRelevance(sourceTags: string[], targetCategory: Category): number {
  const targetTags = targetCategory.solutions.flatMap(s => s.tags);
  const commonTags = sourceTags.filter(tag => 
    targetTags.some(targetTag => 
      targetTag.toLowerCase() === tag.toLowerCase()
    )
  );
  
  // Base relevance on tag overlap
  let score = commonTags.length * 10;
  
  // Boost score for enterprise vs non-enterprise categories
  const enterpriseBonus = targetCategory.solutions.some(s => s.flags.enterprise) ? 5 : 0;
  
  return score + enterpriseBonus;
}

/**
 * Find complementary solutions from other categories
 */
function findComplementarySolutions(
  solution: Solution, 
  category: Category
): Array<{solution: Solution; category: Category}> {
  const complementary: Array<{solution: Solution; category: Category; score: number}> = [];
  
  CATEGORIES
    .filter(cat => cat.slug !== category.slug)
    .forEach(cat => {
      cat.solutions.forEach(otherSolution => {
        const score = calculateSolutionComplementarity(solution, otherSolution);
        if (score > 0) {
          complementary.push({ solution: otherSolution, category: cat, score });
        }
      });
    });
  
  return complementary
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => ({ solution: item.solution, category: item.category }));
}

/**
 * Calculate how well two solutions complement each other
 */
function calculateSolutionComplementarity(solution1: Solution, solution2: Solution): number {
  let score = 0;
  
  // Industry fit overlap
  const industryOverlap = solution1.metrics.industryFit.filter(industry =>
    solution2.metrics.industryFit.includes(industry)
  ).length;
  score += industryOverlap * 15;
  
  // Implementation timeline compatibility
  const timingCompatibility = Math.abs(
    solution1.metrics.implementationWeeks - solution2.metrics.implementationWeeks
  ) <= 2 ? 10 : 0;
  score += timingCompatibility;
  
  // Complexity compatibility
  const complexityMatch = solution1.metrics.complexity === solution2.metrics.complexity ? 5 : 0;
  score += complexityMatch;
  
  // Tag similarity bonus
  const tagOverlap = solution1.tags.filter(tag => 
    solution2.tags.some(tag2 => tag2.toLowerCase().includes(tag.toLowerCase()))
  ).length;
  score += tagOverlap * 3;
  
  return score;
}

/**
 * Find cross-category solutions based on tags and industry fit
 */
function findCrossCategorySolutions(category: Category): Array<{solution: Solution; sourceCategory: Category}> {
  const crossCategory: Array<{solution: Solution; sourceCategory: Category; relevance: number}> = [];
  const categoryTags = category.solutions.flatMap(s => s.tags);
  const categoryIndustries = [...new Set(category.solutions.flatMap(s => s.metrics.industryFit))];
  
  CATEGORIES
    .filter(cat => cat.slug !== category.slug)
    .forEach(otherCategory => {
      otherCategory.solutions
        .filter(s => s.flags.featured || s.flags.popular)
        .forEach(solution => {
          const relevance = calculateCrossCategoryRelevance(
            categoryTags,
            categoryIndustries,
            solution
          );
          
          if (relevance > 20) {
            crossCategory.push({ solution, sourceCategory: otherCategory, relevance });
          }
        });
    });
  
  return crossCategory
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 2);
}

/**
 * Calculate cross-category relevance
 */
function calculateCrossCategoryRelevance(
  sourceTags: string[],
  sourceIndustries: string[],
  targetSolution: Solution
): number {
  let relevance = 0;
  
  // Tag overlap
  const tagMatches = sourceTags.filter(tag =>
    targetSolution.tags.some(targetTag => 
      targetTag.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(targetTag.toLowerCase())
    )
  ).length;
  relevance += tagMatches * 8;
  
  // Industry overlap
  const industryMatches = sourceIndustries.filter(industry =>
    targetSolution.metrics.industryFit.includes(industry)
  ).length;
  relevance += industryMatches * 12;
  
  // Priority boost for featured/popular solutions
  if (targetSolution.flags.featured) relevance += 10;
  if (targetSolution.flags.popular) relevance += 5;
  if (targetSolution.flags.enterprise) relevance += 5;
  
  return relevance;
}

// ============================================================================
// ANCHOR TEXT OPTIMIZATION
// ============================================================================

/**
 * Generate optimized anchor text with variations
 */
export function generateOptimizedAnchorText(
  targetUrl: string,
  targetTitle: string,
  context: 'contextual' | 'navigational' | 'promotional' | 'related',
  keywords: string[]
): string {
  const variations: Record<typeof context, (title: string, keywords: string[]) => string[]> = {
    contextual: (title, kw) => [
      title,
      `${title} solution`,
      `AI-powered ${title.toLowerCase()}`,
      `Enterprise ${title.toLowerCase()}`
    ],
    navigational: (title, kw) => [
      title,
      `${title} overview`,
      `All ${title.toLowerCase()}`,
      `Browse ${title.toLowerCase()}`
    ],
    promotional: (title, kw) => [
      title,
      `Get ${title.toLowerCase()}`,
      `Learn about ${title.toLowerCase()}`,
      `Explore ${title.toLowerCase()}`
    ],
    related: (title, kw) => [
      title,
      `Related: ${title}`,
      `See also: ${title}`,
      `${title} integration`
    ]
  };
  
  const options = variations[context](targetTitle, keywords);
  
  // Return a variation based on URL hash for consistency
  const urlHash = targetUrl.split('').reduce((hash, char) => 
    ((hash << 5) - hash) + char.charCodeAt(0), 0
  );
  
  return options[Math.abs(urlHash) % options.length];
}

/**
 * Validate anchor text diversity to avoid over-optimization
 */
export function validateAnchorTextDiversity(links: InternalLink[]): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const anchorCounts = links.reduce((acc, link) => {
    acc[link.anchor] = (acc[link.anchor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check for over-optimization
  Object.entries(anchorCounts).forEach(([anchor, count]) => {
    if (count > 3) {
      issues.push(`Anchor text "${anchor}" used ${count} times - risk of over-optimization`);
      suggestions.push(`Vary anchor text for "${anchor}" with synonyms or longer phrases`);
    }
  });
  
  // Check for exact match overuse
  const exactMatchCount = links.filter(link => 
    link.keywords.some(keyword => 
      link.anchor.toLowerCase() === keyword.toLowerCase()
    )
  ).length;
  
  if (exactMatchCount > links.length * 0.3) {
    issues.push('Too many exact match anchors detected');
    suggestions.push('Use more natural, varied anchor text patterns');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export default {
  INTERNAL_LINKING_STRATEGY,
  generateContextualLinks,
  generateOptimizedAnchorText,
  validateAnchorTextDiversity,
  findRelatedCategories,
  findComplementarySolutions
};
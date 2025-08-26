/**
 * Master SEO Configuration
 * 
 * Central configuration file that orchestrates all SEO optimization
 * utilities for maximum search engine visibility and ranking performance.
 */

import type { Solution, Category } from '@/types/solutions';
import { CATEGORIES } from '@/content/solutions';

// Import all SEO utilities
import { generateComprehensiveMeta, TARGET_KEYWORDS } from './programmatic-seo';
import { generateAdvancedMetaTags, DEFAULT_META_CONFIG } from './meta-generation';
import { generateContextualLinks, INTERNAL_LINKING_STRATEGY } from './internal-linking-strategy';
import { generateAllSitemaps, DEFAULT_SITEMAP_CONFIG } from './sitemap-generator';
import { 
  generateSolutionServiceSchema, 
  generateCategoryCollectionSchema,
  generateSolutionFAQSchema,
  TIER4_ORGANIZATION_SCHEMA 
} from './structured-data';
import { 
  generatePerformanceResourceHints,
  generateCriticalCSS,
  WEB_VITALS_THRESHOLDS 
} from './performance-optimization';

// ============================================================================
// MASTER SEO CONFIGURATION
// ============================================================================

export interface SEOMasterConfig {
  // Global settings
  baseUrl: string;
  siteName: string;
  defaultLanguage: string;
  
  // Target keywords and rankings
  targetKeywords: {
    primary: string[];
    geographic: string[];
    longtail: string[];
    competitive: string[];
  };
  
  // Performance thresholds
  performanceTargets: {
    lcp: number;    // Largest Contentful Paint (ms)
    fid: number;    // First Input Delay (ms) 
    cls: number;    // Cumulative Layout Shift
    ttfb: number;   // Time to First Byte (ms)
  };
  
  // Content optimization
  contentOptimization: {
    titleLength: { min: number; max: number };
    descriptionLength: { min: number; max: number };
    keywordDensity: { min: number; max: number };
    readabilityScore: number;
  };
  
  // Technical SEO
  technicalSEO: {
    enableStructuredData: boolean;
    enableInternalLinking: boolean;
    enablePerformanceOptimization: boolean;
    enableSitemapGeneration: boolean;
    maxUrlsPerSitemap: number;
    canonicalizeUrls: boolean;
  };
  
  // Analytics and tracking
  analytics: {
    trackCoreWebVitals: boolean;
    trackUserEngagement: boolean;
    trackConversions: boolean;
    reportingInterval: number; // minutes
  };
}

export const MASTER_SEO_CONFIG: SEOMasterConfig = {
  baseUrl: 'https://tier4intelligence.com',
  siteName: 'Tier 4 Intelligence',
  defaultLanguage: 'en-US',
  
  targetKeywords: {
    primary: [
      'AI consulting services',
      'enterprise automation solutions',
      'AI implementation consulting',
      'business process automation'
    ],
    geographic: [
      'AI consulting San Francisco',
      'Bay Area AI consultants', 
      'San Francisco automation services',
      'Silicon Valley AI experts'
    ],
    longtail: [
      '5-day AI proof of concept',
      'AI ROI validation services',
      'vendor neutral AI consulting',
      'fractional chief automation officer',
      'rapid AI implementation'
    ],
    competitive: [
      'AI consulting vs automation',
      'enterprise AI strategy',
      'AI transformation roadmap',
      'business AI adoption'
    ]
  },
  
  performanceTargets: {
    lcp: 2000,      // Target < 2s for excellent LCP
    fid: 50,        // Target < 50ms for excellent FID
    cls: 0.05,      // Target < 0.05 for excellent CLS
    ttfb: 500       // Target < 500ms for excellent TTFB
  },
  
  contentOptimization: {
    titleLength: { min: 30, max: 60 },
    descriptionLength: { min: 120, max: 160 },
    keywordDensity: { min: 1, max: 3 },
    readabilityScore: 70 // Target Flesch Reading Ease
  },
  
  technicalSEO: {
    enableStructuredData: true,
    enableInternalLinking: true, 
    enablePerformanceOptimization: true,
    enableSitemapGeneration: true,
    maxUrlsPerSitemap: 10000,
    canonicalizeUrls: true
  },
  
  analytics: {
    trackCoreWebVitals: true,
    trackUserEngagement: true,
    trackConversions: true,
    reportingInterval: 30
  }
};

// ============================================================================
// SEO PAGE OPTIMIZATION ORCHESTRATOR
// ============================================================================

export interface PageSEOResult {
  metadata: any;
  structuredData: any[];
  internalLinks: any[];
  performanceHints: string[];
  criticalCSS: string;
  recommendations: string[];
  score: number;
}

/**
 * Generate complete SEO optimization for any page
 */
export async function generatePageSEO(
  pageType: 'landing' | 'category' | 'solution' | 'content',
  data: {
    url: string;
    category?: Category;
    solution?: Solution;
    customTitle?: string;
    customDescription?: string;
  },
  config: Partial<SEOMasterConfig> = {}
): Promise<PageSEOResult> {
  const finalConfig = { ...MASTER_SEO_CONFIG, ...config };
  const recommendations: string[] = [];
  
  // 1. Generate comprehensive metadata
  const metadata = generateComprehensiveMeta(pageType, {
    category: data.category,
    solution: data.solution,
    customTitle: data.customTitle,
    customDescription: data.customDescription
  });
  
  // 2. Generate structured data
  const structuredData: any[] = [TIER4_ORGANIZATION_SCHEMA];
  
  if (finalConfig.technicalSEO.enableStructuredData) {
    switch (pageType) {
      case 'landing':
        // Add solutions item list schema
        break;
      case 'category':
        if (data.category) {
          structuredData.push(generateCategoryCollectionSchema(data.category));
        }
        break;
      case 'solution':
        if (data.solution && data.category) {
          structuredData.push(generateSolutionServiceSchema(data.solution, data.category));
          structuredData.push(generateSolutionFAQSchema(data.solution, data.category));
        }
        break;
    }
  }
  
  // 3. Generate internal links
  let internalLinks: any[] = [];
  if (finalConfig.technicalSEO.enableInternalLinking) {
    internalLinks = generateContextualLinks(
      data.url,
      pageType,
      data.category,
      data.solution
    );
  }
  
  // 4. Generate performance hints
  let performanceHints: string[] = [];
  if (finalConfig.technicalSEO.enablePerformanceOptimization) {
    performanceHints = generatePerformanceResourceHints();
  }
  
  // 5. Generate critical CSS
  const criticalCSS = generateCriticalCSS();
  
  // 6. Validate and provide recommendations
  if (metadata.title && metadata.title.length > finalConfig.contentOptimization.titleLength.max) {
    recommendations.push(`Title too long: ${metadata.title.length} chars (max: ${finalConfig.contentOptimization.titleLength.max})`);
  }
  
  if (metadata.description && metadata.description.length > finalConfig.contentOptimization.descriptionLength.max) {
    recommendations.push(`Description too long: ${metadata.description.length} chars (max: ${finalConfig.contentOptimization.descriptionLength.max})`);
  }
  
  if (internalLinks.length < 3) {
    recommendations.push('Consider adding more contextual internal links for better SEO authority distribution');
  }
  
  // Calculate SEO score
  const score = calculateSEOScore(metadata, structuredData, internalLinks, recommendations);
  
  return {
    metadata,
    structuredData,
    internalLinks,
    performanceHints,
    criticalCSS,
    recommendations,
    score
  };
}

/**
 * Calculate SEO optimization score (0-100)
 */
function calculateSEOScore(
  metadata: any,
  structuredData: any[],
  internalLinks: any[],
  recommendations: string[]
): number {
  let score = 0;
  
  // Title optimization (20 points)
  if (metadata.title) {
    if (metadata.title.length >= 30 && metadata.title.length <= 60) {
      score += 20;
    } else if (metadata.title.length <= 70) {
      score += 15;
    } else {
      score += 5;
    }
  }
  
  // Description optimization (20 points)
  if (metadata.description) {
    if (metadata.description.length >= 120 && metadata.description.length <= 160) {
      score += 20;
    } else if (metadata.description.length <= 180) {
      score += 15;
    } else {
      score += 5;
    }
  }
  
  // Keywords optimization (15 points)
  if (metadata.keywords && metadata.keywords.length >= 5) {
    score += 15;
  } else if (metadata.keywords && metadata.keywords.length >= 3) {
    score += 10;
  }
  
  // Structured data (15 points)
  if (structuredData.length >= 2) {
    score += 15;
  } else if (structuredData.length >= 1) {
    score += 10;
  }
  
  // Internal linking (15 points)
  if (internalLinks.length >= 5) {
    score += 15;
  } else if (internalLinks.length >= 3) {
    score += 10;
  } else if (internalLinks.length >= 1) {
    score += 5;
  }
  
  // Open Graph optimization (10 points)
  if (metadata.ogTitle && metadata.ogDescription && metadata.ogImage) {
    score += 10;
  } else if (metadata.ogTitle && metadata.ogDescription) {
    score += 7;
  }
  
  // Canonical URL (5 points)
  if (metadata.canonical) {
    score += 5;
  }
  
  // Deduct points for issues
  score -= recommendations.length * 2;
  
  return Math.max(0, Math.min(100, score));
}

// ============================================================================
// BULK SEO OPTIMIZATION
// ============================================================================

/**
 * Generate SEO optimization for all solution pages
 */
export async function generateBulkSEO(): Promise<{
  landing: PageSEOResult;
  categories: Record<string, PageSEOResult>;
  solutions: Record<string, PageSEOResult>;
  sitemaps: any;
  summary: {
    totalPages: number;
    averageScore: number;
    recommendations: string[];
  };
}> {
  const results = {
    landing: {} as PageSEOResult,
    categories: {} as Record<string, PageSEOResult>,
    solutions: {} as Record<string, PageSEOResult>,
    sitemaps: {},
    summary: {
      totalPages: 0,
      averageScore: 0,
      recommendations: [] as string[]
    }
  };
  
  const allScores: number[] = [];
  const allRecommendations: string[] = [];
  
  // Generate landing page SEO
  results.landing = await generatePageSEO('landing', {
    url: `${MASTER_SEO_CONFIG.baseUrl}/solutions`
  });
  allScores.push(results.landing.score);
  allRecommendations.push(...results.landing.recommendations);
  
  // Generate category pages SEO
  for (const category of CATEGORIES) {
    results.categories[category.slug] = await generatePageSEO('category', {
      url: `${MASTER_SEO_CONFIG.baseUrl}/solutions/${category.slug}`,
      category
    });
    allScores.push(results.categories[category.slug].score);
    allRecommendations.push(...results.categories[category.slug].recommendations);
    
    // Generate solution pages SEO
    for (const solution of category.solutions) {
      const key = `${category.slug}/${solution.slug}`;
      results.solutions[key] = await generatePageSEO('solution', {
        url: `${MASTER_SEO_CONFIG.baseUrl}/solutions/${category.slug}/${solution.slug}`,
        category,
        solution
      });
      allScores.push(results.solutions[key].score);
      allRecommendations.push(...results.solutions[key].recommendations);
    }
  }
  
  // Generate sitemaps
  if (MASTER_SEO_CONFIG.technicalSEO.enableSitemapGeneration) {
    results.sitemaps = await generateAllSitemaps(DEFAULT_SITEMAP_CONFIG);
  }
  
  // Calculate summary
  results.summary.totalPages = allScores.length;
  results.summary.averageScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
  results.summary.recommendations = [...new Set(allRecommendations)].slice(0, 10);
  
  return results;
}

// ============================================================================
// SEO MONITORING & REPORTING
// ============================================================================

export interface SEOReport {
  timestamp: string;
  pageUrl: string;
  metrics: {
    seoScore: number;
    titleLength: number;
    descriptionLength: number;
    keywordCount: number;
    internalLinksCount: number;
    structuredDataCount: number;
  };
  coreWebVitals: {
    lcp?: number;
    fid?: number;
    cls?: number;
  };
  recommendations: string[];
  competitorAnalysis?: {
    averageScore: number;
    gapAnalysis: string[];
  };
}

/**
 * Generate comprehensive SEO report for a page
 */
export async function generateSEOReport(
  pageUrl: string,
  pageType: 'landing' | 'category' | 'solution',
  data: {
    category?: Category;
    solution?: Solution;
  } = {}
): Promise<SEOReport> {
  const seoResult = await generatePageSEO(pageType, {
    url: pageUrl,
    ...data
  });
  
  return {
    timestamp: new Date().toISOString(),
    pageUrl,
    metrics: {
      seoScore: seoResult.score,
      titleLength: seoResult.metadata.title?.length || 0,
      descriptionLength: seoResult.metadata.description?.length || 0,
      keywordCount: seoResult.metadata.keywords?.length || 0,
      internalLinksCount: seoResult.internalLinks.length,
      structuredDataCount: seoResult.structuredData.length
    },
    coreWebVitals: {
      // These would be populated by actual performance monitoring
      lcp: undefined,
      fid: undefined,
      cls: undefined
    },
    recommendations: seoResult.recommendations,
    competitorAnalysis: {
      averageScore: 75, // This would come from competitive analysis
      gapAnalysis: [
        'Improve page loading speed to match competitors',
        'Add more industry-specific long-tail keywords',
        'Increase internal linking depth'
      ]
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  MASTER_SEO_CONFIG,
  generatePageSEO,
  generateBulkSEO,
  generateSEOReport,
  calculateSEOScore
};
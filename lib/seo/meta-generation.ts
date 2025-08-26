/**
 * Advanced Meta Tag Generation System
 * 
 * Generates optimized HTML meta tags for maximum SEO impact including
 * Open Graph, Twitter Cards, rich snippets, and performance hints.
 */

import type { SEOMetadata } from '@/types/solutions';

// ============================================================================
// META TAG CONFIGURATION
// ============================================================================

export interface MetaTagConfig {
  // Basic SEO
  includeBasicSEO: boolean;
  
  // Social sharing
  includeOpenGraph: boolean;
  includeTwitterCards: boolean;
  
  // Performance
  includePerformanceHints: boolean;
  includeCriticalResourceHints: boolean;
  
  // Rich snippets
  includeStructuredData: boolean;
  
  // Additional features
  includeCanonical: boolean;
  includeHreflang: boolean;
  includeRobots: boolean;
  
  // Custom properties
  customProperties?: Record<string, string>;
}

export const DEFAULT_META_CONFIG: MetaTagConfig = {
  includeBasicSEO: true,
  includeOpenGraph: true,
  includeTwitterCards: true,
  includePerformanceHints: true,
  includeCriticalResourceHints: true,
  includeStructuredData: true,
  includeCanonical: true,
  includeHreflang: false,
  includeRobots: true
};

// ============================================================================
// CORE META TAG GENERATION
// ============================================================================

/**
 * Generate complete HTML meta tags for optimal SEO
 */
export function generateAdvancedMetaTags(
  metadata: SEOMetadata,
  config: Partial<MetaTagConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_META_CONFIG, ...config };
  const tags: string[] = [];
  
  // Basic SEO meta tags
  if (finalConfig.includeBasicSEO) {
    tags.push(...generateBasicSEOTags(metadata));
  }
  
  // Open Graph meta tags
  if (finalConfig.includeOpenGraph) {
    tags.push(...generateOpenGraphTags(metadata));
  }
  
  // Twitter Card meta tags
  if (finalConfig.includeTwitterCards) {
    tags.push(...generateTwitterCardTags(metadata));
  }
  
  // Performance and resource hints
  if (finalConfig.includePerformanceHints) {
    tags.push(...generatePerformanceHints());
  }
  
  // Critical resource hints
  if (finalConfig.includeCriticalResourceHints) {
    tags.push(...generateCriticalResourceHints());
  }
  
  // Canonical URL
  if (finalConfig.includeCanonical && metadata.canonical) {
    tags.push(`<link rel="canonical" href="${metadata.canonical}" />`);
  }
  
  // Robots meta
  if (finalConfig.includeRobots) {
    tags.push(...generateRobotsTags(metadata));
  }
  
  // Structured data
  if (finalConfig.includeStructuredData && metadata.structuredData) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(metadata.structuredData, null, 0)}</script>`);
  }
  
  // Custom properties
  if (finalConfig.customProperties) {
    tags.push(...generateCustomMetaTags(finalConfig.customProperties));
  }
  
  return tags.join('\n');
}

/**
 * Generate basic SEO meta tags
 */
function generateBasicSEOTags(metadata: SEOMetadata): string[] {
  const tags: string[] = [];
  
  // Title
  if (metadata.title) {
    tags.push(`<title>${escapeHTML(metadata.title)}</title>`);
  }
  
  // Description
  if (metadata.description) {
    tags.push(`<meta name="description" content="${escapeHTML(metadata.description)}" />`);
  }
  
  // Keywords (still useful for internal search and categorization)
  if (metadata.keywords && metadata.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${metadata.keywords.map(k => escapeHTML(k)).join(', ')}" />`);
  }
  
  // Author and publisher
  tags.push(`<meta name="author" content="Tier 4 Intelligence" />`);
  tags.push(`<meta name="publisher" content="Tier 4 Intelligence" />`);
  
  // Language
  tags.push(`<meta name="language" content="en-US" />`);
  
  // Copyright
  tags.push(`<meta name="copyright" content="© ${new Date().getFullYear()} Tier 4 Intelligence. All rights reserved." />`);
  
  return tags;
}

/**
 * Generate Open Graph meta tags for social sharing
 */
function generateOpenGraphTags(metadata: SEOMetadata): string[] {
  const tags: string[] = [];
  
  // Basic Open Graph
  tags.push(`<meta property="og:type" content="website" />`);
  tags.push(`<meta property="og:site_name" content="Tier 4 Intelligence" />`);
  tags.push(`<meta property="og:locale" content="en_US" />`);
  
  // Title and description
  if (metadata.ogTitle || metadata.title) {
    tags.push(`<meta property="og:title" content="${escapeHTML(metadata.ogTitle || metadata.title)}" />`);
  }
  
  if (metadata.ogDescription || metadata.description) {
    tags.push(`<meta property="og:description" content="${escapeHTML(metadata.ogDescription || metadata.description)}" />`);
  }
  
  // URL
  if (metadata.canonical) {
    tags.push(`<meta property="og:url" content="${metadata.canonical}" />`);
  }
  
  // Image
  if (metadata.ogImage) {
    tags.push(`<meta property="og:image" content="${metadata.ogImage}" />`);
    tags.push(`<meta property="og:image:width" content="1200" />`);
    tags.push(`<meta property="og:image:height" content="630" />`);
    tags.push(`<meta property="og:image:alt" content="${escapeHTML(metadata.title || 'Tier 4 Intelligence')}" />`);
    tags.push(`<meta property="og:image:type" content="image/jpeg" />`);
  }
  
  // Business-specific Open Graph
  tags.push(`<meta property="business:contact_data:locality" content="San Francisco" />`);
  tags.push(`<meta property="business:contact_data:region" content="CA" />`);
  tags.push(`<meta property="business:contact_data:country_name" content="USA" />`);
  
  return tags;
}

/**
 * Generate Twitter Card meta tags
 */
function generateTwitterCardTags(metadata: SEOMetadata): string[] {
  const tags: string[] = [];
  
  // Twitter Card type
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  tags.push(`<meta name="twitter:site" content="@Tier4Intel" />`);
  tags.push(`<meta name="twitter:creator" content="@Tier4Intel" />`);
  
  // Title and description
  if (metadata.ogTitle || metadata.title) {
    tags.push(`<meta name="twitter:title" content="${escapeHTML(metadata.ogTitle || metadata.title)}" />`);
  }
  
  if (metadata.ogDescription || metadata.description) {
    tags.push(`<meta name="twitter:description" content="${escapeHTML(metadata.ogDescription || metadata.description)}" />`);
  }
  
  // Image
  if (metadata.ogImage) {
    tags.push(`<meta name="twitter:image" content="${metadata.ogImage}" />`);
    tags.push(`<meta name="twitter:image:alt" content="${escapeHTML(metadata.title || 'Tier 4 Intelligence')}" />`);
  }
  
  return tags;
}

/**
 * Generate performance optimization hints
 */
function generatePerformanceHints(): string[] {
  const tags: string[] = [];
  
  // DNS prefetch for external resources
  tags.push(`<link rel="dns-prefetch" href="//fonts.googleapis.com" />`);
  tags.push(`<link rel="dns-prefetch" href="//www.googletagmanager.com" />`);
  tags.push(`<link rel="dns-prefetch" href="//www.google-analytics.com" />`);
  
  // Preconnect for critical resources
  tags.push(`<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />`);
  tags.push(`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`);
  
  // Preload critical resources
  tags.push(`<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />`);
  
  return tags;
}

/**
 * Generate critical resource hints for better Core Web Vitals
 */
function generateCriticalResourceHints(): string[] {
  const tags: string[] = [];
  
  // Preload critical images
  tags.push(`<link rel="preload" href="/images/tier4-logo-horizontal.png" as="image" />`);
  tags.push(`<link rel="preload" href="/images/optimized/tier4-hero-640w.webp" as="image" media="(max-width: 768px)" />`);
  tags.push(`<link rel="preload" href="/images/optimized/tier4-hero-1024w.webp" as="image" media="(min-width: 769px)" />`);
  
  // Module preload for critical JavaScript
  tags.push(`<link rel="modulepreload" href="/_next/static/chunks/main.js" />`);
  
  // Prefetch likely next pages
  tags.push(`<link rel="prefetch" href="/contact" />`);
  tags.push(`<link rel="prefetch" href="/solutions/customer-self-service" />`);
  
  return tags;
}

/**
 * Generate robots and crawling directives
 */
function generateRobotsTags(metadata: SEOMetadata): string[] {
  const tags: string[] = [];
  
  // Default robots directive
  tags.push(`<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`);
  
  // Google-specific directives
  tags.push(`<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`);
  
  // Bing-specific directives
  tags.push(`<meta name="bingbot" content="index, follow" />`);
  
  return tags;
}

/**
 * Generate custom meta tags
 */
function generateCustomMetaTags(customProperties: Record<string, string>): string[] {
  const tags: string[] = [];
  
  Object.entries(customProperties).forEach(([key, value]) => {
    tags.push(`<meta name="${escapeHTML(key)}" content="${escapeHTML(value)}" />`);
  });
  
  return tags;
}

// ============================================================================
// SPECIALIZED META GENERATORS
// ============================================================================

/**
 * Generate meta tags specifically optimized for featured snippets
 */
export function generateFeaturedSnippetTags(
  question: string,
  answer: string,
  metadata: SEOMetadata
): string {
  const snippetSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    }
  };
  
  return `<script type="application/ld+json">${JSON.stringify(snippetSchema, null, 0)}</script>`;
}

/**
 * Generate meta tags for local SEO optimization
 */
export function generateLocalSEOTags(
  businessName: string = "Tier 4 Intelligence",
  location: string = "San Francisco, CA"
): string[] {
  const tags: string[] = [];
  
  tags.push(`<meta name="geo.region" content="US-CA" />`);
  tags.push(`<meta name="geo.placename" content="San Francisco" />`);
  tags.push(`<meta name="geo.position" content="37.7749;-122.4194" />`);
  tags.push(`<meta name="ICBM" content="37.7749, -122.4194" />`);
  
  // Local business schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": businessName,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "areaServed": {
      "@type": "Place",
      "name": "San Francisco Bay Area"
    }
  };
  
  tags.push(`<script type="application/ld+json">${JSON.stringify(localBusinessSchema, null, 0)}</script>`);
  
  return tags;
}

/**
 * Generate meta tags for article/blog content
 */
export function generateArticleTags(
  title: string,
  description: string,
  author: string = "Tier 4 Intelligence",
  publishDate: string,
  modifiedDate?: string
): string[] {
  const tags: string[] = [];
  
  tags.push(`<meta property="article:author" content="${escapeHTML(author)}" />`);
  tags.push(`<meta property="article:published_time" content="${publishDate}" />`);
  
  if (modifiedDate) {
    tags.push(`<meta property="article:modified_time" content="${modifiedDate}" />`);
  }
  
  tags.push(`<meta property="article:section" content="AI Solutions" />`);
  tags.push(`<meta property="article:tag" content="AI, Automation, Enterprise Solutions" />`);
  
  return tags;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML characters in meta tag content
 */
function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate meta tag content lengths
 */
export function validateMetaContent(metadata: SEOMetadata): Array<{field: string; issue: string; recommendation?: string}> {
  const issues: Array<{field: string; issue: string; recommendation?: string}> = [];
  
  // Title validation
  if (metadata.title) {
    if (metadata.title.length < 30) {
      issues.push({
        field: 'title',
        issue: 'Title is too short',
        recommendation: 'Titles should be 30-60 characters for optimal SEO'
      });
    } else if (metadata.title.length > 60) {
      issues.push({
        field: 'title',
        issue: 'Title is too long',
        recommendation: 'Titles over 60 characters may be truncated in search results'
      });
    }
  }
  
  // Description validation
  if (metadata.description) {
    if (metadata.description.length < 120) {
      issues.push({
        field: 'description',
        issue: 'Description is too short',
        recommendation: 'Descriptions should be 120-160 characters for best results'
      });
    } else if (metadata.description.length > 160) {
      issues.push({
        field: 'description',
        issue: 'Description is too long',
        recommendation: 'Descriptions over 160 characters may be truncated'
      });
    }
  }
  
  // Keywords validation
  if (metadata.keywords && metadata.keywords.length > 10) {
    issues.push({
      field: 'keywords',
      issue: 'Too many keywords',
      recommendation: 'Focus on 5-10 most relevant keywords'
    });
  }
  
  return issues;
}

/**
 * Generate meta tag preview for testing
 */
export function generateMetaPreview(metadata: SEOMetadata) {
  return {
    title: metadata.title,
    description: metadata.description,
    url: metadata.canonical,
    previewLength: {
      title: metadata.title?.length || 0,
      description: metadata.description?.length || 0
    },
    validation: validateMetaContent(metadata)
  };
}

export default {
  generateAdvancedMetaTags,
  generateFeaturedSnippetTags,
  generateLocalSEOTags,
  generateArticleTags,
  validateMetaContent,
  generateMetaPreview,
  DEFAULT_META_CONFIG
};
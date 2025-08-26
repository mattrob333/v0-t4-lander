/**
 * Comprehensive Sitemap Generation System
 * 
 * Generates XML sitemaps for all solution pages, categories, and related content
 * with proper priority, change frequency, and last modification dates.
 */

import type { Solution, Category } from '@/types/solutions';
import { CATEGORIES, FEATURED_PRODUCTS } from '@/content/solutions';

// ============================================================================
// SITEMAP CONFIGURATION
// ============================================================================

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  images?: Array<{
    url: string;
    caption?: string;
    title?: string;
    geoLocation?: string;
  }>;
  alternateLanguages?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export interface SitemapConfig {
  baseUrl: string;
  includeImages: boolean;
  includeAlternateLanguages: boolean;
  maxUrlsPerSitemap: number;
  enableImageSitemaps: boolean;
  enableVideoSitemaps: boolean;
}

export const DEFAULT_SITEMAP_CONFIG: SitemapConfig = {
  baseUrl: 'https://tier4intelligence.com',
  includeImages: true,
  includeAlternateLanguages: false,
  maxUrlsPerSitemap: 50000,
  enableImageSitemaps: true,
  enableVideoSitemaps: false
};

// ============================================================================
// CORE SITEMAP GENERATION
// ============================================================================

/**
 * Generate sitemap entries for all solution-related pages
 */
export function generateSolutionsSitemap(config: Partial<SitemapConfig> = {}): SitemapEntry[] {
  const finalConfig = { ...DEFAULT_SITEMAP_CONFIG, ...config };
  const entries: SitemapEntry[] = [];
  const currentDate = new Date().toISOString();
  
  // Solutions landing page
  entries.push({
    url: `${finalConfig.baseUrl}/solutions`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.9,
    images: finalConfig.includeImages ? [
      {
        url: `${finalConfig.baseUrl}/images/solutions-hero.jpg`,
        caption: 'AI Solutions Overview',
        title: 'Comprehensive AI Solutions for Business Transformation'
      }
    ] : undefined
  });

  // Category pages
  CATEGORIES.forEach(category => {
    entries.push({
      url: `${finalConfig.baseUrl}/solutions/${category.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
      images: finalConfig.includeImages ? [
        {
          url: `${finalConfig.baseUrl}/images/categories/${category.slug}.jpg`,
          caption: `${category.title} Solutions`,
          title: category.tagline
        }
      ] : undefined
    });

    // Individual solution pages (future implementation)
    category.solutions.forEach(solution => {
      const priority = solution.flags.featured ? 0.7 : solution.flags.popular ? 0.6 : 0.5;
      
      entries.push({
        url: `${finalConfig.baseUrl}/solutions/${category.slug}/${solution.slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: priority,
        images: finalConfig.includeImages ? [
          {
            url: `${finalConfig.baseUrl}/images/solutions/${solution.slug}.jpg`,
            caption: solution.title,
            title: solution.summary
          },
          {
            url: `${finalConfig.baseUrl}/images/solutions/${solution.slug}-process.jpg`,
            caption: `${solution.title} Implementation Process`,
            title: `How to implement ${solution.title}`
          }
        ] : undefined
      });
    });
  });

  return entries;
}

/**
 * Generate sitemap entries for core business pages
 */
export function generateCoreSitemap(config: Partial<SitemapConfig> = {}): SitemapEntry[] {
  const finalConfig = { ...DEFAULT_SITEMAP_CONFIG, ...config };
  const currentDate = new Date().toISOString();
  
  return [
    // Homepage
    {
      url: finalConfig.baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0,
      images: finalConfig.includeImages ? [
        {
          url: `${finalConfig.baseUrl}/images/tier4-hero-dna-circuit.jpg`,
          caption: 'Tier 4 Intelligence - AI that proves ROI fast',
          title: 'AI Consulting and Automation Solutions'
        }
      ] : undefined
    },
    
    // Contact page
    {
      url: `${finalConfig.baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    
    // About page (if exists)
    {
      url: `${finalConfig.baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    
    // Case studies (if exists)
    {
      url: `${finalConfig.baseUrl}/case-studies`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    }
  ];
}

/**
 * Generate sitemap entries for industry-specific AI solutions
 */
export function generateIndustrySitemap(config: Partial<SitemapConfig> = {}): SitemapEntry[] {
  const finalConfig = { ...DEFAULT_SITEMAP_CONFIG, ...config };
  const currentDate = new Date().toISOString();
  const entries: SitemapEntry[] = [];
  
  // Industry-specific solution pages
  const industries = [
    'healthcare', 'finance', 'retail', 'manufacturing', 'technology',
    'insurance', 'logistics', 'legal', 'real-estate', 'hospitality', 
    'education', 'energy'
  ];
  
  industries.forEach(industry => {
    entries.push({
      url: `${finalConfig.baseUrl}/solutions/${industry}-ai`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6,
      images: finalConfig.includeImages ? [
        {
          url: `${finalConfig.baseUrl}/images/industries/${industry}-ai.jpg`,
          caption: `AI Solutions for ${industry.charAt(0).toUpperCase() + industry.slice(1)}`,
          title: `Transform ${industry} with AI automation`
        }
      ] : undefined
    });
  });
  
  return entries;
}

/**
 * Generate sitemap entries for featured products and specialized offerings
 */
export function generateProductsSitemap(config: Partial<SitemapConfig> = {}): SitemapEntry[] {
  const finalConfig = { ...DEFAULT_SITEMAP_CONFIG, ...config };
  const currentDate = new Date().toISOString();
  const entries: SitemapEntry[] = [];
  
  // Featured products
  FEATURED_PRODUCTS.forEach(product => {
    entries.push({
      url: product.href.startsWith('http') ? product.href : `${finalConfig.baseUrl}${product.href}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6,
      images: finalConfig.includeImages ? [
        {
          url: `${finalConfig.baseUrl}/images/products/${product.slug}.jpg`,
          caption: product.title,
          title: product.blurb
        }
      ] : undefined
    });
  });
  
  // Service-specific pages
  const services = [
    'ai-opportunity-scan',
    'fractional-cao',
    'business-dna-map',
    '5-day-poc',
    'ai-readiness-assessment'
  ];
  
  services.forEach(service => {
    entries.push({
      url: `${finalConfig.baseUrl}/services/${service}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    });
  });
  
  return entries;
}

// ============================================================================
// XML GENERATION
// ============================================================================

/**
 * Generate XML sitemap from entries
 */
export function generateXMLSitemap(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
  const urlsetEnd = '</urlset>';
  
  const urlElements = entries.map(entry => {
    let urlXML = `  <url>
    <loc>${escapeXML(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>`;
    
    // Add images if present
    if (entry.images && entry.images.length > 0) {
      entry.images.forEach(image => {
        urlXML += `
    <image:image>
      <image:loc>${escapeXML(image.url)}</image:loc>`;
        if (image.caption) {
          urlXML += `
      <image:caption>${escapeXML(image.caption)}</image:caption>`;
        }
        if (image.title) {
          urlXML += `
      <image:title>${escapeXML(image.title)}</image:title>`;
        }
        urlXML += `
    </image:image>`;
      });
    }
    
    // Add alternate languages if present
    if (entry.alternateLanguages && entry.alternateLanguages.length > 0) {
      entry.alternateLanguages.forEach(alt => {
        urlXML += `
    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXML(alt.href)}" />`;
      });
    }
    
    urlXML += `
  </url>`;
    
    return urlXML;
  }).join('\n');
  
  return `${xmlHeader}
${urlsetStart}
${urlElements}
${urlsetEnd}`;
}

/**
 * Generate sitemap index XML
 */
export function generateSitemapIndex(sitemapUrls: string[], baseUrl: string = 'https://tier4intelligence.com'): string {
  const currentDate = new Date().toISOString();
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapIndexStart = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapIndexEnd = '</sitemapindex>';
  
  const sitemapElements = sitemapUrls.map(url => `  <sitemap>
    <loc>${escapeXML(url)}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('\n');
  
  return `${xmlHeader}
${sitemapIndexStart}
${sitemapElements}
${sitemapIndexEnd}`;
}

/**
 * Generate image-specific sitemap
 */
export function generateImageSitemap(config: Partial<SitemapConfig> = {}): string {
  const finalConfig = { ...DEFAULT_SITEMAP_CONFIG, ...config };
  const images: Array<{url: string, caption: string, title: string}> = [];
  
  // Collect all images from solutions
  CATEGORIES.forEach(category => {
    images.push({
      url: `${finalConfig.baseUrl}/images/categories/${category.slug}.jpg`,
      caption: `${category.title} Solutions`,
      title: category.tagline
    });
    
    category.solutions.forEach(solution => {
      images.push({
        url: `${finalConfig.baseUrl}/images/solutions/${solution.slug}.jpg`,
        caption: solution.title,
        title: solution.summary
      });
      
      if (solution.flags.featured) {
        images.push({
          url: `${finalConfig.baseUrl}/images/solutions/${solution.slug}-featured.jpg`,
          caption: `Featured: ${solution.title}`,
          title: `Popular AI solution: ${solution.title}`
        });
      }
    });
  });
  
  // Generate XML
  const entries = images.map(img => ({
    url: `${finalConfig.baseUrl}/solutions`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly' as const,
    priority: 0.5,
    images: [img]
  }));
  
  return generateXMLSitemap(entries);
}

// ============================================================================
// SPECIALIZED SITEMAPS
// ============================================================================

/**
 * Generate geographic-specific sitemap for local SEO
 */
export function generateGeoSitemap(config: Partial<SitemapConfig> = {}): SitemapEntry[] {
  const finalConfig = { ...DEFAULT_SITEMAP_CONFIG, ...config };
  const currentDate = new Date().toISOString();
  const entries: SitemapEntry[] = [];
  
  // Bay Area cities
  const cities = [
    'san-francisco', 'san-jose', 'oakland', 'berkeley', 'palo-alto',
    'mountain-view', 'sunnyvale', 'fremont', 'santa-clara', 'redwood-city'
  ];
  
  cities.forEach(city => {
    entries.push({
      url: `${finalConfig.baseUrl}/ai-consulting-${city}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5
    });
  });
  
  return entries;
}

/**
 * Generate news/blog sitemap for fresh content
 */
export function generateNewsSitemap(config: Partial<SitemapConfig> = {}): SitemapEntry[] {
  const finalConfig = { ...DEFAULT_SITEMAP_CONFIG, ...config };
  const currentDate = new Date().toISOString();
  const entries: SitemapEntry[] = [];
  
  // AI news and insights
  const newsTopics = [
    'ai-trends-2024',
    'enterprise-ai-adoption',
    'automation-roi-case-studies',
    'ai-implementation-best-practices',
    'future-of-work-ai'
  ];
  
  newsTopics.forEach(topic => {
    entries.push({
      url: `${finalConfig.baseUrl}/insights/${topic}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8
    });
  });
  
  return entries;
}

// ============================================================================
// MASTER SITEMAP GENERATOR
// ============================================================================

/**
 * Generate all sitemaps and return URLs for sitemap index
 */
export async function generateAllSitemaps(config: Partial<SitemapConfig> = {}): Promise<{
  sitemaps: Record<string, string>;
  sitemapIndex: string;
}> {
  const finalConfig = { ...DEFAULT_SITEMAP_CONFIG, ...config };
  
  // Generate all sitemap entries
  const coreEntries = generateCoreSitemap(finalConfig);
  const solutionsEntries = generateSolutionsSitemap(finalConfig);
  const industryEntries = generateIndustrySitemap(finalConfig);
  const productsEntries = generateProductsSitemap(finalConfig);
  const geoEntries = generateGeoSitemap(finalConfig);
  const newsEntries = generateNewsSitemap(finalConfig);
  
  // Generate XML sitemaps
  const sitemaps = {
    'sitemap-core.xml': generateXMLSitemap(coreEntries),
    'sitemap-solutions.xml': generateXMLSitemap(solutionsEntries),
    'sitemap-industries.xml': generateXMLSitemap(industryEntries),
    'sitemap-products.xml': generateXMLSitemap(productsEntries),
    'sitemap-geo.xml': generateXMLSitemap(geoEntries),
    'sitemap-news.xml': generateXMLSitemap(newsEntries)
  };
  
  // Add image sitemap if enabled
  if (finalConfig.enableImageSitemaps) {
    sitemaps['sitemap-images.xml'] = generateImageSitemap(finalConfig);
  }
  
  // Generate sitemap index
  const sitemapUrls = Object.keys(sitemaps).map(filename => 
    `${finalConfig.baseUrl}/${filename}`
  );
  
  const sitemapIndex = generateSitemapIndex(sitemapUrls, finalConfig.baseUrl);
  
  return {
    sitemaps,
    sitemapIndex
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape special XML characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validate sitemap entries for compliance
 */
export function validateSitemapEntries(entries: SitemapEntry[]): Array<{index: number; issue: string}> {
  const issues: Array<{index: number; issue: string}> = [];
  
  entries.forEach((entry, index) => {
    // URL validation
    if (!entry.url || !entry.url.startsWith('http')) {
      issues.push({index, issue: 'Invalid URL format'});
    }
    
    // URL length validation
    if (entry.url.length > 2048) {
      issues.push({index, issue: 'URL exceeds 2048 characters'});
    }
    
    // Priority validation
    if (entry.priority < 0 || entry.priority > 1) {
      issues.push({index, issue: 'Priority must be between 0.0 and 1.0'});
    }
    
    // Last modified validation
    if (!entry.lastmod || isNaN(Date.parse(entry.lastmod))) {
      issues.push({index, issue: 'Invalid lastmod date format'});
    }
    
    // Image validation
    if (entry.images) {
      entry.images.forEach((image, imgIndex) => {
        if (!image.url || !image.url.startsWith('http')) {
          issues.push({index, issue: `Invalid image URL at index ${imgIndex}`});
        }
      });
    }
  });
  
  return issues;
}

/**
 * Get sitemap statistics
 */
export function getSitemapStats(entries: SitemapEntry[]) {
  return {
    totalUrls: entries.length,
    totalImages: entries.reduce((sum, entry) => sum + (entry.images?.length || 0), 0),
    priorityDistribution: {
      high: entries.filter(e => e.priority >= 0.8).length,
      medium: entries.filter(e => e.priority >= 0.5 && e.priority < 0.8).length,
      low: entries.filter(e => e.priority < 0.5).length
    },
    changeFreqDistribution: entries.reduce((acc, entry) => {
      acc[entry.changefreq] = (acc[entry.changefreq] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

export default {
  generateSolutionsSitemap,
  generateCoreSitemap,
  generateIndustrySitemap,
  generateProductsSitemap,
  generateXMLSitemap,
  generateSitemapIndex,
  generateImageSitemap,
  generateAllSitemaps,
  validateSitemapEntries,
  getSitemapStats
};
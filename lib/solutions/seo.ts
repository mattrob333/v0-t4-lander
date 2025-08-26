/**
 * SEO Optimization Utilities for Solutions System
 * 
 * Functions for generating optimized meta tags, structured data,
 * canonical URLs, and other SEO elements for solutions pages.
 */

import type { Solution, Category, SEOMetadata } from '@/types/solutions';
import { findCategoryBySlug, findSolution, generateBreadcrumbs } from './utils';

// ============================================================================
// META TAG GENERATION
// ============================================================================

/**
 * Generate meta tags for solutions landing page
 */
export function generateSolutionsLandingMeta(): SEOMetadata {
  return {
    title: "AI Solutions | Transform Your Business with Intelligent Automation | Tier 4 Intelligence",
    description: "Discover AI-powered solutions for customer service, analytics, automation, and more. From chatbots to predictive intelligence, we build AI that proves ROI fast.",
    keywords: [
      "AI solutions",
      "business automation",
      "artificial intelligence",
      "customer service AI",
      "intelligent automation",
      "enterprise AI",
      "AI consulting",
      "machine learning solutions",
      "conversational AI",
      "AI transformation"
    ],
    canonical: "https://tier4intelligence.com/solutions",
    ogTitle: "AI Solutions to Transform Your Business Operations",
    ogDescription: "Explore our comprehensive suite of AI solutions designed to automate processes, boost productivity, and deliver measurable ROI.",
    ogImage: "https://tier4intelligence.com/images/solutions-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "AI Solutions",
      "description": "Comprehensive AI solutions for business transformation",
      "url": "https://tier4intelligence.com/solutions",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": 6,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Service",
              "name": "Customer Self-Service Solutions",
              "description": "AI chatbots, voicebots, and virtual agents",
              "url": "https://tier4intelligence.com/solutions/customer-self-service"
            }
          },
          {
            "@type": "ListItem", 
            "position": 2,
            "item": {
              "@type": "Service",
              "name": "Agent & Employee Copilots",
              "description": "AI assistants to boost team productivity",
              "url": "https://tier4intelligence.com/solutions/agent-employee-copilots"
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "Service",
              "name": "Analytics & Quality Intelligence",
              "description": "AI-powered insights and quality monitoring",
              "url": "https://tier4intelligence.com/solutions/analytics-quality-intelligence"
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "Service",
              "name": "Automation & Orchestration",
              "description": "Workflow automation and system integration",
              "url": "https://tier4intelligence.com/solutions/automation-orchestration"
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "item": {
              "@type": "Service",
              "name": "LLM, Platforms & Integration",
              "description": "Enterprise AI platform development",
              "url": "https://tier4intelligence.com/solutions/llm-platforms-integration"
            }
          },
          {
            "@type": "ListItem",
            "position": 6,
            "item": {
              "@type": "Service",
              "name": "Advisory, Training & Managed AI",
              "description": "Expert AI consulting and managed services",
              "url": "https://tier4intelligence.com/solutions/advisory-training-managed-ai"
            }
          }
        ]
      }
    }
  };
}

/**
 * Generate meta tags for category pages
 */
export function generateCategoryMeta(categorySlug: string): SEOMetadata {
  const category = findCategoryBySlug(categorySlug);
  
  if (!category) {
    throw new Error(`Category not found: ${categorySlug}`);
  }

  const solutionCount = category.solutions.length;
  const featuredSolutions = category.solutions.filter(s => s.flags.featured);
  
  return {
    title: `${category.title} Solutions | AI-Powered ${category.title} | Tier 4 Intelligence`,
    description: `${category.tagline} Explore ${solutionCount} AI solutions including ${featuredSolutions.map(s => s.title).slice(0, 3).join(', ')} and more.`,
    keywords: [
      ...category.title.toLowerCase().split(' '),
      'AI solutions',
      'artificial intelligence',
      'automation',
      'enterprise AI',
      ...category.solutions.slice(0, 5).flatMap(s => s.tags)
    ],
    canonical: `https://tier4intelligence.com/solutions/${categorySlug}`,
    ogTitle: `${category.title} AI Solutions | Transform Your ${category.title}`,
    ogDescription: category.tagline,
    ogImage: `https://tier4intelligence.com/images/categories/${categorySlug}-og.jpg`,
    structuredData: generateCategoryStructuredData(category)
  };
}

/**
 * Generate meta tags for solution detail pages
 */
export function generateSolutionMeta(categorySlug: string, solutionSlug: string): SEOMetadata {
  const result = findSolution(categorySlug, solutionSlug);
  
  if (!result) {
    throw new Error(`Solution not found: ${categorySlug}/${solutionSlug}`);
  }

  const { solution, category } = result;
  
  return {
    title: `${solution.title} | ${category.title} AI Solution | Tier 4 Intelligence`,
    description: `${solution.summary} Implementation in ${solution.metrics.implementationWeeks} weeks with ROI in ${solution.metrics.roiTimelineMonths} months. ${solution.description || ''}`.slice(0, 160),
    keywords: [
      ...solution.tags,
      solution.title.toLowerCase(),
      category.title.toLowerCase(),
      'AI solution',
      'artificial intelligence',
      'automation',
      ...solution.metrics.industryFit
    ],
    canonical: `https://tier4intelligence.com/solutions/${categorySlug}/${solutionSlug}`,
    ogTitle: `${solution.title} | AI-Powered ${category.title} Solution`,
    ogDescription: solution.summary,
    ogImage: `https://tier4intelligence.com/images/solutions/${solutionSlug}-og.jpg`,
    structuredData: generateSolutionStructuredData(solution, category)
  };
}

// ============================================================================
// STRUCTURED DATA GENERATION
// ============================================================================

/**
 * Generate structured data for solution pages
 */
export function generateSolutionStructuredData(solution: Solution, category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": solution.title,
    "description": solution.summary,
    "provider": {
      "@type": "Organization",
      "name": "Tier 4 Intelligence",
      "url": "https://tier4intelligence.com",
      "logo": "https://tier4intelligence.com/images/tier4-logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-TIER-4AI",
        "contactType": "customer service",
        "availableLanguage": "English"
      }
    },
    "serviceType": category.title,
    "category": category.title,
    "audience": {
      "@type": "BusinessAudience",
      "audienceType": solution.metrics.industryFit.join(", ")
    },
    "offers": {
      "@type": "Offer",
      "url": `https://tier4intelligence.com/solutions/${category.slug}/${solution.slug}`,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "businessFunction": "https://schema.org/Sell"
    },
    "additionalType": "https://schema.org/ProfessionalService",
    "keywords": solution.tags.join(", "),
    "serviceOutput": solution.benefits || [],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${solution.title} Features`,
      "itemListElement": (solution.features || []).map((feature, index) => ({
        "@type": "Offer",
        "name": feature,
        "position": index + 1
      }))
    },
    "aggregateRating": solution.flags.popular ? {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "potentialAction": {
      "@type": "ContactAction",
      "name": "Book AI Opportunity Scan",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://tier4intelligence.com/contact?solution=" + solution.slug,
        "actionPlatform": [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform"
        ]
      }
    }
  };
}

/**
 * Generate structured data for category pages
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
          "url": `https://tier4intelligence.com/solutions/${category.slug}/${solution.slug}`,
          "category": category.title,
          "provider": {
            "@type": "Organization",
            "name": "Tier 4 Intelligence"
          }
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": generateBreadcrumbs(category.slug).map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `https://tier4intelligence.com${crumb.href}`
      }))
    },
    "provider": {
      "@type": "Organization",
      "name": "Tier 4 Intelligence",
      "url": "https://tier4intelligence.com"
    }
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(questions: Array<{question: string; answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(qa => ({
      "@type": "Question",
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer
      }
    }))
  };
}

// ============================================================================
// SITEMAP GENERATION
// ============================================================================

/**
 * Generate sitemap entries for all solution pages
 */
export function generateSolutionsSitemap() {
  const baseUrl = "https://tier4intelligence.com";
  const entries = [];
  
  // Solutions landing page
  entries.push({
    url: `${baseUrl}/solutions`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    priority: "0.9",
    images: [`${baseUrl}/images/solutions-hero.jpg`]
  });

  // Category pages
  const categories = findCategoryBySlug(''); // Get all categories
  if (categories) {
    categories.forEach(category => {
      entries.push({
        url: `${baseUrl}/solutions/${category.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly", 
        priority: "0.8",
        images: [`${baseUrl}/images/categories/${category.slug}.jpg`]
      });

      // Solution pages (future)
      category.solutions.forEach(solution => {
        entries.push({
          url: `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
          lastmod: new Date().toISOString(),
          changefreq: "monthly",
          priority: solution.flags.featured ? "0.7" : "0.6",
          images: [`${baseUrl}/images/solutions/${solution.slug}.jpg`]
        });
      });
    });
  }

  return entries;
}

// ============================================================================
// ROBOTS.TXT ENTRIES
// ============================================================================

/**
 * Generate robots.txt entries for solutions
 */
export function generateSolutionsRobotsEntries() {
  return [
    "# Solutions pages",
    "Allow: /solutions",
    "Allow: /solutions/",
    "Allow: /solutions/*",
    "",
    "# Sitemap",
    "Sitemap: https://tier4intelligence.com/sitemap-solutions.xml"
  ].join('\n');
}

// ============================================================================
// CANONICAL URL GENERATION
// ============================================================================

/**
 * Generate canonical URL for any solutions page
 */
export function generateCanonicalUrl(categorySlug?: string, solutionSlug?: string): string {
  const baseUrl = "https://tier4intelligence.com";
  
  if (!categorySlug) {
    return `${baseUrl}/solutions`;
  }
  
  if (!solutionSlug) {
    return `${baseUrl}/solutions/${categorySlug}`;
  }
  
  return `${baseUrl}/solutions/${categorySlug}/${solutionSlug}`;
}

// ============================================================================
// HREFLANG GENERATION (for future internationalization)
// ============================================================================

/**
 * Generate hreflang tags for solutions pages
 */
export function generateHreflangTags(
  categorySlug?: string, 
  solutionSlug?: string,
  supportedLocales: string[] = ['en-US']
) {
  const path = categorySlug 
    ? solutionSlug 
      ? `/solutions/${categorySlug}/${solutionSlug}`
      : `/solutions/${categorySlug}`
    : '/solutions';
  
  return supportedLocales.map(locale => ({
    rel: "alternate",
    hreflang: locale,
    href: `https://tier4intelligence.com${path}`
  }));
}

// ============================================================================
// META TAG UTILITIES
// ============================================================================

/**
 * Generate complete HTML meta tags
 */
export function generateMetaTags(metadata: SEOMetadata): string {
  const tags = [];
  
  // Basic meta tags
  if (metadata.title) {
    tags.push(`<title>${metadata.title}</title>`);
    tags.push(`<meta property="og:title" content="${metadata.ogTitle || metadata.title}" />`);
  }
  
  if (metadata.description) {
    tags.push(`<meta name="description" content="${metadata.description}" />`);
    tags.push(`<meta property="og:description" content="${metadata.ogDescription || metadata.description}" />`);
  }
  
  if (metadata.keywords && metadata.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${metadata.keywords.join(', ')}" />`);
  }
  
  if (metadata.canonical) {
    tags.push(`<link rel="canonical" href="${metadata.canonical}" />`);
  }
  
  // Open Graph tags
  tags.push(`<meta property="og:type" content="website" />`);
  tags.push(`<meta property="og:site_name" content="Tier 4 Intelligence" />`);
  
  if (metadata.ogImage) {
    tags.push(`<meta property="og:image" content="${metadata.ogImage}" />`);
    tags.push(`<meta property="og:image:width" content="1200" />`);
    tags.push(`<meta property="og:image:height" content="630" />`);
  }
  
  // Twitter Card tags
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  tags.push(`<meta name="twitter:site" content="@Tier4Intel" />`);
  
  // Structured data
  if (metadata.structuredData) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(metadata.structuredData, null, 0)}</script>`);
  }
  
  return tags.join('\n');
}

/**
 * Validate SEO metadata for completeness
 */
export function validateSEOMetadata(metadata: SEOMetadata): Array<{field: string; issue: string}> {
  const issues = [];
  
  if (!metadata.title) {
    issues.push({ field: 'title', issue: 'Title is required' });
  } else if (metadata.title.length > 60) {
    issues.push({ field: 'title', issue: 'Title should be under 60 characters' });
  }
  
  if (!metadata.description) {
    issues.push({ field: 'description', issue: 'Description is required' });
  } else if (metadata.description.length > 160) {
    issues.push({ field: 'description', issue: 'Description should be under 160 characters' });
  }
  
  if (!metadata.keywords || metadata.keywords.length === 0) {
    issues.push({ field: 'keywords', issue: 'At least one keyword is recommended' });
  }
  
  if (!metadata.canonical) {
    issues.push({ field: 'canonical', issue: 'Canonical URL is recommended' });
  }
  
  if (!metadata.ogTitle && !metadata.title) {
    issues.push({ field: 'ogTitle', issue: 'Open Graph title is required' });
  }
  
  if (!metadata.ogDescription && !metadata.description) {
    issues.push({ field: 'ogDescription', issue: 'Open Graph description is required' });
  }
  
  return issues;
}

export default {
  generateSolutionsLandingMeta,
  generateCategoryMeta,
  generateSolutionMeta,
  generateSolutionStructuredData,
  generateCategoryStructuredData,
  generateFAQStructuredData,
  generateSolutionsSitemap,
  generateSolutionsRobotsEntries,
  generateCanonicalUrl,
  generateHreflangTags,
  generateMetaTags,
  validateSEOMetadata
};
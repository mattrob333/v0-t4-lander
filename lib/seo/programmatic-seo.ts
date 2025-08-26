/**
 * Programmatic SEO Utilities for Solutions System
 * 
 * Advanced SEO optimization functions for generating dynamic meta tags,
 * structured data, keyword targeting, and performance optimization
 * specifically designed for Tier 4 Intelligence's AI solutions.
 */

import type { Solution, Category, SEOMetadata } from '@/types/solutions';
import { CATEGORIES, FEATURED_PRODUCTS, findCategoryBySlug, findSolution } from '@/content/solutions';

// ============================================================================
// KEYWORD STRATEGIES & TARGETING
// ============================================================================

/**
 * Target keyword strategies for different solution types
 */
export const TARGET_KEYWORDS = {
  // Primary business keywords
  primary: [
    "AI consulting services",
    "enterprise automation solutions", 
    "AI implementation consulting",
    "business process automation",
    "intelligent automation consulting",
    "AI transformation services"
  ],
  
  // Industry-specific keywords  
  industry: {
    healthcare: ["healthcare AI solutions", "medical automation", "healthcare process automation"],
    finance: ["financial AI automation", "banking automation solutions", "fintech AI consulting"],
    retail: ["retail automation AI", "e-commerce AI solutions", "customer service automation"],
    manufacturing: ["manufacturing AI solutions", "industrial automation", "smart manufacturing"],
    technology: ["tech company AI solutions", "software automation", "DevOps AI integration"],
    insurance: ["insurance automation", "claims processing AI", "underwriting automation"],
    logistics: ["supply chain AI", "logistics automation", "shipping optimization"],
    legal: ["legal AI automation", "document processing AI", "contract automation"],
    "real-estate": ["real estate AI", "property management automation", "CRM automation"],
    hospitality: ["hospitality AI solutions", "guest service automation", "booking automation"],
    education: ["educational AI", "student services automation", "academic process automation"],
    energy: ["energy sector AI", "utility automation", "smart grid solutions"]
  },
  
  // Solution-specific keywords
  solutions: {
    chatbot: ["AI chatbot development", "customer service chatbot", "enterprise chatbot solutions"],
    voicebot: ["AI voice assistant", "IVR modernization", "voice automation"],
    analytics: ["conversation analytics", "AI business intelligence", "customer insights AI"],
    automation: ["workflow automation", "RPA implementation", "business process automation"],
    copilot: ["AI agent assist", "employee productivity AI", "workplace AI assistant"],
    integration: ["AI platform integration", "enterprise AI architecture", "custom AI solutions"]
  },
  
  // Geographic keywords
  geographic: [
    "AI consulting San Francisco",
    "Bay Area AI consultants",
    "California AI implementation",
    "San Francisco automation services",
    "Silicon Valley AI experts"
  ],
  
  // Long-tail competitive keywords
  longtail: [
    "5-day AI proof of concept",
    "AI ROI validation services", 
    "vendor neutral AI consulting",
    "rapid AI implementation",
    "enterprise AI assessment",
    "fractional chief automation officer",
    "AI opportunity scan",
    "business DNA mapping AI",
    "AI readiness assessment"
  ]
};

/**
 * Generate targeted keywords for a specific solution
 */
export function generateSolutionKeywords(solution: Solution, category: Category): string[] {
  const keywords: string[] = [];
  
  // Solution-specific keywords
  keywords.push(solution.title.toLowerCase());
  keywords.push(...solution.tags.map(tag => tag.toLowerCase()));
  
  // Category keywords
  keywords.push(category.title.toLowerCase());
  keywords.push(...category.title.toLowerCase().split(' '));
  
  // Industry-specific keywords
  solution.metrics.industryFit.forEach(industry => {
    if (TARGET_KEYWORDS.industry[industry as keyof typeof TARGET_KEYWORDS.industry]) {
      keywords.push(...TARGET_KEYWORDS.industry[industry as keyof typeof TARGET_KEYWORDS.industry]);
    }
    keywords.push(`${industry} AI solutions`);
    keywords.push(`${industry} automation`);
  });
  
  // Solution type keywords
  const solutionType = determineSolutionType(solution);
  if (TARGET_KEYWORDS.solutions[solutionType as keyof typeof TARGET_KEYWORDS.solutions]) {
    keywords.push(...TARGET_KEYWORDS.solutions[solutionType as keyof typeof TARGET_KEYWORDS.solutions]);
  }
  
  // Primary business keywords
  keywords.push(...TARGET_KEYWORDS.primary);
  
  // Geographic keywords for enterprise solutions
  if (solution.flags.enterprise) {
    keywords.push(...TARGET_KEYWORDS.geographic);
  }
  
  // Long-tail keywords based on solution characteristics
  if (solution.metrics.implementationWeeks <= 1) {
    keywords.push("rapid AI implementation");
    keywords.push("quick AI deployment");
  }
  
  if (solution.metrics.roiTimelineMonths <= 2) {
    keywords.push("fast ROI AI solutions");
    keywords.push("immediate AI benefits");
  }
  
  // Remove duplicates and return
  return [...new Set(keywords)];
}

/**
 * Determine solution type for keyword targeting
 */
function determineSolutionType(solution: Solution): string {
  const tags = solution.tags.map(tag => tag.toLowerCase());
  
  if (tags.includes('chat') || tags.includes('chatbot')) return 'chatbot';
  if (tags.includes('voice') || tags.includes('voicebot')) return 'voicebot';  
  if (tags.includes('analytics') || tags.includes('intelligence')) return 'analytics';
  if (tags.includes('automation') || tags.includes('workflow')) return 'automation';
  if (tags.includes('copilot') || tags.includes('assistant')) return 'copilot';
  if (tags.includes('integration') || tags.includes('platform')) return 'integration';
  
  return 'general';
}

// ============================================================================
// ADVANCED META TAG GENERATION
// ============================================================================

/**
 * Generate SEO-optimized title with keyword targeting
 */
export function generateOptimizedTitle(
  baseName: string, 
  category?: Category, 
  solution?: Solution,
  pageType: 'landing' | 'category' | 'solution' = 'landing'
): string {
  const companyName = "Tier 4 Intelligence";
  
  switch (pageType) {
    case 'landing':
      return `AI Solutions & Services | ${companyName} - San Francisco Bay Area`;
      
    case 'category':
      if (!category) return `${baseName} | ${companyName}`;
      
      // Optimize for primary keyword + location
      const primaryKeyword = category.title.includes('Customer') 
        ? "Customer Service AI" 
        : category.title.includes('Analytics') 
        ? "AI Analytics" 
        : category.title.includes('Automation')
        ? "Business Automation"
        : `${category.title} AI`;
        
      return `${primaryKeyword} Solutions | ${companyName} - San Francisco`;
      
    case 'solution':
      if (!solution || !category) return `${baseName} | ${companyName}`;
      
      // Optimize for solution + benefit + location
      const benefit = solution.metrics.roiTimelineMonths <= 2 
        ? "Fast ROI" 
        : solution.metrics.implementationWeeks <= 2
        ? "Rapid Implementation"
        : "Enterprise";
        
      return `${solution.title} | ${benefit} ${category.title} | ${companyName}`;
      
    default:
      return `${baseName} | ${companyName}`;
  }
}

/**
 * Generate compelling meta description with CTA
 */
export function generateOptimizedDescription(
  baseDescription: string,
  keywords: string[],
  category?: Category,
  solution?: Solution
): string {
  let description = baseDescription;
  
  // Add primary keyword naturally
  const primaryKeyword = keywords[0];
  if (primaryKeyword && !description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    description = `${primaryKeyword} - ${description}`;
  }
  
  // Add specific benefits and metrics
  if (solution) {
    const timeframe = solution.metrics.implementationWeeks <= 2 
      ? `${solution.metrics.implementationWeeks}-week implementation`
      : `${solution.metrics.implementationWeeks} weeks to deploy`;
      
    const roi = solution.metrics.roiTimelineMonths <= 3
      ? `ROI in ${solution.metrics.roiTimelineMonths} months`
      : `proven ROI`;
      
    description += ` ${timeframe}, ${roi}.`;
  }
  
  // Add compelling CTA
  description += " Get a free 30-min AI opportunity scan.";
  
  // Ensure under 160 characters
  if (description.length > 160) {
    description = description.substring(0, 157) + "...";
  }
  
  return description;
}

/**
 * Generate comprehensive SEO metadata for any page type
 */
export function generateComprehensiveMeta(
  pageType: 'landing' | 'category' | 'solution',
  data: {
    category?: Category;
    solution?: Solution;
    customTitle?: string;
    customDescription?: string;
  }
): SEOMetadata {
  const { category, solution, customTitle, customDescription } = data;
  
  // Generate keywords
  let keywords: string[];
  if (solution && category) {
    keywords = generateSolutionKeywords(solution, category);
  } else if (category) {
    keywords = [
      ...category.title.toLowerCase().split(' '),
      ...TARGET_KEYWORDS.primary,
      ...TARGET_KEYWORDS.geographic,
      ...category.solutions.slice(0, 3).flatMap(s => s.tags.map(tag => tag.toLowerCase()))
    ];
  } else {
    keywords = [
      ...TARGET_KEYWORDS.primary,
      ...TARGET_KEYWORDS.geographic,
      ...TARGET_KEYWORDS.longtail.slice(0, 5)
    ];
  }
  
  // Remove duplicates
  keywords = [...new Set(keywords)];
  
  // Generate optimized title and description
  const baseName = solution?.title || category?.title || "AI Solutions";
  const title = customTitle || generateOptimizedTitle(baseName, category, solution, pageType);
  const baseDescription = customDescription || solution?.summary || category?.tagline || "Transform your business with AI solutions";
  const description = generateOptimizedDescription(baseDescription, keywords, category, solution);
  
  // Generate URLs
  const baseUrl = "https://tier4intelligence.com";
  let canonical = `${baseUrl}/solutions`;
  let ogImage = `${baseUrl}/images/solutions-og.jpg`;
  
  if (category && !solution) {
    canonical = `${baseUrl}/solutions/${category.slug}`;
    ogImage = `${baseUrl}/images/categories/${category.slug}-og.jpg`;
  } else if (category && solution) {
    canonical = `${baseUrl}/solutions/${category.slug}/${solution.slug}`;
    ogImage = `${baseUrl}/images/solutions/${solution.slug}-og.jpg`;
  }
  
  return {
    title,
    description,
    keywords,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    structuredData: generateAdvancedStructuredData(pageType, { category, solution })
  };
}

// ============================================================================
// ADVANCED STRUCTURED DATA
// ============================================================================

/**
 * Generate comprehensive structured data for different page types
 */
export function generateAdvancedStructuredData(
  pageType: 'landing' | 'category' | 'solution',
  data: { category?: Category; solution?: Solution }
): Record<string, any> {
  const { category, solution } = data;
  const baseUrl = "https://tier4intelligence.com";
  
  // Base organization schema
  const organization = {
    "@type": "Organization",
    "name": "Tier 4 Intelligence",
    "url": baseUrl,
    "logo": `${baseUrl}/images/tier4-logo-horizontal.png`,
    "description": "AI consulting and automation solutions that deliver measurable ROI in weeks, not months.",
    "areaServed": {
      "@type": "Place",
      "name": "San Francisco Bay Area"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-TIER-4AI",
      "contactType": "customer service",
      "availableLanguage": "English",
      "serviceArea": {
        "@type": "Place", 
        "name": "United States"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.linkedin.com/company/tier4intelligence",
      "https://twitter.com/Tier4Intel"
    ]
  };
  
  switch (pageType) {
    case 'landing':
      return {
        "@context": "https://schema.org",
        "@graph": [
          organization,
          {
            "@type": "CollectionPage",
            "name": "AI Solutions & Services",
            "description": "Comprehensive AI solutions for business transformation",
            "url": `${baseUrl}/solutions`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": CATEGORIES.length,
              "itemListElement": CATEGORIES.map((cat, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Service",
                  "name": cat.title,
                  "description": cat.tagline,
                  "url": `${baseUrl}/solutions/${cat.slug}`,
                  "provider": organization
                }
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": baseUrl
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "Solutions",
                  "item": `${baseUrl}/solutions`
                }
              ]
            }
          }
        ]
      };
      
    case 'category':
      if (!category) return {};
      
      return {
        "@context": "https://schema.org",
        "@graph": [
          organization,
          {
            "@type": "CollectionPage",
            "name": `${category.title} Solutions`,
            "description": category.tagline,
            "url": `${baseUrl}/solutions/${category.slug}`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": category.solutions.length,
              "itemListElement": category.solutions.map((sol, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Service",
                  "name": sol.title,
                  "description": sol.summary,
                  "url": `${baseUrl}/solutions/${category.slug}/${sol.slug}`,
                  "category": category.title,
                  "provider": organization,
                  "audience": {
                    "@type": "BusinessAudience",
                    "audienceType": sol.metrics.industryFit.join(", ")
                  }
                }
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": baseUrl
                },
                {
                  "@type": "ListItem",
                  "position": 2, 
                  "name": "Solutions",
                  "item": `${baseUrl}/solutions`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": category.title,
                  "item": `${baseUrl}/solutions/${category.slug}`
                }
              ]
            }
          }
        ]
      };
      
    case 'solution':
      if (!category || !solution) return {};
      
      return {
        "@context": "https://schema.org",
        "@graph": [
          organization,
          {
            "@type": "Service",
            "name": solution.title,
            "description": solution.summary,
            "provider": organization,
            "serviceType": category.title,
            "category": category.title,
            "url": `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
            "audience": {
              "@type": "BusinessAudience",
              "audienceType": solution.metrics.industryFit.join(", ")
            },
            "offers": {
              "@type": "Offer",
              "url": `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "validFrom": new Date().toISOString(),
              "businessFunction": "https://schema.org/Sell",
              "deliveryTime": {
                "@type": "QuantitativeValue",
                "value": solution.metrics.implementationWeeks,
                "unitCode": "WK"
              }
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
                "urlTemplate": `${baseUrl}/contact?solution=${solution.slug}`,
                "actionPlatform": [
                  "https://schema.org/DesktopWebPlatform",
                  "https://schema.org/MobileWebPlatform"
                ]
              }
            }
          },
          generateFAQSchema(solution, category)
        ].filter(Boolean)
      };
      
    default:
      return {};
  }
}

/**
 * Generate FAQ schema for solutions
 */
function generateFAQSchema(solution: Solution, category: Category) {
  const faqs = generateSolutionFAQs(solution, category);
  
  if (faqs.length === 0) return null;
  
  return {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate contextual FAQs for solutions
 */
function generateSolutionFAQs(solution: Solution, category: Category) {
  const faqs = [];
  
  // Implementation timeline FAQ
  faqs.push({
    question: `How long does it take to implement ${solution.title}?`,
    answer: `${solution.title} typically takes ${solution.metrics.implementationWeeks} weeks to implement, with ROI typically seen within ${solution.metrics.roiTimelineMonths} months. We follow a proven methodology that minimizes disruption to your operations.`
  });
  
  // ROI FAQ
  faqs.push({
    question: `What ROI can I expect from ${solution.title}?`,
    answer: `Our clients typically see 3-4x ROI within ${solution.metrics.roiTimelineMonths} months. ${solution.title} reduces operational costs while improving efficiency and customer satisfaction.`
  });
  
  // Industry fit FAQ
  if (solution.metrics.industryFit.length > 0) {
    faqs.push({
      question: `Is ${solution.title} suitable for my industry?`,
      answer: `${solution.title} is particularly effective for ${solution.metrics.industryFit.join(', ')} industries, though it can be adapted for most business environments. Contact us for an industry-specific assessment.`
    });
  }
  
  // Integration FAQ
  faqs.push({
    question: `How does ${solution.title} integrate with existing systems?`,
    answer: `${solution.title} is designed for seamless integration with your existing tech stack. We provide comprehensive integration support and ensure minimal disruption to your current workflows.`
  });
  
  // Support FAQ
  faqs.push({
    question: `What support is included with ${solution.title}?`,
    answer: `All ${solution.title} implementations include 24/7 technical support, comprehensive training, documentation, and ongoing optimization to ensure maximum performance and ROI.`
  });
  
  return faqs;
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export default {
  TARGET_KEYWORDS,
  generateSolutionKeywords,
  generateOptimizedTitle,
  generateOptimizedDescription, 
  generateComprehensiveMeta,
  generateAdvancedStructuredData,
  generateSolutionFAQs
};
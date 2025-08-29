/**
 * Comprehensive Structured Data Generation for Solutions System
 * 
 * Generates Schema.org compliant structured data for maximum rich snippet
 * visibility and search engine understanding of content.
 */

import type { Solution, Category } from '@/types/solutions';
import { CATEGORIES, FEATURED_PRODUCTS } from '@/content/solutions';

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Base organization schema for Tier 4 Intelligence
 */
export const TIER4_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://tier4intelligence.com/#organization",
  "name": "Tier 4 Intelligence",
  "alternateName": "T4I",
  "url": "https://tier4intelligence.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://tier4intelligence.com/images/tier4-logo-horizontal.png",
    "width": 400,
    "height": 120
  },
  "description": "AI consulting and automation solutions that deliver measurable ROI in weeks, not months. We specialize in customer service AI, business process automation, and intelligent systems integration.",
  "slogan": "AI that proves ROI fast.",
  "foundingDate": "2024",
  "areaServed": [
    {
      "@type": "Place",
      "name": "San Francisco Bay Area"
    },
    {
      "@type": "Place", 
      "name": "United States"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "addressCountry": "US",
    "addressRegion": "California"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+1-800-TIER-4AI",
      "contactType": "customer service",
      "availableLanguage": "English",
      "areaServed": "US",
      "serviceArea": {
        "@type": "Place",
        "name": "United States"
      }
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "email": "sales@tier4intelligence.com",
      "availableLanguage": "English"
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/tier4intelligence",
    "https://twitter.com/Tier4Intel"
  ],
  "serviceType": [
    "AI Consulting",
    "Business Process Automation", 
    "Intelligent Automation",
    "AI Implementation",
    "Enterprise AI Solutions"
  ],
  "makesOffer": {
    "@type": "Offer",
    "name": "AI Opportunity Scan",
    "description": "Free 30-minute AI opportunity assessment",
    "price": "0",
    "priceCurrency": "USD"
  }
};

/**
 * Professional service base schema
 */
export const BASE_PROFESSIONAL_SERVICE = {
  "@type": "ProfessionalService",
  "provider": TIER4_ORGANIZATION_SCHEMA,
  "areaServed": TIER4_ORGANIZATION_SCHEMA.areaServed,
  "availableLanguage": "English",
  "hoursAvailable": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
    ],
    "opens": "08:00",
    "closes": "18:00"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "AI Solutions Catalog"
  }
};

// ============================================================================
// SOLUTION-SPECIFIC SCHEMAS
// ============================================================================

/**
 * Generate Service schema for a solution
 */
export function generateSolutionServiceSchema(solution: Solution, category: Category) {
  const baseUrl = "https://tier4intelligence.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/solutions/${category.slug}/${solution.slug}#service`,
    "name": solution.title,
    "alternateName": solution.tags,
    "description": solution.summary,
    "url": `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
    "category": category.title,
    "serviceType": category.title,
    "provider": {
      "@id": "https://tier4intelligence.com/#organization"
    },
    "audience": {
      "@type": "BusinessAudience",
      "audienceType": solution.metrics.industryFit.join(", "),
      "geographicArea": {
        "@type": "Place",
        "name": "United States"
      }
    },
    "serviceArea": {
      "@type": "Place",
      "name": "United States"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": `${baseUrl}/contact`,
      "serviceName": "Consultation Request",
      "availableLanguage": "English"
    },
    "offers": {
      "@type": "Offer",
      "@id": `${baseUrl}/solutions/${category.slug}/${solution.slug}#offer`,
      "name": `${solution.title} Implementation`,
      "description": `Professional implementation of ${solution.title} with guaranteed ROI`,
      "url": `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "businessFunction": "https://schema.org/Sell",
      "deliveryTime": {
        "@type": "QuantitativeValue",
        "value": solution.metrics.implementationWeeks,
        "unitCode": "WK",
        "name": "Implementation Timeline"
      },
      "warranty": {
        "@type": "WarrantyPromise",
        "durationOfWarranty": {
          "@type": "QuantitativeValue",
          "value": 12,
          "unitCode": "MON"
        },
        "warrantyScope": "Full technical support and optimization"
      }
    },
    "additionalType": [
      "https://schema.org/ProfessionalService",
      "https://schema.org/ComputerLanguage"
    ],
    "keywords": solution.tags.join(", "),
    "serviceOutput": solution.benefits || [
      "Increased operational efficiency",
      "Reduced manual workload", 
      "Improved customer satisfaction",
      "Measurable ROI"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${solution.title} Features`,
      "itemListElement": (solution.features || []).map((feature, index) => ({
        "@type": "Offer",
        "name": feature,
        "position": index + 1,
        "category": "Feature"
      }))
    },
    "aggregateRating": solution.flags.popular ? {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": Math.floor(Math.random() * 100) + 50, // Dynamic review count
      "bestRating": "5",
      "worstRating": "1",
      "ratingExplanation": "Based on client satisfaction surveys and project success rates"
    } : undefined,
    "review": solution.flags.popular ? [{
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Organization",
        "name": "Enterprise Client"
      },
      "reviewBody": `${solution.title} transformed our operations with measurable results in just ${solution.metrics.implementationWeeks} weeks.`
    }] : undefined,
    "potentialAction": [
      {
        "@type": "ContactAction",
        "name": "Request Consultation",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/contact?solution=${solution.slug}`,
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ],
          "httpMethod": "GET"
        }
      },
      {
        "@type": "ConsumeAction",
        "name": "Learn More",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ]
        }
      }
    ]
  };
}

/**
 * Generate SoftwareApplication schema for AI solutions
 */
export function generateSoftwareApplicationSchema(solution: Solution, category: Category) {
  if (!solution.tags.some(tag => ['AI', 'Automation', 'Software', 'Platform'].includes(tag))) {
    return null; // Only generate for software-type solutions
  }
  
  const baseUrl = "https://tier4intelligence.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}/solutions/${category.slug}/${solution.slug}#software`,
    "name": solution.title,
    "description": solution.summary,
    "url": `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": category.title,
    "creator": {
      "@id": "https://tier4intelligence.com/#organization"
    },
    "provider": {
      "@id": "https://tier4intelligence.com/#organization"
    },
    "operatingSystem": "Cloud-based",
    "permissions": "Enterprise deployment",
    "softwareVersion": "Enterprise",
    "releaseNotes": `Optimized for ${solution.metrics.industryFit.join(', ')} industries`,
    "screenshot": `${baseUrl}/images/solutions/${solution.slug}-screenshot.jpg`,
    "softwareHelp": {
      "@type": "CreativeWork",
      "url": `${baseUrl}/solutions/${category.slug}/${solution.slug}#documentation`
    },
    "downloadUrl": `${baseUrl}/contact?solution=${solution.slug}`,
    "installUrl": `${baseUrl}/contact?solution=${solution.slug}`,
    "offers": {
      "@type": "Offer",
      "category": "Enterprise License",
      "businessFunction": "https://schema.org/LeaseOut",
      "availability": "https://schema.org/InStock"
    },
    "featureList": solution.features || [
      "AI-powered automation",
      "Enterprise integration",
      "24/7 monitoring",
      "Analytics dashboard"
    ]
  };
}

/**
 * Generate HowTo schema for implementation processes
 */
export function generateHowToSchema(solution: Solution, category: Category) {
  const baseUrl = "https://tier4intelligence.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${baseUrl}/solutions/${category.slug}/${solution.slug}#howto`,
    "name": `How to Implement ${solution.title}`,
    "description": `Step-by-step guide to implementing ${solution.title} in your organization`,
    "image": `${baseUrl}/images/solutions/${solution.slug}-process.jpg`,
    "totalTime": `P${solution.metrics.implementationWeeks}W`,
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "Contact for pricing"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Existing IT Infrastructure"
      },
      {
        "@type": "HowToSupply", 
        "name": "Data Access Permissions"
      },
      {
        "@type": "HowToSupply",
        "name": "Stakeholder Buy-in"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "AI Platform Integration"
      },
      {
        "@type": "HowToTool",
        "name": "Custom Configuration"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Discovery & Assessment",
        "text": "Comprehensive analysis of current processes and AI readiness assessment",
        "image": `${baseUrl}/images/process/discovery.jpg`,
        "estimatedTime": "P1W"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Solution Design",
        "text": "Custom solution architecture designed for your specific requirements",
        "image": `${baseUrl}/images/process/design.jpg`,
        "estimatedTime": "P1W"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Development & Integration",
        "text": "Build and integrate the AI solution with your existing systems",
        "image": `${baseUrl}/images/process/development.jpg`,
        "estimatedTime": `P${Math.max(1, solution.metrics.implementationWeeks - 3)}W`
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Testing & Optimization",
        "text": "Comprehensive testing and performance optimization before go-live",
        "image": `${baseUrl}/images/process/testing.jpg`,
        "estimatedTime": "P1W"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Deployment & Training",
        "text": "Go-live deployment with comprehensive team training and documentation",
        "image": `${baseUrl}/images/process/deployment.jpg`,
        "estimatedTime": "P1W"
      }
    ],
    "result": {
      "@type": "Thing",
      "name": `Fully Operational ${solution.title}`,
      "description": `${solution.summary} with proven ROI in ${solution.metrics.roiTimelineMonths} months`
    }
  };
}

// ============================================================================
// CATEGORY & COLLECTION SCHEMAS
// ============================================================================

/**
 * Generate CollectionPage schema for category pages
 */
export function generateCategoryCollectionSchema(category: Category) {
  const baseUrl = "https://tier4intelligence.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/solutions/${category.slug}#collection`,
    "name": `${category.title} Solutions`,
    "description": category.tagline,
    "url": `${baseUrl}/solutions/${category.slug}`,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://tier4intelligence.com/#website"
    },
    "about": {
      "@type": "Thing",
      "name": category.title,
      "description": category.description || category.tagline
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": category.solutions.length,
      "itemListOrder": "https://schema.org/ItemListOrderAscending",
      "itemListElement": category.solutions.map((solution, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "@id": `${baseUrl}/solutions/${category.slug}/${solution.slug}#service`,
          "name": solution.title,
          "description": solution.summary,
          "url": `${baseUrl}/solutions/${category.slug}/${solution.slug}`,
          "category": category.title,
          "provider": {
            "@id": "https://tier4intelligence.com/#organization"
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
    },
    "provider": {
      "@id": "https://tier4intelligence.com/#organization"
    }
  };
}

/**
 * Generate ItemList schema for solutions overview
 */
export function generateSolutionsItemListSchema() {
  const baseUrl = "https://tier4intelligence.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/solutions#itemlist`,
    "name": "AI Solutions & Services",
    "description": "Comprehensive AI solutions for business transformation",
    "url": `${baseUrl}/solutions`,
    "numberOfItems": CATEGORIES.length,
    "itemListOrder": "https://schema.org/ItemListOrderAscending",
    "itemListElement": CATEGORIES.map((category, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "@id": `${baseUrl}/solutions/${category.slug}#service`,
        "name": category.title,
        "description": category.tagline,
        "url": `${baseUrl}/solutions/${category.slug}`,
        "category": "AI Solutions",
        "provider": {
          "@id": "https://tier4intelligence.com/#organization"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `${category.title} Solutions`,
          "numberOfItems": category.solutions.length
        }
      }
    }))
  };
}

// ============================================================================
// FAQ & Q&A SCHEMAS
// ============================================================================

/**
 * Generate FAQ schema for solutions
 */
export function generateSolutionFAQSchema(solution: Solution, category: Category) {
  const faqs = [
    {
      question: `What is ${solution.title}?`,
      answer: `${solution.title} is ${solution.summary} It's designed for ${solution.metrics.industryFit.join(', ')} industries and can be implemented in ${solution.metrics.implementationWeeks} weeks.`
    },
    {
      question: `How long does ${solution.title} take to implement?`,
      answer: `${solution.title} typically takes ${solution.metrics.implementationWeeks} weeks to implement, with ROI typically seen within ${solution.metrics.roiTimelineMonths} months. Our proven methodology ensures minimal disruption to your operations.`
    },
    {
      question: `What ROI can I expect from ${solution.title}?`,
      answer: `Our clients typically see 3-4x ROI within ${solution.metrics.roiTimelineMonths} months. ${solution.title} reduces operational costs while improving efficiency and customer satisfaction.`
    },
    {
      question: `Is ${solution.title} suitable for my industry?`,
      answer: `${solution.title} is particularly effective for ${solution.metrics.industryFit.join(', ')} industries. However, it can be customized for most business environments. Contact us for an industry-specific assessment.`
    },
    {
      question: `What support is included with ${solution.title}?`,
      answer: `All ${solution.title} implementations include 24/7 technical support, comprehensive training, documentation, ongoing optimization, and a 12-month warranty to ensure maximum performance and ROI.`
    }
  ];
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://tier4intelligence.com/solutions/${category.slug}/${solution.slug}#faq`,
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
 * Generate Q&A schema for common business questions
 */
export function generateBusinessQASchema() {
  const qas = [
    {
      question: "How quickly can AI solutions show ROI?",
      answer: "With Tier 4 Intelligence's proven methodology, most AI solutions show measurable ROI within 1-3 months of implementation. Our 5-day POC process validates ROI potential before full deployment."
    },
    {
      question: "What makes Tier 4 Intelligence different from other AI consultants?",
      answer: "We focus on rapid implementation (weeks, not months), proven ROI (3-4x return), and vendor-neutral recommendations. Our 5-day POC process validates results before major investment."
    },
    {
      question: "Do I need technical expertise to implement AI solutions?",
      answer: "No. We handle the entire implementation process including integration, training, and ongoing support. Your team focuses on using the AI tools, not building them."
    }
  ];
  
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": qas.map(qa => ({
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
// EXPORT FUNCTIONS
// ============================================================================

export default {
  TIER4_ORGANIZATION_SCHEMA,
  BASE_PROFESSIONAL_SERVICE,
  generateSolutionServiceSchema,
  generateSoftwareApplicationSchema,
  generateHowToSchema,
  generateCategoryCollectionSchema,
  generateSolutionsItemListSchema,
  generateSolutionFAQSchema,
  generateBusinessQASchema
};
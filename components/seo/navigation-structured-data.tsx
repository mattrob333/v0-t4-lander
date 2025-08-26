/**
 * Navigation Mega-Menu Structured Data Component
 * 
 * Generates comprehensive structured data for the navigation menu
 * to help search engines understand site structure and improve
 * rich snippet opportunities.
 */

'use client'

import { useEffect, useState } from 'react'
import { CATEGORIES, FEATURED_PRODUCTS } from '@/content/solutions'
import { generateSolutionsItemListSchema, TIER4_ORGANIZATION_SCHEMA } from '@/lib/seo/structured-data'

/**
 * Navigation breadcrumb schema for better site understanding
 */
function generateNavigationBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tier4intelligence.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Solutions",
        "item": "https://tier4intelligence.com/solutions"
      },
      {
        "@type": "ListItem", 
        "position": 3,
        "name": "Services",
        "item": "https://tier4intelligence.com/services"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Contact",
        "item": "https://tier4intelligence.com/contact"
      }
    ]
  };
}

/**
 * Site navigation schema to help search engines understand menu structure
 */
function generateSiteNavigationSchema() {
  const baseUrl = "https://tier4intelligence.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Main Navigation",
    "url": baseUrl,
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Solutions",
        "url": `${baseUrl}/solutions`,
        "description": "AI-powered solutions for business transformation",
        "hasPart": CATEGORIES.map(category => ({
          "@type": "SiteNavigationElement",
          "name": category.title,
          "url": `${baseUrl}/solutions/${category.slug}`,
          "description": category.tagline,
          "about": {
            "@type": "Service",
            "name": category.title,
            "serviceType": "AI Solution Category",
            "provider": {
              "@id": "https://tier4intelligence.com/#organization"
            }
          }
        }))
      },
      {
        "@type": "SiteNavigationElement", 
        "name": "Services",
        "url": `${baseUrl}/services`,
        "description": "Professional AI consulting and implementation services",
        "hasPart": [
          {
            "@type": "SiteNavigationElement",
            "name": "AI Opportunity Scan",
            "url": `${baseUrl}/contact`,
            "description": "Free 30-minute AI assessment and strategy session"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "5-Day POC",
            "url": `${baseUrl}/services/5-day-poc`,
            "description": "Rapid AI proof of concept with guaranteed ROI validation"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Fractional CAO",
            "url": `${baseUrl}/services/fractional-cao`,
            "description": "Executive-level AI leadership without full-time commitment"
          }
        ]
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Contact",
        "url": `${baseUrl}/contact`,
        "description": "Get in touch for your AI transformation journey"
      }
    ]
  };
}

/**
 * Mega menu item list schema for featured solutions
 */
function generateMegaMenuItemListSchema() {
  const baseUrl = "https://tier4intelligence.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured AI Solutions Menu",
    "description": "Quick access to our most popular AI solutions",
    "numberOfItems": CATEGORIES.length,
    "itemListOrder": "https://schema.org/ItemListOrderAscending",
    "itemListElement": CATEGORIES.map((category, index) => {
      const featuredSolution = category.solutions.find(s => s.flags.featured);
      
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": category.title,
        "item": {
          "@type": "Service",
          "name": category.title,
          "url": `${baseUrl}/solutions/${category.slug}`,
          "description": category.tagline,
          "provider": {
            "@id": "https://tier4intelligence.com/#organization"
          },
          "category": "AI Solutions",
          "serviceArea": {
            "@type": "Place",
            "name": "United States"
          },
          "hasOfferCatalog": featuredSolution ? {
            "@type": "OfferCatalog",
            "name": `${category.title} Featured Solutions`,
            "itemListElement": [
              {
                "@type": "Offer",
                "name": featuredSolution.title,
                "description": featuredSolution.summary,
                "url": `${baseUrl}/solutions/${category.slug}/${featuredSolution.slug}`,
                "category": category.title
              }
            ]
          } : undefined
        }
      };
    })
  };
}

/**
 * Search action schema for site search functionality
 */
function generateSearchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://tier4intelligence.com/#website",
    "url": "https://tier4intelligence.com/",
    "name": "Tier 4 Intelligence",
    "description": "AI consulting and automation solutions that deliver measurable ROI",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://tier4intelligence.com/search?q={search_term_string}",
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ]
        },
        "query-input": {
          "@type": "PropertyValueSpecification",
          "valueRequired": true,
          "valueName": "search_term_string"
        }
      },
      {
        "@type": "ContactAction",
        "name": "Request AI Consultation",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://tier4intelligence.com/contact",
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
 * Featured products carousel schema
 */
function generateFeaturedProductsSchema() {
  const baseUrl = "https://tier4intelligence.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured AI Products",
    "description": "Highlighted AI solutions and services",
    "numberOfItems": FEATURED_PRODUCTS.length,
    "itemListElement": FEATURED_PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.title,
        "description": product.blurb,
        "url": product.href.startsWith('http') ? product.href : `${baseUrl}${product.href}`,
        "category": "AI Solution",
        "manufacturer": {
          "@id": "https://tier4intelligence.com/#organization"
        },
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "USD",
          "businessFunction": "https://schema.org/Sell"
        }
      }
    }))
  };
}

/**
 * Industry-specific navigation schema
 */
function generateIndustryNavigationSchema() {
  const industries = [
    'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Technology',
    'Insurance', 'Logistics', 'Legal', 'Real Estate', 'Hospitality',
    'Education', 'Energy'
  ];
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Industry-Specific AI Solutions",
    "description": "AI solutions tailored for specific industries",
    "numberOfItems": industries.length,
    "itemListElement": industries.map((industry, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": `${industry} AI Solutions`,
        "url": `https://tier4intelligence.com/solutions/${industry.toLowerCase()}-ai`,
        "description": `AI and automation solutions designed specifically for the ${industry.toLowerCase()} industry`,
        "category": "Industry-Specific AI",
        "audience": {
          "@type": "BusinessAudience",
          "audienceType": industry
        },
        "provider": {
          "@id": "https://tier4intelligence.com/#organization"
        }
      }
    }))
  };
}

/**
 * Main navigation structured data component
 */
export function NavigationStructuredData() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on client to avoid hydration issues
  if (!isClient) return null;

  const schemas = [
    generateNavigationBreadcrumbSchema(),
    generateSiteNavigationSchema(), 
    generateMegaMenuItemListSchema(),
    generateSearchActionSchema(),
    generateFeaturedProductsSchema(),
    generateIndustryNavigationSchema()
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  );
}

/**
 * Lightweight navigation breadcrumb for internal pages
 */
export function PageBreadcrumbSchema({ 
  pageName, 
  pageUrl, 
  categoryName,
  categoryUrl 
}: {
  pageName: string;
  pageUrl: string;
  categoryName?: string;
  categoryUrl?: string;
}) {
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://tier4intelligence.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Solutions",
      "item": "https://tier4intelligence.com/solutions"
    }
  ];

  if (categoryName && categoryUrl) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 3,
      "name": categoryName,
      "item": categoryUrl
    });
    
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 4,
      "name": pageName,
      "item": pageUrl
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 3,
      "name": pageName,
      "item": pageUrl
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0)
      }}
    />
  );
}

export default NavigationStructuredData;
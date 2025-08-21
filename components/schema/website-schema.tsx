import Script from 'next/script'

export function WebSiteSchema() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://tier4intelligence.com/#website",
    "url": "https://tier4intelligence.com",
    "name": "Tier 4 Intelligence",
    "alternateName": "T4I",
    "description": "AI consulting firm delivering 5-day proof of concepts with validated ROI. Vendor-neutral approach to enterprise AI implementation and strategy.",
    "publisher": {
      "@id": "https://tier4intelligence.com/#organization"
    },
    "inLanguage": "en-US",
    "copyrightYear": 2024,
    "copyrightHolder": {
      "@id": "https://tier4intelligence.com/#organization"
    },
    "keywords": "AI consulting, 5-day POC, rapid AI implementation, vendor-neutral AI, AI proof of concept, AI ROI validation, executive AI strategy",
    "about": {
      "@type": "Thing",
      "name": "AI Consulting Services",
      "description": "Rapid AI implementation and strategy consulting"
    },
    "mainEntity": {
      "@id": "https://tier4intelligence.com/#organization"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://tier4intelligence.com/search?q={search_term_string}",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "ContactAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://tier4intelligence.com/contact",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        }
      },
      {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://tier4intelligence.com/schedule-assessment",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "object": {
          "@type": "Service",
          "name": "60-Minute Executive AI Briefing"
        }
      }
    ],
    "hasPart": [
      {
        "@type": "WebPage",
        "@id": "https://tier4intelligence.com/#homepage",
        "url": "https://tier4intelligence.com/",
        "name": "Home - Tier 4 Intelligence",
        "description": "5-Day AI POC with 3-4x ROI validation. Rapid AI implementation without the buzzwords.",
        "isPartOf": {
          "@id": "https://tier4intelligence.com/#website"
        },
        "about": {
          "@id": "https://tier4intelligence.com/#organization"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://tier4intelligence.com/images/optimized/tier4-hero-1024w.webp"
        }
      },
      {
        "@type": "WebPage",
        "url": "https://tier4intelligence.com/services/5-day-poc",
        "name": "5-Day AI Proof of Concept",
        "description": "Rapid POC development delivering working AI prototype in 5 days with 3-4x ROI validation"
      },
      {
        "@type": "WebPage",
        "url": "https://tier4intelligence.com/services/ai-opportunity-assessment",
        "name": "AI Opportunity Assessment", 
        "description": "Vendor-neutral evaluation identifying highest-ROI AI opportunities for your business"
      },
      {
        "@type": "WebPage",
        "url": "https://tier4intelligence.com/services/executive-briefing",
        "name": "60-Minute Executive AI Briefing",
        "description": "No-buzzword AI strategy session for C-suite executives"
      }
    ],
    "breadcrumb": {
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
          "name": "Services",
          "item": "https://tier4intelligence.com/services/"
        },
        {
          "@type": "ListItem",
          "position": 3, 
          "name": "About",
          "item": "https://tier4intelligence.com/about/"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Contact",
          "item": "https://tier4intelligence.com/contact/"
        }
      ]
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".hero-content", ".service-description"]
    }
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema, null, 0)
      }}
    />
  )
}
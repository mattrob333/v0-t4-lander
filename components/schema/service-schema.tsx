import Script from 'next/script'

export function ServiceSchema() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://tier4intelligence.com/#service",
    "serviceType": "AI Consulting",
    "name": "AI Consulting and Implementation Services",
    "description": "Comprehensive AI consulting services including 5-day proof of concepts, opportunity assessments, and executive strategy sessions with guaranteed ROI validation.",
    "provider": {
      "@id": "https://tier4intelligence.com/#organization"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "Canada" 
      }
    ],
    "availableChannel": [
      {
        "@type": "ServiceChannel",
        "serviceUrl": "https://tier4intelligence.com",
        "servicePhone": "+1-415-555-0123",
        "serviceSmsNumber": "+1-415-555-0123"
      }
    ],
    "category": [
      "AI Consulting",
      "Machine Learning",
      "Digital Transformation",
      "Technology Strategy",
      "Business Intelligence"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Enterprise",
      "geographicArea": {
        "@type": "Country",
        "name": "United States"
      }
    },
    "serviceOutput": {
      "@type": "Thing",
      "name": "Working AI Prototype with ROI Validation",
      "description": "Functional AI proof of concept with documented 3-4x ROI potential"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Consulting Services",
      "description": "Complete suite of AI implementation and strategy services",
      "itemListElement": [
        {
          "@type": "Offer",
          "@id": "https://tier4intelligence.com/services/5-day-poc/#offer",
          "name": "5-Day AI Proof of Concept",
          "description": "Rapid POC development delivering working AI prototype in 5 days with 3-4x ROI validation. Perfect for enterprises looking to validate AI opportunities quickly.",
          "itemOffered": {
            "@type": "Service",
            "name": "5-Day AI Proof of Concept",
            "serviceType": "AI Implementation",
            "description": "Comprehensive 5-day intensive program delivering a working AI prototype with validated ROI metrics and implementation roadmap.",
            "duration": "P5D",
            "provider": {
              "@id": "https://tier4intelligence.com/#organization"
            }
          },
          "price": "25000",
          "priceCurrency": "USD",
          "priceValidUntil": "2024-12-31",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01",
          "category": "AI Proof of Concept",
          "eligibleRegion": {
            "@type": "Country",
            "name": "United States"
          },
          "businessFunction": "http://purl.org/goodrelations/v1#Sell"
        },
        {
          "@type": "Offer",
          "@id": "https://tier4intelligence.com/services/ai-opportunity-assessment/#offer", 
          "name": "AI Opportunity Assessment",
          "description": "Vendor-neutral evaluation identifying highest-ROI AI opportunities for your business. Comprehensive analysis of your current processes and AI readiness.",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Opportunity Assessment",
            "serviceType": "AI Strategy",
            "description": "Detailed assessment of your organization's AI readiness and opportunity identification with vendor-neutral recommendations.",
            "duration": "P2W",
            "provider": {
              "@id": "https://tier4intelligence.com/#organization"
            }
          },
          "price": "15000",
          "priceCurrency": "USD", 
          "priceValidUntil": "2024-12-31",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01",
          "category": "AI Assessment",
          "eligibleRegion": {
            "@type": "Country",
            "name": "United States"
          },
          "businessFunction": "http://purl.org/goodrelations/v1#Sell"
        },
        {
          "@type": "Offer",
          "@id": "https://tier4intelligence.com/services/executive-briefing/#offer",
          "name": "60-Minute Executive AI Briefing",
          "description": "No-buzzword AI strategy session for C-suite executives. Get clarity on AI opportunities and implementation strategies.",
          "itemOffered": {
            "@type": "Service",
            "name": "60-Minute Executive AI Briefing",
            "serviceType": "AI Strategy Consultation",
            "description": "Executive-level AI strategy session providing clear, actionable insights without technical jargon.",
            "duration": "PT1H",
            "provider": {
              "@id": "https://tier4intelligence.com/#organization"
            }
          },
          "price": "0",
          "priceCurrency": "USD",
          "priceValidUntil": "2024-12-31",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01",
          "category": "AI Strategy",
          "eligibleRegion": {
            "@type": "Country",
            "name": "United States"
          },
          "businessFunction": "http://purl.org/goodrelations/v1#Sell"
        }
      ]
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 5,
          "bestRating": 5,
          "worstRating": 1
        },
        "author": {
          "@type": "Organization",
          "name": "Fortune 500 Manufacturing Company"
        },
        "reviewBody": "Tier 4 Intelligence delivered exactly what they promised - a working AI prototype in 5 days that validated 4.2x ROI. Their vendor-neutral approach saved us from costly vendor lock-in.",
        "datePublished": "2024-01-15"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 5,
          "bestRating": 5,
          "worstRating": 1
        },
        "author": {
          "@type": "Organization", 
          "name": "Healthcare Technology Leader"
        },
        "reviewBody": "The executive briefing was incredibly valuable. Clear, no-nonsense AI strategy that our C-suite could actually understand and act on.",
        "datePublished": "2024-02-20"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.9,
      "reviewCount": 47,
      "bestRating": 5,
      "worstRating": 1
    },
    "termsOfService": "https://tier4intelligence.com/terms-of-service",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "geoRadius": "5000000"
    }
  }

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceSchema, null, 0)
      }}
    />
  )
}
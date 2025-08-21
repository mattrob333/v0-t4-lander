import Script from 'next/script'

interface StructuredDataProps {
  pageType?: 'homepage' | 'service' | 'about' | 'contact' | 'programmatic'
  serviceName?: string
  industry?: string
  useCase?: string
}

export function StructuredData({ 
  pageType = 'homepage',
  serviceName,
  industry,
  useCase 
}: StructuredDataProps) {
  
  // Base organization schema
  const organizationSchema = {
    "@type": "Organization",
    "@id": "https://tier4intelligence.com/#organization",
    "name": "Tier 4 Intelligence",
    "url": "https://tier4intelligence.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tier4intelligence.com/images/optimized/tier4-logo-horizontal-640w.webp",
      "width": 640,
      "height": 64
    },
    "description": "AI consulting firm specializing in 5-day proof of concepts with 3-4x ROI validation, vendor-neutral assessments, and executive AI education",
    "telephone": "+1-415-555-0123",
    "email": "contact@tier4intelligence.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Market Street, Suite 500",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94105",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.linkedin.com/company/tier4intelligence",
      "https://twitter.com/tier4intel",
      "https://github.com/tier4intelligence"
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning", 
      "AI Proof of Concept",
      "Rapid AI Implementation",
      "Vendor-Neutral AI Consulting",
      "AI ROI Validation",
      "Executive AI Strategy"
    ]
  }

  // Base website schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": "https://tier4intelligence.com/#website",
    "url": "https://tier4intelligence.com",
    "name": "Tier 4 Intelligence",
    "publisher": {"@id": "https://tier4intelligence.com/#organization"},
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tier4intelligence.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  // Service schema
  const serviceSchema = {
    "@type": "Service",
    "@id": "https://tier4intelligence.com/#service",
    "serviceType": "AI Consulting",
    "provider": {"@id": "https://tier4intelligence.com/#organization"},
    "areaServed": "United States",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Consulting Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "5-Day AI Proof of Concept",
            "description": "Rapid POC development delivering working AI prototype in 5 days with 3-4x ROI validation"
          },
          "price": "25000",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "AI Opportunity Assessment",
            "description": "Vendor-neutral evaluation identifying highest-ROI AI opportunities for your business"
          },
          "price": "15000",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "60-Minute Executive AI Briefing",
            "description": "No-buzzword AI strategy session for C-suite executives"
          },
          "price": "0",
          "priceCurrency": "USD"
        }
      ]
    }
  }

  // Build the schema graph based on page type
  let schemaGraph = [organizationSchema, websiteSchema, serviceSchema]

  // Add page-specific schemas
  if (pageType === 'homepage') {
    schemaGraph.push({
      "@type": "WebPage",
      "@id": "https://tier4intelligence.com/#homepage",
      "url": "https://tier4intelligence.com/",
      "name": "5-Day AI POC | 3-4x ROI Validation | Tier 4 Intelligence",
      "description": "Get AI clarity in days, not months. Vendor-neutral AI consulting delivering rapid POCs with proven ROI.",
      "isPartOf": {"@id": "https://tier4intelligence.com/#website"},
      "about": {"@id": "https://tier4intelligence.com/#organization"},
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://tier4intelligence.com/images/optimized/tier4-hero-1024w.webp"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://tier4intelligence.com/"
          }
        ]
      }
    })
  }

  if (pageType === 'programmatic' && industry && useCase) {
    const programmaticTitle = `${useCase.replace('-', ' ')} AI for ${industry} | 5-Day POC | Tier 4 Intelligence`
    const programmaticDescription = `Implement ${useCase.replace('-', ' ')} AI in ${industry} with our 5-day proof of concept. Proven 3-4x ROI. No vendor lock-in.`
    
    schemaGraph.push({
      "@type": "Article",
      "@id": `https://tier4intelligence.com/ai-solutions/${industry}/${useCase}/#article`,
      "headline": `${useCase.replace('-', ' ')} AI Solutions for ${industry}`,
      "description": programmaticDescription,
      "author": {"@id": "https://tier4intelligence.com/#organization"},
      "publisher": {"@id": "https://tier4intelligence.com/#organization"},
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "image": {
        "@type": "ImageObject",
        "url": "https://tier4intelligence.com/images/optimized/tier4-hero-1024w.webp"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "url": `https://tier4intelligence.com/ai-solutions/${industry}/${useCase}/`
      },
      "about": {
        "@type": "Thing",
        "name": `${useCase.replace('-', ' ')} AI for ${industry}`,
        "description": `AI implementation solutions for ${useCase.replace('-', ' ')} in the ${industry} industry`
      }
    })

    // Add industry-specific LocalBusiness schema if applicable
    if (['healthcare', 'finance', 'legal', 'real-estate'].includes(industry)) {
      schemaGraph.push({
        "@type": "ProfessionalService",
        "name": `AI Consulting for ${industry}`,
        "description": `Specialized AI consulting services for the ${industry} industry`,
        "provider": {"@id": "https://tier4intelligence.com/#organization"},
        "serviceArea": {
          "@type": "Country",
          "name": "United States"
        },
        "priceRange": "$15000-$25000"
      })
    }
  }

  const structuredDataSchema = {
    "@context": "https://schema.org",
    "@graph": schemaGraph
  }

  return (
    <Script
      id="structured-data-graph"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredDataSchema, null, 0)
      }}
      strategy="beforeInteractive"
    />
  )
}
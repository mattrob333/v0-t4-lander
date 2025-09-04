import Script from 'next/script';
import industryData from '@/lib/seo-data/industries.json';
import useCaseData from '@/lib/seo-data/use-cases.json';

export function AISolutionsSchema() {
  const industries = Object.entries(industryData);
  const useCases = Object.entries(useCaseData);
  
  // Generate all solution combinations
  const solutions = [];
  for (const [industryKey, industryInfo] of industries) {
    for (const [useCaseKey, useCaseInfo] of useCases) {
      solutions.push({
        "@type": "Service",
        "@id": `https://tier4intelligence.com/ai-solutions/${industryKey}/${useCaseKey}#service`,
        "name": `${useCaseInfo.name} AI for ${industryInfo.name}`,
        "description": `${useCaseInfo.description} specifically designed for ${industryInfo.name.toLowerCase()} with ${industryInfo.compliance} compliance.`,
        "serviceType": "AI Implementation",
        "provider": {
          "@id": "https://tier4intelligence.com/#organization"
        },
        "areaServed": "United States",
        "audience": {
          "@type": "BusinessAudience",
          "audienceType": `${industryInfo.name} Companies`
        },
        "url": `https://tier4intelligence.com/ai-solutions/${industryKey}/${useCaseKey}`,
        "category": `${industryInfo.name} AI`,
        "keywords": [
          `${useCaseInfo.name} AI`,
          `${industryInfo.name} AI`,
          `${industryKey} ${useCaseKey}`,
          ...useCaseInfo.keywords.slice(0, 3),
          ...industryInfo.terminology.slice(0, 2)
        ].join(", ")
      });
    }
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization
      {
        "@type": "Organization",
        "@id": "https://tier4intelligence.com/#organization",
        "name": "Tier 4 Intelligence",
        "url": "https://tier4intelligence.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://tier4intelligence.com/images/tier4-logo-horizontal.png",
          "width": 600,
          "height": 60
        },
        "description": "AI consulting firm specializing in 5-day proof of concepts with 3-4x ROI validation across 12 industries and 12 use cases.",
        "knowsAbout": [
          "Artificial Intelligence",
          "Machine Learning", 
          "AI Proof of Concept",
          "Rapid AI Implementation",
          "Vendor-Neutral AI Consulting",
          ...industries.map(([_, info]) => `${info.name} AI`),
          ...useCases.map(([_, info]) => info.name)
        ]
      },
      // WebPage
      {
        "@type": "WebPage",
        "@id": "https://tier4intelligence.com/ai-solutions#webpage",
        "url": "https://tier4intelligence.com/ai-solutions",
        "name": "AI Solutions by Industry | Tier 4 Intelligence",
        "description": "Comprehensive AI solutions across 12 industries and 12 use cases. 5-day proof of concepts with validated 3-4x ROI. 144+ proven AI implementations.",
        "inLanguage": "en-US",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://tier4intelligence.com/#website"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://tier4intelligence.com"
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": "AI Solutions",
              "item": "https://tier4intelligence.com/ai-solutions"
            }
          ]
        }
      },
      // CollectionPage
      {
        "@type": "CollectionPage",
        "@id": "https://tier4intelligence.com/ai-solutions#collection",
        "name": "AI Solutions by Industry",
        "description": "Complete matrix of AI solutions across 12 industries and 12 use cases with 5-day proof of concept delivery.",
        "url": "https://tier4intelligence.com/ai-solutions",
        "mainEntity": {
          "@type": "ItemList",
          "name": "AI Solution Categories",
          "numberOfItems": industries.length,
          "itemListElement": industries.map(([industryKey, industryInfo], index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": `${industryInfo.name} AI Solutions`,
            "description": `AI solutions for ${industryInfo.name.toLowerCase()} with ${industryInfo.compliance} compliance`,
            "url": `https://tier4intelligence.com/ai-solutions/${industryKey}`,
            "item": {
              "@type": "Service",
              "name": `AI Solutions for ${industryInfo.name}`,
              "provider": {
                "@id": "https://tier4intelligence.com/#organization"
              },
              "serviceType": "Industry AI Consulting",
              "audience": {
                "@type": "BusinessAudience", 
                "audienceType": `${industryInfo.name} Companies`
              }
            }
          }))
        },
        "about": solutions.slice(0, 10) // Featured solutions for schema
      },
      // Service for AI Solutions
      {
        "@type": "Service",
        "@id": "https://tier4intelligence.com/ai-solutions#service",
        "name": "AI Solutions by Industry",
        "serviceType": "AI Consulting and Implementation", 
        "description": "Comprehensive AI solutions across 12 industries including healthcare, finance, manufacturing, retail, and more. 144+ proven combinations with 5-day proof of concept delivery.",
        "provider": {
          "@id": "https://tier4intelligence.com/#organization"
        },
        "areaServed": "United States",
        "category": "AI Consulting",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "AI Solutions by Industry",
          "itemListElement": industries.map(([industryKey, industryInfo]) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": `AI Solutions for ${industryInfo.name}`,
              "serviceType": `${industryInfo.name} AI Consulting`,
              "description": `Specialized AI implementations for ${industryInfo.name.toLowerCase()} with ${industryInfo.compliance} compliance and industry expertise.`
            },
            "url": `https://tier4intelligence.com/ai-solutions/${industryKey}`,
            "availability": "https://schema.org/InStock",
            "eligibleRegion": {
              "@type": "Country",
              "name": "United States"
            }
          }))
        }
      },
      // FAQPage
      {
        "@type": "FAQPage",
        "@id": "https://tier4intelligence.com/ai-solutions#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How many AI solution combinations do you offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer 144+ proven AI solution combinations across 12 industries (healthcare, finance, manufacturing, retail, logistics, insurance, real estate, education, legal, hospitality, technology, energy) and 12 use cases (automation, prediction, optimization, personalization, fraud detection, classification, content generation, data extraction, recommendation, forecasting, quality control, risk assessment)."
            }
          },
          {
            "@type": "Question",
            "name": "Which industries do you serve with AI solutions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `We serve ${industries.map(([_, info]) => info.name.toLowerCase()).join(', ')} with industry-specific AI solutions. Each solution is tailored for industry compliance requirements and domain expertise.`
            }
          },
          {
            "@type": "Question",
            "name": "What AI use cases do you implement?",
            "acceptedAnswer": {
              "@type": "Answer", 
              "text": `Our core AI use cases include ${useCases.map(([_, info]) => info.name.toLowerCase()).slice(0, 8).join(', ')}, and more. Each use case is adapted for specific industry requirements with proven ROI validation.`
            }
          },
          {
            "@type": "Question",
            "name": "How do you ensure industry compliance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every AI solution is designed with industry-specific compliance built-in. We ensure adherence to regulations like HIPAA for healthcare, SOX for finance, GDPR for retail, and other industry standards. Our vendor-neutral approach allows us to select the most compliant technologies."
            }
          },
          {
            "@type": "Question",
            "name": "What makes your AI solutions industry-specific?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI solutions incorporate industry-specific terminology, compliance requirements, business processes, and domain expertise. We understand that healthcare AI needs HIPAA compliance while financial AI requires SOX compliance, and we build these requirements into every solution from day one."
            }
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="ai-solutions-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0)
      }}
    />
  );
}
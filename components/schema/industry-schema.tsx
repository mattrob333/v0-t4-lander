import Script from 'next/script';
import useCaseData from '@/lib/seo-data/use-cases.json';

interface IndustrySchemaProps {
  industry: string;
  industryInfo: any;
}

export function IndustrySchema({ industry, industryInfo }: IndustrySchemaProps) {
  const useCases = Object.entries(useCaseData);
  
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization
      {
        "@type": "Organization",
        "@id": "https://tier4intelligence.com/#organization",
        "name": "Tier 4 Intelligence",
        "url": "https://tier4intelligence.com",
        "knowsAbout": [
          "Artificial Intelligence",
          `${industryInfo.name} AI`,
          `AI for ${industryInfo.name}`,
          ...industryInfo.terminology,
          ...useCases.map(([_, info]) => `${info.name} for ${industryInfo.name}`)
        ]
      },
      // WebPage
      {
        "@type": "WebPage",
        "@id": `https://tier4intelligence.com/ai-solutions/${industry}#webpage`,
        "url": `https://tier4intelligence.com/ai-solutions/${industry}`,
        "name": `${industryInfo.name} AI Solutions | 5-Day POC | Tier 4 Intelligence`,
        "description": `Comprehensive AI solutions for ${industryInfo.name.toLowerCase()}. 12 proven use cases with ${industryInfo.compliance} compliance. 5-day proof of concept with validated 3-4x ROI.`,
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
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${industryInfo.name} AI Solutions`,
              "item": `https://tier4intelligence.com/ai-solutions/${industry}`
            }
          ]
        }
      },
      // Service for Industry AI
      {
        "@type": "Service",
        "@id": `https://tier4intelligence.com/ai-solutions/${industry}#service`,
        "name": `AI Solutions for ${industryInfo.name}`,
        "serviceType": `${industryInfo.name} AI Consulting`,
        "description": `Specialized AI implementations for ${industryInfo.name.toLowerCase()} with ${industryInfo.compliance} compliance, industry expertise, and proven ROI validation.`,
        "provider": {
          "@id": "https://tier4intelligence.com/#organization"
        },
        "areaServed": "United States",
        "audience": {
          "@type": "BusinessAudience",
          "audienceType": `${industryInfo.name} Companies`
        },
        "category": `${industryInfo.name} AI`,
        "serviceOutput": {
          "@type": "Thing",
          "name": `${industryInfo.name} AI Solution`,
          "description": `Working AI prototype with ${industryInfo.compliance} compliance and ${industryInfo.metrics[0]} improvement`
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `${industryInfo.name} AI Use Cases`,
          "itemListElement": useCases.map(([useCaseKey, useCaseInfo]) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": `${useCaseInfo.name} AI for ${industryInfo.name}`,
              "serviceType": "AI Implementation",
              "description": `${useCaseInfo.description} specifically designed for ${industryInfo.name.toLowerCase()} with ${industryInfo.compliance} compliance.`,
              "duration": "P5D"
            },
            "url": `https://tier4intelligence.com/ai-solutions/${industry}/${useCaseKey}`,
            "availability": "https://schema.org/InStock",
            "category": `${industryInfo.name} AI`,
            "eligibleRegion": {
              "@type": "Country",
              "name": "United States"
            }
          }))
        }
      },
      // CollectionPage for Use Cases
      {
        "@type": "CollectionPage", 
        "@id": `https://tier4intelligence.com/ai-solutions/${industry}#collection`,
        "name": `AI Use Cases for ${industryInfo.name}`,
        "description": `12 proven AI use cases specifically designed for ${industryInfo.name.toLowerCase()} with industry-specific compliance and expertise.`,
        "url": `https://tier4intelligence.com/ai-solutions/${industry}`,
        "mainEntity": {
          "@type": "ItemList",
          "name": `${industryInfo.name} AI Use Cases`,
          "numberOfItems": useCases.length,
          "itemListElement": useCases.map(([useCaseKey, useCaseInfo], index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": `${useCaseInfo.name} for ${industryInfo.name}`,
            "description": `${useCaseInfo.description} optimized for ${industryInfo.terminology.slice(0, 2).join(' and ')} with ${industryInfo.compliance} compliance`,
            "url": `https://tier4intelligence.com/ai-solutions/${industry}/${useCaseKey}`,
            "item": {
              "@type": "Service",
              "name": `${useCaseInfo.name} AI for ${industryInfo.name}`,
              "provider": {
                "@id": "https://tier4intelligence.com/#organization"
              }
            }
          }))
        }
      },
      // FAQPage for Industry
      {
        "@type": "FAQPage",
        "@id": `https://tier4intelligence.com/ai-solutions/${industry}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What AI solutions do you offer for ${industryInfo.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `We offer 12 proven AI use cases for ${industryInfo.name.toLowerCase()} including ${useCases.slice(0, 6).map(([_, info]) => info.name.toLowerCase()).join(', ')}, and more. Each solution is designed with ${industryInfo.compliance} compliance built-in.`
            }
          },
          {
            "@type": "Question",
            "name": `How do you ensure ${industryInfo.compliance} compliance?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `All our ${industryInfo.name.toLowerCase()} AI solutions are designed with ${industryInfo.compliance} compliance from day one. We understand the regulatory landscape and ensure your AI implementation meets all requirements with complete audit trails and documentation.`
            }
          },
          {
            "@type": "Question",
            "name": `What are the main challenges for ${industryInfo.name} companies with AI?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Common challenges include ${industryInfo.painPoints.slice(0, 3).join(', ')}. Our vendor-neutral approach and industry expertise help overcome these obstacles with proven solutions.`
            }
          },
          {
            "@type": "Question",
            "name": `What metrics do you track for ${industryInfo.name} AI implementations?`,
            "acceptedAnswer": {
              "@type": "Answer", 
              "text": `We focus on key ${industryInfo.name.toLowerCase()} metrics including ${industryInfo.metrics.join(', ')}. Our 5-day POCs deliver measurable improvements with 3-4x ROI validation.`
            }
          },
          {
            "@type": "Question",
            "name": `How long does it take to implement AI for ${industryInfo.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Our 5-day proof of concept delivers a working AI prototype in just 5 days, with full implementation typically completed within 30 days. This is significantly faster than traditional 6+ month AI implementations while ensuring ${industryInfo.compliance} compliance.`
            }
          }
        ]
      },
      // LocalBusiness enhancement
      {
        "@type": "LocalBusiness",
        "@id": `https://tier4intelligence.com/ai-solutions/${industry}#localbusiness`,
        "name": `Tier 4 Intelligence - ${industryInfo.name} AI Specialists`,
        "description": `Leading ${industryInfo.name.toLowerCase()} AI consulting firm providing 5-day proof of concepts with ${industryInfo.compliance} compliance and proven ROI validation.`,
        "url": `https://tier4intelligence.com/ai-solutions/${industry}`,
        "parentOrganization": {
          "@id": "https://tier4intelligence.com/#organization"
        },
        "serviceArea": {
          "@type": "Country",
          "name": "United States"
        },
        "makesOffer": {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `${industryInfo.name} AI Consulting`,
            "serviceType": "AI Implementation"
          },
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  return (
    <Script
      id={`industry-schema-${industry}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0)
      }}
    />
  );
}
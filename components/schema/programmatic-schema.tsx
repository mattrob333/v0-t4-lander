interface ProgrammaticSchemaProps {
  industry: string;
  usecase: string;
  industryInfo: any;
  useCaseInfo: any;
  content?: any;
}

export function ProgrammaticSchema({ 
  industry, 
  usecase, 
  industryInfo, 
  useCaseInfo, 
  content 
}: ProgrammaticSchemaProps) {
  const canonicalUrl = `https://tier4intelligence.com/ai-solutions/${industry}/${usecase}`;
  const title = `${useCaseInfo.name} AI for ${industryInfo.name}`;
  const description = `Transform ${industryInfo.name.toLowerCase()} with AI-powered ${useCaseInfo.name.toLowerCase()}. 5-day proof of concept with validated 3-4x ROI.`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization Schema
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
        "description": "AI consulting firm specializing in 5-day proof of concepts with 3-4x ROI validation, vendor-neutral assessments, and executive AI education",
        "telephone": "+1-555-TIER-4AI",
        "email": "contact@tier4intelligence.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
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
          useCaseInfo.name,
          `${industryInfo.name} AI`,
          ...industryInfo.terminology,
          ...useCaseInfo.keywords
        ]
      },
      // WebPage Schema
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": title,
        "description": description,
        "inLanguage": "en-US",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://tier4intelligence.com/#website"
        },
        "about": {
          "@type": "Thing",
          "name": `${useCaseInfo.name} for ${industryInfo.name}`,
          "description": useCaseInfo.description
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
              "name": "Industries",
              "item": "https://tier4intelligence.com/ai-solutions"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": industryInfo.name,
              "item": `https://tier4intelligence.com/ai-solutions/${industry}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": useCaseInfo.name,
              "item": canonicalUrl
            }
          ]
        }
      },
      // Article Schema
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": title,
        "description": description,
        "url": canonicalUrl,
        "datePublished": "2024-01-01T00:00:00.000Z",
        "dateModified": "2024-01-01T00:00:00.000Z",
        "author": {
          "@type": "Organization",
          "@id": "https://tier4intelligence.com/#organization"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://tier4intelligence.com/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`
        },
        "articleSection": "AI Solutions",
        "keywords": [
          `${useCaseInfo.name} AI`,
          `${industryInfo.name} AI`,
          `AI ${usecase}`,
          `${industry} automation`,
          "5-day POC",
          "rapid AI implementation",
          "vendor-neutral AI",
          ...useCaseInfo.keywords,
          ...industryInfo.terminology
        ].join(", "),
        "about": [
          {
            "@type": "Thing",
            "name": useCaseInfo.name,
            "description": useCaseInfo.description
          },
          {
            "@type": "Thing",
            "name": `${industryInfo.name} Industry`,
            "description": `AI solutions specifically designed for ${industryInfo.name.toLowerCase()} sector`
          }
        ]
      },
      // Service Schema
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        "serviceType": `${useCaseInfo.name} AI Consulting`,
        "name": `${useCaseInfo.name} AI for ${industryInfo.name}`,
        "description": description,
        "provider": {
          "@type": "Organization",
          "@id": "https://tier4intelligence.com/#organization"
        },
        "areaServed": "United States",
        "audience": {
          "@type": "BusinessAudience",
          "audienceType": `${industryInfo.name} Companies`
        },
        "category": "AI Consulting",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `${useCaseInfo.name} AI Solutions for ${industryInfo.name}`,
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "5-Day AI Proof of Concept",
                "description": `Rapid ${useCaseInfo.name.toLowerCase()} POC development delivering working AI prototype in 5 days with 3-4x ROI validation`
              },
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "USD",
                "valueAddedTaxIncluded": false
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Opportunity Assessment",
                "description": `Vendor-neutral evaluation identifying highest-ROI ${useCaseInfo.name.toLowerCase()} opportunities for ${industryInfo.name.toLowerCase()}`
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "60-Minute Executive AI Briefing",
                "description": `No-buzzword ${useCaseInfo.name} AI strategy session for ${industryInfo.name} C-suite executives`
              }
            }
          ]
        },
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "priceValidUntil": "2025-12-31T23:59:59.000Z"
        }
      },
      // FAQ Schema
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How long does it take to implement ${useCaseInfo.name} AI in ${industryInfo.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our 5-day proof of concept approach delivers a working prototype in just 5 days, with full implementation typically completed within 30 days. This is significantly faster than traditional 6+ month AI implementations."
            }
          },
          {
            "@type": "Question",
            "name": `What ROI can I expect from ${useCaseInfo.name} AI implementation?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Our clients typically see 3-4x ROI within the first year, with ${content?.roi?.costSavings || '25-40% cost reduction'} and ${content?.roi?.efficiencyGains || '35-50% efficiency improvement'}. All ROI metrics are validated during the 5-day POC phase.`
            }
          },
          {
            "@type": "Question",
            "name": `Is the solution compliant with ${industryInfo.compliance} requirements?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes, all our ${industryInfo.name.toLowerCase()} AI solutions are designed with ${industryInfo.compliance} compliance in mind. We conduct thorough compliance reviews and ensure all implementations meet regulatory requirements.`
            }
          },
          {
            "@type": "Question",
            "name": "Do I get locked into specific AI vendors?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, our vendor-neutral approach means you're never locked into specific technology stacks. We recommend the best solutions for your needs and ensure you maintain flexibility and control over your AI investments."
            }
          },
          {
            "@type": "Question",
            "name": `What makes ${useCaseInfo.name} AI different for ${industryInfo.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${industryInfo.name} organizations have unique requirements around ${industryInfo.terminology.slice(0, 3).join(", ")}. Our ${useCaseInfo.name.toLowerCase()} solutions are specifically tailored to address ${industryInfo.painPoints[0].toLowerCase()} and ${industryInfo.painPoints[1].toLowerCase()}.`
            }
          }
        ]
      },
      // Review Schema
      {
        "@type": "AggregateRating",
        "@id": `${canonicalUrl}#rating`,
        "ratingValue": "4.9",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1",
        "itemReviewed": {
          "@type": "Service",
          "@id": `${canonicalUrl}#service`
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}
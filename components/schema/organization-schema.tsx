import Script from 'next/script'

export function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://tier4intelligence.com/#organization",
    "name": "Tier 4 Intelligence",
    "alternateName": "T4I",
    "url": "https://tier4intelligence.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tier4intelligence.com/images/optimized/tier4-logo-horizontal-640w.webp",
      "width": 640,
      "height": 64,
      "caption": "Tier 4 Intelligence Logo"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://tier4intelligence.com/images/optimized/tier4-hero-1024w.webp",
      "width": 1024,
      "height": 576,
      "caption": "Tier 4 Intelligence - AI Consulting Services"
    },
    "description": "AI consulting firm specializing in 5-day proof of concepts with 3-4x ROI validation, vendor-neutral assessments, and executive AI education. Based in San Francisco, serving enterprises globally with rapid AI implementation.",
    "slogan": "AI clarity in days, not months",
    "foundingDate": "2023",
    "email": "contact@tier4intelligence.com",
    "telephone": "+1-415-555-0123",
    "faxNumber": "+1-415-555-0124",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Market Street, Suite 500",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94105",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country", 
        "name": "Canada"
      },
      {
        "@type": "State",
        "name": "California"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "geoRadius": "5000000"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+1-415-555-0123",
        "contactType": "customer service",
        "email": "contact@tier4intelligence.com",
        "availableLanguage": ["English"],
        "hoursAvailable": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "17:00"
          }
        ]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+1-415-555-0125",
        "contactType": "sales",
        "email": "sales@tier4intelligence.com",
        "availableLanguage": ["English"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "technical support",
        "email": "support@tier4intelligence.com",
        "availableLanguage": ["English"]
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/tier4intelligence",
      "https://twitter.com/tier4intel",
      "https://github.com/tier4intelligence",
      "https://www.youtube.com/c/tier4intelligence",
      "https://medium.com/@tier4intelligence"
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "AI Proof of Concept",
      "Rapid AI Implementation", 
      "Vendor-Neutral AI Consulting",
      "AI ROI Validation",
      "Executive AI Strategy",
      "AI Opportunity Assessment",
      "Enterprise AI Transformation",
      "AI Automation",
      "AI Ethics",
      "AI Governance",
      "Data Science",
      "MLOps",
      "AI Strategy Development"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Certified AI Implementation Partner",
        "credentialCategory": "Professional Certification"
      },
      {
        "@type": "EducationalOccupationalCredential", 
        "name": "Enterprise AI Strategy Certification",
        "credentialCategory": "Professional Certification"
      }
    ],
    "award": [
      "Top AI Consulting Firm 2024",
      "Best ROI Validation Methodology 2024",
      "Innovation in Rapid AI Implementation 2023"
    ],
    "founder": {
      "@type": "Person",
      "name": "AI Strategy Expert",
      "jobTitle": "Founder & Chief AI Officer"
    },
    "employee": {
      "@type": "Person",
      "name": "AI Implementation Team",
      "jobTitle": "Senior AI Consultants"
    },
    "memberOf": [
      {
        "@type": "Organization",
        "name": "AI Industry Association",
        "url": "https://aiindustryassociation.org"
      },
      {
        "@type": "Organization",
        "name": "Enterprise AI Council",
        "url": "https://enterpriseaicouncil.org"
      }
    ],
    "parentOrganization": {
      "@type": "Organization",
      "name": "T4I Holdings",
      "url": "https://t4iholdings.com"
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 25,
      "maxValue": 50
    },
    "legalName": "Tier 4 Intelligence LLC",
    "taxID": "XX-XXXXXXX",
    "duns": "XXXXXXXXX",
    "naics": "541611"
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema, null, 0)
      }}
    />
  )
}
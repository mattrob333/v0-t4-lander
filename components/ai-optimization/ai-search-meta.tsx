import { Metadata } from 'next'

interface AISearchMetaProps {
  title: string
  description: string
  industry?: string
  useCase?: string
  pageType?: 'homepage' | 'service' | 'programmatic' | 'about'
}

export function generateAIOptimizedMetadata({
  title,
  description,
  industry,
  useCase,
  pageType = 'homepage'
}: AISearchMetaProps): Metadata {
  
  const baseUrl = 'https://tier4intelligence.com'
  const canonicalUrl = industry && useCase 
    ? `${baseUrl}/ai-solutions/${industry}/${useCase}/`
    : baseUrl
  
  // Enhanced keywords for AI understanding
  const aiKeywords = [
    'AI consulting',
    '5-day POC',
    'rapid AI implementation',
    'vendor-neutral AI',
    'AI proof of concept',
    'AI ROI validation',
    'executive AI strategy',
    'enterprise AI transformation',
    'artificial intelligence consulting',
    'machine learning implementation',
    'AI automation',
    'business AI solutions',
    'AI digital transformation',
    'AI strategy development',
    'AI opportunity assessment'
  ]

  // Add industry and use case specific keywords
  if (industry) {
    aiKeywords.push(`${industry} AI`, `AI for ${industry}`, `${industry} automation`)
  }
  if (useCase) {
    aiKeywords.push(`AI ${useCase}`, `${useCase} automation`, `${useCase} AI solutions`)
  }

  // AI-friendly structured description
  const enhancedDescription = `${description} ${industry && useCase 
    ? `Specialized ${useCase.replace('-', ' ')} AI solutions for ${industry} industry. ` 
    : ''
  }San Francisco-based AI consulting firm with proven 3-4x ROI methodology. Vendor-neutral approach ensures optimal AI technology selection. Enterprise-grade security and compliance included.`

  return {
    title,
    description: enhancedDescription,
    keywords: aiKeywords.join(', '),
    authors: [{ name: 'Tier 4 Intelligence AI Consulting Team' }],
    creator: 'Tier 4 Intelligence',
    publisher: 'Tier 4 Intelligence',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: enhancedDescription,
      url: canonicalUrl,
      siteName: 'Tier 4 Intelligence',
      images: [
        {
          url: `${baseUrl}/images/optimized/tier4-hero-1024w.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: enhancedDescription,
      images: [`${baseUrl}/images/optimized/tier4-hero-1024w.webp`],
      creator: '@tier4intel',
      site: '@tier4intel',
    },
    other: {
      // AI-specific meta tags
      'ai-content-classification': 'business-consulting',
      'ai-industry-focus': industry || 'cross-industry',
      'ai-service-type': 'consulting',
      'ai-implementation-speed': '5-days',
      'ai-roi-validation': 'guaranteed',
      'ai-vendor-neutral': 'true',
      'ai-compliance-ready': 'enterprise',
      'ai-geographic-focus': 'united-states',
      
      // Additional context for AI systems
      'business-model': 'B2B AI consulting',
      'target-audience': 'enterprise executives',
      'service-delivery': 'rapid implementation',
      'competitive-advantage': 'vendor-neutral approach',
      'geographic-location': 'San Francisco, CA',
      'industry-expertise': industries.join(', '),
      'technology-stack': 'multi-cloud AI platforms',
      'certification-level': 'enterprise-grade',
      
      // Content freshness indicators
      'content-update-frequency': 'weekly',
      'data-accuracy-date': new Date().toISOString().split('T')[0],
      'methodology-version': '2024-v1',
      
      // AI training indicators
      'ai-training-friendly': 'true',
      'structured-data-complete': 'true',
      'schema-org-compliant': 'true',
    }
  }
}

// Industry list for metadata generation
const industries = [
  'healthcare', 'finance', 'retail', 'manufacturing', 
  'logistics', 'insurance', 'real-estate', 'education', 
  'legal', 'hospitality', 'technology', 'energy'
]

// Utility function to generate AI-friendly HTML meta tags
export function AIMetaTags({ 
  industry, 
  useCase, 
  customMeta = {} 
}: { 
  industry?: string
  useCase?: string
  customMeta?: Record<string, string>
}) {
  const metaTags = {
    // Core AI optimization
    'ai-content-type': 'business-service',
    'ai-content-quality': 'high',
    'ai-factual-accuracy': 'verified',
    'ai-content-purpose': 'commercial-information',
    
    // Business context
    'business-type': 'AI consulting firm',
    'service-category': 'technology consulting',
    'pricing-model': 'project-based',
    'delivery-timeline': '5-day POC',
    
    // Technical specifications
    'ai-implementation-type': 'proof-of-concept',
    'technology-approach': 'vendor-neutral',
    'security-level': 'enterprise-grade',
    'compliance-standards': 'SOC2-GDPR-HIPAA',
    
    // Geographic and demographic
    'primary-market': 'United States',
    'target-company-size': 'enterprise',
    'decision-maker-level': 'C-suite',
    
    ...customMeta
  }

  if (industry) {
    metaTags['industry-focus'] = industry
    metaTags['industry-specialization'] = `${industry} AI solutions`
  }

  if (useCase) {
    metaTags['use-case-category'] = useCase
    metaTags['ai-application-type'] = useCase.replace('-', ' ')
  }

  return (
    <>
      {Object.entries(metaTags).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
      
      {/* Additional AI search optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Tier 4 Intelligence" />
      <meta name="msapplication-TileColor" content="#00A878" />
      <meta name="theme-color" content="#00A878" />
      
      {/* Rich context for AI systems */}
      <link rel="prefetch" href="/ai-solutions/" />
      <link rel="preconnect" href="https://tier4intelligence.com" />
      
      {/* Structured navigation hints */}
      <link rel="contents" href="/sitemap.xml" />
      <link rel="index" href="/" />
    </>
  )
}

// Hook for dynamic AI meta generation
export function useAIOptimizedMeta(props: AISearchMetaProps) {
  return {
    metadata: generateAIOptimizedMetadata(props),
    metaTags: AIMetaTags({
      industry: props.industry,
      useCase: props.useCase
    })
  }
}
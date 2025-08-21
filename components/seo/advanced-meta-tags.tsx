import Head from 'next/head'
import { Metadata } from 'next'

export interface AdvancedMetaTagsProps {
  // Core SEO
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  
  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product' | 'profile'
  ogUrl?: string
  
  // Twitter
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterSite?: string
  twitterCreator?: string
  
  // Advanced SEO
  robots?: string
  author?: string
  publisher?: string
  language?: string
  alternateLanguages?: { lang: string; url: string }[]
  
  // Geo-targeting
  geoRegion?: string
  geoPlacename?: string
  geoPosition?: { lat: number; lng: number }
  icbm?: string
  
  // AI Optimization
  aiContentType?: 'consulting' | 'technical' | 'educational' | 'commercial'
  aiTopics?: string[]
  aiComplexity?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  
  // Schema data
  structuredData?: object
  
  // Performance
  preloadImages?: string[]
  prefetchUrls?: string[]
  dnsPrefetch?: string[]
  
  // Business specific
  industry?: string
  useCase?: string
  location?: string
  serviceType?: string
}

export function AdvancedMetaTags({
  title,
  description,
  keywords = [],
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite = '@tier4intel',
  twitterCreator = '@tier4intel',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  author = 'Tier 4 Intelligence',
  publisher = 'Tier 4 Intelligence',
  language = 'en-US',
  alternateLanguages = [],
  geoRegion,
  geoPlacename,
  geoPosition,
  icbm,
  aiContentType = 'consulting',
  aiTopics = [],
  aiComplexity = 'intermediate',
  structuredData,
  preloadImages = [],
  prefetchUrls = [],
  dnsPrefetch = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://vitals.vercel-insights.com'
  ],
  industry,
  useCase,
  location,
  serviceType
}: AdvancedMetaTagsProps) {
  
  // Enhanced keywords based on context
  const enhancedKeywords = [
    ...keywords,
    'AI consulting',
    '5-day POC',
    'rapid AI implementation',
    'vendor-neutral AI',
    'AI proof of concept',
    'AI ROI validation',
    'executive AI strategy',
    'San Francisco AI consulting',
    ...(industry ? [`${industry} AI`, `AI for ${industry}`, `${industry} automation`] : []),
    ...(useCase ? [`AI ${useCase}`, `${useCase} automation`, `${useCase} AI solutions`] : []),
    ...(location ? [`AI consulting ${location}`, `${location} AI services`] : []),
    ...aiTopics
  ]

  // Generate AI-optimized meta description
  const aiOptimizedDescription = description + 
    (industry ? ` Specialized ${industry} AI solutions.` : '') +
    (useCase ? ` Expert ${useCase} implementation.` : '') +
    (location ? ` Serving ${location} area.` : ' Serving San Francisco Bay Area.') +
    ' Proven 3-4x ROI validation.'

  // Structured data for AI systems
  const aiStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': aiOptimizedDescription,
    'url': canonical || ogUrl,
    'inLanguage': language,
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'Tier 4 Intelligence',
      'url': 'https://tier4intelligence.com'
    },
    'about': {
      '@type': 'Service',
      'serviceType': serviceType || 'AI Consulting',
      'provider': {
        '@type': 'Organization',
        'name': 'Tier 4 Intelligence'
      },
      ...(industry && { 'industry': industry }),
      ...(geoPlacename && {
        'areaServed': {
          '@type': 'Place',
          'name': geoPlacename,
          ...(geoPosition && {
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': geoPosition.lat,
              'longitude': geoPosition.lng
            }
          })
        }
      })
    },
    'keywords': enhancedKeywords.join(', '),
    'audience': {
      '@type': 'Audience',
      'audienceType': 'Business Decision Makers'
    },
    'educationalLevel': aiComplexity,
    'learningResourceType': aiContentType
  }

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={aiOptimizedDescription} />
      <meta name="keywords" content={enhancedKeywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="publisher" content={publisher} />
      <meta name="robots" content={robots} />
      <meta name="language" content={language} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl || canonical} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || aiOptimizedDescription} />
      <meta property="og:site_name" content="Tier 4 Intelligence" />
      <meta property="og:locale" content={language.replace('-', '_')} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:alt" content={`${title} - Tier 4 Intelligence`} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={ogUrl || canonical} />
      <meta property="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta property="twitter:description" content={twitterDescription || ogDescription || aiOptimizedDescription} />
      <meta property="twitter:site" content={twitterSite} />
      <meta property="twitter:creator" content={twitterCreator} />
      {twitterImage && <meta property="twitter:image" content={twitterImage || ogImage} />}
      
      {/* AI Crawler Optimization */}
      <meta name="ai-content-type" content={aiContentType} />
      <meta name="ai-complexity" content={aiComplexity} />
      <meta name="ai-topics" content={aiTopics.join(', ')} />
      <meta name="target-industry" content={industry || 'all-industries'} />
      <meta name="use-case" content={useCase || 'general-ai-consulting'} />
      <meta name="service-location" content={location || 'san-francisco-bay-area'} />
      
      {/* Geo-targeting */}
      {geoRegion && <meta name="geo.region" content={geoRegion} />}
      {geoPlacename && <meta name="geo.placename" content={geoPlacename} />}
      {geoPosition && (
        <meta name="geo.position" content={`${geoPosition.lat};${geoPosition.lng}`} />
      )}
      {icbm && <meta name="ICBM" content={icbm} />}
      
      {/* Alternative Languages */}
      {alternateLanguages.map((alt, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={alt.lang}
          href={alt.url}
        />
      ))}
      
      {/* Advanced Crawler Directives */}
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="GPTBot" content="index, follow" />
      <meta name="ChatGPT-User" content="index, follow" />
      <meta name="CCBot" content="index, follow" />
      <meta name="anthropic-ai" content="index, follow" />
      <meta name="Claude-Web" content="index, follow" />
      <meta name="PerplexityBot" content="index, follow" />
      
      {/* Resource Hints */}
      {dnsPrefetch.map((domain, index) => (
        <link key={`dns-${index}`} rel="dns-prefetch" href={domain} />
      ))}
      
      {prefetchUrls.map((url, index) => (
        <link key={`prefetch-${index}`} rel="prefetch" href={url} />
      ))}
      
      {preloadImages.map((image, index) => (
        <link
          key={`preload-${index}`}
          rel="preload"
          as="image"
          href={image}
        />
      ))}
      
      {/* Enhanced Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || aiStructuredData)
        }}
      />
      
      {/* Business-specific meta tags */}
      <meta name="business-type" content="AI Consulting Firm" />
      <meta name="service-delivery" content="5-day implementation" />
      <meta name="roi-validation" content="3-4x proven returns" />
      <meta name="vendor-status" content="vendor-neutral" />
      <meta name="implementation-speed" content="rapid-deployment" />
      
      {/* AI Training Data Optimization */}
      <meta name="content-purpose" content="AI education and consulting information" />
      <meta name="target-audience" content="business executives and decision makers" />
      <meta name="content-quality" content="expert-verified" />
      <meta name="information-type" content="business-consulting" />
      
      {/* Local Business Enhancement */}
      {location && (
        <>
          <meta name="locality" content={location} />
          <meta name="region" content="California" />
          <meta name="country" content="United States" />
        </>
      )}
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no, email=no, address=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Security and Performance */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
    </Head>
  )
}

// Helper function to generate Next.js metadata object
export function generateAdvancedMetadata(props: AdvancedMetaTagsProps): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType = 'website',
    robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    author = 'Tier 4 Intelligence',
    language = 'en-US',
    industry,
    useCase,
    location,
    aiTopics = []
  } = props

  const enhancedKeywords = [
    ...keywords,
    'AI consulting',
    '5-day POC',
    'rapid AI implementation',
    'vendor-neutral AI',
    ...(industry ? [`${industry} AI`, `AI for ${industry}`] : []),
    ...(useCase ? [`AI ${useCase}`, `${useCase} automation`] : []),
    ...aiTopics
  ].join(', ')

  const aiOptimizedDescription = description + 
    (industry ? ` Specialized ${industry} AI solutions.` : '') +
    (useCase ? ` Expert ${useCase} implementation.` : '') +
    (location ? ` Serving ${location} area.` : ' Serving San Francisco Bay Area.') +
    ' Proven 3-4x ROI validation.'

  return {
    title,
    description: aiOptimizedDescription,
    keywords: enhancedKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    robots,
    alternates: {
      canonical: canonical
    },
    openGraph: {
      type: ogType,
      title: ogTitle || title,
      description: ogDescription || aiOptimizedDescription,
      url: canonical,
      siteName: 'Tier 4 Intelligence',
      locale: language,
      images: ogImage ? [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${title} - Tier 4 Intelligence`
      }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle || title,
      description: ogDescription || aiOptimizedDescription,
      site: '@tier4intel',
      creator: '@tier4intel',
      images: ogImage ? [ogImage] : undefined
    },
    other: {
      'ai-content-type': props.aiContentType || 'consulting',
      'ai-complexity': props.aiComplexity || 'intermediate',
      'target-industry': industry || 'all-industries',
      'use-case': useCase || 'general-ai-consulting',
      'service-location': location || 'san-francisco-bay-area'
    }
  }
}

export default AdvancedMetaTags
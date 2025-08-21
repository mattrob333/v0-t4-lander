"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'

// Keyword mapping for automated internal linking
const KEYWORD_MAPPING = {
  '5-day POC': '/services/5-day-poc/',
  'AI assessment': '/services/ai-opportunity-assessment/',
  'executive briefing': '/services/executive-briefing/',
  'vendor-neutral': '/about/vendor-neutral-approach/',
  'ROI validation': '/resources/roi-calculator/',
  'rapid implementation': '/methodology/rapid-ai-implementation/',
  'AI consulting': '/services/',
  'artificial intelligence': '/ai-solutions/',
  'machine learning': '/ai-solutions/technology/automation/',
  'healthcare AI': '/ai-solutions/healthcare/',
  'finance AI': '/ai-solutions/finance/',
  'retail AI': '/ai-solutions/retail/',
  'manufacturing AI': '/ai-solutions/manufacturing/',
  'fraud detection': '/ai-solutions/finance/fraud-detection/',
  'predictive analytics': '/ai-solutions/healthcare/prediction/',
  'automation': '/ai-solutions/manufacturing/automation/',
  'risk assessment': '/ai-solutions/insurance/risk-assessment/',
  'compliance': '/compliance/',
  'HIPAA': '/compliance/hipaa/',
  'SOX': '/compliance/sox/',
  'GDPR': '/compliance/gdpr/'
}

// Smart internal linking component
export function InternalLinkingSystem({ content, className = "" }: { 
  content: string
  className?: string 
}) {
  const processContent = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = []
    let processedText = text
    let keyIndex = 0

    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = Object.keys(KEYWORD_MAPPING).sort((a, b) => b.length - a.length)

    sortedKeywords.forEach(keyword => {
      const url = KEYWORD_MAPPING[keyword as keyof typeof KEYWORD_MAPPING]
      const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi')
      
      if (regex.test(processedText)) {
        processedText = processedText.replace(regex, `<INTERNAL_LINK_${keyIndex}>${keyword}</INTERNAL_LINK_${keyIndex}>`)
        keyIndex++
      }
    })

    // Split by our markers and create proper React elements
    const parts = processedText.split(/(<INTERNAL_LINK_\d+>.*?<\/INTERNAL_LINK_\d+>)/)
    
    parts.forEach((part, index) => {
      const linkMatch = part.match(/<INTERNAL_LINK_\d+>(.*?)<\/INTERNAL_LINK_\d+>/)
      
      if (linkMatch) {
        const linkText = linkMatch[1]
        const url = KEYWORD_MAPPING[linkText.toLowerCase() as keyof typeof KEYWORD_MAPPING]
        
        if (url) {
          elements.push(
            <Link 
              key={`link-${index}`}
              href={url}
              className="internal-link text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
              title={`Learn more about ${linkText}`}
            >
              {linkText}
            </Link>
          )
        } else {
          elements.push(<span key={`text-${index}`}>{linkText}</span>)
        }
      } else {
        elements.push(<span key={`text-${index}`}>{part}</span>)
      }
    })

    return elements
  }

  return (
    <div className={className}>
      {processContent(content)}
    </div>
  )
}

// Related pages component for sidebar/footer
export function RelatedPages({ currentPath }: { currentPath: string }) {
  const getRelatedPages = (path: string) => {
    const related = []

    // Industry-specific related pages
    if (path.includes('/healthcare/')) {
      related.push(
        { title: 'Healthcare AI Automation', url: '/ai-solutions/healthcare/automation/', description: 'Streamline healthcare workflows with AI' },
        { title: 'Healthcare Predictive Analytics', url: '/ai-solutions/healthcare/prediction/', description: 'Predict patient outcomes and optimize care' },
        { title: 'Healthcare Compliance', url: '/compliance/hipaa/', description: 'HIPAA-compliant AI solutions' }
      )
    } else if (path.includes('/finance/')) {
      related.push(
        { title: 'Financial Fraud Detection', url: '/ai-solutions/finance/fraud-detection/', description: 'Real-time fraud prevention with AI' },
        { title: 'Financial Risk Assessment', url: '/ai-solutions/finance/risk-assessment/', description: 'AI-powered risk analysis and mitigation' },
        { title: 'SOX Compliance', url: '/compliance/sox/', description: 'SOX-compliant financial AI solutions' }
      )
    } else if (path.includes('/retail/')) {
      related.push(
        { title: 'Retail Personalization', url: '/ai-solutions/retail/personalization/', description: 'Personalized customer experiences with AI' },
        { title: 'Retail Forecasting', url: '/ai-solutions/retail/forecasting/', description: 'Demand forecasting and inventory optimization' },
        { title: 'Retail Recommendation Engine', url: '/ai-solutions/retail/recommendation/', description: 'AI-powered product recommendations' }
      )
    }

    // Service-related pages
    if (related.length < 3) {
      related.push(
        { title: '5-Day AI Proof of Concept', url: '/services/5-day-poc/', description: 'Rapid AI implementation with guaranteed ROI' },
        { title: 'AI Opportunity Assessment', url: '/services/ai-opportunity-assessment/', description: 'Identify your highest-value AI opportunities' },
        { title: 'Executive AI Briefing', url: '/services/executive-briefing/', description: 'No-buzzword AI strategy for executives' }
      )
    }

    return related.slice(0, 3)
  }

  const relatedPages = getRelatedPages(currentPath)

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Related Resources</h3>
      <div className="space-y-4">
        {relatedPages.map((page, index) => (
          <Link 
            key={index}
            href={page.url}
            className="block p-3 bg-white rounded border hover:shadow-md transition-shadow duration-200"
          >
            <h4 className="font-medium text-blue-600 hover:text-blue-800">{page.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Breadcrumb navigation component
export function BreadcrumbNavigation({ path }: { path: string }) {
  const generateBreadcrumbs = (currentPath: string) => {
    const segments = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Home', url: '/' }]

    let currentUrl = ''
    segments.forEach((segment, index) => {
      currentUrl += `/${segment}`
      
      let name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      
      // Custom naming for specific paths
      if (segment === 'ai-solutions') name = 'AI Solutions'
      if (segment === '5-day-poc') name = '5-Day POC'
      
      breadcrumbs.push({
        name,
        url: currentUrl
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs(path)

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-500 text-sm font-medium">{crumb.name}</span>
            ) : (
              <Link 
                href={crumb.url}
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Topic cluster navigation
export function TopicClusterNav({ currentTopic, currentIndustry }: { 
  currentTopic?: string
  currentIndustry?: string 
}) {
  const industries = [
    'healthcare', 'finance', 'retail', 'manufacturing', 
    'logistics', 'insurance', 'real-estate', 'education',
    'legal', 'hospitality', 'technology', 'energy'
  ]

  const useCases = [
    'automation', 'prediction', 'optimization', 'personalization',
    'fraud-detection', 'classification', 'content-generation', 
    'data-extraction', 'recommendation', 'forecasting',
    'quality-control', 'risk-assessment'
  ]

  return (
    <div className="bg-white border rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4">Explore AI Solutions</h3>
      
      {currentIndustry && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-2">Other {currentIndustry.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} AI Solutions:</h4>
          <div className="flex flex-wrap gap-2">
            {useCases.map(useCase => (
              <Link
                key={useCase}
                href={`/ai-solutions/${currentIndustry}/${useCase}/`}
                className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                  currentTopic === useCase 
                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50'
                }`}
              >
                {useCase.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
            ))}
          </div>
        </div>
      )}

      {currentTopic && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">
            {currentTopic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} AI in Other Industries:
          </h4>
          <div className="flex flex-wrap gap-2">
            {industries.map(industry => (
              <Link
                key={industry}
                href={`/ai-solutions/${industry}/${currentTopic}/`}
                className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                  currentIndustry === industry 
                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50'
                }`}
              >
                {industry.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Client-side script for automatic keyword linking
export function AutomaticInternalLinking() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const linkifyContent = () => {
      const main = document.querySelector('main')
      if (!main) return

      // Skip if already processed
      if (main.getAttribute('data-internal-links-processed')) return

      let html = main.innerHTML
      const processedKeywords = new Set()

      // Process keywords in order of length (longest first)
      Object.entries(KEYWORD_MAPPING)
        .sort(([a], [b]) => b.length - a.length)
        .forEach(([keyword, url]) => {
          // Skip if a longer keyword containing this one was already processed
          const shouldSkip = Array.from(processedKeywords).some(processed => 
            processed.includes(keyword) && processed !== keyword
          )
          
          if (shouldSkip) return

          const regex = new RegExp(
            `\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b(?![^<]*>)(?![^<]*<\/a>)`,
            'gi'
          )
          
          const matches = html.match(regex)
          if (matches && matches.length > 0) {
            // Only link the first occurrence
            html = html.replace(regex, `<a href="${url}" class="internal-link text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200" title="Learn more about $1">$1</a>`)
            processedKeywords.add(keyword)
          }
        })

      main.innerHTML = html
      main.setAttribute('data-internal-links-processed', 'true')
    }

    // Run after a short delay to ensure content is loaded
    const timer = setTimeout(linkifyContent, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return null
}

// Export all components
export default {
  InternalLinkingSystem,
  RelatedPages,
  BreadcrumbNavigation,
  TopicClusterNav,
  AutomaticInternalLinking
}
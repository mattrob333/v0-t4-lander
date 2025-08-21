/**
 * Advanced Internal Linking Strategy System
 * Automates intelligent internal linking for SEO optimization and user experience
 */

export interface LinkingRule {
  id: string
  keyword: string | RegExp
  targetUrl: string
  anchor: string
  priority: number
  contextRules?: {
    includePages?: string[]
    excludePages?: string[]
    maxLinksPerPage?: number
    position?: 'first' | 'last' | 'all'
    proximity?: string[] // Keywords that should be near the target keyword
  }
  seoValue: number
  description: string
  isActive: boolean
}

export interface PageContext {
  url: string
  title: string
  content: string
  keywords: string[]
  category: string
  industry?: string
  useCase?: string
  pageType: 'service' | 'industry' | 'use-case' | 'content' | 'landing'
}

export interface LinkSuggestion {
  keyword: string
  targetUrl: string
  anchor: string
  confidence: number
  seoValue: number
  position: number
  context: string
  reason: string
}

export interface LinkingAnalysis {
  totalLinks: number
  internalLinks: number
  externalLinks: number
  orphanPages: string[]
  hubPages: string[]
  linkDepth: Map<string, number>
  topLinked: Array<{ url: string; count: number }>
  recommendations: string[]
}

export class InternalLinkingManager {
  private rules: Map<string, LinkingRule> = new Map()
  private pages: Map<string, PageContext> = new Map()
  private linkGraph: Map<string, Set<string>> = new Map()

  constructor() {
    this.initializeDefaultRules()
  }

  /**
   * Initialize default linking rules for AI consulting content
   */
  private initializeDefaultRules(): void {
    const defaultRules: Omit<LinkingRule, 'id'>[] = [
      // Core service links
      {
        keyword: /\b(5[- ]?day\s+(?:AI\s+)?POC|five[- ]day\s+(?:proof\s+of\s+concept|POC))\b/gi,
        targetUrl: '/services/5-day-poc/',
        anchor: '5-day AI POC',
        priority: 100,
        seoValue: 95,
        description: 'Primary service offering - highest priority',
        isActive: true,
        contextRules: {
          maxLinksPerPage: 2,
          position: 'first'
        }
      },
      {
        keyword: /\b(AI\s+(?:opportunity\s+)?assessment|vendor[- ]neutral\s+(?:AI\s+)?evaluation)\b/gi,
        targetUrl: '/services/ai-opportunity-assessment/',
        anchor: 'AI opportunity assessment',
        priority: 90,
        seoValue: 90,
        description: 'Key assessment service',
        isActive: true,
        contextRules: {
          maxLinksPerPage: 2,
          proximity: ['consulting', 'evaluation', 'strategy']
        }
      },
      {
        keyword: /\b(executive\s+(?:AI\s+)?briefing|C[- ]suite\s+AI|leadership\s+AI)\b/gi,
        targetUrl: '/services/executive-briefing/',
        anchor: 'executive AI briefing',
        priority: 85,
        seoValue: 85,
        description: 'Executive-focused service',
        isActive: true,
        contextRules: {
          includePages: ['/about/', '/case-studies/'],
          maxLinksPerPage: 1
        }
      },

      // Industry-specific links
      {
        keyword: /\b(healthcare\s+AI|AI\s+in\s+healthcare|medical\s+AI)\b/gi,
        targetUrl: '/ai-solutions/healthcare/',
        anchor: 'healthcare AI solutions',
        priority: 80,
        seoValue: 80,
        description: 'Healthcare industry targeting',
        isActive: true,
        contextRules: {
          excludePages: ['/ai-solutions/healthcare/'],
          maxLinksPerPage: 1
        }
      },
      {
        keyword: /\b(finance\s+AI|AI\s+in\s+finance|fintech\s+AI|financial\s+AI)\b/gi,
        targetUrl: '/ai-solutions/finance/',
        anchor: 'finance AI solutions',
        priority: 80,
        seoValue: 80,
        description: 'Finance industry targeting',
        isActive: true,
        contextRules: {
          excludePages: ['/ai-solutions/finance/'],
          maxLinksPerPage: 1
        }
      },
      {
        keyword: /\b(retail\s+AI|AI\s+in\s+retail|e[- ]commerce\s+AI)\b/gi,
        targetUrl: '/ai-solutions/retail/',
        anchor: 'retail AI solutions',
        priority: 75,
        seoValue: 75,
        description: 'Retail industry targeting',
        isActive: true
      },
      {
        keyword: /\b(manufacturing\s+AI|AI\s+in\s+manufacturing|industrial\s+AI)\b/gi,
        targetUrl: '/ai-solutions/manufacturing/',
        anchor: 'manufacturing AI solutions',
        priority: 75,
        seoValue: 75,
        description: 'Manufacturing industry targeting',
        isActive: true
      },

      // Use case specific links
      {
        keyword: /\b(fraud\s+detection|AI\s+fraud|fraudulent\s+activity)\b/gi,
        targetUrl: '/ai-solutions/finance/fraud-detection/',
        anchor: 'AI fraud detection',
        priority: 70,
        seoValue: 70,
        description: 'High-value use case',
        isActive: true,
        contextRules: {
          proximity: ['finance', 'banking', 'security']
        }
      },
      {
        keyword: /\b(personalization|AI\s+personalization|personalized\s+experience)\b/gi,
        targetUrl: '/ai-solutions/retail/personalization/',
        anchor: 'AI personalization',
        priority: 65,
        seoValue: 65,
        description: 'Popular use case for retail',
        isActive: true
      },
      {
        keyword: /\b(quality\s+control|AI\s+quality|automated\s+inspection)\b/gi,
        targetUrl: '/ai-solutions/manufacturing/quality-control/',
        anchor: 'AI quality control',
        priority: 65,
        seoValue: 65,
        description: 'Manufacturing quality use case',
        isActive: true
      },
      {
        keyword: /\b(predictive\s+analytics|AI\s+prediction|forecasting)\b/gi,
        targetUrl: '/ai-solutions/use-cases/prediction/',
        anchor: 'predictive analytics',
        priority: 60,
        seoValue: 60,
        description: 'Cross-industry use case',
        isActive: true
      },

      // Content and process links
      {
        keyword: /\b(case\s+studies|success\s+stories|AI\s+implementations)\b/gi,
        targetUrl: '/case-studies/',
        anchor: 'case studies',
        priority: 55,
        seoValue: 55,
        description: 'Social proof content',
        isActive: true,
        contextRules: {
          excludePages: ['/case-studies/'],
          maxLinksPerPage: 1
        }
      },
      {
        keyword: /\b(ROI\s+calculator|calculate\s+ROI|AI\s+ROI)\b/gi,
        targetUrl: '/roi-calculator/',
        anchor: 'ROI calculator',
        priority: 50,
        seoValue: 50,
        description: 'Conversion tool',
        isActive: true,
        contextRules: {
          maxLinksPerPage: 1,
          position: 'last'
        }
      },
      {
        keyword: /\b(schedule\s+(?:a\s+)?(?:consultation|assessment|call)|book\s+(?:a\s+)?meeting)\b/gi,
        targetUrl: '/schedule-assessment/',
        anchor: 'schedule an assessment',
        priority: 95,
        seoValue: 90,
        description: 'Primary CTA',
        isActive: true,
        contextRules: {
          maxLinksPerPage: 1,
          position: 'last'
        }
      },

      // Methodology and about links
      {
        keyword: /\b(methodology|approach|process|framework)\b/gi,
        targetUrl: '/methodology/',
        anchor: 'our methodology',
        priority: 45,
        seoValue: 45,
        description: 'Process explanation',
        isActive: true,
        contextRules: {
          excludePages: ['/methodology/'],
          maxLinksPerPage: 1
        }
      },
      {
        keyword: /\b(about\s+(?:us|tier\s?4)|who\s+we\s+are|our\s+team)\b/gi,
        targetUrl: '/about/',
        anchor: 'about us',
        priority: 40,
        seoValue: 40,
        description: 'Company information',
        isActive: true,
        contextRules: {
          excludePages: ['/about/'],
          maxLinksPerPage: 1
        }
      }
    ]

    defaultRules.forEach((rule, index) => {
      this.addRule({
        ...rule,
        id: `default-${index}`,
      })
    })
  }

  /**
   * Add a new linking rule
   */
  public addRule(rule: LinkingRule): void {
    this.rules.set(rule.id, rule)
  }

  /**
   * Update an existing linking rule
   */
  public updateRule(id: string, updates: Partial<LinkingRule>): boolean {
    const rule = this.rules.get(id)
    if (!rule) return false

    this.rules.set(id, { ...rule, ...updates })
    return true
  }

  /**
   * Remove a linking rule
   */
  public removeRule(id: string): boolean {
    return this.rules.delete(id)
  }

  /**
   * Add page context for analysis
   */
  public addPage(context: PageContext): void {
    this.pages.set(context.url, context)
  }

  /**
   * Analyze content and suggest internal links
   */
  public analyzeContent(content: string, currentUrl: string): LinkSuggestion[] {
    const suggestions: LinkSuggestion[] = []
    const currentPage = this.pages.get(currentUrl)
    const usedAnchors = new Set<string>()

    // Sort rules by priority (highest first)
    const sortedRules = Array.from(this.rules.values())
      .filter(rule => rule.isActive)
      .sort((a, b) => b.priority - a.priority)

    for (const rule of sortedRules) {
      const matches = this.findMatches(content, rule.keyword)
      
      if (matches.length === 0) continue

      // Apply context rules
      if (!this.shouldApplyRule(rule, currentUrl, currentPage)) continue

      // Process matches
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i]
        
        // Check max links per page
        if (rule.contextRules?.maxLinksPerPage) {
          const existingLinksToTarget = suggestions.filter(s => s.targetUrl === rule.targetUrl).length
          if (existingLinksToTarget >= rule.contextRules.maxLinksPerPage) break
        }

        // Check position rules
        if (rule.contextRules?.position) {
          if (rule.contextRules.position === 'first' && i > 0) continue
          if (rule.contextRules.position === 'last' && i < matches.length - 1) continue
        }

        // Avoid duplicate anchors on same page
        if (usedAnchors.has(rule.anchor)) continue

        // Check proximity rules
        const confidence = this.calculateConfidence(content, match, rule)
        if (confidence < 0.5) continue

        suggestions.push({
          keyword: match.text,
          targetUrl: rule.targetUrl,
          anchor: rule.anchor,
          confidence,
          seoValue: rule.seoValue,
          position: match.index,
          context: this.getContext(content, match.index),
          reason: rule.description
        })

        usedAnchors.add(rule.anchor)
      }
    }

    // Sort by priority and confidence
    return suggestions
      .sort((a, b) => (b.seoValue * b.confidence) - (a.seoValue * a.confidence))
      .slice(0, 10) // Limit suggestions per page
  }

  /**
   * Find matches for keyword in content
   */
  private findMatches(content: string, keyword: string | RegExp): Array<{ text: string; index: number }> {
    const matches: Array<{ text: string; index: number }> = []
    
    if (typeof keyword === 'string') {
      const regex = new RegExp(keyword, 'gi')
      let match
      while ((match = regex.exec(content)) !== null) {
        matches.push({
          text: match[0],
          index: match.index
        })
      }
    } else {
      let match
      while ((match = keyword.exec(content)) !== null) {
        matches.push({
          text: match[0],
          index: match.index
        })
      }
    }

    return matches
  }

  /**
   * Check if rule should be applied to current page
   */
  private shouldApplyRule(rule: LinkingRule, currentUrl: string, currentPage?: PageContext): boolean {
    const contextRules = rule.contextRules

    if (!contextRules) return true

    // Check include pages
    if (contextRules.includePages) {
      const included = contextRules.includePages.some(page => currentUrl.includes(page))
      if (!included) return false
    }

    // Check exclude pages
    if (contextRules.excludePages) {
      const excluded = contextRules.excludePages.some(page => currentUrl.includes(page))
      if (excluded) return false
    }

    return true
  }

  /**
   * Calculate confidence score for a match
   */
  private calculateConfidence(content: string, match: { text: string; index: number }, rule: LinkingRule): number {
    let confidence = 0.7 // Base confidence

    // Check proximity rules
    if (rule.contextRules?.proximity) {
      const contextWindow = this.getContext(content, match.index, 200)
      const proximityMatches = rule.contextRules.proximity.filter(term => 
        contextWindow.toLowerCase().includes(term.toLowerCase())
      )
      confidence += (proximityMatches.length / rule.contextRules.proximity.length) * 0.3
    }

    // Boost confidence for exact keyword matches
    if (typeof rule.keyword === 'string' && match.text.toLowerCase() === rule.keyword.toLowerCase()) {
      confidence += 0.1
    }

    // Reduce confidence if keyword appears too frequently (keyword stuffing)
    const keywordFrequency = (content.match(new RegExp(match.text, 'gi')) || []).length
    const contentLength = content.length
    const density = (keywordFrequency * match.text.length) / contentLength
    
    if (density > 0.05) { // More than 5% density
      confidence -= 0.2
    }

    return Math.min(1, Math.max(0, confidence))
  }

  /**
   * Get context around a match
   */
  private getContext(content: string, index: number, windowSize: number = 100): string {
    const start = Math.max(0, index - windowSize)
    const end = Math.min(content.length, index + windowSize)
    return content.slice(start, end)
  }

  /**
   * Apply internal links to content
   */
  public applyInternalLinks(content: string, currentUrl: string): string {
    const suggestions = this.analyzeContent(content, currentUrl)
    let modifiedContent = content

    // Apply links in reverse order to maintain positions
    suggestions
      .sort((a, b) => b.position - a.position)
      .forEach(suggestion => {
        const linkHtml = `<a href="${suggestion.targetUrl}" class="internal-link" data-seo-value="${suggestion.seoValue}">${suggestion.anchor}</a>`
        
        // Find the exact match and replace it
        const beforeMatch = modifiedContent.slice(0, suggestion.position)
        const afterMatch = modifiedContent.slice(suggestion.position + suggestion.keyword.length)
        
        modifiedContent = beforeMatch + linkHtml + afterMatch
      })

    return modifiedContent
  }

  /**
   * Analyze site-wide internal linking structure
   */
  public analyzeSiteLinking(): LinkingAnalysis {
    const analysis: LinkingAnalysis = {
      totalLinks: 0,
      internalLinks: 0,
      externalLinks: 0,
      orphanPages: [],
      hubPages: [],
      linkDepth: new Map(),
      topLinked: [],
      recommendations: []
    }

    // Build link graph and analyze
    const linkCounts = new Map<string, number>()
    const incomingLinks = new Map<string, Set<string>>()

    // Analyze each page
    for (const [url, page] of this.pages) {
      const suggestions = this.analyzeContent(page.content, url)
      
      // Count links
      analysis.totalLinks += suggestions.length
      analysis.internalLinks += suggestions.length

      // Track link targets
      suggestions.forEach(suggestion => {
        linkCounts.set(suggestion.targetUrl, (linkCounts.get(suggestion.targetUrl) || 0) + 1)
        
        if (!incomingLinks.has(suggestion.targetUrl)) {
          incomingLinks.set(suggestion.targetUrl, new Set())
        }
        incomingLinks.get(suggestion.targetUrl)!.add(url)
      })
    }

    // Find orphan pages (pages with no incoming internal links)
    for (const [url] of this.pages) {
      if (!incomingLinks.has(url) || incomingLinks.get(url)!.size === 0) {
        analysis.orphanPages.push(url)
      }
    }

    // Find hub pages (pages with many outgoing links)
    for (const [url, page] of this.pages) {
      const outgoingLinks = this.analyzeContent(page.content, url).length
      if (outgoingLinks >= 10) {
        analysis.hubPages.push(url)
      }
    }

    // Calculate link depth from homepage
    analysis.linkDepth = this.calculateLinkDepth('/')

    // Get top linked pages
    analysis.topLinked = Array.from(linkCounts.entries())
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Generate recommendations
    analysis.recommendations = this.generateLinkingRecommendations(analysis)

    return analysis
  }

  /**
   * Calculate link depth from a starting page
   */
  private calculateLinkDepth(startUrl: string): Map<string, number> {
    const depths = new Map<string, number>()
    const visited = new Set<string>()
    const queue = [{ url: startUrl, depth: 0 }]

    while (queue.length > 0) {
      const { url, depth } = queue.shift()!
      
      if (visited.has(url)) continue
      visited.add(url)
      depths.set(url, depth)

      // Find linked pages
      const page = this.pages.get(url)
      if (page) {
        const suggestions = this.analyzeContent(page.content, url)
        suggestions.forEach(suggestion => {
          if (!visited.has(suggestion.targetUrl)) {
            queue.push({ url: suggestion.targetUrl, depth: depth + 1 })
          }
        })
      }
    }

    return depths
  }

  /**
   * Generate linking recommendations
   */
  private generateLinkingRecommendations(analysis: LinkingAnalysis): string[] {
    const recommendations: string[] = []

    if (analysis.orphanPages.length > 0) {
      recommendations.push(`Found ${analysis.orphanPages.length} orphan pages. Add internal links to improve crawlability.`)
    }

    if (analysis.hubPages.length === 0) {
      recommendations.push('No hub pages found. Create topic clusters with central hub pages.')
    }

    const deepPages = Array.from(analysis.linkDepth.entries())
      .filter(([, depth]) => depth > 3)
      .map(([url]) => url)

    if (deepPages.length > 0) {
      recommendations.push(`${deepPages.length} pages are more than 3 clicks from homepage. Improve internal linking structure.`)
    }

    if (analysis.internalLinks < analysis.totalLinks * 0.8) {
      recommendations.push('Low internal link ratio. Add more internal links to improve site structure.')
    }

    return recommendations
  }

  /**
   * Generate internal linking report
   */
  public generateLinkingReport(): {
    analysis: LinkingAnalysis
    rulesSummary: {
      totalRules: number
      activeRules: number
      topPerformingRules: Array<{ rule: LinkingRule; estimatedImpact: number }>
    }
    optimization: {
      coverage: number
      efficiency: number
      recommendations: string[]
    }
  } {
    const analysis = this.analyzeSiteLinking()
    
    const activeRules = Array.from(this.rules.values()).filter(rule => rule.isActive)
    const topPerformingRules = activeRules
      .map(rule => ({
        rule,
        estimatedImpact: rule.priority * rule.seoValue / 100
      }))
      .sort((a, b) => b.estimatedImpact - a.estimatedImpact)
      .slice(0, 5)

    const totalPages = this.pages.size
    const linkedPages = totalPages - analysis.orphanPages.length
    const coverage = totalPages > 0 ? linkedPages / totalPages : 0
    const efficiency = analysis.totalLinks > 0 ? analysis.internalLinks / analysis.totalLinks : 0

    return {
      analysis,
      rulesSummary: {
        totalRules: this.rules.size,
        activeRules: activeRules.length,
        topPerformingRules
      },
      optimization: {
        coverage,
        efficiency,
        recommendations: [
          ...analysis.recommendations,
          coverage < 0.9 ? 'Improve link coverage - some pages lack internal links' : '',
          efficiency < 0.8 ? 'Increase internal link ratio' : '',
          activeRules.length < 10 ? 'Add more linking rules for better automation' : ''
        ].filter(Boolean)
      }
    }
  }
}

// Default internal linking manager instance
export const internalLinkingManager = new InternalLinkingManager()

// Helper functions
export function suggestLinksForContent(content: string, url: string): LinkSuggestion[] {
  return internalLinkingManager.analyzeContent(content, url)
}

export function applyAutoLinks(content: string, url: string): string {
  return internalLinkingManager.applyInternalLinks(content, url)
}

export default internalLinkingManager
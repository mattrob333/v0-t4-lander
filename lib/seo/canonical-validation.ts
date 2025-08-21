/**
 * Canonical URL Validation and Management System
 * Ensures proper URL structure and prevents duplicate content issues
 */

export interface CanonicalRule {
  pattern: RegExp
  canonical: (matches: RegExpMatchArray) => string
  priority: number
  description: string
}

export interface UrlValidationResult {
  isValid: boolean
  canonical: string
  issues: string[]
  recommendations: string[]
  redirectType?: 'permanent' | 'temporary' | 'none'
}

export class CanonicalUrlManager {
  private baseUrl: string
  private rules: CanonicalRule[]

  constructor(baseUrl: string = 'https://tier4intelligence.com') {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.rules = this.initializeRules()
  }

  private initializeRules(): CanonicalRule[] {
    return [
      // Homepage variations
      {
        pattern: /^\/?(index\.(html?|php|aspx?)?)?(\?.*)?$/,
        canonical: () => '/',
        priority: 100,
        description: 'Homepage canonicalization'
      },

      // Remove trailing slashes for non-directory pages
      {
        pattern: /^\/([^\/]+)\/$/,
        canonical: (matches) => `/${matches[1]}`,
        priority: 90,
        description: 'Remove trailing slash from pages'
      },

      // Add trailing slash for directory-style URLs
      {
        pattern: /^\/((services|ai-solutions|locations|resources|case-studies|about|contact)(?:\/[^\/]+)*)$/,
        canonical: (matches) => `/${matches[1]}/`,
        priority: 85,
        description: 'Add trailing slash to directory pages'
      },

      // AI Solutions canonical structure
      {
        pattern: /^\/ai-solutions\/([a-z-]+)\/([a-z-]+)\/?$/,
        canonical: (matches) => `/ai-solutions/${matches[1]}/${matches[2]}/`,
        priority: 80,
        description: 'AI solutions industry/use-case pages'
      },

      // Industry overview pages
      {
        pattern: /^\/ai-solutions\/([a-z-]+)\/?$/,
        canonical: (matches) => `/ai-solutions/${matches[1]}/`,
        priority: 75,
        description: 'Industry overview pages'
      },

      // Use case overview pages
      {
        pattern: /^\/ai-solutions\/use-cases\/([a-z-]+)\/?$/,
        canonical: (matches) => `/ai-solutions/use-cases/${matches[1]}/`,
        priority: 75,
        description: 'Use case overview pages'
      },

      // Location-based pages
      {
        pattern: /^\/locations\/([a-z-]+)-([a-z]{2})(?:\/([a-z-]+))?\/?$/,
        canonical: (matches) => {
          const base = `/locations/${matches[1]}-${matches[2]}/`
          return matches[3] ? `${base}${matches[3]}/` : base
        },
        priority: 70,
        description: 'Location-based service pages'
      },

      // Service pages
      {
        pattern: /^\/services\/([a-z-]+)\/?$/,
        canonical: (matches) => `/services/${matches[1]}/`,
        priority: 65,
        description: 'Service pages'
      },

      // Remove query parameters from static content
      {
        pattern: /^\/([^?]+)\?.*$/,
        canonical: (matches) => `/${matches[1]}`,
        priority: 60,
        description: 'Remove query parameters from static pages'
      },

      // Normalize case (convert to lowercase)
      {
        pattern: /^\/.*[A-Z].*$/,
        canonical: (matches) => matches[0].toLowerCase(),
        priority: 55,
        description: 'Convert URLs to lowercase'
      },

      // Remove duplicate slashes
      {
        pattern: /^\/.*\/\/.*$/,
        canonical: (matches) => matches[0].replace(/\/+/g, '/'),
        priority: 50,
        description: 'Remove duplicate slashes'
      },

      // Default rule - ensure proper structure
      {
        pattern: /.*/,
        canonical: (matches) => matches[0],
        priority: 1,
        description: 'Default pass-through'
      }
    ]
  }

  /**
   * Validate and get canonical URL for a given path
   */
  public validateUrl(path: string): UrlValidationResult {
    const cleanPath = this.cleanPath(path)
    const issues: string[] = []
    const recommendations: string[] = []
    let redirectType: 'permanent' | 'temporary' | 'none' = 'none'

    // Find the highest priority matching rule
    const matchingRule = this.rules
      .filter(rule => rule.pattern.test(cleanPath))
      .sort((a, b) => b.priority - a.priority)[0]

    if (!matchingRule) {
      return {
        isValid: false,
        canonical: this.baseUrl + cleanPath,
        issues: ['No matching canonical rule found'],
        recommendations: ['Review URL structure']
      }
    }

    const matches = cleanPath.match(matchingRule.pattern)
    if (!matches) {
      return {
        isValid: false,
        canonical: this.baseUrl + cleanPath,
        issues: ['Pattern match failed'],
        recommendations: ['Check URL format']
      }
    }

    const canonicalPath = matchingRule.canonical(matches)
    const fullCanonical = this.baseUrl + canonicalPath

    // Check for issues
    if (cleanPath !== canonicalPath) {
      redirectType = 'permanent'
      issues.push(`URL should redirect to canonical: ${canonicalPath}`)
      recommendations.push('Implement 301 redirect')
    }

    // Additional validations
    this.validateUrlStructure(cleanPath, issues, recommendations)
    this.validateSeoFriendliness(cleanPath, issues, recommendations)

    return {
      isValid: issues.length === 0,
      canonical: fullCanonical,
      issues,
      recommendations,
      redirectType
    }
  }

  /**
   * Clean and normalize path
   */
  private cleanPath(path: string): string {
    // Remove base URL if present
    let cleanPath = path.replace(this.baseUrl, '')
    
    // Ensure starts with /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath
    }

    // Decode URL encoding
    try {
      cleanPath = decodeURIComponent(cleanPath)
    } catch (e) {
      // Keep original if decoding fails
    }

    return cleanPath
  }

  /**
   * Validate URL structure
   */
  private validateUrlStructure(path: string, issues: string[], recommendations: string[]): void {
    // Check for invalid characters
    if (/[^a-z0-9\-\/\._~:?#[\]@!$&'()*+,;=%]/.test(path)) {
      issues.push('URL contains invalid characters')
      recommendations.push('Use only alphanumeric characters, hyphens, and forward slashes')
    }

    // Check for excessive length
    if (path.length > 255) {
      issues.push('URL is too long')
      recommendations.push('Keep URLs under 255 characters')
    }

    // Check for excessive nesting
    const segments = path.split('/').filter(Boolean)
    if (segments.length > 5) {
      issues.push('URL has too many path segments')
      recommendations.push('Limit URL depth to 5 levels or fewer')
    }

    // Check for non-descriptive segments
    if (/\/(id|page|item)\/\d+/.test(path)) {
      issues.push('URL contains non-descriptive numeric identifiers')
      recommendations.push('Use descriptive slugs instead of numeric IDs')
    }
  }

  /**
   * Validate SEO friendliness
   */
  private validateSeoFriendliness(path: string, issues: string[], recommendations: string[]): void {
    const segments = path.split('/').filter(Boolean)

    // Check for underscores
    if (path.includes('_')) {
      issues.push('URL contains underscores')
      recommendations.push('Use hyphens instead of underscores for better SEO')
    }

    // Check for stop words in URL
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    segments.forEach(segment => {
      const words = segment.split('-')
      const hasStopWords = words.some(word => stopWords.includes(word))
      if (hasStopWords && words.length > 3) {
        recommendations.push(`Consider removing stop words from: ${segment}`)
      }
    })

    // Check for keyword stuffing
    segments.forEach(segment => {
      const words = segment.split('-')
      const uniqueWords = new Set(words)
      if (words.length - uniqueWords.size > 2) {
        issues.push(`Potential keyword stuffing in: ${segment}`)
        recommendations.push('Avoid repeating keywords in URL segments')
      }
    })
  }

  /**
   * Generate canonical mappings for common URL variations
   */
  public generateCanonicalMappings(): Map<string, string> {
    const mappings = new Map<string, string>()

    // Common homepage variations
    const homepageVariations = [
      '/index.html',
      '/index.php',
      '/home',
      '/home/',
      '/default.html',
      '/default.php'
    ]

    homepageVariations.forEach(variation => {
      mappings.set(this.baseUrl + variation, this.baseUrl + '/')
    })

    // Generate mappings for all AI solution combinations
    const industries = [
      'healthcare', 'finance', 'retail', 'manufacturing', 
      'logistics', 'insurance', 'real-estate', 'education', 
      'legal', 'hospitality', 'technology', 'energy'
    ]

    const useCases = [
      'automation', 'prediction', 'optimization', 
      'personalization', 'fraud-detection', 'classification', 
      'content-generation', 'data-extraction', 'recommendation', 
      'forecasting', 'quality-control', 'risk-assessment'
    ]

    // Industry/use-case URL variations
    industries.forEach(industry => {
      useCases.forEach(useCase => {
        const canonical = `/ai-solutions/${industry}/${useCase}/`
        const variations = [
          `/ai-solutions/${industry}/${useCase}`,
          `/ai-solutions/${industry}/${useCase}.html`,
          `/ai-solutions/${industry}/${useCase}/index.html`,
          `/AI-Solutions/${industry}/${useCase}/`,
          `/ai_solutions/${industry}/${useCase}/`
        ]
        
        variations.forEach(variation => {
          mappings.set(this.baseUrl + variation, this.baseUrl + canonical)
        })
      })
    })

    return mappings
  }

  /**
   * Validate entire site URL structure
   */
  public validateSiteStructure(urls: string[]): {
    validUrls: string[]
    invalidUrls: { url: string; issues: string[] }[]
    redirects: { from: string; to: string; type: string }[]
    recommendations: string[]
  } {
    const validUrls: string[] = []
    const invalidUrls: { url: string; issues: string[] }[] = []
    const redirects: { from: string; to: string; type: string }[] = []
    const recommendations: string[] = []

    urls.forEach(url => {
      const result = this.validateUrl(url)
      
      if (result.isValid) {
        validUrls.push(result.canonical)
      } else {
        invalidUrls.push({ url, issues: result.issues })
      }

      if (result.redirectType && result.redirectType !== 'none') {
        redirects.push({
          from: url,
          to: result.canonical,
          type: result.redirectType
        })
      }

      recommendations.push(...result.recommendations)
    })

    // Remove duplicate recommendations
    const uniqueRecommendations = Array.from(new Set(recommendations))

    return {
      validUrls,
      invalidUrls,
      redirects,
      recommendations: uniqueRecommendations
    }
  }
}

/**
 * Default canonical manager instance
 */
export const canonicalManager = new CanonicalUrlManager()

/**
 * Helper function to get canonical URL for a path
 */
export function getCanonicalUrl(path: string): string {
  return canonicalManager.validateUrl(path).canonical
}

/**
 * Helper function to check if URL needs redirect
 */
export function needsRedirect(path: string): { redirect: boolean; to?: string; type?: string } {
  const result = canonicalManager.validateUrl(path)
  
  if (result.redirectType && result.redirectType !== 'none') {
    return {
      redirect: true,
      to: result.canonical,
      type: result.redirectType
    }
  }

  return { redirect: false }
}

export default canonicalManager
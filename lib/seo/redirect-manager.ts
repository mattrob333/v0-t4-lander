/**
 * Comprehensive Redirect Management System
 * Handles all types of redirects with proper HTTP status codes and SEO optimization
 */

export type RedirectType = 'permanent' | 'temporary' | 'internal' | 'external'
export type RedirectStatus = 301 | 302 | 307 | 308

export interface RedirectRule {
  id: string
  source: string | RegExp
  destination: string
  type: RedirectType
  status: RedirectStatus
  description: string
  isActive: boolean
  createdAt: Date
  lastModified: Date
  conditions?: {
    userAgent?: RegExp
    referer?: RegExp
    queryParams?: Record<string, string | RegExp>
    headers?: Record<string, string | RegExp>
  }
  preserveQuery?: boolean
  preserveFragment?: boolean
}

export interface RedirectMatch {
  rule: RedirectRule
  destination: string
  status: RedirectStatus
  matches?: RegExpMatchArray
}

export interface RedirectStats {
  totalRedirects: number
  activeRedirects: number
  redirectsByType: Record<RedirectType, number>
  redirectsByStatus: Record<RedirectStatus, number>
  lastUpdated: Date
}

export class RedirectManager {
  private rules: Map<string, RedirectRule> = new Map()
  private baseUrl: string

  constructor(baseUrl: string = 'https://tier4intelligence.com') {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.initializeDefaultRules()
  }

  /**
   * Initialize default redirect rules for common SEO scenarios
   */
  private initializeDefaultRules(): void {
    const defaultRules: Omit<RedirectRule, 'id' | 'createdAt' | 'lastModified'>[] = [
      // Homepage variations
      {
        source: /^\/(index\.(html?|php|aspx?)?|home|default\.(html?|php))(\?.*)?$/i,
        destination: '/',
        type: 'permanent',
        status: 301,
        description: 'Homepage canonical redirects',
        isActive: true,
        preserveQuery: false
      },

      // Remove trailing slashes from files
      {
        source: /^\/([^\/]+\.(html?|php|aspx?))\/$/,
        destination: '/$1',
        type: 'permanent',
        status: 301,
        description: 'Remove trailing slash from files',
        isActive: true
      },

      // Add trailing slash to directories
      {
        source: /^\/((services|ai-solutions|locations|resources|case-studies|about|contact)(?:\/[^\/\?]+)*)(\?.*)?$/,
        destination: '/$1/$3',
        type: 'permanent',
        status: 301,
        description: 'Add trailing slash to directories',
        isActive: true,
        preserveQuery: true
      },

      // Normalize case - convert to lowercase
      {
        source: /^\/.*[A-Z].*$/,
        destination: (path: string) => path.toLowerCase(),
        type: 'permanent',
        status: 301,
        description: 'Convert URLs to lowercase',
        isActive: true
      },

      // Remove www subdomain
      {
        source: 'https://www.tier4intelligence.com',
        destination: 'https://tier4intelligence.com',
        type: 'permanent',
        status: 301,
        description: 'Remove www subdomain',
        isActive: true
      },

      // HTTP to HTTPS redirect
      {
        source: 'http://tier4intelligence.com',
        destination: 'https://tier4intelligence.com',
        type: 'permanent',
        status: 301,
        description: 'Force HTTPS',
        isActive: true
      },

      // Legacy URL patterns
      {
        source: /^\/old-services\/(.+)$/,
        destination: '/services/$1/',
        type: 'permanent',
        status: 301,
        description: 'Legacy services URL structure',
        isActive: true
      },

      // Query parameter cleanup for static pages
      {
        source: /^\/((services|about|contact)\/[^?]*)\?.*$/,
        destination: '/$1',
        type: 'permanent',
        status: 301,
        description: 'Remove query parameters from static pages',
        isActive: true
      },

      // AI solutions URL normalization
      {
        source: /^\/ai[_-]solutions\/([a-z-]+)\/([a-z-]+)\/?$/i,
        destination: '/ai-solutions/$1/$2/',
        type: 'permanent',
        status: 301,
        description: 'Normalize AI solutions URLs',
        isActive: true
      },

      // Location pages normalization
      {
        source: /^\/locations?\/([a-z-]+)[_\s]+([a-z]{2})\/?$/i,
        destination: '/locations/$1-$2/',
        type: 'permanent',
        status: 301,
        description: 'Normalize location URLs',
        isActive: true
      }
    ]

    defaultRules.forEach((rule, index) => {
      this.addRule({
        ...rule,
        id: `default-${index}`,
        createdAt: new Date(),
        lastModified: new Date()
      })
    })
  }

  /**
   * Add a new redirect rule
   */
  public addRule(rule: RedirectRule): void {
    this.rules.set(rule.id, {
      ...rule,
      lastModified: new Date()
    })
  }

  /**
   * Update an existing redirect rule
   */
  public updateRule(id: string, updates: Partial<RedirectRule>): boolean {
    const rule = this.rules.get(id)
    if (!rule) return false

    this.rules.set(id, {
      ...rule,
      ...updates,
      lastModified: new Date()
    })
    return true
  }

  /**
   * Remove a redirect rule
   */
  public removeRule(id: string): boolean {
    return this.rules.delete(id)
  }

  /**
   * Get all redirect rules
   */
  public getRules(): RedirectRule[] {
    return Array.from(this.rules.values())
  }

  /**
   * Find matching redirect for a URL
   */
  public findRedirect(url: string, request?: {
    userAgent?: string
    referer?: string
    headers?: Record<string, string>
  }): RedirectMatch | null {
    const fullUrl = url.startsWith('http') ? url : this.baseUrl + url
    const pathname = new URL(fullUrl).pathname

    for (const rule of this.rules.values()) {
      if (!rule.isActive) continue

      // Check if source pattern matches
      let matches: RegExpMatchArray | null = null
      let matchesPattern = false

      if (typeof rule.source === 'string') {
        matchesPattern = fullUrl === rule.source || pathname === rule.source
      } else {
        matches = pathname.match(rule.source)
        matchesPattern = matches !== null
      }

      if (!matchesPattern) continue

      // Check additional conditions if present
      if (rule.conditions && request) {
        if (rule.conditions.userAgent && request.userAgent) {
          if (!rule.conditions.userAgent.test(request.userAgent)) continue
        }
        if (rule.conditions.referer && request.referer) {
          if (!rule.conditions.referer.test(request.referer)) continue
        }
        if (rule.conditions.headers && request.headers) {
          const headerMatch = Object.entries(rule.conditions.headers).every(([key, pattern]) => {
            const headerValue = request.headers![key.toLowerCase()]
            if (!headerValue) return false
            return typeof pattern === 'string' ? headerValue === pattern : pattern.test(headerValue)
          })
          if (!headerMatch) continue
        }
      }

      // Build destination URL
      let destination = typeof rule.destination === 'function' 
        ? rule.destination(pathname) 
        : rule.destination

      // Handle regex substitutions
      if (matches && typeof rule.destination === 'string') {
        destination = rule.destination.replace(/\$(\d+)/g, (match, group) => {
          const index = parseInt(group, 10)
          return matches![index] || match
        })
      }

      // Preserve query and fragment if specified
      const urlObj = new URL(fullUrl)
      if (rule.preserveQuery && urlObj.search) {
        destination += (destination.includes('?') ? '&' : '?') + urlObj.search.slice(1)
      }
      if (rule.preserveFragment && urlObj.hash) {
        destination += urlObj.hash
      }

      // Ensure destination is absolute URL
      if (!destination.startsWith('http')) {
        destination = this.baseUrl + (destination.startsWith('/') ? destination : '/' + destination)
      }

      return {
        rule,
        destination,
        status: rule.status,
        matches: matches || undefined
      }
    }

    return null
  }

  /**
   * Generate redirect configuration for different server types
   */
  public generateServerConfig(serverType: 'nginx' | 'apache' | 'vercel' | 'netlify'): string {
    const rules = this.getRules().filter(rule => rule.isActive)

    switch (serverType) {
      case 'nginx':
        return this.generateNginxConfig(rules)
      case 'apache':
        return this.generateApacheConfig(rules)
      case 'vercel':
        return this.generateVercelConfig(rules)
      case 'netlify':
        return this.generateNetlifyConfig(rules)
      default:
        throw new Error(`Unsupported server type: ${serverType}`)
    }
  }

  private generateNginxConfig(rules: RedirectRule[]): string {
    const config = ['# Generated redirect rules for Nginx']
    
    rules.forEach(rule => {
      config.push(`# ${rule.description}`)
      
      if (typeof rule.source === 'string') {
        if (rule.source.startsWith('http')) {
          // Full URL redirect
          const sourceUrl = new URL(rule.source)
          config.push(`server {`)
          config.push(`    server_name ${sourceUrl.hostname};`)
          config.push(`    return ${rule.status} ${rule.destination};`)
          config.push(`}`)
        } else {
          // Path redirect
          config.push(`location = ${rule.source} {`)
          config.push(`    return ${rule.status} ${rule.destination};`)
          config.push(`}`)
        }
      } else {
        // Regex redirect
        const regexStr = rule.source.source.replace(/\//g, '\\/')
        config.push(`location ~ ${regexStr} {`)
        config.push(`    return ${rule.status} ${rule.destination};`)
        config.push(`}`)
      }
      config.push('')
    })

    return config.join('\n')
  }

  private generateApacheConfig(rules: RedirectRule[]): string {
    const config = ['# Generated redirect rules for Apache', 'RewriteEngine On']
    
    rules.forEach(rule => {
      config.push(`# ${rule.description}`)
      
      if (typeof rule.source === 'string') {
        const escapedSource = rule.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        config.push(`RewriteRule ^${escapedSource}$ ${rule.destination} [R=${rule.status},L]`)
      } else {
        const regexStr = rule.source.source
        config.push(`RewriteRule ${regexStr} ${rule.destination} [R=${rule.status},L]`)
      }
      config.push('')
    })

    return config.join('\n')
  }

  private generateVercelConfig(rules: RedirectRule[]): string {
    const redirects = rules.map(rule => ({
      source: typeof rule.source === 'string' ? rule.source : rule.source.source,
      destination: rule.destination,
      permanent: rule.status === 301 || rule.status === 308
    }))

    return JSON.stringify({ redirects }, null, 2)
  }

  private generateNetlifyConfig(rules: RedirectRule[]): string {
    const config = ['# Generated redirect rules for Netlify']
    
    rules.forEach(rule => {
      config.push(`# ${rule.description}`)
      const source = typeof rule.source === 'string' ? rule.source : rule.source.source
      config.push(`${source} ${rule.destination} ${rule.status}`)
    })

    return config.join('\n')
  }

  /**
   * Get redirect statistics
   */
  public getStats(): RedirectStats {
    const rules = this.getRules()
    const activeRules = rules.filter(rule => rule.isActive)

    const redirectsByType = activeRules.reduce((acc, rule) => {
      acc[rule.type] = (acc[rule.type] || 0) + 1
      return acc
    }, {} as Record<RedirectType, number>)

    const redirectsByStatus = activeRules.reduce((acc, rule) => {
      acc[rule.status] = (acc[rule.status] || 0) + 1
      return acc
    }, {} as Record<RedirectStatus, number>)

    return {
      totalRedirects: rules.length,
      activeRedirects: activeRules.length,
      redirectsByType,
      redirectsByStatus,
      lastUpdated: new Date()
    }
  }

  /**
   * Validate redirect chains and loops
   */
  public validateRedirects(): {
    valid: boolean
    issues: Array<{
      type: 'chain' | 'loop' | 'invalid_destination'
      rule: RedirectRule
      message: string
    }>
  } {
    const issues: Array<{
      type: 'chain' | 'loop' | 'invalid_destination'
      rule: RedirectRule
      message: string
    }> = []

    const rules = this.getRules().filter(rule => rule.isActive)

    for (const rule of rules) {
      // Check for redirect chains and loops
      const visited = new Set<string>()
      let current = typeof rule.destination === 'string' ? rule.destination : 'dynamic'
      let chainLength = 0
      const maxChainLength = 5

      while (current !== 'dynamic' && chainLength < maxChainLength) {
        if (visited.has(current)) {
          issues.push({
            type: 'loop',
            rule,
            message: `Redirect loop detected: ${Array.from(visited).join(' -> ')} -> ${current}`
          })
          break
        }

        visited.add(current)
        const nextRedirect = this.findRedirect(current)
        
        if (nextRedirect) {
          chainLength++
          current = nextRedirect.destination
          
          if (chainLength >= maxChainLength) {
            issues.push({
              type: 'chain',
              rule,
              message: `Redirect chain too long (>${maxChainLength} redirects)`
            })
          }
        } else {
          break
        }
      }

      // Validate destination URL
      if (typeof rule.destination === 'string') {
        try {
          new URL(rule.destination.startsWith('http') ? rule.destination : this.baseUrl + rule.destination)
        } catch (error) {
          issues.push({
            type: 'invalid_destination',
            rule,
            message: `Invalid destination URL: ${rule.destination}`
          })
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }
}

// Default redirect manager instance
export const redirectManager = new RedirectManager()

// Helper functions
export function checkRedirect(url: string): RedirectMatch | null {
  return redirectManager.findRedirect(url)
}

export function addCustomRedirect(rule: Omit<RedirectRule, 'id' | 'createdAt' | 'lastModified'>): string {
  const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  redirectManager.addRule({
    ...rule,
    id,
    createdAt: new Date(),
    lastModified: new Date()
  })
  return id
}

export default redirectManager
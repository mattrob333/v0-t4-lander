"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Types for conversion tracking
interface ConversionEvent {
  eventName: string
  timestamp: Date
  pageUrl: string
  referrer: string
  userId: string
  sessionId: string
  metadata?: Record<string, any>
  value?: number
  currency?: string
}

interface UserSession {
  sessionId: string
  userId: string
  startTime: Date
  pageViews: number
  totalTimeOnSite: number
  source: string
  medium: string
  campaign: string
  device: string
  browser: string
  os: string
}

interface ConversionFunnel {
  stage: string
  eventName: string
  timestamp: Date
  userId: string
  metadata?: Record<string, any>
}

// Analytics Configuration
const ANALYTICS_CONFIG = {
  // Replace with your actual analytics endpoints
  endpoints: {
    events: '/api/analytics/events',
    conversions: '/api/analytics/conversions',
    sessions: '/api/analytics/sessions'
  },
  // Conversion goals with their values
  conversionGoals: {
    'schedule-assessment': { value: 2500, currency: 'USD', stage: 'lead' },
    'form-submit': { value: 1000, currency: 'USD', stage: 'inquiry' },
    'download-guide': { value: 500, currency: 'USD', stage: 'engagement' },
    'phone-call-click': { value: 3000, currency: 'USD', stage: 'high-intent' },
    'poc-request': { value: 5000, currency: 'USD', stage: 'sales-qualified' },
    'consultation-book': { value: 2000, currency: 'USD', stage: 'meeting-scheduled' },
    'exit-popup-submit': { value: 750, currency: 'USD', stage: 'exit-intent-capture' }
  },
  // Funnel stages
  funnelStages: [
    'page-view',
    'engagement',
    'interest',
    'lead',
    'sales-qualified',
    'meeting-scheduled'
  ]
}

// Utility functions
const generateSessionId = (): string => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

const getUserId = (): string => {
  if (typeof window === 'undefined') return 'ssr-user'
  
  let userId = localStorage.getItem('analytics-user-id')
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
    localStorage.setItem('analytics-user-id', userId)
  }
  return userId
}

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'ssr-session'
  
  let sessionId = sessionStorage.getItem('analytics-session-id')
  if (!sessionId) {
    sessionId = generateSessionId()
    sessionStorage.setItem('analytics-session-id', sessionId)
  }
  return sessionId
}

const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return { device: 'unknown', browser: 'unknown', os: 'unknown' }
  }

  const userAgent = navigator.userAgent
  
  // Simple device detection
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)
  const isTablet = /Tablet|iPad/.test(userAgent)
  const device = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  
  // Simple browser detection
  let browser = 'unknown'
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'
  
  // Simple OS detection
  let os = 'unknown'
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS')) os = 'iOS'
  
  return { device, browser, os }
}

const getTrafficSource = () => {
  if (typeof window === 'undefined') {
    return { source: 'direct', medium: 'none', campaign: 'none' }
  }

  const urlParams = new URLSearchParams(window.location.search)
  const referrer = document.referrer
  
  // UTM parameters
  const utmSource = urlParams.get('utm_source')
  const utmMedium = urlParams.get('utm_medium')
  const utmCampaign = urlParams.get('utm_campaign')
  
  if (utmSource) {
    return {
      source: utmSource,
      medium: utmMedium || 'unknown',
      campaign: utmCampaign || 'unknown'
    }
  }
  
  // Referrer-based source detection
  if (referrer) {
    if (referrer.includes('google.com')) {
      return { source: 'google', medium: 'organic', campaign: 'none' }
    } else if (referrer.includes('bing.com')) {
      return { source: 'bing', medium: 'organic', campaign: 'none' }
    } else if (referrer.includes('linkedin.com')) {
      return { source: 'linkedin', medium: 'social', campaign: 'none' }
    } else if (referrer.includes('twitter.com') || referrer.includes('x.com')) {
      return { source: 'twitter', medium: 'social', campaign: 'none' }
    } else {
      return { source: 'referral', medium: 'referral', campaign: referrer }
    }
  }
  
  return { source: 'direct', medium: 'none', campaign: 'none' }
}

// Analytics Hook
export function useConversionAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sessionStartTime = useRef<Date>(new Date())
  const pageStartTime = useRef<Date>(new Date())
  const scrollDepth = useRef<number>(0)
  const maxScrollDepth = useRef<number>(0)

  // Initialize session tracking
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializeSession = async () => {
      const sessionData: UserSession = {
        sessionId: getSessionId(),
        userId: getUserId(),
        startTime: sessionStartTime.current,
        pageViews: 1,
        totalTimeOnSite: 0,
        ...getTrafficSource(),
        ...getDeviceInfo()
      }

      // Store session data
      localStorage.setItem('current-session', JSON.stringify(sessionData))
      
      // Send session start event
      trackEvent('session-start', { sessionData })
    }

    initializeSession()
  }, [])

  // Track page views
  useEffect(() => {
    if (typeof window === 'undefined') return

    pageStartTime.current = new Date()
    
    const trackPageView = async () => {
      const pageViewData = {
        path: pathname,
        searchParams: searchParams.toString(),
        referrer: document.referrer,
        timestamp: new Date(),
        ...getTrafficSource(),
        ...getDeviceInfo()
      }

      trackEvent('page-view', pageViewData)
    }

    trackPageView()

    // Track time on page when user leaves
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - pageStartTime.current.getTime()
      trackEvent('page-exit', { 
        timeOnPage,
        maxScrollDepth: maxScrollDepth.current,
        path: pathname
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pathname, searchParams])

  // Track scroll depth
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      
      scrollDepth.current = scrollPercent
      maxScrollDepth.current = Math.max(maxScrollDepth.current, scrollPercent)

      // Track scroll milestones
      if (scrollPercent >= 25 && !sessionStorage.getItem('scroll-25')) {
        sessionStorage.setItem('scroll-25', 'true')
        trackEvent('scroll-depth', { depth: 25 })
      }
      if (scrollPercent >= 50 && !sessionStorage.getItem('scroll-50')) {
        sessionStorage.setItem('scroll-50', 'true')
        trackEvent('scroll-depth', { depth: 50 })
      }
      if (scrollPercent >= 75 && !sessionStorage.getItem('scroll-75')) {
        sessionStorage.setItem('scroll-75', 'true')
        trackEvent('scroll-depth', { depth: 75 })
      }
      if (scrollPercent >= 90 && !sessionStorage.getItem('scroll-90')) {
        sessionStorage.setItem('scroll-90', 'true')
        trackEvent('scroll-depth', { depth: 90 })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const trackEvent = useCallback(async (eventName: string, metadata?: Record<string, any>) => {
    if (typeof window === 'undefined') return

    const eventData: ConversionEvent = {
      eventName,
      timestamp: new Date(),
      pageUrl: window.location.href,
      referrer: document.referrer,
      userId: getUserId(),
      sessionId: getSessionId(),
      metadata: {
        ...metadata,
        scrollDepth: scrollDepth.current,
        timeOnPage: Date.now() - pageStartTime.current.getTime()
      }
    }

    // Add conversion value if it's a conversion goal
    const goalConfig = ANALYTICS_CONFIG.conversionGoals[eventName as keyof typeof ANALYTICS_CONFIG.conversionGoals]
    if (goalConfig) {
      eventData.value = goalConfig.value
      eventData.currency = goalConfig.currency
    }

    // Store event locally
    const storedEvents = JSON.parse(localStorage.getItem('analytics-events') || '[]')
    storedEvents.push(eventData)
    localStorage.setItem('analytics-events', JSON.stringify(storedEvents))

    // Send to analytics API (replace with your actual endpoint)
    // Skip API calls in development to prevent 404 errors
    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch(ANALYTICS_CONFIG.endpoints.events, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData)
        })
      } catch (error) {
        console.error('Failed to send analytics event:', error)
      }
    }

    // Console log for development
    console.log('Analytics Event:', eventName, eventData)
  }, [])

  const trackConversion = useCallback(async (conversionName: string, metadata?: Record<string, any>) => {
    const goalConfig = ANALYTICS_CONFIG.conversionGoals[conversionName as keyof typeof ANALYTICS_CONFIG.conversionGoals]
    
    if (!goalConfig) {
      console.warn(`Unknown conversion goal: ${conversionName}`)
      return
    }

    // Track the conversion event
    await trackEvent(conversionName, {
      ...metadata,
      conversionStage: goalConfig.stage,
      conversionValue: goalConfig.value
    })

    // Track funnel progression
    const funnelData: ConversionFunnel = {
      stage: goalConfig.stage,
      eventName: conversionName,
      timestamp: new Date(),
      userId: getUserId(),
      metadata
    }

    const storedFunnelData = JSON.parse(localStorage.getItem('funnel-progression') || '[]')
    storedFunnelData.push(funnelData)
    localStorage.setItem('funnel-progression', JSON.stringify(storedFunnelData))

    // Send conversion to API
    // Skip API calls in development to prevent 404 errors
    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch(ANALYTICS_CONFIG.endpoints.conversions, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...funnelData,
            value: goalConfig.value,
            currency: goalConfig.currency
          })
        })
      } catch (error) {
        console.error('Failed to send conversion event:', error)
      }
    }
  }, [trackEvent])

  const trackElementClick = useCallback((elementName: string, metadata?: Record<string, any>) => {
    trackEvent('element-click', {
      elementName,
      ...metadata
    })
  }, [trackEvent])

  const trackFormInteraction = useCallback((formName: string, action: 'start' | 'complete' | 'abandon', metadata?: Record<string, any>) => {
    trackEvent(`form-${action}`, {
      formName,
      ...metadata
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackConversion,
    trackElementClick,
    trackFormInteraction
  }
}

// Higher-order component for automatic click tracking
interface ClickTrackingProps {
  eventName: string
  metadata?: Record<string, any>
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export function ClickTracking({ eventName, metadata, children, className, ...props }: ClickTrackingProps) {
  const { trackElementClick } = useConversionAnalytics()

  const handleClick = useCallback((e: React.MouseEvent) => {
    trackElementClick(eventName, {
      ...metadata,
      elementText: e.currentTarget.textContent,
      elementId: e.currentTarget.id,
      elementClass: e.currentTarget.className
    })

    // Call original onClick if provided
    if (props.onClick) {
      props.onClick(e)
    }
  }, [eventName, metadata, trackElementClick, props])

  return (
    <div 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
}

// Form tracking wrapper
interface FormTrackingProps {
  formName: string
  onSubmit?: (e: React.FormEvent) => void
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export function FormTracking({ formName, onSubmit, children, className, ...props }: FormTrackingProps) {
  const { trackFormInteraction } = useConversionAnalytics()
  const formStarted = useRef(false)

  const handleFocus = useCallback(() => {
    if (!formStarted.current) {
      formStarted.current = true
      trackFormInteraction(formName, 'start')
    }
  }, [formName, trackFormInteraction])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    trackFormInteraction(formName, 'complete', {
      formData: new FormData(e.target as HTMLFormElement)
    })

    if (onSubmit) {
      onSubmit(e)
    }
  }, [formName, trackFormInteraction, onSubmit])

  useEffect(() => {
    // Track form abandonment if user leaves page without submitting
    const handleBeforeUnload = () => {
      if (formStarted.current) {
        trackFormInteraction(formName, 'abandon')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [formName, trackFormInteraction])

  return (
    <form 
      className={className}
      onSubmit={handleSubmit}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </form>
  )
}

// Heat map tracking (simplified)
export function useHeatMapTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const trackClicks = (e: MouseEvent) => {
      const target = e.target as Element
      const rect = target.getBoundingClientRect()
      const clickData = {
        x: e.clientX,
        y: e.clientY,
        elementTag: target.tagName,
        elementId: target.id,
        elementClass: target.className,
        pageX: rect.left + e.offsetX,
        pageY: rect.top + e.offsetY,
        timestamp: new Date(),
        url: window.location.href
      }

      const storedClicks = JSON.parse(localStorage.getItem('heatmap-clicks') || '[]')
      storedClicks.push(clickData)
      
      // Keep only last 1000 clicks to prevent storage bloat
      if (storedClicks.length > 1000) {
        storedClicks.shift()
      }
      
      localStorage.setItem('heatmap-clicks', JSON.stringify(storedClicks))
    }

    document.addEventListener('click', trackClicks)
    return () => document.removeEventListener('click', trackClicks)
  }, [])
}

// Analytics Dashboard Component (for development)
export function AnalyticsDashboard() {
  const [events, setEvents] = useState<ConversionEvent[]>([])
  const [funnelData, setFunnelData] = useState<ConversionFunnel[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedEvents = JSON.parse(localStorage.getItem('analytics-events') || '[]')
    const storedFunnel = JSON.parse(localStorage.getItem('funnel-progression') || '[]')
    
    setEvents(storedEvents)
    setFunnelData(storedFunnel)
  }, [])

  const clearData = () => {
    localStorage.removeItem('analytics-events')
    localStorage.removeItem('funnel-progression')
    localStorage.removeItem('heatmap-clicks')
    setEvents([])
    setFunnelData([])
  }

  const exportData = () => {
    const data = {
      events,
      funnelData,
      session: JSON.parse(localStorage.getItem('current-session') || '{}'),
      heatmapClicks: JSON.parse(localStorage.getItem('heatmap-clicks') || '[]'),
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics-data.json'
    a.click()
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
      >
        📊 Analytics
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
        <div className="flex gap-2">
          <button onClick={exportData} className="text-blue-600 text-sm hover:underline">
            Export
          </button>
          <button onClick={clearData} className="text-red-600 text-sm hover:underline">
            Clear
          </button>
          <button onClick={() => setIsVisible(false)} className="text-gray-500 text-sm hover:underline">
            ×
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-800 mb-2">Recent Events ({events.length})</h4>
          <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
            {events.slice(-10).reverse().map((event, index) => (
              <div key={index} className="mb-1">
                <span className="font-medium">{event.eventName}</span>
                <span className="text-gray-500 ml-1">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-800 mb-2">Conversion Funnel</h4>
          <div className="text-xs text-gray-600">
            {ANALYTICS_CONFIG.funnelStages.map(stage => {
              const count = funnelData.filter(f => f.stage === stage).length
              return (
                <div key={stage} className="flex justify-between">
                  <span>{stage}:</span>
                  <span>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
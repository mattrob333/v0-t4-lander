"use client"

import { useState, useEffect, useCallback, useRef, ReactNode } from "react"
import { Button } from "@/components/ui/button"

// Types for A/B testing
interface ABTestVariant {
  id: string
  name: string
  weight: number // 0-100, total should equal 100
  component: ReactNode
  metadata?: Record<string, any>
}

interface ABTestConfig {
  testId: string
  testName: string
  description?: string
  variants: ABTestVariant[]
  conversionGoals: string[]
  trafficAllocation: number // 0-100, percentage of users to include in test
  startDate?: Date
  endDate?: Date
  isActive: boolean
}

interface ABTestResult {
  testId: string
  variantId: string
  userId: string
  timestamp: Date
  conversionEvents: string[]
  metadata?: Record<string, any>
}

// A/B Test Configuration Storage
const AB_TEST_CONFIGS: ABTestConfig[] = [
  {
    testId: 'hero-headline-test',
    testName: 'Hero Headline Optimization',
    description: 'Testing different value propositions in the main headline',
    variants: [
      {
        id: 'control',
        name: 'Control: Current Headline',
        weight: 50,
        component: (
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight md:text-5xl md:leading-tight">
            Rapid AI Clarity in Days. Strategic AI Leadership for Years.
          </h1>
        )
      },
      {
        id: 'roi-focused',
        name: 'ROI-Focused Headline',
        weight: 25,
        component: (
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight md:text-5xl md:leading-tight">
            Validate 3-4x AI ROI in 5 Days. No Buzzwords, Just Results.
          </h1>
        )
      },
      {
        id: 'problem-focused',
        name: 'Problem-Focused Headline',
        weight: 25,
        component: (
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight md:text-5xl md:leading-tight">
            Stop Guessing About AI. Get Working Proof of Concept in 5 Days.
          </h1>
        )
      }
    ],
    conversionGoals: ['schedule-assessment', 'form-submit', 'download'],
    trafficAllocation: 100,
    isActive: true
  },
  {
    testId: 'cta-button-test',
    testName: 'Primary CTA Button Optimization',
    description: 'Testing different CTA copy and styling',
    variants: [
      {
        id: 'control',
        name: 'Control: Schedule Assessment',
        weight: 33,
        component: (
          <Button className="h-12 rounded-full bg-[#00A878] px-6 text-white hover:bg-[#00936B]">
            Schedule Your AI Opportunity Assessment
          </Button>
        )
      },
      {
        id: 'urgency',
        name: 'Urgency: Book Now',
        weight: 33,
        component: (
          <Button className="h-12 rounded-full bg-orange-600 px-6 text-white hover:bg-orange-700">
            Book Your Free AI Strategy Session Now
          </Button>
        )
      },
      {
        id: 'value',
        name: 'Value: Get Free Analysis',
        weight: 34,
        component: (
          <Button className="h-12 rounded-full bg-[#00A878] px-6 text-white hover:bg-[#00936B] border-2 border-yellow-400">
            Get Free $2,500 AI Analysis
          </Button>
        )
      }
    ],
    conversionGoals: ['cta-click', 'form-submit'],
    trafficAllocation: 100,
    isActive: true
  }
]

// Local storage keys
const STORAGE_KEYS = {
  USER_ID: 'ab-test-user-id',
  TEST_ASSIGNMENTS: 'ab-test-assignments',
  CONVERSION_EVENTS: 'ab-test-conversions'
}

// Utility functions
const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

const getUserId = (): string => {
  if (typeof window === 'undefined') return 'ssr-user'
  
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
  if (!userId) {
    userId = generateUserId()
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId)
  }
  return userId
}

const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// A/B Test Assignment Logic
const assignUserToVariant = (testConfig: ABTestConfig, userId: string): ABTestVariant | null => {
  // Check if user should be included in test (traffic allocation)
  const userHash = hashString(userId + testConfig.testId)
  const userTrafficPercent = (userHash % 100) + 1
  
  if (userTrafficPercent > testConfig.trafficAllocation) {
    return null // User not included in test
  }
  
  // Check if test is active and within date range
  if (!testConfig.isActive) return null
  
  const now = new Date()
  if (testConfig.startDate && now < testConfig.startDate) return null
  if (testConfig.endDate && now > testConfig.endDate) return null
  
  // Assign user to variant based on weights
  const variantHash = hashString(userId + testConfig.testId + 'variant')
  const variantPercent = variantHash % 100
  
  let cumulativeWeight = 0
  for (const variant of testConfig.variants) {
    cumulativeWeight += variant.weight
    if (variantPercent < cumulativeWeight) {
      return variant
    }
  }
  
  // Fallback to first variant
  return testConfig.variants[0]
}

// A/B Test Hook
export function useABTest(testId: string) {
  const [assignment, setAssignment] = useState<{
    variant: ABTestVariant | null
    isInTest: boolean
  }>({ variant: null, isInTest: false })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    if (typeof window === 'undefined') return

    const testConfig = AB_TEST_CONFIGS.find(config => config.testId === testId)
    if (!testConfig) {
      console.warn(`A/B test configuration not found for testId: ${testId}`)
      return
    }

    const userId = getUserId()
    
    // Check for existing assignment
    const existingAssignments = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TEST_ASSIGNMENTS) || '{}'
    )
    
    let assignedVariant = null
    let isInTest = false
    
    if (existingAssignments[testId]) {
      // Use existing assignment
      const variantId = existingAssignments[testId]
      assignedVariant = testConfig.variants.find(v => v.id === variantId) || null
      isInTest = assignedVariant !== null
    } else {
      // Make new assignment
      assignedVariant = assignUserToVariant(testConfig, userId)
      isInTest = assignedVariant !== null
      
      // Store assignment
      existingAssignments[testId] = assignedVariant ? assignedVariant.id : null
      localStorage.setItem(STORAGE_KEYS.TEST_ASSIGNMENTS, JSON.stringify(existingAssignments))
    }

    setAssignment({ variant: assignedVariant, isInTest })
  }, [testId])

  const trackConversion = useCallback((eventName: string, metadata?: Record<string, any>) => {
    if (typeof window === 'undefined') return
    
    const userId = getUserId()
    const existingAssignments = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TEST_ASSIGNMENTS) || '{}'
    )
    
    const variantId = existingAssignments[testId]
    if (!variantId) return // User not in this test
    
    // Store conversion event
    const conversionEvent: ABTestResult = {
      testId,
      variantId,
      userId,
      timestamp: new Date(),
      conversionEvents: [eventName],
      metadata
    }
    
    const existingEvents = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSION_EVENTS) || '[]'
    )
    
    existingEvents.push(conversionEvent)
    localStorage.setItem(STORAGE_KEYS.CONVERSION_EVENTS, JSON.stringify(existingEvents))
    
    // Send to analytics (placeholder - replace with your analytics service)
    console.log('A/B Test Conversion:', conversionEvent)
    
    // Optional: Send to your analytics API
    // fetch('/api/ab-test/conversion', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(conversionEvent)
    // })
  }, [testId])

  return {
    variant: assignment.variant,
    isInTest: assignment.isInTest,
    trackConversion,
    isClient
  }
}

// A/B Test Component Wrapper
interface ABTestProps {
  testId: string
  fallback?: ReactNode
  className?: string
  onVariantAssigned?: (variantId: string) => void
}

export function ABTest({ testId, fallback, className, onVariantAssigned }: ABTestProps) {
  const { variant, isInTest, isClient } = useABTest(testId)
  
  useEffect(() => {
    if (variant && onVariantAssigned) {
      onVariantAssigned(variant.id)
    }
  }, [variant, onVariantAssigned])

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return fallback || null
  }

  if (!isInTest || !variant) {
    return fallback || null
  }

  return (
    <div className={className} data-ab-test={testId} data-variant={variant.id}>
      {variant.component}
    </div>
  )
}

// A/B Test Management Dashboard (for development/testing)
export function ABTestDashboard() {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [conversions, setConversions] = useState<ABTestResult[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window === 'undefined') return

    const storedAssignments = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TEST_ASSIGNMENTS) || '{}'
    )
    const storedConversions = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSION_EVENTS) || '[]'
    )
    
    setAssignments(storedAssignments)
    setConversions(storedConversions)
  }, [])

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.TEST_ASSIGNMENTS)
    localStorage.removeItem(STORAGE_KEYS.CONVERSION_EVENTS)
    localStorage.removeItem(STORAGE_KEYS.USER_ID)
    setAssignments({})
    setConversions([])
    window.location.reload()
  }

  const getConversionStats = (testId: string) => {
    const testConversions = conversions.filter(c => c.testId === testId)
    const variantStats: Record<string, { views: number; conversions: number; rate: number }> = {}
    
    // This is simplified - in reality you'd track views separately
    testConversions.forEach(conversion => {
      if (!variantStats[conversion.variantId]) {
        variantStats[conversion.variantId] = { views: 1, conversions: 0, rate: 0 }
      }
      variantStats[conversion.variantId].conversions++
      variantStats[conversion.variantId].rate = 
        (variantStats[conversion.variantId].conversions / variantStats[conversion.variantId].views) * 100
    })
    
    return variantStats
  }

  if (!isClient) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">A/B Test Dashboard</h3>
        <Button variant="outline" size="sm" onClick={clearAllData}>
          Reset All
        </Button>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {AB_TEST_CONFIGS.map(config => {
          const userVariant = assignments[config.testId]
          const stats = getConversionStats(config.testId)
          
          return (
            <div key={config.testId} className="border border-gray-200 rounded p-3">
              <div className="font-medium text-sm text-gray-900 mb-2">
                {config.testName}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                Your variant: <span className="font-medium">{userVariant || 'Not assigned'}</span>
              </div>
              
              {Object.entries(stats).length > 0 && (
                <div className="text-xs">
                  <div className="font-medium text-gray-700 mb-1">Conversion Rates:</div>
                  {Object.entries(stats).map(([variantId, stat]) => (
                    <div key={variantId} className="flex justify-between">
                      <span>{variantId}:</span>
                      <span>{stat.rate.toFixed(1)}% ({stat.conversions}/{stat.views})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Conversion Tracking Hook
export function useConversionTracking() {
  const trackConversion = useCallback((eventName: string, testId?: string, metadata?: Record<string, any>) => {
    if (typeof window === 'undefined') return

    const userId = getUserId()
    const assignments = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TEST_ASSIGNMENTS) || '{}'
    )

    // Track for all active tests or specific test
    const testsToTrack = testId ? [testId] : Object.keys(assignments)
    
    testsToTrack.forEach(tId => {
      const variantId = assignments[tId]
      if (!variantId) return

      const conversionEvent: ABTestResult = {
        testId: tId,
        variantId,
        userId,
        timestamp: new Date(),
        conversionEvents: [eventName],
        metadata
      }

      const existingEvents = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CONVERSION_EVENTS) || '[]'
      )
      
      existingEvents.push(conversionEvent)
      localStorage.setItem(STORAGE_KEYS.CONVERSION_EVENTS, JSON.stringify(existingEvents))
      
      // Send to analytics
      console.log('Conversion tracked:', conversionEvent)
    })
  }, [])

  return { trackConversion }
}

// Predefined Test Components
export function ABTestHeroHeadline({ fallback }: { fallback?: ReactNode }) {
  return (
    <ABTest 
      testId="hero-headline-test" 
      fallback={fallback}
      className="hero-headline-test"
    />
  )
}

export function ABTestPrimaryCTA({ fallback }: { fallback?: ReactNode }) {
  return (
    <ABTest 
      testId="cta-button-test" 
      fallback={fallback}
      className="primary-cta-test"
    />
  )
}

// Results Export (for development)
export function exportABTestResults() {
  if (typeof window === 'undefined') return null

  const assignments = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TEST_ASSIGNMENTS) || '{}'
  )
  const conversions = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.CONVERSION_EVENTS) || '[]'
  )

  return {
    assignments,
    conversions,
    userId: getUserId(),
    exportedAt: new Date().toISOString()
  }
}
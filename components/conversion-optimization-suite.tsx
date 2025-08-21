"use client"

import { useState, useEffect } from "react"
import { ExitIntentPopup } from "./exit-intent-popup"
import { MultiStepLeadForm } from "./multi-step-lead-form"
import { SocialProofSystem } from "./social-proof-system"
import { UrgencyScarcitySystem } from "./urgency-scarcity-system"
import { RiskReductionTrustSystem } from "./risk-reduction-trust-system"
import { ABTestDashboard, useABTest } from "./ab-testing-framework"
import { AnalyticsDashboard, useConversionAnalytics, useHeatMapTracking } from "./conversion-analytics"
import { 
  HeroPrimaryCTA, 
  ValuePropCTA, 
  RiskFreeCTA, 
  SocialProofCTA, 
  StickyFooterCTA,
  MultiCTASection
} from "./optimized-ctas"
import { useToast } from "@/hooks/use-toast"

interface ConversionOptimizationSuiteProps {
  variant?: 'full' | 'minimal' | 'enterprise'
  showDashboards?: boolean
  enableABTesting?: boolean
  enableAnalytics?: boolean
}

export function ConversionOptimizationSuite({ 
  variant = 'full',
  showDashboards = process.env.NODE_ENV === 'development',
  enableABTesting = true,
  enableAnalytics = true
}: ConversionOptimizationSuiteProps) {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [activeLeadForm, setActiveLeadForm] = useState<'assessment' | 'consultation' | 'demo' | null>(null)
  const [userEngagement, setUserEngagement] = useState({
    timeOnSite: 0,
    pageViews: 1,
    interactionCount: 0,
    scrollDepth: 0
  })
  
  const { toast } = useToast()
  const { trackConversion, trackEvent } = enableAnalytics ? useConversionAnalytics() : { trackConversion: () => {}, trackEvent: () => {} }
  
  // Enable heat map tracking if analytics is enabled
  if (enableAnalytics) {
    useHeatMapTracking()
  }

  // Track user engagement metrics
  useEffect(() => {
    const startTime = Date.now()
    
    // Track time on site
    const timeInterval = setInterval(() => {
      setUserEngagement(prev => ({
        ...prev,
        timeOnSite: Date.now() - startTime
      }))
    }, 1000)

    // Track interactions
    const trackInteraction = () => {
      setUserEngagement(prev => ({
        ...prev,
        interactionCount: prev.interactionCount + 1
      }))
    }

    // Track scroll depth
    const trackScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      
      setUserEngagement(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, scrollPercent)
      }))
    }

    // Add event listeners
    document.addEventListener('click', trackInteraction)
    document.addEventListener('scroll', trackScroll, { passive: true })
    
    return () => {
      clearInterval(timeInterval)
      document.removeEventListener('click', trackInteraction)
      document.removeEventListener('scroll', trackScroll)
    }
  }, [])

  // Handle CTA clicks with conversion tracking
  const handleScheduleAssessment = () => {
    setActiveLeadForm('assessment')
    if (enableAnalytics) {
      trackConversion('schedule-assessment', {
        source: 'main-cta',
        userEngagement
      })
    }
  }

  const handleScheduleConsultation = () => {
    setActiveLeadForm('consultation')
    if (enableAnalytics) {
      trackConversion('consultation-book', {
        source: 'consultation-cta',
        userEngagement
      })
    }
  }

  const handleRequestDemo = () => {
    setActiveLeadForm('demo')
    if (enableAnalytics) {
      trackConversion('demo-request', {
        source: 'demo-cta',
        userEngagement
      })
    }
  }

  const handleFormClose = () => {
    setActiveLeadForm(null)
  }

  const handleFormSuccess = () => {
    setActiveLeadForm(null)
    toast({
      title: "Thank you!",
      description: "We'll be in touch within 24 hours to coordinate next steps.",
    })
    
    if (enableAnalytics) {
      trackEvent('form-completion-success', {
        formType: activeLeadForm,
        userEngagement
      })
    }
  }

  // A/B Testing Integration
  const { variant: heroVariant } = enableABTesting ? useABTest('hero-headline-test') : { variant: null }
  const { variant: ctaVariant } = enableABTesting ? useABTest('cta-button-test') : { variant: null }

  // Render based on variant
  if (variant === 'minimal') {
    return (
      <>
        {/* Essential CRO Components */}
        <ExitIntentPopup disabled={false} />
        <StickyFooterCTA onClick={handleScheduleAssessment} />
        
        {/* Lead Forms */}
        <MultiStepLeadForm 
          open={activeLeadForm === 'assessment'}
          onOpenChange={(open) => !open && handleFormClose()}
          variant="assessment"
        />
        
        {/* Analytics Dashboard (development only) */}
        {showDashboards && enableAnalytics && <AnalyticsDashboard />}
        {showDashboards && enableABTesting && <ABTestDashboard />}
      </>
    )
  }

  if (variant === 'enterprise') {
    return (
      <>
        {/* Full Enterprise CRO Suite */}
        <ExitIntentPopup disabled={false} />
        
        {/* Social Proof */}
        <SocialProofSystem variant="full" showRealTimeActivity={true} />
        
        {/* Urgency & Scarcity */}
        <UrgencyScarcitySystem variant="full" onCTAClick={handleScheduleAssessment} />
        
        {/* Risk Reduction & Trust */}
        <RiskReductionTrustSystem variant="full" onCTA={handleScheduleAssessment} />
        
        {/* Optimized CTAs */}
        <ValuePropCTA onClick={handleScheduleConsultation} />
        <RiskFreeCTA onClick={handleScheduleAssessment} />
        <SocialProofCTA onClick={handleScheduleAssessment} />
        
        {/* Multi-CTA Section */}
        <MultiCTASection 
          variant="comparison" 
          onCTAClick={(ctaId) => {
            if (ctaId === 'schedule-assessment') handleScheduleAssessment()
            else if (ctaId === 'consultation') handleScheduleConsultation()
            else if (ctaId === 'poc-request') handleRequestDemo()
          }}
        />
        
        <StickyFooterCTA onClick={handleScheduleAssessment} />
        
        {/* Lead Forms */}
        <MultiStepLeadForm 
          open={activeLeadForm === 'assessment'}
          onOpenChange={(open) => !open && handleFormClose()}
          variant="assessment"
        />
        <MultiStepLeadForm 
          open={activeLeadForm === 'consultation'}
          onOpenChange={(open) => !open && handleFormClose()}
          variant="consultation"
        />
        <MultiStepLeadForm 
          open={activeLeadForm === 'demo'}
          onOpenChange={(open) => !open && handleFormClose()}
          variant="demo"
        />
        
        {/* Development Dashboards */}
        {showDashboards && enableAnalytics && <AnalyticsDashboard />}
        {showDashboards && enableABTesting && <ABTestDashboard />}
      </>
    )
  }

  // Full variant - all features
  return (
    <>
      {/* Exit Intent System */}
      <ExitIntentPopup disabled={false} />
      
      {/* Social Proof Elements */}
      <SocialProofSystem 
        variant="full" 
        showRealTimeActivity={true}
        maxTestimonials={4}
      />
      
      {/* Urgency & Scarcity Mechanisms */}
      <UrgencyScarcitySystem 
        variant="full" 
        onCTAClick={handleScheduleAssessment} 
      />
      
      {/* Risk Reduction & Trust System */}
      <RiskReductionTrustSystem 
        variant="full"
        showGuarantees={true}
        showSecurityBadges={true}
        showRiskFreeTrial={true}
        onCTA={handleScheduleAssessment}
      />
      
      {/* Optimized CTAs Throughout the Funnel */}
      <ValuePropCTA onClick={handleScheduleConsultation} />
      <RiskFreeCTA onClick={handleScheduleAssessment} />
      <SocialProofCTA onClick={handleScheduleAssessment} />
      
      {/* Multi-CTA Comparison Section */}
      <MultiCTASection 
        variant="comparison" 
        onCTAClick={(ctaId) => {
          if (ctaId === 'schedule-assessment') handleScheduleAssessment()
          else if (ctaId === 'consultation') handleScheduleConsultation()
          else if (ctaId === 'poc-request') handleRequestDemo()
          else if (ctaId === 'download-guide') {
            if (enableAnalytics) trackConversion('download-guide', { source: ctaId })
          }
        }}
      />
      
      {/* Sticky Footer CTA */}
      <StickyFooterCTA onClick={handleScheduleAssessment} />
      
      {/* Advanced Lead Capture Forms */}
      <MultiStepLeadForm 
        open={activeLeadForm === 'assessment'}
        onOpenChange={(open) => !open && handleFormClose()}
        variant="assessment"
        title="Schedule Your AI Opportunity Assessment"
      />
      
      <MultiStepLeadForm 
        open={activeLeadForm === 'consultation'}
        onOpenChange={(open) => !open && handleFormClose()}
        variant="consultation"
        title="Book Your Strategic AI Consultation"
      />
      
      <MultiStepLeadForm 
        open={activeLeadForm === 'demo'}
        onOpenChange={(open) => !open && handleFormClose()}
        variant="demo"
        title="Request Your Personalized Demo"
      />
      
      {/* Development Tools */}
      {showDashboards && (
        <>
          {enableAnalytics && <AnalyticsDashboard />}
          {enableABTesting && <ABTestDashboard />}
        </>
      )}
      
      {/* A/B Testing Integration Notice */}
      {enableABTesting && showDashboards && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs">
          A/B Testing Active
          {heroVariant && <div>Hero: {heroVariant.id}</div>}
          {ctaVariant && <div>CTA: {ctaVariant.id}</div>}
        </div>
      )}
    </>
  )
}

// Individual Feature Toggles for Granular Control
export function useConversionFeatures() {
  const [features, setFeatures] = useState({
    exitIntent: true,
    socialProof: true,
    urgencyScarcity: true,
    riskReduction: true,
    abTesting: true,
    analytics: true,
    stickyFooter: true,
    multiStepForms: true
  })

  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }))
  }

  return { features, toggleFeature }
}

// Performance Monitoring Component
export function ConversionPerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    conversionRate: 0,
    averageTimeToConversion: 0,
    bounceRate: 0,
    engagementScore: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Calculate metrics from stored analytics data
    const calculateMetrics = () => {
      const events = JSON.parse(localStorage.getItem('analytics-events') || '[]')
      const conversions = events.filter((e: any) => 
        ['schedule-assessment', 'consultation-book', 'demo-request', 'download-guide'].includes(e.eventName)
      )
      
      const totalSessions = new Set(events.map((e: any) => e.sessionId)).size || 1
      const conversionRate = (conversions.length / totalSessions) * 100
      
      // Calculate average time to conversion
      const conversionTimes = conversions.map((c: any) => c.metadata?.timeOnPage || 0)
      const avgTimeToConversion = conversionTimes.length > 0 
        ? conversionTimes.reduce((a: number, b: number) => a + b, 0) / conversionTimes.length / 1000
        : 0

      // Simple engagement score based on interactions and time
      const totalInteractions = events.filter((e: any) => e.eventName.includes('click')).length
      const avgScrollDepth = events.reduce((acc: number, e: any) => acc + (e.metadata?.scrollDepth || 0), 0) / events.length || 0
      const engagementScore = Math.min((totalInteractions / totalSessions) * 10 + avgScrollDepth / 10, 100)

      setMetrics({
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageTimeToConversion: Math.round(avgTimeToConversion),
        bounceRate: 0, // Would need additional tracking
        engagementScore: Math.round(engagementScore)
      })
    }

    calculateMetrics()
    const interval = setInterval(calculateMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs">
      <h4 className="font-semibold text-gray-900 mb-3">Conversion Metrics</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Conversion Rate:</span>
          <span className="font-semibold text-[#00A878]">{metrics.conversionRate}%</span>
        </div>
        <div className="flex justify-between">
          <span>Avg. Time to Convert:</span>
          <span className="font-semibold">{metrics.averageTimeToConversion}s</span>
        </div>
        <div className="flex justify-between">
          <span>Engagement Score:</span>
          <span className="font-semibold">{metrics.engagementScore}/100</span>
        </div>
      </div>
    </div>
  )
}

export default ConversionOptimizationSuite
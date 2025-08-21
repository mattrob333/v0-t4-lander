"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Calendar, 
  Download, 
  Phone, 
  MessageSquare, 
  Zap, 
  Clock, 
  Star, 
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Award,
  Target,
  Rocket,
  DollarSign
} from "lucide-react"
import { useConversionAnalytics } from "./conversion-analytics"

// CTA Types and Configurations
interface CTAConfig {
  id: string
  type: 'primary' | 'secondary' | 'tertiary'
  variant: 'assessment' | 'consultation' | 'demo' | 'download' | 'call' | 'form'
  urgency: 'high' | 'medium' | 'low' | 'none'
  context: 'hero' | 'section' | 'sidebar' | 'inline' | 'footer' | 'sticky'
  copy: {
    headline?: string
    subheadline?: string
    buttonText: string
    supportingText?: string
  }
  styling: {
    size: 'sm' | 'md' | 'lg' | 'xl'
    color: 'primary' | 'secondary' | 'urgent' | 'success' | 'premium'
    icon?: React.ElementType
  }
  behavioral: {
    trackingEvent: string
    conversionGoal: string
    abTestId?: string
  }
  targeting?: {
    timeOnPage?: number
    scrollDepth?: number
    visitNumber?: number
    source?: string[]
  }
}

// Pre-configured CTAs for different contexts
const CTA_CONFIGS: Record<string, CTAConfig> = {
  'hero-primary': {
    id: 'hero-primary',
    type: 'primary',
    variant: 'assessment',
    urgency: 'medium',
    context: 'hero',
    copy: {
      buttonText: 'Schedule Your AI Opportunity Assessment',
      supportingText: '60-minute strategy session • No commitment required'
    },
    styling: {
      size: 'lg',
      color: 'primary',
      icon: Calendar
    },
    behavioral: {
      trackingEvent: 'hero-cta-click',
      conversionGoal: 'schedule-assessment'
    }
  },
  'hero-secondary': {
    id: 'hero-secondary',
    type: 'secondary',
    variant: 'demo',
    urgency: 'low',
    context: 'hero',
    copy: {
      buttonText: 'See How Our Process Works',
      supportingText: '5-minute overview'
    },
    styling: {
      size: 'lg',
      color: 'secondary',
      icon: ArrowRight
    },
    behavioral: {
      trackingEvent: 'hero-demo-click',
      conversionGoal: 'engagement'
    }
  },
  'value-prop-cta': {
    id: 'value-prop-cta',
    type: 'primary',
    variant: 'consultation',
    urgency: 'high',
    context: 'section',
    copy: {
      headline: 'Ready to Validate Your AI Opportunities?',
      subheadline: 'Get a custom AI roadmap based on your industry and use case',
      buttonText: 'Book Your Free Strategic Session',
      supportingText: 'Usually $500 • Free for qualified executives'
    },
    styling: {
      size: 'xl',
      color: 'urgent',
      icon: Rocket
    },
    behavioral: {
      trackingEvent: 'value-prop-cta-click',
      conversionGoal: 'consultation-book'
    },
    targeting: {
      scrollDepth: 40
    }
  },
  'risk-free-cta': {
    id: 'risk-free-cta',
    type: 'primary',
    variant: 'assessment',
    urgency: 'medium',
    context: 'section',
    copy: {
      headline: '100% Risk-Free AI Assessment',
      subheadline: 'Money-back guarantee if we don\'t identify at least 3 high-impact AI opportunities',
      buttonText: 'Start My Risk-Free Assessment',
      supportingText: 'No contracts • No commitments • No risk'
    },
    styling: {
      size: 'lg',
      color: 'success',
      icon: Shield
    },
    behavioral: {
      trackingEvent: 'risk-free-cta-click',
      conversionGoal: 'schedule-assessment'
    }
  },
  'urgency-cta': {
    id: 'urgency-cta',
    type: 'primary',
    variant: 'call',
    urgency: 'high',
    context: 'sidebar',
    copy: {
      headline: 'Need AI Clarity This Week?',
      buttonText: 'Call Now: (555) 123-4567',
      supportingText: 'Speak directly with our AI strategy team'
    },
    styling: {
      size: 'md',
      color: 'urgent',
      icon: Phone
    },
    behavioral: {
      trackingEvent: 'urgency-call-click',
      conversionGoal: 'phone-call-click'
    },
    targeting: {
      timeOnPage: 30000
    }
  },
  'download-lead-magnet': {
    id: 'download-lead-magnet',
    type: 'secondary',
    variant: 'download',
    urgency: 'low',
    context: 'inline',
    copy: {
      headline: 'Free AI Strategy Guide',
      subheadline: 'Complete framework for evaluating AI opportunities in your industry',
      buttonText: 'Download Free Guide',
      supportingText: 'Instant download • No spam'
    },
    styling: {
      size: 'md',
      color: 'secondary',
      icon: Download
    },
    behavioral: {
      trackingEvent: 'guide-download-click',
      conversionGoal: 'download-guide'
    }
  },
  'social-proof-cta': {
    id: 'social-proof-cta',
    type: 'primary',
    variant: 'assessment',
    urgency: 'medium',
    context: 'section',
    copy: {
      headline: 'Join 147+ Companies That Have Succeeded with AI',
      subheadline: 'See why C-suite executives choose our proven methodology',
      buttonText: 'Schedule My Executive Briefing',
      supportingText: '98% satisfaction rate • Average 3.8x ROI'
    },
    styling: {
      size: 'lg',
      color: 'primary',
      icon: Award
    },
    behavioral: {
      trackingEvent: 'social-proof-cta-click',
      conversionGoal: 'schedule-assessment'
    }
  },
  'sticky-footer-cta': {
    id: 'sticky-footer-cta',
    type: 'primary',
    variant: 'assessment',
    urgency: 'medium',
    context: 'sticky',
    copy: {
      buttonText: 'Book Your AI Assessment',
      supportingText: 'Free 60-minute session'
    },
    styling: {
      size: 'md',
      color: 'primary',
      icon: Calendar
    },
    behavioral: {
      trackingEvent: 'sticky-cta-click',
      conversionGoal: 'schedule-assessment'
    },
    targeting: {
      scrollDepth: 50
    }
  }
}

// Individual CTA Component
interface OptimizedCTAProps {
  config: CTAConfig
  onClick?: () => void
  className?: string
  showSupportingElements?: boolean
}

export function OptimizedCTA({ 
  config, 
  onClick, 
  className = '',
  showSupportingElements = true 
}: OptimizedCTAProps) {
  const { trackConversion, trackElementClick } = useConversionAnalytics()
  const [isVisible, setIsVisible] = useState(false)
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [scrollDepth, setScrollDepth] = useState(0)

  // Track time on page
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setTimeOnPage(Date.now() - startTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollDepth(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Visibility logic based on targeting
  useEffect(() => {
    const targeting = config.targeting
    if (!targeting) {
      setIsVisible(true)
      return
    }

    let shouldShow = true

    if (targeting.timeOnPage && timeOnPage < targeting.timeOnPage) {
      shouldShow = false
    }

    if (targeting.scrollDepth && scrollDepth < targeting.scrollDepth) {
      shouldShow = false
    }

    setIsVisible(shouldShow)
  }, [config.targeting, timeOnPage, scrollDepth])

  const handleClick = () => {
    // Track the click event
    trackElementClick(config.behavioral.trackingEvent, {
      ctaId: config.id,
      ctaType: config.type,
      ctaVariant: config.variant,
      ctaContext: config.context,
      timeOnPage,
      scrollDepth
    })

    // Track conversion
    trackConversion(config.behavioral.conversionGoal, {
      ctaId: config.id,
      ctaContext: config.context
    })

    // Execute custom onClick
    onClick?.()
  }

  const getButtonStyles = () => {
    const baseStyles = "font-semibold transition-all duration-200 flex items-center gap-2"
    const sizeStyles = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-12 px-8 text-lg",
      xl: "h-14 px-10 text-xl"
    }
    const colorStyles = {
      primary: "bg-[#00A878] hover:bg-[#00936B] text-white",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300",
      urgent: "bg-red-600 hover:bg-red-700 text-white animate-pulse",
      success: "bg-green-600 hover:bg-green-700 text-white",
      premium: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
    }

    return `${baseStyles} ${sizeStyles[config.styling.size]} ${colorStyles[config.styling.color]}`
  }

  const getUrgencyIndicator = () => {
    if (config.urgency === 'high') {
      return (
        <div className="flex items-center gap-1 text-red-600 text-xs font-medium mb-2">
          <Zap className="w-3 h-3" />
          <span>Limited time offer</span>
        </div>
      )
    }
    if (config.urgency === 'medium') {
      return (
        <div className="flex items-center gap-1 text-orange-600 text-xs font-medium mb-2">
          <Clock className="w-3 h-3" />
          <span>Popular choice</span>
        </div>
      )
    }
    return null
  }

  const getSocialProof = () => {
    if (!showSupportingElements) return null

    return (
      <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span>4.9/5 rating</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>147+ companies</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>3.8x avg ROI</span>
        </div>
      </div>
    )
  }

  if (!isVisible) return null

  // Context-specific rendering
  if (config.context === 'sticky') {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-lg ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">{config.copy.buttonText}</div>
            {config.copy.supportingText && (
              <div className="text-sm text-gray-600">{config.copy.supportingText}</div>
            )}
          </div>
          <Button 
            onClick={handleClick}
            className={getButtonStyles()}
          >
            {config.styling.icon && <config.styling.icon className="w-5 h-5" />}
            {config.copy.buttonText}
          </Button>
        </div>
      </div>
    )
  }

  if (config.context === 'sidebar') {
    return (
      <Card className={`p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 ${className}`}>
        {getUrgencyIndicator()}
        {config.copy.headline && (
          <h3 className="font-bold text-lg text-gray-900 mb-2">{config.copy.headline}</h3>
        )}
        {config.copy.subheadline && (
          <p className="text-gray-700 mb-4 text-sm">{config.copy.subheadline}</p>
        )}
        <Button 
          onClick={handleClick}
          className={`w-full ${getButtonStyles()}`}
        >
          {config.styling.icon && <config.styling.icon className="w-5 h-5" />}
          {config.copy.buttonText}
        </Button>
        {config.copy.supportingText && (
          <p className="text-xs text-gray-600 mt-3 text-center">{config.copy.supportingText}</p>
        )}
      </Card>
    )
  }

  // Default section/inline rendering
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        {getUrgencyIndicator()}
        {config.copy.headline && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{config.copy.headline}</h2>
        )}
        {config.copy.subheadline && (
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">{config.copy.subheadline}</p>
        )}
        
        <Button 
          onClick={handleClick}
          className={getButtonStyles()}
        >
          {config.styling.icon && <config.styling.icon className="w-5 h-5" />}
          {config.copy.buttonText}
        </Button>
        
        {config.copy.supportingText && (
          <p className="text-sm text-gray-600 mt-3">{config.copy.supportingText}</p>
        )}
        
        {showSupportingElements && getSocialProof()}
      </div>
    </section>
  )
}

// Pre-built CTA Components
export function HeroPrimaryCTA({ onClick }: { onClick?: () => void }) {
  return <OptimizedCTA config={CTA_CONFIGS['hero-primary']} onClick={onClick} />
}

export function HeroSecondaryCTA({ onClick }: { onClick?: () => void }) {
  return <OptimizedCTA config={CTA_CONFIGS['hero-secondary']} onClick={onClick} />
}

export function ValuePropCTA({ onClick }: { onClick?: () => void }) {
  return (
    <OptimizedCTA 
      config={CTA_CONFIGS['value-prop-cta']} 
      onClick={onClick} 
      className="bg-gradient-to-br from-[#00A878]/5 to-emerald-50"
    />
  )
}

export function RiskFreeCTA({ onClick }: { onClick?: () => void }) {
  return (
    <OptimizedCTA 
      config={CTA_CONFIGS['risk-free-cta']} 
      onClick={onClick} 
      className="bg-white"
    />
  )
}

export function UrgencySidebarCTA({ onClick }: { onClick?: () => void }) {
  return (
    <div className="sticky top-24">
      <OptimizedCTA config={CTA_CONFIGS['urgency-cta']} onClick={onClick} />
    </div>
  )
}

export function DownloadLeadMagnet({ onClick }: { onClick?: () => void }) {
  return <OptimizedCTA config={CTA_CONFIGS['download-lead-magnet']} onClick={onClick} />
}

export function SocialProofCTA({ onClick }: { onClick?: () => void }) {
  return (
    <OptimizedCTA 
      config={CTA_CONFIGS['social-proof-cta']} 
      onClick={onClick} 
      className="bg-gray-50"
    />
  )
}

export function StickyFooterCTA({ onClick }: { onClick?: () => void }) {
  return <OptimizedCTA config={CTA_CONFIGS['sticky-footer-cta']} onClick={onClick} />
}

// Multi-CTA Section Component
interface MultiCTASectionProps {
  variant: 'comparison' | 'tiered' | 'progressive'
  onCTAClick?: (ctaId: string) => void
}

export function MultiCTASection({ variant, onCTAClick }: MultiCTASectionProps) {
  const { trackElementClick } = useConversionAnalytics()

  const handleCTAClick = (ctaId: string) => {
    trackElementClick('multi-cta-click', { ctaId, variant })
    onCTAClick?.(ctaId)
  }

  if (variant === 'comparison') {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Path to AI Success</h2>
            <p className="text-gray-600">Select the option that best fits your timeline and needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Start */}
            <Card className="p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Quick Start</h3>
              <p className="text-gray-600 mb-6">Get immediate AI insights and next steps</p>
              <Button 
                onClick={() => handleCTAClick('download-guide')}
                variant="outline"
                className="w-full mb-4"
              >
                Download Free Guide
              </Button>
              <p className="text-xs text-gray-500">Instant access • No meeting required</p>
            </Card>

            {/* Strategic Assessment */}
            <Card className="p-8 text-center border-2 border-[#00A878] relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#00A878] text-white px-4 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <div className="bg-[#00A878]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#00A878]" />
              </div>
              <h3 className="font-bold text-xl mb-2">Strategic Assessment</h3>
              <p className="text-gray-600 mb-6">60-minute personalized AI opportunity analysis</p>
              <Button 
                onClick={() => handleCTAClick('schedule-assessment')}
                className="w-full mb-4 bg-[#00A878] hover:bg-[#00936B]"
              >
                Schedule Free Assessment
              </Button>
              <p className="text-xs text-gray-500">Usually $500 • Free for qualified executives</p>
            </Card>

            {/* Full Implementation */}
            <Card className="p-8 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Full Implementation</h3>
              <p className="text-gray-600 mb-6">Complete 5-day POC with working prototype</p>
              <Button 
                onClick={() => handleCTAClick('poc-request')}
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
              >
                Request POC Quote
              </Button>
              <p className="text-xs text-gray-500">Custom pricing • Enterprise contracts</p>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'tiered') {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600">Choose the level of engagement that works for you</p>
          </div>
          
          <div className="space-y-4">
            <Card className="p-6 border-l-4 border-[#00A878]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Free AI Strategy Session</h3>
                  <p className="text-gray-600 text-sm">60-minute consultation to identify your top AI opportunities</p>
                </div>
                <Button 
                  onClick={() => handleCTAClick('consultation')}
                  className="bg-[#00A878] hover:bg-[#00936B]"
                >
                  Book Now
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">5-Day AI Proof of Concept</h3>
                  <p className="text-gray-600 text-sm">Working AI prototype with ROI validation and implementation roadmap</p>
                </div>
                <Button 
                  onClick={() => handleCTAClick('poc')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Get Quote
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Fractional Chief AI Officer</h3>
                  <p className="text-gray-600 text-sm">Ongoing strategic guidance and AI leadership for your organization</p>
                </div>
                <Button 
                  onClick={() => handleCTAClick('fractional-cao')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Learn More
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  // Progressive variant
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your AI Journey Today</h2>
          <p className="text-gray-600">Take the first step towards AI transformation</p>
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          <Button 
            onClick={() => handleCTAClick('primary')}
            size="lg"
            className="bg-[#00A878] hover:bg-[#00936B] px-12 py-4 text-xl"
          >
            <Calendar className="w-6 h-6 mr-2" />
            Schedule Your Free Assessment
          </Button>
          
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Not ready to schedule? Start with our resources:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCTAClick('download')}
              >
                <Download className="w-4 h-4 mr-1" />
                Download Guide
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCTAClick('call')}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
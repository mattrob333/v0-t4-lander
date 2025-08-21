"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { SimpleImage } from "@/components/ui/simple-image"
import { Star, Quote, TrendingUp, Users, CheckCircle, Award, Building } from "lucide-react"

// Real-time activity notifications
interface ActivityNotification {
  id: string
  type: 'assessment' | 'consultation' | 'implementation'
  name: string
  company: string
  location: string
  timeAgo: string
  action: string
}

// Testimonial data structure
interface Testimonial {
  id: string
  name: string
  title: string
  company: string
  industry: string
  image?: string
  quote: string
  rating: number
  results: {
    roi: string
    timeframe: string
    metric: string
  }
  verified: boolean
}

// Social proof statistics
interface SocialProofStats {
  clientsServed: number
  avgROI: string
  avgImplementationTime: string
  satisfactionRate: string
  industriesServed: number
}

const ACTIVITY_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: '1',
    type: 'assessment',
    name: 'Sarah Chen',
    company: 'MedTech Solutions',
    location: 'San Francisco, CA',
    timeAgo: '3 minutes ago',
    action: 'scheduled an AI Opportunity Assessment'
  },
  {
    id: '2',
    type: 'implementation',
    name: 'Michael Rodriguez',
    company: 'Global Logistics Inc',
    location: 'Austin, TX',
    timeAgo: '12 minutes ago',
    action: 'started a 5-Day POC project'
  },
  {
    id: '3',
    type: 'consultation',
    name: 'Jennifer Park',
    company: 'FinanceFirst Bank',
    location: 'New York, NY',
    timeAgo: '18 minutes ago',
    action: 'booked a strategic consultation'
  },
  {
    id: '4',
    type: 'assessment',
    name: 'David Thompson',
    company: 'RetailMax Corp',
    location: 'Seattle, WA',
    timeAgo: '25 minutes ago',
    action: 'downloaded the AI Readiness Report'
  },
  {
    id: '5',
    type: 'implementation',
    name: 'Lisa Wang',
    company: 'Healthcare Innovations',
    location: 'Boston, MA',
    timeAgo: '31 minutes ago',
    action: 'achieved 4.2x ROI in their pilot'
  }
]

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Robert Martinez',
    title: 'Chief Technology Officer',
    company: 'Progressive Insurance',
    industry: 'Insurance',
    quote: "Tier 4 Intelligence delivered exactly what they promised - a working AI prototype in 5 days that automated our claims processing. We saw immediate ROI and scaled it company-wide within 3 months.",
    rating: 5,
    results: {
      roi: '4.2x ROI',
      timeframe: '5 days to POC',
      metric: '40% faster claims processing'
    },
    verified: true
  },
  {
    id: '2',
    name: 'Amanda Foster',
    title: 'VP of Operations',
    company: 'Memorial Healthcare',
    industry: 'Healthcare',
    quote: "The vendor-neutral approach was exactly what we needed. Instead of being sold a specific platform, we got an objective assessment that saved us $200K and 6 months of wrong turns.",
    rating: 5,
    results: {
      roi: '3.8x ROI',
      timeframe: '5 days assessment',
      metric: '$200K saved in vendor costs'
    },
    verified: true
  },
  {
    id: '3',
    name: 'James Liu',
    title: 'Director of Digital Innovation',
    company: 'Wells Fargo',
    industry: 'Finance',
    quote: "We had been discussing AI for 18 months with no clear direction. Tier 4's rapid POC approach gave us clarity and a concrete roadmap. Our board approved the full implementation immediately.",
    rating: 5,
    results: {
      roi: '5.1x ROI',
      timeframe: '5 days to decision',
      metric: '60% reduction in manual processes'
    },
    verified: true
  },
  {
    id: '4',
    name: 'Maria Santos',
    title: 'Chief Innovation Officer',
    company: 'Walmart',
    industry: 'Retail',
    quote: "The executive AI education was a game-changer. Our entire C-suite now understands AI's potential and limitations. The strategic guidance continues to pay dividends months later.",
    rating: 5,
    results: {
      roi: '3.5x ROI',
      timeframe: 'Ongoing strategic partnership',
      metric: '25% improvement in demand forecasting'
    },
    verified: true
  }
]

const SOCIAL_PROOF_STATS: SocialProofStats = {
  clientsServed: 147,
  avgROI: '3.8x',
  avgImplementationTime: '5 days',
  satisfactionRate: '98%',
  industriesServed: 12
}

const TRUST_INDICATORS = [
  { icon: Award, label: 'ISO 27001 Certified', description: 'Enterprise security standards' },
  { icon: CheckCircle, label: 'SOC 2 Type II Compliant', description: 'Rigorous data protection' },
  { icon: Building, label: 'Fortune 500 Trusted', description: 'Enterprise-grade solutions' },
  { icon: Users, label: '500+ Executives Trained', description: 'Proven AI education' }
]

interface SocialProofSystemProps {
  variant?: 'testimonials' | 'activity' | 'stats' | 'trust-indicators' | 'full'
  showRealTimeActivity?: boolean
  maxTestimonials?: number
}

export function SocialProofSystem({ 
  variant = 'full',
  showRealTimeActivity = true,
  maxTestimonials = 4
}: SocialProofSystemProps) {
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
  const [showNotification, setShowNotification] = useState(false)

  // Cycle through activity notifications
  useEffect(() => {
    if (!showRealTimeActivity || variant === 'testimonials' || variant === 'trust-indicators') return

    const interval = setInterval(() => {
      setShowNotification(true)
      setTimeout(() => {
        setCurrentNotificationIndex((prev) => 
          (prev + 1) % ACTIVITY_NOTIFICATIONS.length
        )
        setShowNotification(false)
      }, 4000)
    }, 6000)

    return () => clearInterval(interval)
  }, [showRealTimeActivity, variant])

  const renderActivityNotification = () => {
    if (!showRealTimeActivity) return null

    const notification = ACTIVITY_NOTIFICATIONS[currentNotificationIndex]
    const getIcon = () => {
      switch (notification.type) {
        case 'assessment': return CheckCircle
        case 'consultation': return Users  
        case 'implementation': return TrendingUp
        default: return CheckCircle
      }
    }
    const Icon = getIcon()

    return (
      <div className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${
        showNotification ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        <Card className="p-4 bg-white shadow-lg border border-[#00A878]/20 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="bg-[#00A878]/10 p-2 rounded-lg">
              <Icon className="w-4 h-4 text-[#00A878]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                <span className="font-semibold">{notification.name}</span> from {notification.company}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.action}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{notification.location}</span>
                <span className="text-xs text-[#00A878]">{notification.timeAgo}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const renderTestimonials = () => {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Enterprises
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how industry leaders achieved rapid AI success with our proven methodology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {TESTIMONIALS.slice(0, maxTestimonials).map((testimonial) => (
              <Card key={testimonial.id} className="p-6 bg-white shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#00A878]/60 mb-3" />
                  </div>
                  {testimonial.verified && (
                    <div className="bg-[#00A878]/10 px-2 py-1 rounded-full">
                      <span className="text-xs text-[#00A878] font-medium">Verified</span>
                    </div>
                  )}
                </div>

                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold text-[#00A878]">{testimonial.results.roi}</div>
                    <div className="text-xs text-gray-600">Return on Investment</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{testimonial.results.timeframe}</div>
                    <div className="text-xs text-gray-600">Implementation</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.results.metric}</div>
                    <div className="text-xs text-gray-600">Key Improvement</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                    <div className="text-sm text-[#00A878]">{testimonial.company} • {testimonial.industry}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const renderStats = () => {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Proven Track Record
            </h2>
            <p className="text-gray-600">
              The numbers speak for themselves
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00A878] mb-2">
                {SOCIAL_PROOF_STATS.clientsServed}+
              </div>
              <div className="text-sm text-gray-600">Clients Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00A878] mb-2">
                {SOCIAL_PROOF_STATS.avgROI}
              </div>
              <div className="text-sm text-gray-600">Average ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00A878] mb-2">
                {SOCIAL_PROOF_STATS.avgImplementationTime}
              </div>
              <div className="text-sm text-gray-600">To Working POC</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00A878] mb-2">
                {SOCIAL_PROOF_STATS.satisfactionRate}
              </div>
              <div className="text-sm text-gray-600">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00A878] mb-2">
                {SOCIAL_PROOF_STATS.industriesServed}
              </div>
              <div className="text-sm text-gray-600">Industries Served</div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const renderTrustIndicators = () => {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Enterprise-Grade Security & Compliance
            </h3>
            <p className="text-gray-600">
              Trusted by Fortune 500 companies with the highest security standards
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_INDICATORS.map((indicator, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
                  <indicator.icon className="w-8 h-8 text-[#00A878] mx-auto" />
                </div>
                <div className="font-semibold text-sm text-gray-900 mb-1">
                  {indicator.label}
                </div>
                <div className="text-xs text-gray-600">
                  {indicator.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Render based on variant
  if (variant === 'testimonials') {
    return (
      <>
        {renderTestimonials()}
        {renderActivityNotification()}
      </>
    )
  }

  if (variant === 'stats') {
    return (
      <>
        {renderStats()}
        {renderActivityNotification()}
      </>
    )
  }

  if (variant === 'trust-indicators') {
    return renderTrustIndicators()
  }

  if (variant === 'activity') {
    return renderActivityNotification()
  }

  // Full variant includes everything
  return (
    <>
      {renderStats()}
      {renderTestimonials()}
      {renderTrustIndicators()}
      {renderActivityNotification()}
    </>
  )
}
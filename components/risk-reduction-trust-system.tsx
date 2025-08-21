"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Award, 
  CheckCircle, 
  Lock, 
  Clock, 
  RefreshCw, 
  Users, 
  FileCheck, 
  DollarSign, 
  Zap,
  Phone,
  Star,
  Building,
  Globe,
  TrendingUp,
  Eye,
  UserCheck,
  Briefcase
} from "lucide-react"

// Trust Badge Component
interface TrustBadge {
  id: string
  type: 'certification' | 'security' | 'compliance' | 'partnership' | 'guarantee'
  title: string
  subtitle?: string
  icon: React.ElementType
  verified: boolean
  clickable?: boolean
  link?: string
}

const TRUST_BADGES: TrustBadge[] = [
  {
    id: 'iso27001',
    type: 'security',
    title: 'ISO 27001',
    subtitle: 'Information Security',
    icon: Shield,
    verified: true,
    clickable: true,
    link: '/compliance/iso27001'
  },
  {
    id: 'soc2',
    type: 'compliance',
    title: 'SOC 2 Type II',
    subtitle: 'Data Protection',
    icon: Lock,
    verified: true,
    clickable: true,
    link: '/compliance/soc2'
  },
  {
    id: 'gdpr',
    type: 'compliance',
    title: 'GDPR Compliant',
    subtitle: 'Privacy Regulation',
    icon: FileCheck,
    verified: true
  },
  {
    id: 'fortune500',
    type: 'partnership',
    title: 'Fortune 500 Trusted',
    subtitle: '50+ Enterprise Clients',
    icon: Building,
    verified: true
  },
  {
    id: 'ai-certified',
    type: 'certification',
    title: 'AI Ethics Certified',
    subtitle: 'Responsible AI Institute',
    icon: Award,
    verified: true
  },
  {
    id: 'vendor-neutral',
    type: 'guarantee',
    title: '100% Vendor Neutral',
    subtitle: 'No Platform Lock-in',
    icon: Globe,
    verified: true
  }
]

// Risk Reversal Guarantee Component
interface GuaranteeItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  type: 'money-back' | 'performance' | 'timeline' | 'satisfaction'
}

const GUARANTEES: GuaranteeItem[] = [
  {
    id: 'roi-guarantee',
    title: '3x ROI Guarantee',
    description: 'If our POC doesn\'t demonstrate at least 3x ROI potential, we\'ll refund your investment and provide free strategic consulting.',
    icon: TrendingUp,
    type: 'performance'
  },
  {
    id: 'timeline-guarantee',
    title: '5-Day Delivery Promise',
    description: 'Your working AI proof of concept will be delivered in 5 business days or your next project is free.',
    icon: Clock,
    type: 'timeline'
  },
  {
    id: 'satisfaction-guarantee',
    title: '100% Satisfaction Guarantee',
    description: 'Not satisfied with our strategic guidance? We\'ll continue working with you at no charge until you are.',
    icon: Star,
    type: 'satisfaction'
  },
  {
    id: 'transparency-guarantee',
    title: 'Complete Transparency',
    description: 'Full visibility into our process, methodology, and recommendations. No black boxes or hidden agendas.',
    icon: Eye,
    type: 'performance'
  }
]

// Risk-free trial messaging
const RISK_FREE_BENEFITS = [
  {
    icon: RefreshCw,
    title: 'No Long-term Commitments',
    description: 'Start with our 5-day POC. Scale or stop based on results.'
  },
  {
    icon: UserCheck,
    title: 'Executive References Available',
    description: 'Connect with C-suite executives who\'ve succeeded with our approach.'
  },
  {
    icon: Briefcase,
    title: 'Enterprise NDA Coverage',
    description: 'Your proprietary information is protected by enterprise-grade NDAs.'
  },
  {
    icon: Phone,
    title: '24/7 Executive Support',
    description: 'Direct access to senior consultants throughout your engagement.'
  }
]

interface TrustBadgeGridProps {
  badges?: TrustBadge[]
  variant?: 'grid' | 'horizontal' | 'compact'
  showSubtitles?: boolean
}

export function TrustBadgeGrid({ 
  badges = TRUST_BADGES, 
  variant = 'grid',
  showSubtitles = true 
}: TrustBadgeGridProps) {
  const gridClass = variant === 'horizontal' 
    ? 'flex flex-wrap justify-center gap-4' 
    : variant === 'compact'
    ? 'grid grid-cols-3 md:grid-cols-6 gap-3'
    : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'

  return (
    <div className={gridClass}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 ${
            badge.clickable ? 'hover:shadow-md cursor-pointer' : ''
          }`}
          onClick={badge.clickable ? () => window.open(badge.link, '_blank') : undefined}
        >
          <div className="flex justify-center mb-2">
            <div className="bg-[#00A878]/10 p-2 rounded-lg">
              <badge.icon className="w-6 h-6 text-[#00A878]" />
            </div>
            {badge.verified && (
              <div className="relative -ml-2 -mt-1">
                <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full" />
              </div>
            )}
          </div>
          <div className="text-sm font-semibold text-gray-900">{badge.title}</div>
          {showSubtitles && badge.subtitle && (
            <div className="text-xs text-gray-600 mt-1">{badge.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  )
}

interface GuaranteesSectionProps {
  guarantees?: GuaranteeItem[]
  variant?: 'detailed' | 'compact'
  title?: string
}

export function GuaranteesSection({ 
  guarantees = GUARANTEES,
  variant = 'detailed',
  title = "Our Guarantees to You"
}: GuaranteesSectionProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-green-800 mb-3 text-center">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guarantees.slice(0, 2).map((guarantee) => (
            <div key={guarantee.id} className="flex items-center gap-2">
              <guarantee.icon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">{guarantee.title}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We stand behind our work with concrete guarantees that protect your investment and ensure your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guarantees.map((guarantee) => (
            <Card key={guarantee.id} className="p-6 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-[#00A878]/10 p-3 rounded-lg flex-shrink-0">
                  <guarantee.icon className="w-6 h-6 text-[#00A878]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{guarantee.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{guarantee.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

interface RiskFreeTrialProps {
  onCTA?: () => void
  variant?: 'banner' | 'section' | 'inline'
}

export function RiskFreeTrial({ onCTA, variant = 'section' }: RiskFreeTrialProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-[#00A878] to-emerald-600 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <div className="font-semibold">100% Risk-Free Start</div>
              <div className="text-sm text-emerald-100">5-day POC with money-back guarantee</div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={onCTA}
            className="bg-white text-[#00A878] hover:bg-gray-100"
          >
            Start Risk-Free
          </Button>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Shield className="w-4 h-4 text-[#00A878]" />
        <span>100% risk-free • Money-back guarantee</span>
      </div>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00A878]/10 px-4 py-2 rounded-full mb-4">
            <Shield className="w-5 h-5 text-[#00A878]" />
            <span className="font-semibold text-[#00A878]">100% Risk-Free</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your AI Journey with Complete Confidence
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've eliminated every risk from your AI exploration. Start with confidence, knowing you're completely protected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {RISK_FREE_BENEFITS.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="bg-[#00A878]/10 p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <benefit.icon className="w-8 h-8 text-[#00A878]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={onCTA}
            size="lg"
            className="bg-[#00A878] hover:bg-[#00936B] text-white px-8 py-4 text-lg font-semibold"
          >
            Start Your Risk-Free Assessment
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            No contracts • No commitments • No risk
          </p>
        </div>
      </div>
    </section>
  )
}

interface SecurityBadgesProps {
  variant?: 'minimal' | 'detailed'
}

export function SecurityBadges({ variant = 'minimal' }: SecurityBadgesProps) {
  const securityBadges = TRUST_BADGES.filter(badge => 
    badge.type === 'security' || badge.type === 'compliance'
  )

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-100">
        {securityBadges.map((badge) => (
          <div key={badge.id} className="flex items-center gap-2 text-xs text-gray-500">
            <badge.icon className="w-4 h-4" />
            <span>{badge.title}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Lock className="w-4 h-4" />
          <span>256-bit SSL</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise-Grade Security</h3>
          <p className="text-gray-600">Your data and intellectual property are protected by the highest security standards</p>
        </div>
        <TrustBadgeGrid badges={securityBadges} variant="horizontal" />
      </div>
    </div>
  )
}

interface MoneyBackGuaranteeProps {
  days?: number
  conditions?: string[]
  onCTA?: () => void
}

export function MoneyBackGuarantee({ 
  days = 30, 
  conditions = [
    "No questions asked within first 30 days",
    "Full refund if POC doesn't meet agreed criteria",
    "Immediate refund processing"
  ],
  onCTA 
}: MoneyBackGuaranteeProps) {
  return (
    <Card className="p-6 border-2 border-green-200 bg-green-50">
      <div className="text-center">
        <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {days}-Day Money-Back Guarantee
        </h3>
        <p className="text-gray-700 mb-4">
          Try our AI consulting services completely risk-free. If you're not completely satisfied, 
          we'll refund every penny.
        </p>
        
        <div className="bg-white rounded-lg p-4 mb-6">
          <ul className="text-sm text-gray-700 space-y-2">
            {conditions.map((condition, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={onCTA}
          className="bg-[#00A878] hover:bg-[#00936B] text-white font-semibold"
          size="lg"
        >
          Try Risk-Free Now
        </Button>
      </div>
    </Card>
  )
}

// Main Risk Reduction and Trust System Component
interface RiskReductionTrustSystemProps {
  variant?: 'full' | 'compact' | 'badges-only'
  showGuarantees?: boolean
  showSecurityBadges?: boolean
  showRiskFreeTrial?: boolean
  onCTA?: () => void
}

export function RiskReductionTrustSystem({
  variant = 'full',
  showGuarantees = true,
  showSecurityBadges = true,
  showRiskFreeTrial = true,
  onCTA
}: RiskReductionTrustSystemProps) {
  if (variant === 'badges-only') {
    return (
      <div className="py-8">
        <TrustBadgeGrid />
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-8">
        <TrustBadgeGrid variant="horizontal" showSubtitles={false} />
        {showGuarantees && <GuaranteesSection variant="compact" />}
        {showRiskFreeTrial && <RiskFreeTrial variant="banner" onCTA={onCTA} />}
        {showSecurityBadges && <SecurityBadges variant="minimal" />}
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Trust Badges Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600">
              We maintain the highest standards of security, compliance, and professional excellence
            </p>
          </div>
          <TrustBadgeGrid />
        </div>
      </section>

      {/* Guarantees Section */}
      {showGuarantees && <GuaranteesSection />}

      {/* Risk-Free Trial Section */}
      {showRiskFreeTrial && <RiskFreeTrial onCTA={onCTA} />}

      {/* Security Badges */}
      {showSecurityBadges && <SecurityBadges variant="detailed" />}

      {/* Money-Back Guarantee CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <MoneyBackGuarantee onCTA={onCTA} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why We Can Offer These Guarantees
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00A878]" />
                  <span>147+ successful AI implementations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00A878]" />
                  <span>98% client satisfaction rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00A878]" />
                  <span>Average 3.8x ROI on POC projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00A878]" />
                  <span>Vendor-neutral, client-first approach</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
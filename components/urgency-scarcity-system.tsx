"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Users, TrendingUp, AlertCircle, CheckCircle, Zap } from "lucide-react"

interface CountdownTimerProps {
  targetDate: Date
  onExpire?: () => void
  variant?: 'compact' | 'detailed'
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function CountdownTimer({ targetDate, onExpire, variant = 'detailed' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference <= 0) {
        setIsExpired(true)
        onExpire?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    }

    setTimeLeft(calculateTimeLeft())

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onExpire])

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Offer expired</span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-[#00A878]">
        <Clock className="w-4 h-4" />
        <span className="font-mono text-sm font-semibold">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {timeLeft.days > 0 && (
        <div className="text-center">
          <div className="bg-[#00A878] text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold text-lg">
            {timeLeft.days}
          </div>
          <div className="text-xs text-gray-600 mt-1">Days</div>
        </div>
      )}
      <div className="text-center">
        <div className="bg-[#00A878] text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold text-lg">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-600 mt-1">Hours</div>
      </div>
      <div className="text-center">
        <div className="bg-[#00A878] text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold text-lg">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-600 mt-1">Minutes</div>
      </div>
      <div className="text-center">
        <div className="bg-gray-600 text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold text-lg">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-600 mt-1">Seconds</div>
      </div>
    </div>
  )
}

interface LimitedTimeOfferProps {
  title: string
  description: string
  offer: string
  originalPrice?: string
  salePrice?: string
  expiresAt: Date
  spotsLeft?: number
  onCTA?: () => void
  ctaText?: string
}

export function LimitedTimeOffer({
  title,
  description,
  offer,
  originalPrice,
  salePrice,
  expiresAt,
  spotsLeft,
  onCTA,
  ctaText = "Claim This Offer"
}: LimitedTimeOfferProps) {
  return (
    <Card className="p-6 border-2 border-[#00A878]/20 bg-gradient-to-br from-[#00A878]/5 to-emerald-50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
            Limited Time
          </span>
        </div>
        {spotsLeft && spotsLeft > 0 && (
          <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
            <span className="text-xs font-semibold">Only {spotsLeft} spots left</span>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>

      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="text-center mb-3">
          <div className="text-lg font-semibold text-[#00A878] mb-1">{offer}</div>
          {originalPrice && salePrice && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-500 line-through text-sm">{originalPrice}</span>
              <span className="text-xl font-bold text-red-600">{salePrice}</span>
            </div>
          )}
        </div>
        <CountdownTimer targetDate={expiresAt} />
      </div>

      <Button 
        onClick={onCTA}
        className="w-full bg-[#00A878] hover:bg-[#00936B] text-white font-semibold"
        size="lg"
      >
        {ctaText}
      </Button>
    </Card>
  )
}

interface AvailabilityIndicatorProps {
  totalSpots: number
  spotsLeft: number
  type: 'assessment-slots' | 'poc-capacity' | 'consultation-spots'
  refreshInterval?: number
}

export function AvailabilityIndicator({ 
  totalSpots, 
  spotsLeft, 
  type,
  refreshInterval = 30000 
}: AvailabilityIndicatorProps) {
  const [currentSpotsLeft, setCurrentSpotsLeft] = useState(spotsLeft)
  const [justBooked, setJustBooked] = useState(false)

  const getTypeConfig = () => {
    switch (type) {
      case 'assessment-slots':
        return {
          title: 'Assessment Slots This Week',
          icon: Calendar,
          color: 'text-[#00A878]'
        }
      case 'poc-capacity':
        return {
          title: 'POC Project Capacity This Month',
          icon: TrendingUp,
          color: 'text-blue-600'
        }
      case 'consultation-spots':
        return {
          title: 'Strategic Consultation Spots',
          icon: Users,
          color: 'text-purple-600'
        }
    }
  }

  const config = getTypeConfig()
  const Icon = config.icon
  const percentageFilled = ((totalSpots - currentSpotsLeft) / totalSpots) * 100
  const isLow = currentSpotsLeft <= 3
  const isCritical = currentSpotsLeft <= 1

  // Simulate realistic booking activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3 && currentSpotsLeft > 0) { // 30% chance every interval
        setCurrentSpotsLeft(prev => Math.max(0, prev - 1))
        setJustBooked(true)
        setTimeout(() => setJustBooked(false), 3000)
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [currentSpotsLeft, refreshInterval])

  return (
    <Card className="p-4 bg-white shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <span className="font-medium text-gray-900">{config.title}</span>
        </div>
        {justBooked && (
          <div className="text-xs text-red-600 font-medium animate-pulse">
            Just booked!
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Available</span>
          <span className={`font-semibold ${
            isCritical ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-gray-900'
          }`}>
            {currentSpotsLeft} of {totalSpots} spots
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isCritical 
                ? 'bg-red-500' 
                : isLow 
                ? 'bg-orange-500' 
                : 'bg-[#00A878]'
            }`}
            style={{ width: `${percentageFilled}%` }}
          />
        </div>

        {isLow && (
          <div className="flex items-center gap-1 text-xs text-orange-600">
            <AlertCircle className="w-3 h-3" />
            <span>
              {isCritical ? 'Last spot available!' : 'Limited availability'}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}

interface SeasonalUrgencyProps {
  seasonType: 'year-end' | 'q1-planning' | 'budget-cycle' | 'holiday'
  onCTA?: () => void
}

export function SeasonalUrgency({ seasonType, onCTA }: SeasonalUrgencyProps) {
  const getSeasonConfig = () => {
    switch (seasonType) {
      case 'year-end':
        return {
          title: "Year-End Budget Window",
          message: "Use your remaining 2024 budget for AI initiatives before it expires",
          urgencyText: "Budget resets in",
          targetDate: new Date(2025, 0, 1), // January 1, 2025
          ctaText: "Secure 2024 Funding"
        }
      case 'q1-planning':
        return {
          title: "Q1 Strategic Planning",
          message: "Get ahead of 2025 with AI strategy sessions during planning season",
          urgencyText: "Q1 planning ends in",
          targetDate: new Date(2025, 2, 31), // March 31, 2025
          ctaText: "Schedule Q1 Planning"
        }
      case 'budget-cycle':
        return {
          title: "Budget Approval Cycle",
          message: "Submit AI proposals before the budget committee meets",
          urgencyText: "Committee meets in",
          targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          ctaText: "Prepare Proposal"
        }
      case 'holiday':
        return {
          title: "Holiday Special",
          message: "Start your AI journey with reduced rates during the holiday season",
          urgencyText: "Offer expires in",
          targetDate: new Date(2025, 0, 15), // January 15, 2025
          ctaText: "Claim Holiday Rate"
        }
    }
  }

  const config = getSeasonConfig()

  return (
    <div className="bg-gradient-to-r from-blue-600 to-[#00A878] text-white p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5" />
        <span className="font-semibold">{config.title}</span>
      </div>
      
      <p className="mb-4 text-blue-50">{config.message}</p>
      
      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <div className="text-sm text-blue-100 mb-2">{config.urgencyText}:</div>
        <CountdownTimer 
          targetDate={config.targetDate} 
          variant="detailed"
        />
      </div>

      <Button
        onClick={onCTA}
        variant="secondary"
        className="bg-white text-[#00A878] hover:bg-gray-100 font-semibold"
        size="lg"
      >
        {config.ctaText}
      </Button>
    </div>
  )
}

interface SocialUrgencyProps {
  recentActivity: Array<{
    action: string
    timeAgo: string
    company?: string
  }>
  variant?: 'banner' | 'sidebar'
}

export function SocialUrgency({ recentActivity, variant = 'banner' }: SocialUrgencyProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentActivity.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [recentActivity.length])

  const currentActivity = recentActivity[currentIndex]

  if (variant === 'sidebar') {
    return (
      <Card className="p-4 bg-green-50 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-800">Live Activity</span>
        </div>
        <div className="text-sm text-green-700">
          {currentActivity.action}
        </div>
        <div className="text-xs text-green-600 mt-1">
          {currentActivity.timeAgo}
          {currentActivity.company && ` • ${currentActivity.company}`}
        </div>
      </Card>
    )
  }

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4">
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
        <div className="flex-1">
          <p className="text-sm text-green-800">
            <span className="font-medium">{currentActivity.action}</span>
            <span className="text-green-600 ml-2">{currentActivity.timeAgo}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Main component that combines all urgency/scarcity mechanisms
interface UrgencyScarcitySystemProps {
  variant?: 'full' | 'compact' | 'seasonal-only'
  onCTAClick?: () => void
}

export function UrgencyScarcitySystem({ 
  variant = 'full', 
  onCTAClick 
}: UrgencyScarcitySystemProps) {
  const recentActivity = [
    { action: "Assessment booked by TechCorp", timeAgo: "2 minutes ago", company: "TechCorp" },
    { action: "POC started by Healthcare Plus", timeAgo: "8 minutes ago", company: "Healthcare Plus" },
    { action: "Strategy session scheduled", timeAgo: "12 minutes ago" },
    { action: "AI readiness report requested", timeAgo: "15 minutes ago" }
  ]

  if (variant === 'seasonal-only') {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <SeasonalUrgency seasonType="year-end" onCTA={onCTAClick} />
        </div>
      </section>
    )
  }

  if (variant === 'compact') {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <AvailabilityIndicator 
            totalSpots={12} 
            spotsLeft={3} 
            type="assessment-slots"
          />
          <SocialUrgency recentActivity={recentActivity} variant="banner" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AvailabilityIndicator 
              totalSpots={12} 
              spotsLeft={3} 
              type="assessment-slots"
            />
            <AvailabilityIndicator 
              totalSpots={8} 
              spotsLeft={2} 
              type="poc-capacity"
            />
            <AvailabilityIndicator 
              totalSpots={15} 
              spotsLeft={7} 
              type="consultation-spots"
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <LimitedTimeOffer
              title="Executive AI Strategy Session"
              description="Get personalized AI roadmap for your industry"
              offer="Complimentary 60-minute session (normally $500)"
              originalPrice="$500"
              salePrice="FREE"
              expiresAt={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // 7 days from now
              spotsLeft={5}
              onCTA={onCTAClick}
              ctaText="Book My Free Session"
            />
          </div>

          <SocialUrgency recentActivity={recentActivity} />

          <div className="max-w-4xl mx-auto">
            <SeasonalUrgency seasonType="year-end" onCTA={onCTAClick} />
          </div>
        </div>
      </div>
    </section>
  )
}
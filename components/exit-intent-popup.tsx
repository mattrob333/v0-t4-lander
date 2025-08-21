"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { submitLead, type LeadState } from "@/app/actions/submit-lead"
import { X, Gauge, Clock, CheckCircle } from "lucide-react"

interface ExitIntentPopupProps {
  disabled?: boolean
}

export function ExitIntentPopup({ disabled = false }: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [mouseLeaveCount, setMouseLeaveCount] = useState(0)
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [scrollDepth, setScrollDepth] = useState(0)
  const [step, setStep] = useState<'offer' | 'form' | 'success'>('offer')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef(Date.now())
  const { toast } = useToast()

  const [state, action, isPending] = useActionState<LeadState, FormData>(submitLead, { ok: false })

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage(Date.now() - startTimeRef.current)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollDepth(Math.max(scrollDepth, scrollPercent))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollDepth])

  // Exit intent detection
  useEffect(() => {
    if (disabled || hasShown) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY < 10 && e.relatedTarget === null) {
        setMouseLeaveCount(prev => prev + 1)
        
        // Show popup with intelligent conditions
        const shouldShow = 
          mouseLeaveCount >= 0 && // Show on first exit intent
          timeOnPage > 15000 && // At least 15 seconds on page
          scrollDepth > 25 && // Scrolled at least 25%
          !hasShown

        if (shouldShow) {
          setHasShown(true)
          setIsOpen(true)
        }
      }
    }

    // Alternative trigger: extended time without interaction
    const handleInactivity = () => {
      if (timeOnPage > 60000 && scrollDepth > 50 && !hasShown) { // 1 minute + 50% scroll
        setHasShown(true)
        setIsOpen(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    timeoutRef.current = setInterval(handleInactivity, 10000) // Check every 10 seconds

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [disabled, hasShown, mouseLeaveCount, timeOnPage, scrollDepth])

  // Handle form submission success
  useEffect(() => {
    if (state?.ok) {
      setStep('success')
    }
  }, [state])

  const handleClose = () => {
    setIsOpen(false)
    // Don't show again for this session
    sessionStorage.setItem('exit-popup-shown', 'true')
  }

  // Check if already shown in this session
  useEffect(() => {
    const shown = sessionStorage.getItem('exit-popup-shown')
    if (shown) {
      setHasShown(true)
    }
  }, [])

  const handleGetScore = () => {
    setStep('form')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg border-2 border-[#00A878]/20">
        <DialogHeader>
          {step === 'offer' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-6 w-6 text-[#00A878]" />
                  <DialogTitle className="text-xl font-bold">Wait! Get Your Free AI Readiness Score</DialogTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-gradient-to-r from-[#00A878]/5 to-emerald-50 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-[#00A878] font-semibold">
                    <Clock className="h-4 w-4" />
                    <span>2-minute assessment</span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <span className="text-gray-600 text-sm">No commitment required</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Discover if your organization is ready for AI transformation</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00A878]" />
                    <span>Identify your top 3 AI opportunities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00A878]" />
                    <span>Get personalized ROI estimates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00A878]" />
                    <span>Receive executive summary report</span>
                  </li>
                </ul>
              </div>
            </>
          )}
          
          {step === 'form' && (
            <DialogTitle className="text-lg">Get Your AI Readiness Report</DialogTitle>
          )}
          
          {step === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-[#00A878] mx-auto mb-4" />
              <DialogTitle className="text-xl text-[#00A878]">Report Incoming!</DialogTitle>
            </div>
          )}
        </DialogHeader>

        {step === 'offer' && (
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleGetScore}
              className="bg-[#00A878] hover:bg-[#00936B] text-white font-semibold py-3"
            >
              Get My Free AI Readiness Score
            </Button>
            <p className="text-xs text-center text-gray-500">
              Join 500+ executives who've discovered their AI potential
            </p>
          </div>
        )}

        {step === 'form' && (
          <form action={action} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="exit-name" className="text-sm font-medium">
                Full Name *
              </label>
              <input
                id="exit-name"
                name="name"
                required
                placeholder="John Smith"
                className="h-10 rounded border border-gray-300 px-3 text-sm focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="exit-email" className="text-sm font-medium">
                Business Email *
              </label>
              <input
                id="exit-email"
                type="email"
                name="email"
                required
                placeholder="john@company.com"
                className="h-10 rounded border border-gray-300 px-3 text-sm focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="exit-company" className="text-sm font-medium">
                Company *
              </label>
              <input
                id="exit-company"
                name="company"
                required
                placeholder="Acme Corporation"
                className="h-10 rounded border border-gray-300 px-3 text-sm focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="exit-industry" className="text-sm font-medium">
                Industry (helps personalize your report)
              </label>
              <select
                id="exit-industry"
                name="industry"
                className="h-10 rounded border border-gray-300 px-3 text-sm focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20"
              >
                <option value="">Select your industry</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="logistics">Logistics</option>
                <option value="insurance">Insurance</option>
                <option value="real-estate">Real Estate</option>
                <option value="education">Education</option>
                <option value="legal">Legal</option>
                <option value="technology">Technology</option>
                <option value="other">Other</option>
              </select>
            </div>

            <input type="hidden" name="source" value="exit-intent-popup" />
            <input type="hidden" name="notes" value="Requested AI Readiness Assessment via exit intent popup" />

            {state?.error && (
              <p className="text-sm text-red-600" role="alert">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#00A878] hover:bg-[#00936B] text-white font-semibold"
              aria-busy={isPending}
            >
              {isPending ? "Generating Report..." : "Get My AI Readiness Score"}
            </Button>

            <div className="text-xs text-center text-gray-500 space-y-1">
              <p>🔒 Your information is secure and never shared</p>
              <p>📊 Personalized report delivered within 24 hours</p>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Your AI Readiness Report is on the way!</h3>
              <p className="text-sm text-gray-700">
                We'll analyze your company profile and industry context to create a personalized assessment. 
                Expect your executive summary within the next 24 hours.
              </p>
            </div>
            <div className="text-left bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">What happens next:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Personalized AI opportunity analysis</li>
                <li>• Industry-specific ROI projections</li>
                <li>• Implementation roadmap recommendations</li>
                <li>• Optional 15-minute strategy call</li>
              </ul>
            </div>
            <Button 
              onClick={handleClose}
              variant="outline"
              className="w-full"
            >
              Perfect, thanks!
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
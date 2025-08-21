"use client"

import { Button } from "@/components/ui/button"
import { Reveal } from "./reveal"
import { useState, useEffect } from "react"

export function FinalCta({
  calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/matt-tier4/tier-4-ai-catch-up-call",
}: {
  calendlyUrl?: string
}) {
  const [showForm, setShowForm] = useState(false)
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)

  useEffect(() => {
    // Load Calendly popup script
    if (!calendlyLoaded) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = () => setCalendlyLoaded(true)
      document.head.appendChild(script)
    }
  }, [calendlyLoaded])

  const openCalendlyPopup = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url: calendlyUrl })
    } else {
      // Fallback to opening in new tab
      window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="contact" className="border-t border-black/10 bg-white py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">See Your AI Opportunity This Week.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-3 max-w-3xl text-black/70 dark:text-white/80">
            Don’t let analysis paralysis stall your progress. Get a validated assessment, a working Proof-of-Concept, and a
            clear implementation plan within days.
          </p>
        </Reveal>

        {/* Calendly Popup Integration */}
        <Reveal delay={0.15}>
          <div className="mx-auto mt-8 max-w-md">
            <Button
              className="w-full h-14 text-lg bg-[#00A878] hover:bg-[#00936B] text-white rounded-xl"
              onClick={openCalendlyPopup}
              aria-label="Schedule your Tier 4 AI Discovery Call"
            >
              📅 Schedule Your AI Discovery Call
            </Button>
            <p className="mt-2 text-sm text-black/60 dark:text-white/70">
              Opens calendar in popup
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const btn = document.querySelector(
                  'header button[aria-label="Schedule Your Assessment"]'
                ) as HTMLButtonElement | null
                btn?.click()
              }}
            >
              Prefer email? Open request form
            </Button>
            <Button variant="ghost" className="underline underline-offset-4" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Hide details we collect" : "What information will we ask for?"}
            </Button>
          </div>
        </Reveal>

        {showForm && (
          <Reveal delay={0.05}>
            <div className="mx-auto mt-4 max-w-2xl text-left text-sm text-black/70 dark:text-white/80">
              We’ll ask for name, email, company, and a short note on your goals to route your request to the right strategist.
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

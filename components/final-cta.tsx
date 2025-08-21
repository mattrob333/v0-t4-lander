"use client"

import { Button } from "@/components/ui/button"
import { Reveal } from "./reveal"
import { useState } from "react"

export function FinalCta({
  calendlyUrl = "https://calendly.com/your-team/ai-assessment",
}: {
  calendlyUrl?: string
}) {
  const [showForm, setShowForm] = useState(false)

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

        {/* Inline Calendly/Cal.com Embed */}
        <Reveal delay={0.15}>
          <div className="mx-auto mt-8 w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <iframe
              title="Schedule your AI Opportunity Assessment"
              src={`${calendlyUrl}?hide_event_type_details=1&hide_gdpr_banner=1`}
              className="h-[720px] w-full"
              loading="lazy"
            />
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

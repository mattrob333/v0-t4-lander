"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SimpleImage } from "@/components/ui/simple-image"
import { BeforeAfterSlider } from "@/components/ui/before-after-slider"
import { Reveal } from "./reveal"
import { DebugHydration } from "@/components/debug-hydration"
import { ScheduleDialog } from "./schedule-dialog"
import { useState } from "react"

export function AnalysisEngine() {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  return (
    <DebugHydration name="AnalysisEngine">
      <section id="analysis" className="bg-neutral-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              What Normally Takes Months, We Deliver in Days.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-3xl text-white/80">
              Instead of vendor pitches, endless workshops, and months of analysis, we delete wasted steps. You get a
              clear, ROI-backed AI roadmap you can act on immediately.
            </p>
          </Reveal>
        </div>

        <div className="mt-12">
          <Reveal delay={0.15}>
            <div className="max-w-4xl mx-auto">
              {/* Headlines above slider */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-red-400">Without Tier 4</h3>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#00A878]">With Tier 4</h3>
                </div>
              </div>
              
              <BeforeAfterSlider
                beforeImage={{
                  src: "without-tier4-chaos",
                  alt: "Chaotic scene with tangled arrows, multiple clocks, warning triangle, hourglass, and calendar showing 'MONTHS' representing the confusion and delays of traditional AI approaches",
                  width: 800,
                  height: 400
                }}
                afterImage={{
                  src: "with-tier4-roadmap",
                  alt: "Clean green path with checkmark leading to clear outcomes: ROADMAP, ROI, PLAN displayed prominently, representing Tier 4's structured approach",
                  width: 800,
                  height: 400
                }}
                beforeTitle=""
                afterTitle=""
                className=""
              />
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-sm text-red-400 font-semibold mb-2">Before</p>
                <p className="text-sm text-white/70">
                  Endless analysis, scattered vendors, and no clear ROI. Months wasted before decisions are made.
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#00A878] font-semibold mb-2">After</p>
                <p className="text-sm text-white/70">
                  A clear AI roadmap, ROI model, and execution plan delivered in days — not months.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className="mt-8 text-center" style={{ marginTop: '60px' }}>
            <Button 
              className="bg-[#00A878] text-white hover:bg-[#00936B]"
              onClick={() => setShowScheduleDialog(true)}
            >
              See How We Cut the Guesswork
            </Button>
          </div>
        </Reveal>
      </div>
      <ScheduleDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog} />
    </section>
    </DebugHydration>
  )
}

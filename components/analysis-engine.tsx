"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SimpleImage } from "@/components/ui/simple-image"
import { Reveal } from "./reveal"

export function AnalysisEngine() {
  return (
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

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Reveal delay={0.15}>
            <div className="rounded-xl border border-white/10 bg-neutral-800/50 p-6">
              <h3 className="text-xl font-bold text-red-400">Without Tier 4</h3>
              <div className="mt-4">
                <SimpleImage
                  src="without-tier4-chaos"
                  alt="Chaotic scene with tangled arrows, multiple clocks, warning triangle, hourglass, and calendar showing 'MONTHS' representing the confusion and delays of traditional AI approaches"
                  width={400}
                  height={400}
                  className="h-auto w-full rounded border border-white/10"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="mt-4 text-sm text-white/70">
                Endless analysis, scattered vendors, and no clear ROI. Months wasted before decisions are made.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-xl border border-[#00A878]/30 bg-neutral-800/50 p-6">
              <h3 className="text-xl font-bold text-[#00A878]">With Tier 4</h3>
              <div className="mt-4">
                <SimpleImage
                  src="with-tier4-roadmap"
                  alt="Clean green path with checkmark leading to clear outcomes: ROADMAP, ROI, PLAN displayed prominently, representing Tier 4's structured approach"
                  width={400}
                  height={400}
                  className="h-auto w-full rounded border border-white/10"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="mt-4 text-sm text-white/70">
                A clear AI roadmap, ROI model, and execution plan delivered in days — not months.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className="mt-8 text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#00A878] text-white hover:bg-[#00936B]">See How We Cut the Guesswork</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Sample Nexus (Anonymized)</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Image
                    src={"/placeholder.svg?height=220&width=320&query=as-is%20process%20diagram%20box%20arrows"}
                    alt="As-Is workflow diagram showing current process"
                    width={320}
                    height={220}
                    className="h-auto w-full rounded border border-black/10 dark:border-white/10"
                  />
                  <Image
                    src={"/placeholder.svg?height=220&width=320&query=to-be%20target%20state%20process%20diagram"}
                    alt="To-Be workflow diagram showing target process"
                    width={320}
                    height={220}
                    className="h-auto w-full rounded border border-black/10 dark:border-white/10"
                  />
                  <Image
                    src={"/placeholder.svg?height=220&width=320&query=ROI%20model%20impact%20matrix%20table%20visual"}
                    alt="ROI model and impact matrix sample output"
                    width={320}
                    height={220}
                    className="h-auto w-full rounded border border-black/10 dark:border-white/10"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

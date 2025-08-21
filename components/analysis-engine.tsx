"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Reveal } from "./reveal"

export function AnalysisEngine() {
  return (
    <section id="analysis" className="border-t border-black/10 bg-white py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Powered by the Tier 4 AI Strategic Nexus.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-black/70 dark:text-white/80">
              We analyze before we meet—so every conversation starts with insight, not guesswork.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-6 space-y-3 text-sm text-black/80 dark:text-white/80">
              <li>
                <span className="font-semibold">Pre-Call:</span> Market dynamics, data maturity scoring, pain point mapping,
                and an AI Hypothesis Tracker.
              </li>
              <li>
                <span className="font-semibold">Post-Call:</span> ROI modeling, impact matrix, PRDs, roadmap, and risk register.
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#00A878] text-white hover:bg-[#00936B]">
                    See a Sample AI Strategic Nexus
                  </Button>
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

        <div>
          <Reveal>
            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <h3 className="text-lg font-semibold">Pre-Call → Post-Call Workflow</h3>
              <p className="mt-1 text-sm text-black/60 dark:text-white/70">AI agents collaborate through the Strategic Nexus.</p>

              <div className="mt-4 grid gap-4">
                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/10">
                  <p className="text-sm font-semibold">Pre-Call</p>
                  <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-black/75 dark:text-white/80 md:grid-cols-2">
                    <li>• Market Dynamics Agent</li>
                    <li>• Data Maturity Scoring Agent</li>
                    <li>• Pain Point Mapping Agent</li>
                    <li>• AI Hypothesis Tracker</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/10">
                  <p className="text-sm font-semibold">Post-Call</p>
                  <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-black/75 dark:text-white/80 md:grid-cols-2">
                    <li>• ROI Modeling Agent</li>
                    <li>• Impact Matrix Agent</li>
                    <li>• PRD Generator Agent</li>
                    <li>• Roadmap & Risk Register</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-dashed border-black/20 p-3 dark:border-white/20">
                    <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/60">As-Is</p>
                    <Image
                      src={"/placeholder.svg?height=200&width=360&query=as-is%20swimlane%20diagram%20simple"}
                      alt="As-Is swimlane diagram"
                      width={360}
                      height={200}
                      className="mt-2 h-auto w-full rounded"
                    />
                  </div>
                  <div className="rounded-lg border border-dashed border-black/20 p-3 dark:border-white/20">
                    <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/60">To-Be</p>
                    <Image
                      src={"/placeholder.svg?height=200&width=360&query=to-be%20optimized%20workflow%20diagram"}
                      alt="To-Be optimized workflow diagram"
                      width={360}
                      height={200}
                      className="mt-2 h-auto w-full rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

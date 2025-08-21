"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Reveal } from "./reveal"
import { Montserrat } from "next/font/google"
import { BarChart3, Clock3, Rocket } from "lucide-react"

const mont = Montserrat({ subsets: ["latin"], weight: ["700", "800"] })

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <Reveal>
            <h1
              className={`${mont.className} text-3xl font-extrabold tracking-tight leading-tight md:text-5xl md:leading-tight`}
            >
              Rapid AI Clarity in Days. Strategic AI Leadership for Years.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-[0.92rem] leading-7 text-black/70 dark:text-white/80 md:text-[1.03rem] md:leading-8">
              Stop debating the potential of AI and start seeing it. We identify your highest-impact automation
              opportunities, deliver actionable Proof-of-Concepts, and provide precise development quotes within the
              first week. Then, we partner with you long-term to implement and scale your success.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button className="h-12 rounded-full bg-[#00A878] px-6 text-white hover:bg-[#00936B]" asChild>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    const el = document.querySelector(
                      'header button[aria-label="Schedule Your Assessment"]',
                    ) as HTMLButtonElement | null
                    el?.click()
                  }}
                >
                  Schedule Your AI Opportunity Assessment
                </a>
              </Button>
              <Button
                variant="ghost"
                className="h-12 rounded-full text-[#00A878] hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
                asChild
              >
                <a
                  href="#process"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId("process")
                  }}
                >
                  See How Our Process Works
                </a>
              </Button>
            </div>
          </Reveal>

          {/* Stat strip */}
          <Reveal delay={0.22}>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
                <Rocket className="h-5 w-5 text-[#00A878]" />
                <div>
                  <p className="text-sm font-semibold">PoC in 5 Days</p>
                  <p className="text-xs text-black/60 dark:text-white/70">Exec-ready demo fast</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
                <Clock3 className="h-5 w-5 text-[#00A878]" />
                <div>
                  <p className="text-sm font-semibold">&lt;60-min Exec Time</p>
                  <p className="text-xs text-black/60 dark:text-white/70">Decide with confidence</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
                <BarChart3 className="h-5 w-5 text-[#00A878]" />
                <div>
                  <p className="text-sm font-semibold">3–5x ROI in Pilots</p>
                  <p className="text-xs text-black/60 dark:text-white/70">Modeled and measured</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="relative">
            <div
              className="absolute -inset-6 -z-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20"
              aria-hidden="true"
            />
            <Image
              src="/images/tier4-hero-dna-circuit.jpeg"
              alt="DNA double helix pattern integrated into illuminated circuit board pathways, representing the fusion of biological intelligence and AI technology"
              width={720}
              height={520}
              priority
              className="h-auto w-full rounded-xl border border-black/10 dark:border-white/10 shadow-sm"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

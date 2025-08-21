"use client"

import { Reveal } from "./reveal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Briefcase, MonitorSmartphone, FileText, InfinityIcon } from 'lucide-react'

const STEPS = [
  {
    title: "Rapid AI Assessment",
    time: "24 Hours",
    icon: Search,
    desc: "We score data maturity, map pain points, and frame initial hypotheses.",
  },
  {
    title: "Expert Validation",
    time: "Days 1–2",
    icon: Briefcase,
    desc: "Executive working session; confirm feasibility and success criteria.",
  },
  {
    title: "Proof-of-Concept Delivery",
    time: "Days 2–5",
    icon: MonitorSmartphone,
    desc: "A tangible MVP to validate approach and stakeholder buy-in.",
  },
  {
    title: "Detailed Scoping & Quotes",
    time: "Within Week 1",
    icon: FileText,
    desc: "PRDs, acceptance criteria, and verified development quotes.",
  },
  {
    title: "Strategic Automation Partnership",
    time: "Ongoing",
    icon: InfinityIcon,
    desc: "Iterative rollouts, governance, and enterprise change management.",
  },
]

// Consistent pill chip used across all cards
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#00A878] px-2.5 py-1 text-xs font-semibold leading-none text-white">
      {children}
    </span>
  )
}

function StepCard({
  title,
  time,
  icon: Icon,
  desc,
  className = "",
}: {
  title: string
  time: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
  className?: string
}) {
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="p-5 pb-0">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-emerald-50/40 dark:border-white/10 dark:bg-emerald-900/10">
            <Icon className="h-5 w-5 text-[#00A878]" />
          </div>
          <div className="min-w-0 flex-1">
            {/* Reserve consistent space for up to two lines of title to align all chips */}
            <div className="min-h-[3.2rem] md:min-h-[3rem]">
              <CardTitle className="text-[1.05rem] leading-snug">{title}</CardTitle>
            </div>
            <div className="mt-2">
              <Chip>{time}</Chip>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 text-sm text-black/70 dark:text-white/80">{desc}</CardContent>
    </Card>
  )
}

export function ProcessTimeline() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <Reveal>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How It Works — 5-Stage Engagement Model</h2>
      </Reveal>

      {/* Mobile: horizontal scroll-snap with uniform header layout */}
      <div className="mt-8 md:hidden">
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <StepCard
                title={s.title}
                time={s.time}
                icon={s.icon}
                desc={s.desc}
                className="min-w-[80%] snap-center transition-transform duration-300"
              />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Desktop: 5-column grid, chips align because title area height is uniform */}
      <div className="mt-8 hidden grid-cols-5 gap-4 md:grid">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <StepCard
              title={s.title}
              time={s.time}
              icon={s.icon}
              desc={s.desc}
              className="transition-transform duration-300 hover:-translate-y-1"
            />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

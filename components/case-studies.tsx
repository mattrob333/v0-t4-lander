import Image from "next/image"
import { Reveal } from "./reveal"

const CASES = [
  {
    company: "Acme Logistics",
    logo: "/placeholder.svg?height=64&width=160",
    challenge: "Manual dispatch planning increased costs and delays.",
    outcome: "AI scheduler reduced planning time by 72% and improved on-time delivery by 14%.",
    metrics: ["-37% handle time", "+14% on-time", "Payback: 3 months"],
  },
  {
    company: "FinEdge Capital",
    logo: "/placeholder.svg?height=64&width=160",
    challenge: "Analysts inundated with low-value reviews and triage.",
    outcome: "Automated reviews freed 30% analyst capacity with 98.5% precision threshold.",
    metrics: ["+30% capacity", "98.5% precision", "Payback: 2 months"],
  },
  {
    company: "WellSpring Health",
    logo: "/placeholder.svg?height=64&width=160",
    challenge: "Fragmented intake created bottlenecks and rework.",
    outcome: "Intake assistant cut average handling time by 41% with zero compliance incidents.",
    metrics: ["-41% AHT", "0 compliance issues", "Payback: 4 months"],
  },
]

export function CaseStudies() {
  return (
    <section id="cases" className="border-t border-black/10 bg-white py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Proven in the Field</h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.company} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-xl border border-black/10 p-5 dark:border-white/10">
                <Image
                  src={c.logo || "/placeholder.svg"}
                  alt={`${c.company} logo`}
                  width={160}
                  height={64}
                  className="h-10 w-auto opacity-90"
                />
                <div className="mt-4 text-sm">
                  <p className="font-semibold text-black/80 dark:text-white/85">{c.company}</p>
                  <p className="mt-2 text-black/70 dark:text-white/80">Challenge: {c.challenge}</p>
                  <p className="mt-2 text-black/70 dark:text-white/80">Outcome: {c.outcome}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {c.metrics.map((m) => (
                      <li key={m} className="rounded-full border border-black/10 px-2 py-1 text-xs dark:border-white/10">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Reveal } from "./reveal"
import { CheckCircle2, Rocket, Target } from 'lucide-react'

const ITEMS = [
  {
    title: "Clarity Over Complexity",
    icon: Target,
    body:
      "We cut through noise with data-backed validation so executives can make decisions quickly and confidently.",
  },
  {
    title: "Tangible MVPs, Not Just Ideas",
    icon: Rocket,
    body:
      "Stakeholders align around working Proof-of-Concepts in days, not months, reducing risk and ambiguity.",
  },
  {
    title: "Accelerated Time-to-Value",
    icon: CheckCircle2,
    body:
      "We scope precisely and deliver verified quotes — enabling rapid implementation and measurable outcomes.",
  },
]

export function Differentiators() {
  return (
    <section className="border-t border-black/10 bg-white py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Our Differentiator: Speed, Precision, Results</h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="rounded-xl border border-black/10 p-6 transition-transform hover:-translate-y-1 dark:border-white/10">
                <item.icon className="h-6 w-6 text-[#00A878]" />
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-black/70 dark:text-white/80">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

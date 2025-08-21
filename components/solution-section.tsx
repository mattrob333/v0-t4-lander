import { Reveal } from "./reveal"

export function SolutionSection() {
  return (
    <section className="bg-emerald-50 py-20 dark:bg-emerald-900/10">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            From Uncertainty to Actionable Blueprint in One Week.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-3xl text-black/70 dark:text-white/80">
            Tier 4 Intelligence runs a rigorous, proprietary validation process. In the first week, we surface your highest
            ROI automation opportunities, deliver a working Proof-of-Concept, and output verified development quotes along with
            a prioritized roadmap. Then, we partner with you to scale.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

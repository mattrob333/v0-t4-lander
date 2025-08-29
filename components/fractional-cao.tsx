import { Reveal } from "./reveal"
import { SimpleImage } from "@/components/ui/simple-image"

export function FractionalCao() {
  return (
    <section className="bg-emerald-50 py-20 dark:bg-emerald-900/10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Beyond the MVP: Strategic AI Leadership</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-black/70 dark:text-white/80">
              As your Fractional Chief Automation Officer, Tier 4 drives long-term AI success: governance, change
              management, iterative releases, and continuous ROI tracking. We ensure your automation roadmap compounds
              value over time.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-5 -z-10 rounded-xl bg-white/60 dark:bg-white/10" aria-hidden="true" />
            <SimpleImage
              src="strategic-roadmap-executive"
              alt="Executive in business suit reviewing strategic roadmap documents with pen in hand, showing professional strategic planning and AI leadership"
              width={560}
              height={420}
              className="h-auto w-full rounded-xl border border-black/10 dark:border-white/10"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import Image from "next/image"
import { Reveal } from "./reveal"

export function ProblemSection() {
  return (
    <section className="border-t border-black/10 bg-white py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">The Noise of AI is Slowing You Down.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-3xl text-black/70 dark:text-white/80">
            Organizations are inundated with hype and conflicting advice. Internal teams debate feasibility while competitors
            quietly capture value. You need rigorous, fast validation to focus on what works — not another deck of buzzwords.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <Image
                src={"/placeholder.svg?height=360&width=560&query=AI%20noise%20hype%20cloud%20with%20buzzwords"}
                alt="Word cloud of AI hype terms labeled 'AI Noise'"
                width={560}
                height={360}
                className="h-auto w-full rounded"
              />
              <p className="mt-2 text-center text-sm text-black/60 dark:text-white/60">“AI Noise” cloud of hype words</p>
            </div>
            <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <Image
                src={"/placeholder.svg?height=360&width=560&query=single%20clear%20arrow%20validated%20AI%20blueprint"}
                alt="A single clear arrow labeled 'Validated AI Blueprint' cutting through noise"
                width={560}
                height={360}
                className="h-auto w-full rounded"
              />
              <p className="mt-2 text-center text-sm text-black/60 dark:text-white/60">A clear “Validated AI Blueprint” cutting through</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import { Reveal } from "./reveal"
import { SimpleImage } from "@/components/ui/simple-image"

export function ProblemSection() {
  return (
    <section className="border-t border-black/10 bg-white py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">The Noise of AI is Slowing You Down.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-3xl text-black/70 dark:text-white/80">
            Organizations are inundated with hype and conflicting advice. Internal teams debate feasibility while
            competitors quietly capture value. You need rigorous, fast validation to focus on what works — not another
            deck of buzzwords.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <SimpleImage
                src="ai-noise-buzzwords"
                alt="AI in glowing green letters surrounded by a cloud of buzzwords like disruption, blockchain, synergy, and big data representing the overwhelming noise in the AI space"
                width={560}
                height={560}
                className="h-auto w-full rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 600px, 700px"
              />
              <p className="mt-2 text-center text-sm text-black/60 dark:text-white/60">
                "AI Noise" cloud of hype words
              </p>
            </div>
            <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <SimpleImage
                src="ai-blueprint-clarity"
                alt="Clean technical blueprint diagram with geometric shapes and clear labels for Efficiency, ROI, and Scalability representing a structured validated AI approach"
                width={560}
                height={560}
                className="h-auto w-full rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 600px, 700px"
              />
              <p className="mt-2 text-center text-sm text-black/60 dark:text-white/60">
                A clear "Validated AI Blueprint" cutting through
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

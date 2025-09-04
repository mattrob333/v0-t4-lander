import { Reveal } from "./reveal"
import { SimpleImage } from "@/components/ui/simple-image"

interface ProblemSectionProps {
  title?: string;
  problems?: string[];
  industry?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export function ProblemSection({ 
  title = "AI Noise Is Slowing You Down",
  problems = [],
  industry,
  stats = []
}: ProblemSectionProps) {
  return (
    <section className="border-t border-black/10 bg-white py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        </Reveal>
        
        {problems.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start space-x-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">!</span>
                    </div>
                  </div>
                  <p className="text-sm text-black dark:text-white">{problem}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {stats.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-[#00A878] dark:text-[#00A878]">{stat.value}</div>
                  <div className="mt-1 text-sm text-black/70 dark:text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <p className="mt-4 max-w-3xl text-black/70 dark:text-white/80">
            Organizations are inundated with hype and conflicting advice. Internal teams debate feasibility while
            competitors quietly capture value. You need rigorous, fast validation to focus on what works, not another
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
                AI noise: cloud of hype words
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
                Clear validated AI blueprint cutting through the noise
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

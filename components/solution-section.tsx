import { Reveal } from "./reveal"

interface SolutionSectionProps {
  title?: string;
  benefits?: string[];
  useCases?: string[];
  roi?: {
    costSavings?: string;
    efficiencyGains?: string;
    timeToValue?: string;
    accuracy?: string;
  };
}

export function SolutionSection({ 
  title = "From Uncertainty to Actionable Blueprint in One Week",
  benefits = [],
  useCases = [],
  roi
}: SolutionSectionProps) {
  return (
    <section className="bg-emerald-50 py-20 dark:bg-emerald-900/10">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-3xl text-black/70 dark:text-white/80">
            Tier 4 Intelligence runs a rigorous, proprietary validation process. In the first week, we surface your highest-ROI automation opportunities, deliver a working proof-of-concept, and provide verified development quotes along with a prioritized roadmap. Then we partner with you to scale.
          </p>
        </Reveal>

        {benefits.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6 text-black dark:text-white">Key Benefits</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 rounded-lg bg-white dark:bg-neutral-800 p-4 shadow-sm">
                    <div className="flex-shrink-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00A878]">
                        <span className="text-sm font-bold text-white">✓</span>
                      </div>
                    </div>
                    <p className="text-sm text-black dark:text-white">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {useCases.length > 0 && (
          <Reveal delay={0.3}>
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6 text-black dark:text-white">Use Case Examples</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {useCases.map((useCase, index) => (
                  <div key={index} className="rounded-lg bg-white dark:bg-neutral-800 p-4 shadow-sm">
                    <p className="text-sm text-black dark:text-white">{useCase}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {roi && (
          <Reveal delay={0.4}>
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6 text-black dark:text-white">Expected Outcomes</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {roi.costSavings && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00A878]">Cost Savings</div>
                    <div className="mt-1 text-sm text-black/70 dark:text-white/70">{roi.costSavings}</div>
                  </div>
                )}
                {roi.efficiencyGains && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00A878]">Efficiency</div>
                    <div className="mt-1 text-sm text-black/70 dark:text-white/70">{roi.efficiencyGains}</div>
                  </div>
                )}
                {roi.timeToValue && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00A878]">Time to Value</div>
                    <div className="mt-1 text-sm text-black/70 dark:text-white/70">{roi.timeToValue}</div>
                  </div>
                )}
                {roi.accuracy && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00A878]">Accuracy</div>
                    <div className="mt-1 text-sm text-black/70 dark:text-white/70">{roi.accuracy}</div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

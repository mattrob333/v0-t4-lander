import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const FAQS = [
  {
    q: "How do you handle security and data?",
    a: "We operate NDA-first and align to SOC 2 controls. We minimize data movement, use secure environments, and scope clear data retention policies.",
  },
  {
    q: "Are you vendor-neutral?",
    a: "Yes. We evaluate options across cloud and model providers. Our goal is fit-for-purpose solutions with clear tradeoffs and exit options.",
  },
  {
    q: "What’s the typical timeline?",
    a: "Week 1: Assessment, PoC, and verified quotes. Weeks 2–6: MVP and pilot. Ongoing: Iterative rollouts with governance.",
  },
  {
    q: "How do you price?",
    a: "Fixed-fee for Week 1 validation; milestone-based for MVP; retainer or milestone for ongoing automation partnership.",
  },
  {
    q: "What access do you need?",
    a: "Initial analysis uses public and provided documentation. Secure access is requested only when needed for PoC or implementation.",
  },
]

export function FaqSection() {
  return (
    <section className="border-t border-black/10 bg-white py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">FAQs</h2>
        <p className="mt-2 text-sm text-black/60 dark:text-white/70">
          Security, neutrality, and speed — the most common questions answered.
        </p>
        <div className="mt-6">
          <Accordion type="single" collapsible>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

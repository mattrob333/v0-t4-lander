import { ShieldCheck, BadgeCheck, Eye } from 'lucide-react'

export function TrustBar() {
  return (
    <section className="border-t border-black/10 bg-white dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-black/70 dark:text-white/70">
          Trusted by enterprise leaders. NDA-first, representative outcomes shown.
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10">
            <ShieldCheck className="h-4 w-4 text-[#00A878]" />
            SOC 2-aligned process
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10">
            <Eye className="h-4 w-4 text-[#00A878]" />
            Vendor-neutral guidance
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10">
            <BadgeCheck className="h-4 w-4 text-[#00A878]" />
            Exec-ready deliverables
          </div>
        </div>
      </div>
    </section>
  )
}

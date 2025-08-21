"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { submitLead, type LeadState } from "@/app/actions/submit-lead"

export function ScheduleDialog({
  open = false,
  onOpenChange = () => {},
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
}) {
  const { toast } = useToast()

  const [state, action, isPending] = useActionState<LeadState, FormData>(submitLead, { ok: false })

  useEffect(() => {
    if (state?.ok) {
      toast({
        title: "Request received",
        description: "We’ll contact you shortly to coordinate next steps.",
      })
      onOpenChange(false)
    }
  }, [state, toast, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Your AI Opportunity Assessment</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-3">
          <div className="grid gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="Jane Doe"
              className="h-10 rounded border border-black/10 px-3 text-sm outline-none focus:ring-2 focus:ring-[#00A878]/20"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Work Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="jane@company.com"
              className="h-10 rounded border border-black/10 px-3 text-sm outline-none focus:ring-2 focus:ring-[#00A878]/20"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="company" className="text-sm font-medium">
              Company
            </label>
            <input
              id="company"
              name="company"
              required
              placeholder="Acme Inc."
              className="h-10 rounded border border-black/10 px-3 text-sm outline-none focus:ring-2 focus:ring-[#00A878]/20"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="What problem are you hoping to solve?"
              rows={3}
              className="rounded border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#00A878]/20"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#00A878] text-white hover:bg-[#00936B]"
            aria-busy={isPending}
          >
            {isPending ? "Scheduling..." : "Schedule Now"}
          </Button>

          <p className="text-center text-xs text-black/60">We respect NDAs and enterprise confidentiality.</p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

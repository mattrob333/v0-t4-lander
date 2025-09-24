"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { submitLead, type LeadState } from "@/app/actions/submit-lead"
import { ArrowRight } from "lucide-react"

export function ContactFormWrapper() {
  const { toast } = useToast()
  const [state, action, isPending] = useActionState<LeadState, FormData>(submitLead, { ok: false })

  useEffect(() => {
    if (state?.ok) {
      toast({
        title: "Message sent successfully",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      })
    }
  }, [state, toast])

  return (
    <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
          Send Us a Message
        </h3>
        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black dark:text-white">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
              placeholder="Your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black dark:text-white">
              Work Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
              placeholder="your.email@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-black dark:text-white">
              Company *
            </Label>
            <Input
              id="company"
              name="company"
              type="text"
              required
              className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
              placeholder="Your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-black dark:text-white">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              rows={5}
              className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white resize-none"
              placeholder="Tell us about your AI goals, challenges, or questions. What business processes would you like to automate?"
            />
          </div>
          
          {state?.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}
          
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
            aria-busy={isPending}
          >
            {isPending ? "Sending..." : "Send Message"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
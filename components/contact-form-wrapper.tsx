"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useActionState } from "react"
import { submitContact, type LeadState } from "@/app/actions/submit-contact"
import { ArrowRight } from "lucide-react"

export function ContactFormWrapper() {
  const { toast } = useToast()
  const [state, action, isPending] = useActionState<LeadState, FormData>(submitContact, { ok: false })

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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-black dark:text-white">
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
                placeholder="Your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-black dark:text-white">
                Last Name *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
                placeholder="Your last name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black dark:text-white">
              Email Address *
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
            <Label htmlFor="phone" className="text-black dark:text-white">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white"
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-black dark:text-white">
              Message *
            </Label>
            <Textarea
              id="message"
              name="notes"
              required
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
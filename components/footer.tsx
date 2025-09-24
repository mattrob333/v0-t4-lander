"use client"

import Link from "next/link"
import { SimpleImage } from "@/components/ui/simple-image"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, ArrowRight } from "lucide-react"
import { useState } from "react"
import { ScheduleDialog } from "./schedule-dialog"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  const pages = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "AI Solutions", href: "/ai-solutions" },
    { name: "Contact", href: "/contact" }
  ]

  const solutionCategories = [
    { name: "Customer Self-Service", href: "/solutions/customer-self-service" },
    { name: "Agent & Employee Copilots", href: "/solutions/agent-employee-copilots" },
    { name: "Analytics & Quality Intelligence", href: "/solutions/analytics-quality-intelligence" },
    { name: "Automation & Orchestration", href: "/solutions/automation-orchestration" },
    { name: "LLM, Platforms & Integration", href: "/solutions/llm-platforms-integration" },
    { name: "Advisory, Training & Managed AI", href: "/solutions/advisory-training-managed-ai" }
  ]

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "info@tier4intelligence.com",
      href: "mailto:info@tier4intelligence.com"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "925 North Point Parkway, Alpharetta, GA 30005",
      href: null
    }
  ]

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid gap-12 lg:grid-cols-6">
            {/* Logo and Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6">
                <SimpleImage
                  src="tier4-logo-horizontal-dark"
                  alt="Tier 4 Intelligence"
                  width={280}
                  height={64}
                  className="h-12 w-auto"
                />
              </Link>
              <p className="text-white/70 text-lg mb-6 max-w-md">
                AI consulting that delivers results. Get a working proof-of-concept in 5 days with validated ROI for your enterprise.
              </p>
              <div className="flex flex-col gap-4">
                {contactInfo.map((contact, index) => {
                  const Icon = contact.icon
                  const content = (
                    <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                      <div className="p-2 rounded-lg bg-[#00A878]/20">
                        <Icon className="h-4 w-4 text-[#00A878]" />
                      </div>
                      <div>
                        <div className="text-sm text-white/60">{contact.label}</div>
                        <div className="font-medium">{contact.value}</div>
                      </div>
                    </div>
                  )
                  
                  return contact.href ? (
                    <a key={index} href={contact.href} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={index}>
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pages Navigation */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Pages</h3>
              <nav className="flex flex-col gap-3">
                {pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="text-white/70 hover:text-white transition-colors hover:translate-x-1 duration-200 flex items-center gap-2 group"
                  >
                    {page.name}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Solutions</h3>
              <nav className="flex flex-col gap-3">
                {solutionCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="text-white/70 hover:text-white transition-colors hover:translate-x-1 duration-200 flex items-center gap-2 group text-sm"
                  >
                    {category.name}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Industries */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Industries</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/ai-solutions/healthcare"
                  className="text-white/70 hover:text-white transition-colors hover:translate-x-1 duration-200 flex items-center gap-2 group text-sm"
                >
                  Healthcare
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/ai-solutions/finance"
                  className="text-white/70 hover:text-white transition-colors hover:translate-x-1 duration-200 flex items-center gap-2 group text-sm"
                >
                  Financial Services
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/ai-solutions/manufacturing"
                  className="text-white/70 hover:text-white transition-colors hover:translate-x-1 duration-200 flex items-center gap-2 group text-sm"
                >
                  Manufacturing
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/ai-solutions/retail"
                  className="text-white/70 hover:text-white transition-colors hover:translate-x-1 duration-200 flex items-center gap-2 group text-sm"
                >
                  Retail
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/ai-solutions"
                  className="text-white/70 hover:text-white transition-colors hover:translate-x-1 duration-200 flex items-center gap-2 group text-sm font-medium"
                >
                  View All Industries
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </nav>
            </div>

            {/* CTA */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Get Started</h3>
              <p className="text-white/70 mb-4">
                Ready to transform your business with AI?
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setShowScheduleDialog(true)}
                  className="w-full rounded-full bg-[#00A878] px-6 py-3 text-white hover:bg-[#00936B] font-medium"
                >
                 Free Consultation
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border-white/20 px-6 py-3 text-white hover:bg-white/10 hover:text-white font-medium"
                >
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-white/60 text-sm">
              © {currentYear} Tier 4 Intelligence. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <ScheduleDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog} />
    </footer>
  )
}
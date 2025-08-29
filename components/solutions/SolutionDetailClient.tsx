'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScheduleDialog } from "@/components/schedule-dialog"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"
import { Reveal } from "@/components/reveal"

interface SolutionDetailClientProps {
  solution: any
  categorySlug: string
}

function Breadcrumbs({ categorySlug, solutionTitle }: { categorySlug: string; solutionTitle: string }) {
  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-black/60 dark:text-white/60">
        <li>
          <Link href="/" className="hover:text-[#00A878] transition-colors">
            Home
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href="/solutions" className="hover:text-[#00A878] transition-colors">
            Solutions
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href={`/solutions/${categorySlug}`} className="hover:text-[#00A878] transition-colors">
            {categorySlug.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Link>
        </li>
        <li>/</li>
        <li className="text-black dark:text-white font-medium">
          {solutionTitle}
        </li>
      </ol>
    </nav>
  )
}

function SolutionHero({ solution }: { solution: any }) {
  return (
    <Reveal>
      <div className="text-center mb-20">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-4 bg-[#00A878]/10 text-[#00A878] border-[#00A878]/20">
            {solution.category}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6 leading-tight">
            {solution.title}
          </h1>
          <p className="text-xl text-black/70 dark:text-white/70 max-w-4xl mx-auto leading-relaxed">
            {solution.description || solution.summary}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {solution.tags?.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-sm border-black/20 dark:border-white/20">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

function SolutionMetrics({ solution }: { solution: any }) {
  const metrics = [
    {
      icon: Clock,
      label: "Implementation",
      value: `${solution.metrics?.implementationWeeks || 2} weeks`,
      description: "Typical setup time"
    },
    {
      icon: TrendingUp,
      label: "ROI Timeline",
      value: `${solution.metrics?.roiTimelineMonths || 1} months`,
      description: "Expected return"
    },
    {
      icon: Zap,
      label: "Complexity",
      value: solution.metrics?.complexity || "Medium",
      description: "Implementation level"
    },
    {
      icon: Users,
      label: "Best For",
      value: solution.metrics?.industryFit?.slice(0, 2).join(", ") || "All industries",
      description: "Ideal industries"
    }
  ]

  return (
    <Reveal delay={0.2}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {metrics.map((metric, index) => (
          <Card key={index} className="text-center bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <metric.icon className="h-8 w-8 mx-auto mb-3 text-[#00A878]" />
              <div className="text-2xl font-bold text-black dark:text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm font-medium text-black dark:text-white mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-black/60 dark:text-white/60">
                {metric.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Reveal>
  )
}

function SolutionFeatures({ solution }: { solution: any }) {
  const features = solution.features || [
    "24/7 availability",
    "Natural language processing", 
    "CRM integration",
    "Analytics dashboard",
    "Multi-language support",
    "Custom branding"
  ]

  return (
    <Reveal delay={0.3}>
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
            Key Features
          </h2>
          <p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
            Everything you need to transform your customer experience
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature: string, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-[#00A878] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-2 text-lg">
                  {feature}
                </h3>
                <p className="text-black/60 dark:text-white/60">
                  Professional implementation with full support and training
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

function SolutionBenefits({ solution }: { solution: any }) {
  const benefits = solution.benefits || [
    "Reduce support costs by 40%",
    "Improve response times",
    "Capture more leads", 
    "Scale support operations",
    "Increase customer satisfaction",
    "Free up human agents for complex issues"
  ]

  return (
    <Reveal delay={0.4}>
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
            Business Benefits
          </h2>
          <p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
            Measurable results that impact your bottom line
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit: string, index: number) => (
            <Card key={index} className="text-center bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="text-lg font-semibold text-black dark:text-white">
                  {benefit}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

function SolutionProcess() {
  const steps = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We analyze your current support processes and design the optimal solution."
    },
    {
      step: "02", 
      title: "Configuration & Training",
      description: "Set up the system with your knowledge base and train it on your specific use cases."
    },
    {
      step: "03",
      title: "Integration & Testing",
      description: "Integrate with your existing systems and thoroughly test all scenarios."
    },
    {
      step: "04",
      title: "Launch & Optimization",
      description: "Go live with continuous monitoring and optimization based on real usage data."
    }
  ]

  return (
    <Reveal delay={0.5}>
      <section className="mb-20 bg-gray-50 dark:bg-neutral-900 rounded-3xl py-16 px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
            Implementation Process
          </h2>
          <p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
            Our proven 4-step approach ensures successful deployment
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#00A878] mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-black/70 dark:text-white/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

function SolutionIntegrations({ solution }: { solution: any }) {
  const integrations = solution.integrations || [
    "Salesforce", "HubSpot", "Zendesk", "Intercom", 
    "Slack", "Microsoft Teams", "Google Workspace"
  ]

  return (
    <Reveal delay={0.6}>
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
            Integrations
          </h2>
          <p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
            Seamlessly connects with your existing tools
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {integrations.map((integration: string, index: number) => (
            <Card key={index} className="text-center p-4 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-300 min-w-[120px]">
              <CardContent className="p-0">
                <div className="text-sm font-medium text-black dark:text-white">
                  {integration}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

function SolutionCTA({ onScheduleClick }: { onScheduleClick: () => void }) {
  return (
    <Reveal delay={0.7}>
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-[#00A878] to-[#00936B] text-white border-0 rounded-3xl overflow-hidden">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how this solution can transform your business operations and deliver measurable ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full bg-white text-[#00A878] px-8 py-3 hover:bg-gray-100 font-semibold"
                onClick={onScheduleClick}
              >
                Schedule Discovery Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/30 px-8 py-3 hover:bg-white/10 text-white border-2"
              >
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </Reveal>
  )
}

export function SolutionDetailClient({ solution, categorySlug }: SolutionDetailClientProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-[#00A878]/10 blur-3xl" />
        <div className="absolute right-[-200px] top-32 h-[420px] w-[420px] rounded-full bg-black/5 blur-3xl dark:bg-white/5" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs categorySlug={categorySlug} solutionTitle={solution.title} />
        
        <SolutionHero solution={solution} />
        
        <SolutionMetrics solution={solution} />
        
        <SolutionFeatures solution={solution} />
        
        <SolutionBenefits solution={solution} />
        
        <SolutionProcess />
        
        <SolutionIntegrations solution={solution} />
        
        <SolutionCTA onScheduleClick={() => setShowScheduleDialog(true)} />

        <ScheduleDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
        />
      </div>
    </main>
  )
}
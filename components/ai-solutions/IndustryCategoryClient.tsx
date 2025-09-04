'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScheduleDialog } from '@/components/schedule-dialog';
import { IndustryNavigation } from '@/components/internal-linking';
import { ConversionCTA } from '@/components/conversion-ctas';
import { IndustrySchema } from '@/components/schema/industry-schema';
import useCaseData from '@/lib/seo-data/use-cases.json';

interface IndustryCategoryClientProps {
  industry: string;
  industryInfo: any;
}

export function IndustryCategoryClient({ industry, industryInfo }: IndustryCategoryClientProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const useCases = Object.entries(useCaseData);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-[#00A878]/10 blur-3xl" />
        <div className="absolute right-[-200px] top-32 h-[420px] w-[420px] rounded-full bg-black/5 blur-3xl dark:bg-white/5" />
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
              AI Solutions for {industryInfo.name}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-black/70 dark:text-white/70">
              12 proven AI use cases specifically designed for {industryInfo.name.toLowerCase()} with {industryInfo.compliance} compliance built-in. 
              Get your working prototype in just 5 days.
            </p>
            
            <div className="mt-10">
              <Button 
                size="lg" 
                className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
                onClick={() => setShowScheduleDialog(true)}
              >
                Schedule Your Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

      <IndustryNavigation currentIndustry={industry} />

      {/* Industry Overview */}
      <section className="py-20 bg-gray-50 dark:bg-neutral-900 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-4 text-red-500">Key Challenges</h3>
                <ul className="space-y-2">
                  {industryInfo.painPoints.map((pain: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span className="text-black dark:text-white">{pain}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-4 text-[#00A878]">Core Focus Areas</h3>
                <div className="space-y-2">
                  {industryInfo.terminology.map((term: string, index: number) => (
                    <div key={index} className="px-3 py-1 bg-[#00A878]/10 text-[#00A878] dark:bg-[#00A878]/20 text-sm rounded inline-block mr-2 mb-2">
                      {term}
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-4 text-[#00A878]">Success Metrics</h3>
                <ul className="space-y-2">
                  {industryInfo.metrics.map((metric: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-[#00A878] mr-2 mt-1">✓</span>
                      <span className="capitalize text-black dark:text-white">{metric}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              AI Use Cases for {industryInfo.name}
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-black/70 dark:text-white/70">
              Each solution is tailored for {industryInfo.name.toLowerCase()} with industry-specific compliance and expertise
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map(([useCaseKey, useCaseInfo]) => (
              <Card key={useCaseKey} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-gray-200 hover:border-[#00A878] hover:shadow-[#00A878]/20 bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-[#00A878] p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-[#00A878] group-hover:text-[#00936B] transition-colors duration-300">
                    {useCaseInfo.name}
                  </h3>
                  <p className="text-black/70 dark:text-white/70 text-sm mb-3 leading-relaxed">
                    {useCaseInfo.description}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 text-black dark:text-white">Key Benefits:</h4>
                  <ul className="text-xs text-black/70 dark:text-white/70 space-y-1">
                    {useCaseInfo.benefits.slice(0, 3).map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#00A878] mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-sm mb-2 text-black dark:text-white">{industryInfo.name} Applications:</h4>
                  <div className="text-xs text-black/60 dark:text-white/60">
                    Optimized for {industryInfo.terminology.slice(0, 2).join(', ')} with {industryInfo.compliance} compliance
                  </div>
                </div>
                
                <Link href={`/ai-solutions/${industry}/${useCaseKey}`}>
                  <Button className="w-full rounded-full bg-[#00A878] hover:bg-[#00936B] text-white">
                    Learn More
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Trends */}
      <section className="py-20 bg-gray-50 dark:bg-neutral-900 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl mb-12">
              {industryInfo.name} AI Trends & Innovations
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {industryInfo.trends.map((trend: string, index: number) => (
                <Card key={index} className="p-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
                  <div className="text-sm font-semibold text-[#00A878] capitalize">
                    {trend}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl mb-6">
              {industryInfo.compliance} Compliant AI Solutions
            </h2>
            <p className="text-lg text-black/70 dark:text-white/70 mb-12 leading-relaxed">
              All our {industryInfo.name.toLowerCase()} AI solutions are designed with {industryInfo.compliance} compliance from day one. 
              We understand the regulatory landscape and ensure your AI implementation meets all requirements.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold mb-2 text-black dark:text-white">Built-in Compliance</h3>
                <p className="text-sm text-black/70 dark:text-white/70">
                  Every solution includes compliance checks and documentation for {industryInfo.compliance} requirements.
                </p>
              </Card>
              <Card className="p-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold mb-2 text-black dark:text-white">Audit-Ready</h3>
                <p className="text-sm text-black/70 dark:text-white/70">
                  Complete audit trails and documentation to support regulatory reviews and compliance assessments.
                </p>
              </Card>
              <Card className="p-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold mb-2 text-black dark:text-white">Expert Guidance</h3>
                <p className="text-sm text-black/70 dark:text-white/70">
                  Our team includes {industryInfo.name.toLowerCase()} compliance experts who ensure proper implementation.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion CTA */}
      <ConversionCTA 
        industry={industry}
        usecase="automation" // Default use case for industry page
        industryInfo={industryInfo}
        useCaseInfo={useCaseData.automation}
      />

      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      />
      
      <IndustrySchema 
        industry={industry}
        industryInfo={industryInfo}
      />
    </main>
  );
}
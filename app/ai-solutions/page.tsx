'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScheduleDialog } from '@/components/schedule-dialog';
import { AISolutionsSchema } from '@/components/schema/ai-solutions-schema';
import industryData from '@/lib/seo-data/industries.json';
import useCaseData from '@/lib/seo-data/use-cases.json';


export default function AISolutionsOverview() {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const industries = Object.entries(industryData);
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
              AI Solutions for Every Industry
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-black/70 dark:text-white/70">
              144+ proven AI implementations across 12 industries and 12 use cases. 
              Get your working prototype in just 5 days with validated 3-4x ROI.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
                onClick={() => setShowScheduleDialog(true)}
              >
                Find Your AI Solution
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-black/20 px-8 py-3 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
              >
                <Link href="/contact">
                  Contact Our Experts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50 dark:bg-neutral-900 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#00A878] mb-2">144+</div>
              <div className="text-black/60 dark:text-white/60">AI Solution Combinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00936B] mb-2">12</div>
              <div className="text-black/60 dark:text-white/60">Industries Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#007A5E] mb-2">5 Days</div>
              <div className="text-black/60 dark:text-white/60">To Working Prototype</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00A878] mb-2">3-4x</div>
              <div className="text-black/60 dark:text-white/60">Validated ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              AI Solutions by Industry
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-black/70 dark:text-white/70">
              Industry-specific AI implementations with compliance and domain expertise built-in
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map(([industryKey, industryInfo]) => (
              <Card
                key={industryKey}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-gray-200 hover:border-[#00A878] hover:shadow-[#00A878]/20 bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-[#00A878] p-6"
              >
                <Link href={`/ai-solutions/${industryKey}`}>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2 text-[#00A878] group-hover:text-[#00936B] transition-colors duration-300">
                      {industryInfo.name}
                    </h3>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-3">
                      Compliance: {industryInfo.compliance}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-black dark:text-white">Key Pain Points:</h4>
                    <ul className="text-sm text-black/70 dark:text-white/70 space-y-1">
                      {industryInfo.painPoints.slice(0, 3).map((pain: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2 mt-0.5">•</span>
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-black dark:text-white">Core Focus Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {industryInfo.terminology.slice(0, 4).map((term: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-[#00A878]/10 text-[#00A878] dark:bg-[#00A878]/20 text-xs rounded">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full rounded-full bg-[#00A878] hover:bg-[#00936B] text-white">
                    View {industryInfo.name} AI Solutions
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Matrix Overview */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Complete AI Solution Matrix
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-black/70 dark:text-white/70 mb-8">
              Every combination represents a proven implementation with industry-specific expertise
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-[#00A878] text-white">
                  <th className="p-4 text-left font-semibold">Industry</th>
                  {useCases.slice(0, 6).map(([useCaseKey, useCaseInfo]) => (
                    <th key={useCaseKey} className="p-4 text-center min-w-[120px] font-semibold">
                      {useCaseInfo.name}
                    </th>
                  ))}
                  <th className="p-4 text-center font-semibold">View All</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900">
                {industries.slice(0, 6).map(([industryKey, industryInfo]) => (
                  <tr key={industryKey} className="border-b border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-200">
                    <td className="p-4 font-semibold text-black dark:text-white">{industryInfo.name}</td>
                    {useCases.slice(0, 6).map(([useCaseKey]) => (
                      <td key={useCaseKey} className="p-4 text-center">
                        <Link 
                          href={`/ai-solutions/${industryKey}/${useCaseKey}`}
                          className="inline-block w-8 h-8 bg-[#00A878] hover:bg-[#00936B] rounded-full text-white text-xs flex items-center justify-center transition-colors duration-200 font-bold"
                          title={`${industryInfo.name} ${useCaseData[useCaseKey].name}`}
                        >
                          ✓
                        </Link>
                      </td>
                    ))}
                    <td className="p-4 text-center">
                      <Link href={`/ai-solutions/${industryKey}`}>
                        <Button variant="outline" size="sm" className="rounded-full border-[#00A878]/20 text-[#00A878] hover:bg-[#00A878]/10 dark:border-[#00A878]/40 dark:hover:bg-[#00A878]/20">
                          View All
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00A878] to-[#00936B] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-32 -bottom-32 h-[300px] w-[300px] rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to Find Your Perfect AI Solution?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Get a personalized AI strategy session and see how we can deliver results in just 5 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="rounded-full bg-white text-[#00A878] px-8 py-3 hover:bg-gray-100 font-semibold shadow-lg"
              onClick={() => setShowScheduleDialog(true)}
            >
              Schedule Your Assessment
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 py-3"
            >
              <Link href="/contact">Contact Our Experts</Link>
            </Button>
          </div>
        </div>
      </section>

      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      />
      
      <AISolutionsSchema />
    </main>
  );
}
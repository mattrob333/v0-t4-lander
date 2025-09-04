'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CheckCircle, Clock, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { ScheduleDialog } from '@/components/schedule-dialog';
import { ProgrammaticSchema } from '@/components/schema/programmatic-schema';

interface AIUseCaseClientProps {
  industry: string;
  usecase: string;
  industryInfo: any;
  useCaseInfo: any;
}

export function AIUseCaseClient({ industry, usecase, industryInfo, useCaseInfo }: AIUseCaseClientProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-[#00A878]/10 blur-3xl" />
          <div className="absolute right-[-200px] top-32 h-[420px] w-[420px] rounded-full bg-black/5 blur-3xl dark:bg-white/5" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-black/60 dark:text-white/60">
              <li>
                <Link href="/" className="hover:text-[#00A878] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/ai-solutions" className="hover:text-[#00A878] transition-colors">
                  AI Solutions
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/ai-solutions/${industry}`} className="hover:text-[#00A878] transition-colors">
                  {industryInfo.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-black dark:text-white font-medium">
                {useCaseInfo.name}
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4 bg-[#00A878]/10 text-[#00A878] border-[#00A878]/20">
                {industryInfo.name} AI Solution
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6 leading-tight">
                {useCaseInfo.name} AI for {industryInfo.name}
              </h1>
              <p className="text-xl text-black/70 dark:text-white/70 max-w-4xl mx-auto leading-relaxed mb-8">
                Transform your {industryInfo.name.toLowerCase()} operations with AI-powered {useCaseInfo.name.toLowerCase()} in just 5 days. Our vendor-neutral approach delivers validated 3-4x ROI while ensuring {industryInfo.compliance} compliance.
              </p>
              
              <div className="flex justify-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-[#00A878] hover:bg-[#00936B] text-white"
                  onClick={() => setShowScheduleDialog(true)}
                >
                  Schedule Your Assessment
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-[#00A878] mx-auto mb-2" />
                <div className="text-2xl font-bold text-black dark:text-white">5 Days</div>
                <div className="text-sm text-black/60 dark:text-white/60">To Working Prototype</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-[#00A878] mx-auto mb-2" />
                <div className="text-2xl font-bold text-black dark:text-white">3-4x ROI</div>
                <div className="text-sm text-black/60 dark:text-white/60">Validated Return</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-[#00A878] mx-auto mb-2" />
                <div className="text-2xl font-bold text-black dark:text-white">100%</div>
                <div className="text-sm text-black/60 dark:text-white/60">{industryInfo.compliance} Compliant</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-[#00A878] mx-auto mb-2" />
                <div className="text-2xl font-bold text-black dark:text-white">Vendor</div>
                <div className="text-sm text-black/60 dark:text-white/60">Neutral Approach</div>
              </CardContent>
            </Card>
          </div>

          {/* Problem Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
                Why {industryInfo.name} Companies Struggle with {useCaseInfo.name}
              </h2>
              <p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
                Organizations are overwhelmed by AI hype and conflicting advice. You need proven solutions that deliver real results.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-500">Common Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {industryInfo.painPoints.map((pain: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1">!</span>
                        <span className="text-black dark:text-white">{pain}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#00A878]">Why This Matters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-[#00A878]/5 rounded-lg">
                      <div className="text-2xl font-bold text-[#00A878]">67%</div>
                      <div className="text-sm text-black/60 dark:text-white/60">of {industryInfo.name.toLowerCase()} executives cite AI as top priority</div>
                    </div>
                    <div className="text-center p-4 bg-[#00A878]/5 rounded-lg">
                      <div className="text-2xl font-bold text-[#00A878]">3-4x</div>
                      <div className="text-sm text-black/60 dark:text-white/60">ROI achieved with our rapid POC approach</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Solution Section */}
          <section id="benefits" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
                How {useCaseInfo.name} AI Transforms {industryInfo.name}
              </h2>
              <p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
                Our proven methodology delivers working prototypes in 5 days with validated ROI metrics.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#00A878]">Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#00A878] mr-2 mt-1 flex-shrink-0" />
                      <span className="text-black dark:text-white">Improve {industryInfo.metrics[0]} by 35-50%</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#00A878] mr-2 mt-1 flex-shrink-0" />
                      <span className="text-black dark:text-white">Reduce operational costs by 25-40%</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#00A878] mr-2 mt-1 flex-shrink-0" />
                      <span className="text-black dark:text-white">Maintain {industryInfo.compliance} compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#00A878] mr-2 mt-1 flex-shrink-0" />
                      <span className="text-black dark:text-white">5-day proof of concept delivery</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#00A878]">Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="text-black dark:text-white text-sm">
                      {useCaseInfo.name} implementation tailored for {industryInfo.name}
                    </li>
                    <li className="text-black dark:text-white text-sm">
                      Integration with existing {industryInfo.terminology[0]} systems
                    </li>
                    <li className="text-black dark:text-white text-sm">
                      Automated workflows optimized for {industryInfo.terminology[1]}
                    </li>
                    <li className="text-black dark:text-white text-sm">
                      Scalable architecture supporting future growth
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#00A878]">Expected Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold text-black dark:text-white">Cost Savings</div>
                      <div className="text-sm text-black/60 dark:text-white/60">25-40% reduction in operational costs</div>
                    </div>
                    <div>
                      <div className="font-semibold text-black dark:text-white">Time to Value</div>
                      <div className="text-sm text-black/60 dark:text-white/60">5 days to prototype, 30 days to implementation</div>
                    </div>
                    <div>
                      <div className="font-semibold text-black dark:text-white">Accuracy</div>
                      <div className="text-sm text-black/60 dark:text-white/60">99%+ accuracy in automated processes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gray-50 dark:bg-neutral-900 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Ready to Transform {industryInfo.name} with {useCaseInfo.name} AI?
            </h2>
            <p className="text-lg text-black/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
              Join leading {industryInfo.name.toLowerCase()} companies achieving measurable results with our 5-day implementation approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#00A878] hover:bg-[#00936B] text-white"
                onClick={() => setShowScheduleDialog(true)}
              >
                Schedule Risk-Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Our Experts</Link>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-black/60 dark:text-white/60">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-[#00A878] mr-2" />
                Zero Risk Guarantee
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-[#00A878] mr-2" />
                {industryInfo.compliance} Compliant
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-[#00A878] mr-2" />
                Vendor Neutral
              </div>
            </div>
          </section>
        </div>
      </div>

      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      />
      
      <ProgrammaticSchema
        industry={industry}
        usecase={usecase}
        industryInfo={industryInfo}
        useCaseInfo={useCaseInfo}
      />
    </div>
  );
}
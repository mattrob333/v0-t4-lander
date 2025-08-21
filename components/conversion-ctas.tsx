'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface ConversionCTAProps {
  industry: string;
  usecase: string;
  industryInfo: any;
  useCaseInfo: any;
}

// Industry-specific CTA configurations
const industryCtaConfigs = {
  healthcare: {
    primaryCta: 'Schedule HIPAA-Compliant Assessment',
    secondaryCta: 'Download Healthcare AI ROI Calculator',
    urgency: 'Join 200+ healthcare providers already using AI',
    trustSignals: ['HIPAA Compliant', 'FDA Validated', 'Epic/Cerner Certified'],
    riskReduction: 'Start with zero commitment - see results in 5 days',
    socialProof: 'Used by leading health systems nationwide'
  },
  finance: {
    primaryCta: 'Schedule Risk-Free Financial Assessment',
    secondaryCta: 'Download RegTech Compliance Guide',
    urgency: 'Beat Q4 compliance deadlines with AI automation',
    trustSignals: ['SOX Compliant', 'PCI DSS Certified', 'Basel III Ready'],
    riskReduction: 'Zero regulatory risk - fully compliant implementation',
    socialProof: 'Trusted by Fortune 500 financial institutions'
  },
  retail: {
    primaryCta: 'Boost Holiday Sales with AI',
    secondaryCta: 'Download Retail AI Playbook',
    urgency: 'Peak season is here - implement before Black Friday',
    trustSignals: ['GDPR Compliant', 'PCI DSS Secure', 'Omnichannel Ready'],
    riskReduction: 'See 15%+ sales lift in first month or money back',
    socialProof: 'Powers personalization for top e-commerce brands'
  },
  manufacturing: {
    primaryCta: 'Reduce Downtime by 60% in 30 Days',
    secondaryCta: 'Download Manufacturing AI ROI Study',
    urgency: 'Prevent costly equipment failures this quarter',
    trustSignals: ['ISO 9001 Certified', 'OSHA Compliant', 'Industry 4.0 Ready'],
    riskReduction: 'Guaranteed ROI or full refund within 90 days',
    socialProof: 'Deployed across 500+ manufacturing facilities'
  },
  logistics: {
    primaryCta: 'Cut Fuel Costs 30% This Quarter',
    secondaryCta: 'Download Logistics Optimization Guide',
    urgency: 'Rising fuel costs demand immediate action',
    trustSignals: ['DOT Approved', 'FMCSA Compliant', 'Real-time Tracking'],
    riskReduction: 'No upfront costs - pay only after seeing savings',
    socialProof: 'Optimizes routes for 1000+ delivery fleets'
  },
  insurance: {
    primaryCta: 'Reduce Claims Processing to 24 Hours',
    secondaryCta: 'Download InsurTech Transformation Guide',
    urgency: 'Customer expectations are rising - automate now',
    trustSignals: ['Solvency II Ready', 'NAIC Approved', 'Fraud-Resistant'],
    riskReduction: 'Pilot program with guaranteed accuracy improvement',
    socialProof: 'Processes millions of claims for major insurers'
  },
  'real-estate': {
    primaryCta: 'Maximize Property ROI with AI Insights',
    secondaryCta: 'Download PropTech Market Analysis',
    urgency: 'Market timing is critical - get data-driven insights now',
    trustSignals: ['Fair Housing Compliant', 'ADA Accessible', 'Blockchain Ready'],
    riskReduction: 'Risk-free trial with performance guarantees',
    socialProof: 'Manages portfolios worth $50B+ in assets'
  },
  education: {
    primaryCta: 'Improve Student Outcomes in One Semester',
    secondaryCta: 'Download EdTech Implementation Guide',
    urgency: 'New semester starting - implement personalized learning now',
    trustSignals: ['FERPA Compliant', 'COPPA Safe', 'Accessibility Certified'],
    riskReduction: 'Pilot program with measurable outcome guarantees',
    socialProof: 'Supports learning for 500K+ students nationwide'
  },
  legal: {
    primaryCta: 'Reduce Document Review Time by 75%',
    secondaryCta: 'Download Legal AI Efficiency Study',
    urgency: 'Case deadlines approaching - automate review process',
    trustSignals: ['Attorney-Client Privileged', 'Bar Approved', 'Audit Trail'],
    riskReduction: 'Privileged pilot with full confidentiality protection',
    socialProof: 'Trusted by AmLaw 100 firms nationwide'
  },
  hospitality: {
    primaryCta: 'Boost Revenue Per Room by 25%',
    secondaryCta: 'Download Hospitality AI Revenue Guide',
    urgency: 'Peak booking season - optimize pricing now',
    trustSignals: ['PCI Compliant', 'Guest Privacy Protected', 'Multi-platform'],
    riskReduction: 'Revenue guarantee - see results or get refund',
    socialProof: 'Optimizes revenue for 10,000+ properties globally'
  },
  technology: {
    primaryCta: 'Accelerate Development Velocity 3x',
    secondaryCta: 'Download DevOps Automation Blueprint',
    urgency: 'Sprint deadlines demand automation now',
    trustSignals: ['SOC 2 Type II', 'ISO 27001', 'Zero Trust Ready'],
    riskReduction: 'Free proof of concept with performance metrics',
    socialProof: 'Accelerates development for unicorn startups'
  },
  energy: {
    primaryCta: 'Optimize Grid Efficiency by 40%',
    secondaryCta: 'Download Smart Grid Implementation Guide',
    urgency: 'Regulatory deadlines for grid modernization approaching',
    trustSignals: ['NERC Compliant', 'EPA Approved', 'Carbon Neutral'],
    riskReduction: 'Efficiency guarantees with regulatory compliance',
    socialProof: 'Manages renewable integration for major utilities'
  }
};

// Use case-specific value propositions
const useCaseValueProps = {
  automation: {
    timeframe: '5 days to working automation',
    outcome: '50% reduction in manual tasks',
    metric: 'processing time'
  },
  prediction: {
    timeframe: '7 days to accurate forecasts',
    outcome: '90% prediction accuracy',
    metric: 'forecast precision'
  },
  optimization: {
    timeframe: '5 days to efficiency gains',
    outcome: '40% cost reduction',
    metric: 'operational efficiency'
  },
  personalization: {
    timeframe: '5 days to personalized experiences',
    outcome: '60% engagement increase',
    metric: 'customer satisfaction'
  },
  'fraud-detection': {
    timeframe: '3 days to fraud prevention',
    outcome: '95% detection accuracy',
    metric: 'fraud prevention rate'
  },
  classification: {
    timeframe: '5 days to automated sorting',
    outcome: '99% classification accuracy',
    metric: 'data organization efficiency'
  },
  'content-generation': {
    timeframe: '3 days to content automation',
    outcome: '10x content production speed',
    metric: 'content creation velocity'
  },
  'data-extraction': {
    timeframe: '5 days to automated extraction',
    outcome: '90% time savings',
    metric: 'data processing speed'
  },
  recommendation: {
    timeframe: '5 days to smart recommendations',
    outcome: '40% conversion increase',
    metric: 'recommendation relevance'
  },
  forecasting: {
    timeframe: '7 days to demand forecasts',
    outcome: '85% forecast accuracy',
    metric: 'planning precision'
  },
  'quality-control': {
    timeframe: '5 days to quality automation',
    outcome: '99.5% defect detection',
    metric: 'quality consistency'
  },
  'risk-assessment': {
    timeframe: '5 days to risk insights',
    outcome: '80% risk reduction',
    metric: 'risk mitigation effectiveness'
  }
};

export function ConversionCTA({ industry, usecase, industryInfo, useCaseInfo }: ConversionCTAProps) {
  const ctaConfig = industryCtaConfigs[industry as keyof typeof industryCtaConfigs];
  const valueProps = useCaseValueProps[usecase as keyof typeof useCaseValueProps];

  if (!ctaConfig || !valueProps) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency Banner */}
          <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
            🚨 {ctaConfig.urgency}
          </div>
          
          {/* Main Headline */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform {industryInfo.name} with {useCaseInfo.name} AI?
          </h2>
          
          {/* Value Proposition */}
          <p className="text-xl mb-8 opacity-90">
            Join leading {industryInfo.name.toLowerCase()} companies achieving{' '}
            <span className="font-bold text-yellow-300">{valueProps.outcome}</span> with our{' '}
            <span className="font-bold text-yellow-300">{valueProps.timeframe}</span> implementation.
          </p>
          
          {/* Social Proof */}
          <div className="mb-8">
            <p className="text-lg font-medium mb-2">{ctaConfig.socialProof}</p>
            <div className="flex justify-center space-x-6 text-sm">
              {ctaConfig.trustSignals.map((signal, index) => (
                <span key={index} className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {signal}
                </span>
              ))}
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/schedule-assessment" className="flex items-center">
                {ctaConfig.primaryCta}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg"
            >
              <Link href={`/resources/${industry}-${usecase}-guide`} className="flex items-center">
                {ctaConfig.secondaryCta}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Link>
            </Button>
          </div>
          
          {/* Risk Reduction */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-3">Zero Risk Guarantee</h3>
            <p className="text-lg">{ctaConfig.riskReduction}</p>
          </div>
          
          {/* Metrics Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">5 Days</div>
              <div className="text-sm">To Working Prototype</div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">3-4x</div>
              <div className="text-sm">Validated ROI</div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="text-3xl font-bold text-blue-300 mb-2">100%</div>
              <div className="text-sm">{industryInfo.compliance} Compliant</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Industry-specific testimonial component
export function IndustryTestimonial({ industry }: { industry: string }) {
  const testimonials = {
    healthcare: {
      quote: "Tier 4's AI automation reduced our patient intake time by 75% while maintaining HIPAA compliance. ROI was immediate.",
      author: "Dr. Sarah Chen",
      title: "Chief Medical Officer",
      company: "Regional Medical Center",
      metric: "75% faster patient processing"
    },
    finance: {
      quote: "Their fraud detection AI caught sophisticated attacks our previous system missed. False positives dropped 80%.",
      author: "Michael Rodriguez",
      title: "Chief Risk Officer", 
      company: "National Bank",
      metric: "80% reduction in false positives"
    },
    retail: {
      quote: "Personalization AI increased our conversion rate by 45% during peak season. Game-changing results.",
      author: "Jennifer Walsh",
      title: "VP of Digital Commerce",
      company: "Fashion Retailer",
      metric: "45% conversion increase"
    },
    manufacturing: {
      quote: "Predictive maintenance AI prevented $2M in downtime costs. Best investment we've made in decades.",
      author: "David Kim",
      title: "Plant Operations Manager",
      company: "Automotive Manufacturer",
      metric: "$2M downtime savings"
    }
  };

  const testimonial = testimonials[industry as keyof typeof testimonials];
  if (!testimonial) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What {industry.charAt(0).toUpperCase() + industry.slice(1)} Leaders Say</h2>
          <Card className="p-8">
            <blockquote className="text-xl italic text-gray-700 mb-6">
              "{testimonial.quote}"
            </blockquote>
            <div className="text-lg font-semibold text-blue-600 mb-4">
              {testimonial.metric}
            </div>
            <div className="text-gray-600">
              <div className="font-semibold">{testimonial.author}</div>
              <div>{testimonial.title}</div>
              <div className="text-sm">{testimonial.company}</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
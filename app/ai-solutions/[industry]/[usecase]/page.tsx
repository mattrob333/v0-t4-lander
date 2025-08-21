import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/hero';
import { ProblemSection } from '@/components/problem-section';
import { SolutionSection } from '@/components/solution-section';
import { ProcessTimeline } from '@/components/process-timeline';
import { FinalCta } from '@/components/final-cta';
import { ProgrammaticSchema } from '@/components/schema/programmatic-schema';
import industryData from '@/lib/seo-data/industries.json';
import useCaseData from '@/lib/seo-data/use-cases.json';
import { InternalLinkingSystem } from '@/components/internal-linking';
import { ConversionCTA, IndustryTestimonial } from '@/components/conversion-ctas';

interface PageProps {
  params: {
    industry: string;
    usecase: string;
  };
}

// Generate static params for all industry/usecase combinations
export async function generateStaticParams() {
  const industries = Object.keys(industryData);
  const useCases = Object.keys(useCaseData);
  
  const params = [];
  for (const industry of industries) {
    for (const usecase of useCases) {
      params.push({
        industry,
        usecase,
      });
    }
  }
  
  return params;
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry, usecase } = params;
  
  // Validate params
  if (!industryData[industry as keyof typeof industryData] || !useCaseData[usecase as keyof typeof useCaseData]) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }
  
  const industryInfo = industryData[industry as keyof typeof industryData];
  const useCaseInfo = useCaseData[usecase as keyof typeof useCaseData];
  
  const title = `${useCaseInfo.name} AI for ${industryInfo.name} | 5-Day POC | Tier 4 Intelligence`;
  const description = `Transform ${industryInfo.name.toLowerCase()} with AI-powered ${useCaseInfo.name.toLowerCase()}. 5-day proof of concept with validated 3-4x ROI. ${industryInfo.compliance} compliant. No vendor lock-in.`;
  const canonicalUrl = `https://tier4intelligence.com/ai-solutions/${industry}/${usecase}`;
  
  return {
    title,
    description,
    keywords: [
      `${useCaseInfo.name} AI`,
      `${industryInfo.name} AI`,
      `AI ${usecase}`,
      `${industry} automation`,
      '5-day POC',
      'rapid AI implementation',
      'vendor-neutral AI',
      'AI consulting',
      ...useCaseInfo.keywords,
      ...industryInfo.terminology
    ].join(', '),
    authors: [{ name: 'Tier 4 Intelligence' }],
    creator: 'Tier 4 Intelligence',
    publisher: 'Tier 4 Intelligence',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Tier 4 Intelligence',
      images: [
        {
          url: `https://tier4intelligence.com/images/og/${industry}-${usecase}.jpg`,
          width: 1200,
          height: 630,
          alt: `${useCaseInfo.name} AI for ${industryInfo.name}`,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://tier4intelligence.com/images/twitter/${industry}-${usecase}.jpg`],
      creator: '@tier4intel',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Main page component
export default function ProgrammaticPage({ params }: PageProps) {
  const { industry, usecase } = params;
  
  // Validate params
  if (!industryData[industry as keyof typeof industryData] || !useCaseData[usecase as keyof typeof useCaseData]) {
    notFound();
  }
  
  const industryInfo = industryData[industry as keyof typeof industryData];
  const useCaseInfo = useCaseData[usecase as keyof typeof useCaseData];
  
  // Generate page content
  const pageContent = generatePageContent(industryInfo, useCaseInfo, industry, usecase);
  
  return (
    <>
      <ProgrammaticSchema 
        industry={industry}
        usecase={usecase}
        industryInfo={industryInfo}
        useCaseInfo={useCaseInfo}
        content={pageContent}
      />
      
      <main className="min-h-screen">
        <ProgrammaticHero 
          industry={industry}
          usecase={usecase}
          content={pageContent.hero}
          industryInfo={industryInfo}
          useCaseInfo={useCaseInfo}
        />
        
        <ProgrammaticProblem 
          industry={industry}
          usecase={usecase}
          content={pageContent}
          industryInfo={industryInfo}
        />
        
        <ProgrammaticSolution 
          industry={industry}
          usecase={usecase}
          content={pageContent}
          useCaseInfo={useCaseInfo}
        />
        
        <ProgrammaticProcess 
          industry={industry}
          usecase={usecase}
          content={pageContent.process}
        />
        
        <IndustryTestimonial industry={industry} />
        
        <ConversionCTA 
          industry={industry}
          usecase={usecase}
          industryInfo={industryInfo}
          useCaseInfo={useCaseInfo}
        />
        
        <InternalLinkingSystem 
          industry={industry} 
          usecase={usecase} 
        />
      </main>
    </>
  );
}

// Generate comprehensive page content
function generatePageContent(industryInfo: any, useCaseInfo: any, industry: string, usecase: string) {
  const specificPainPoints = generateSpecificPainPoints(industry, usecase);
  const industryBenefits = generateIndustryBenefits(industry, usecase, industryInfo, useCaseInfo);
  const useCases = generateUseCaseExamples(industry, usecase);
  const roi = generateROIMetrics(industry, industryInfo);
  const process = generateImplementationProcess(industry, usecase, industryInfo, useCaseInfo);
  
  return {
    hero: {
      headline: `${useCaseInfo.name} AI for ${industryInfo.name}: 5-Day Implementation`,
      subheadline: `Transform your ${industryInfo.name.toLowerCase()} operations with AI-powered ${useCaseInfo.name.toLowerCase()} in just 5 days. Our vendor-neutral approach delivers validated 3-4x ROI while ensuring ${industryInfo.compliance} compliance.`,
      cta: 'Schedule Your 60-Minute Executive Briefing',
      benefits: industryBenefits.slice(0, 3)
    },
    painPoints: specificPainPoints,
    benefits: industryBenefits,
    useCases: useCases,
    roi: roi,
    process: process,
    compliance: industryInfo.compliance,
    terminology: industryInfo.terminology
  };
}

// Component: Programmatic Hero Section
function ProgrammaticHero({ industry, usecase, content, industryInfo, useCaseInfo }: any) {
  return (
    <Hero
      title={content.headline}
      subtitle={content.subheadline}
      ctaText={content.cta}
      ctaHref="/schedule-assessment"
      backgroundImage={`/images/hero/${industry}-${usecase}.jpg`}
      features={content.benefits}
    />
  );
}

// Component: Programmatic Problem Section
function ProgrammaticProblem({ industry, usecase, content, industryInfo }: any) {
  return (
    <ProblemSection
      title={`Why ${industryInfo.name} Companies Struggle with ${useCaseData[usecase].name}`}
      problems={content.painPoints}
      industry={industry}
      stats={[
        {
          value: '67%',
          label: `of ${industryInfo.name.toLowerCase()} executives cite AI implementation as top priority`
        },
        {
          value: '3-4x',
          label: 'ROI achieved by companies using our rapid POC approach'
        },
        {
          value: '5 days',
          label: 'to working prototype vs 6+ months traditional approach'
        }
      ]}
    />
  );
}

// Component: Programmatic Solution Section
function ProgrammaticSolution({ industry, usecase, content, useCaseInfo }: any) {
  return (
    <SolutionSection
      title={`How ${useCaseInfo.name} AI Transforms ${industryData[industry].name}`}
      benefits={content.benefits}
      useCases={content.useCases}
      roi={content.roi}
    />
  );
}

// Component: Programmatic Process Section
function ProgrammaticProcess({ industry, usecase, content }: any) {
  return (
    <ProcessTimeline
      title={`Our 5-Day ${useCaseData[usecase].name} Implementation Process`}
      subtitle={`Proven methodology delivering working AI solutions for ${industryData[industry].name.toLowerCase()}`}
      steps={content}
    />
  );
}


// Utility functions for content generation
function generateSpecificPainPoints(industry: string, usecase: string): string[] {
  const painPointMap: Record<string, string[]> = {
    'healthcare-automation': [
      'Manual patient intake processes consuming 40% of staff time',
      'Clinical workflow inefficiencies leading to longer patient wait times',
      'Administrative burden reducing time for patient care',
      'Insurance verification delays affecting patient satisfaction'
    ],
    'finance-fraud-detection': [
      'Financial losses from undetected fraud averaging $3.5M annually',
      'False positive rates exceeding 95% in current systems',
      'Regulatory fines from compliance failures',
      'Manual transaction monitoring missing sophisticated attacks'
    ],
    'retail-personalization': [
      'Generic customer experiences leading to 70% cart abandonment',
      'Inability to predict customer preferences accurately',
      'Lost revenue from poor product recommendations',
      'One-size-fits-all marketing reducing engagement by 60%'
    ],
    'manufacturing-prediction': [
      'Unplanned equipment downtime costing $50,000 per hour',
      'Quality issues detected only after production completion',
      'Inefficient maintenance schedules increasing costs by 25%',
      'Reactive approach to equipment failures disrupting production'
    ],
    'logistics-optimization': [
      'Route inefficiencies increasing fuel costs by 30%',
      'Poor warehouse space utilization reducing throughput',
      'Last-mile delivery delays affecting customer satisfaction',
      'Inventory placement issues increasing picking time by 40%'
    ],
    'insurance-risk-assessment': [
      'Inaccurate risk pricing leading to underwriting losses',
      'Manual claims processing taking 45+ days',
      'Fraudulent claims increasing loss ratios by 15%',
      'Outdated risk models missing emerging threats'
    ],
    'real-estate-forecasting': [
      'Market timing errors resulting in 20% value loss',
      'Inaccurate property valuations affecting investment decisions',
      'Poor demand prediction leading to vacancy issues',
      'Seasonal trends not factored into pricing strategies'
    ],
    'education-personalization': [
      'One-size-fits-all approach leaving 40% of students behind',
      'Inability to identify at-risk students early',
      'Limited insights into learning effectiveness',
      'Generic curriculum failing to engage diverse learning styles'
    ],
    'legal-data-extraction': [
      'Manual document review consuming 60% of billable hours',
      'Inconsistent case analysis across legal teams',
      'Delayed case preparation affecting client outcomes',
      'Important information buried in massive document sets'
    ],
    'hospitality-prediction': [
      'Revenue losses from poor demand forecasting',
      'Suboptimal pricing strategies reducing profitability',
      'Guest experience inconsistencies affecting reviews',
      'Seasonal demand fluctuations catching operations unprepared'
    ],
    'technology-automation': [
      'Development bottlenecks reducing time-to-market by 40%',
      'Manual testing processes increasing defect rates',
      'Deployment inefficiencies causing system downtime',
      'Repetitive tasks consuming valuable developer time'
    ],
    'energy-optimization': [
      'Grid inefficiencies increasing operational costs by 25%',
      'Poor demand forecasting leading to capacity issues',
      'Renewable integration challenges affecting stability',
      'Peak demand management requiring expensive backup systems'
    ]
  };
  
  const key = `${industry}-${usecase}`;
  return painPointMap[key] || [
    `Inefficient ${useCaseData[usecase]?.name.toLowerCase()} processes increasing operational costs`,
    `Manual workflows reducing productivity and accuracy`,
    `Lack of data-driven insights affecting strategic decisions`,
    `Legacy systems unable to scale with business growth`
  ];
}

function generateIndustryBenefits(industry: string, usecase: string, industryInfo: any, useCaseInfo: any): string[] {
  return [
    `Improve ${industryInfo.metrics[0]} by 35-50% through intelligent ${useCaseInfo.name.toLowerCase()}`,
    `Reduce operational costs while maintaining ${industryInfo.compliance} compliance`,
    `Scale ${industryInfo.name.toLowerCase()} operations without proportional cost increases`,
    `Get working proof of concept validated in just 5 days`,
    `Access vendor-neutral AI recommendations without technology lock-in`,
    `Implement with existing ${industryInfo.terminology[0]} infrastructure`,
    `Achieve measurable ROI within 30 days of deployment`
  ];
}

function generateUseCaseExamples(industry: string, usecase: string): string[] {
  const examples: Record<string, string[]> = {
    'healthcare-automation': [
      'Automated patient intake reducing registration time by 75%',
      'Clinical workflow automation improving care coordination',
      'Insurance verification automation eliminating manual processing',
      'Medication management automation ensuring safety compliance'
    ],
    'finance-fraud-detection': [
      'Real-time transaction monitoring with 99.5% accuracy',
      'Credit card fraud detection reducing false positives by 80%',
      'Anti-money laundering automation ensuring regulatory compliance',
      'Account takeover prevention protecting customer assets'
    ],
    'retail-personalization': [
      'Dynamic product recommendations increasing conversion by 45%',
      'Personalized marketing campaigns improving customer lifetime value',
      'Individual pricing strategies optimizing profit margins',
      'Customized shopping experiences driving customer loyalty'
    ],
    'manufacturing-prediction': [
      'Predictive maintenance reducing downtime by 60%',
      'Quality prediction preventing 95% of defects',
      'Demand forecasting optimizing production schedules',
      'Supply chain prediction minimizing inventory costs'
    ]
  };
  
  const key = `${industry}-${usecase}`;
  return examples[key] || [
    `${useCaseData[usecase]?.name} implementation tailored for ${industryData[industry]?.name}`,
    `Customized solution addressing industry-specific challenges`,
    `Integration with existing systems and workflows`,
    `Scalable architecture supporting future growth`
  ];
}

function generateROIMetrics(industry: string, industryInfo: any) {
  return {
    costSavings: `25-40% reduction in operational costs`,
    efficiencyGains: `35-50% improvement in ${industryInfo.metrics[0]}`,
    timeToValue: '5 days to working prototype, 30 days to full implementation',
    compliance: `Maintained ${industryInfo.compliance} compliance throughout implementation`,
    accuracy: '99%+ accuracy in automated processes',
    scalability: 'Handles 10x current volume without additional infrastructure'
  };
}

function generateImplementationProcess(industry: string, usecase: string, industryInfo: any, useCaseInfo: any) {
  return [
    {
      day: 1,
      title: 'Discovery & Assessment',
      description: `Analyze current ${industryInfo.name.toLowerCase()} workflows and identify ${useCaseInfo.name.toLowerCase()} opportunities. Review ${industryInfo.compliance} requirements and data architecture.`,
      deliverables: ['Current state assessment', 'Compliance review', 'Data audit']
    },
    {
      day: 2,
      title: 'Solution Design',
      description: `Design AI architecture tailored to ${industryInfo.terminology[0]} and ${industryInfo.terminology[1]}. Select optimal algorithms for ${useCaseInfo.name.toLowerCase()} implementation.`,
      deliverables: ['Technical architecture', 'Algorithm selection', 'Integration plan']
    },
    {
      day: 3,
      title: 'Prototype Development',
      description: `Build working ${useCaseInfo.name.toLowerCase()} prototype using your actual ${industryInfo.name.toLowerCase()} data. Ensure integration with existing systems.`,
      deliverables: ['Working prototype', 'Data integration', 'Initial testing']
    },
    {
      day: 4,
      title: 'Testing & Validation',
      description: `Validate prototype performance against ${industryInfo.metrics[0]} and ${industryInfo.metrics[1]}. Test compliance with ${industryInfo.compliance} requirements.`,
      deliverables: ['Performance validation', 'Compliance testing', 'Security review']
    },
    {
      day: 5,
      title: 'ROI Presentation',
      description: `Present working solution with validated ROI metrics. Provide implementation roadmap and vendor-neutral technology recommendations.`,
      deliverables: ['Executive presentation', 'ROI analysis', 'Implementation roadmap']
    }
  ];
}
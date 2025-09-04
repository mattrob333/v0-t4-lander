import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AIUseCaseClient } from '@/components/ai-solutions/AIUseCaseClient';
import industryData from '@/lib/seo-data/industries.json';
import useCaseData from '@/lib/seo-data/use-cases.json';

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
  const { industry, usecase } = await params;
  
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
  const description = `Transform ${industryInfo.name.toLowerCase()} with AI-powered ${useCaseInfo.name.toLowerCase()}. 5-day proof of concept with validated 3-4x ROI. ${industryInfo.compliance} compliant.`;
  
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
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function AIUseCasePage({ params }: PageProps) {
  const { industry, usecase } = await params;
  
  // Validate params
  if (!industryData[industry as keyof typeof industryData] || !useCaseData[usecase as keyof typeof useCaseData]) {
    notFound();
  }
  
  const industryInfo = industryData[industry as keyof typeof industryData];
  const useCaseInfo = useCaseData[usecase as keyof typeof useCaseData];

  return (
    <AIUseCaseClient 
      industry={industry}
      usecase={usecase}
      industryInfo={industryInfo}
      useCaseInfo={useCaseInfo}
    />
  );
}
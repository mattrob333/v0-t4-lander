import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IndustryCategoryClient } from '@/components/ai-solutions/IndustryCategoryClient';
import industryData from '@/lib/seo-data/industries.json';

interface PageProps {
  params: {
    industry: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(industryData).map((industry) => ({
    industry,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry } = await params;
  
  if (!industryData[industry]) {
    return {
      title: 'Industry Not Found',
      description: 'The requested industry page could not be found.',
    };
  }
  
  const industryInfo = industryData[industry];
  const title = `${industryInfo.name} AI Solutions | 5-Day POC | Tier 4 Intelligence`;
  const description = `Comprehensive AI solutions for ${industryInfo.name.toLowerCase()}. 12 proven use cases with ${industryInfo.compliance} compliance. 5-day proof of concept with validated 3-4x ROI.`;
  
  return {
    title,
    description,
    keywords: [
      `${industryInfo.name} AI`,
      `AI for ${industryInfo.name.toLowerCase()}`,
      ...industryInfo.terminology,
      'AI consulting',
      '5-day POC',
      'rapid AI implementation',
      industryInfo.compliance
    ].join(', '),
    openGraph: {
      title,
      description,
      url: `https://tier4intelligence.com/ai-solutions/${industry}`,
      siteName: 'Tier 4 Intelligence',
      images: [
        {
          url: `https://tier4intelligence.com/images/og/${industry}-ai-solutions.jpg`,
          width: 1200,
          height: 630,
          alt: `${industryInfo.name} AI Solutions`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { industry } = await params;
  
  if (!industryData[industry]) {
    notFound();
  }
  
  const industryInfo = industryData[industry];
  
  return (
    <IndustryCategoryClient 
      industry={industry}
      industryInfo={industryInfo}
    />
  );
}
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import industryData from '@/lib/seo-data/industries.json';
import useCaseData from '@/lib/seo-data/use-cases.json';
import { IndustryNavigation } from '@/components/internal-linking';
import { ConversionCTA } from '@/components/conversion-ctas';

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
  const { industry } = params;
  
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

export default function IndustryPage({ params }: PageProps) {
  const { industry } = params;
  
  if (!industryData[industry]) {
    notFound();
  }
  
  const industryInfo = industryData[industry];
  const useCases = Object.entries(useCaseData);
  
  return (
    <main className="min-h-screen">
      <IndustryNavigation currentIndustry={industry} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI Solutions for {industryInfo.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              12 proven AI use cases specifically designed for {industryInfo.name.toLowerCase()} with {industryInfo.compliance} compliance built-in. 
              Get your working prototype in just 5 days.
            </p>
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
              <Link href="/schedule-assessment">Schedule Your Assessment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-600">Key Challenges</h3>
                <ul className="space-y-2">
                  {industryInfo.painPoints.map((pain: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span>{pain}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Core Focus Areas</h3>
                <div className="space-y-2">
                  {industryInfo.terminology.map((term: string, index: number) => (
                    <div key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded inline-block mr-2 mb-2">
                      {term}
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-600">Success Metrics</h3>
                <ul className="space-y-2">
                  {industryInfo.metrics.map((metric: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="capitalize">{metric}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              AI Use Cases for {industryInfo.name}
            </h2>
            <p className="text-xl text-gray-600">
              Each solution is tailored for {industryInfo.name.toLowerCase()} with industry-specific compliance and expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map(([useCaseKey, useCaseInfo]) => (
              <Card key={useCaseKey} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">
                    {useCaseInfo.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {useCaseInfo.description}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Key Benefits:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {useCaseInfo.benefits.slice(0, 3).map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">{industryInfo.name} Applications:</h4>
                  <div className="text-xs text-gray-600">
                    Optimized for {industryInfo.terminology.slice(0, 2).join(', ')} with {industryInfo.compliance} compliance
                  </div>
                </div>
                
                <Link href={`/ai-solutions/${industry}/${useCaseKey}`}>
                  <Button className="w-full">
                    Learn More
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Trends */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              {industryInfo.name} AI Trends & Innovations
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industryInfo.trends.map((trend: string, index: number) => (
                <Card key={index} className="p-4">
                  <div className="text-sm font-semibold text-purple-600 capitalize">
                    {trend}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              {industryInfo.compliance} Compliant AI Solutions
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              All our {industryInfo.name.toLowerCase()} AI solutions are designed with {industryInfo.compliance} compliance from day one. 
              We understand the regulatory landscape and ensure your AI implementation meets all requirements.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Built-in Compliance</h3>
                <p className="text-sm text-gray-600">
                  Every solution includes compliance checks and documentation for {industryInfo.compliance} requirements.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Audit-Ready</h3>
                <p className="text-sm text-gray-600">
                  Complete audit trails and documentation to support regulatory reviews and compliance assessments.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Expert Guidance</h3>
                <p className="text-sm text-gray-600">
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
    </main>
  );
}
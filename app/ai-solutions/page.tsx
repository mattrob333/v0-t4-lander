import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import industryData from '@/lib/seo-data/industries.json';
import useCaseData from '@/lib/seo-data/use-cases.json';

export const metadata: Metadata = {
  title: 'AI Solutions by Industry | Tier 4 Intelligence',
  description: 'Comprehensive AI solutions across 12 industries and 12 use cases. 5-day proof of concepts with validated 3-4x ROI. Vendor-neutral approach.',
  keywords: 'AI solutions, artificial intelligence, industry AI, AI consulting, rapid AI implementation, vendor-neutral AI',
  openGraph: {
    title: 'AI Solutions by Industry | Tier 4 Intelligence',
    description: 'Comprehensive AI solutions across 12 industries and 12 use cases. 5-day proof of concepts with validated 3-4x ROI.',
    url: 'https://tier4intelligence.com/ai-solutions',
    siteName: 'Tier 4 Intelligence',
    images: [
      {
        url: 'https://tier4intelligence.com/images/og/ai-solutions-overview.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Solutions by Industry',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function AISolutionsOverview() {
  const industries = Object.entries(industryData);
  const useCases = Object.entries(useCaseData);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI Solutions for Every Industry
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              144+ proven AI implementations across 12 industries and 12 use cases. 
              Get your working prototype in just 5 days with validated 3-4x ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                <Link href="/schedule-assessment">Find Your AI Solution</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
                <Link href="/resources/ai-readiness-assessment">Take AI Readiness Quiz</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">144+</div>
              <div className="text-gray-600">AI Solution Combinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">12</div>
              <div className="text-gray-600">Industries Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">5 Days</div>
              <div className="text-gray-600">To Working Prototype</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">3-4x</div>
              <div className="text-gray-600">Validated ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">AI Solutions by Industry</h2>
            <p className="text-xl text-gray-600">
              Industry-specific AI implementations with compliance and domain expertise built-in
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map(([industryKey, industryInfo]) => (
              <Card key={industryKey} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold mb-2 text-blue-600">
                    {industryInfo.name}
                  </h3>
                  <div className="text-sm text-gray-500 mb-3">
                    Compliance: {industryInfo.compliance}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Key Pain Points:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {industryInfo.painPoints.slice(0, 3).map((pain: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Core Focus Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {industryInfo.terminology.slice(0, 4).map((term: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link href={`/ai-solutions/${industryKey}`}>
                  <Button className="w-full">
                    View {industryInfo.name} AI Solutions
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">AI Use Cases</h2>
            <p className="text-xl text-gray-600">
              Proven AI applications that drive measurable business outcomes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map(([useCaseKey, useCaseInfo]) => (
              <Card key={useCaseKey} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-3 text-green-600">
                  {useCaseInfo.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {useCaseInfo.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Key Benefits:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {useCaseInfo.benefits.slice(0, 2).map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href={`/ai-solutions/healthcare/${useCaseKey}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    See Example
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Matrix Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Complete AI Solution Matrix</h2>
            <p className="text-xl text-gray-600 mb-8">
              Every combination represents a proven implementation with industry-specific expertise
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">Industry</th>
                  {useCases.slice(0, 6).map(([useCaseKey, useCaseInfo]) => (
                    <th key={useCaseKey} className="p-3 text-center min-w-[120px]">
                      {useCaseInfo.name}
                    </th>
                  ))}
                  <th className="p-3 text-center">View All</th>
                </tr>
              </thead>
              <tbody>
                {industries.slice(0, 6).map(([industryKey, industryInfo]) => (
                  <tr key={industryKey} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{industryInfo.name}</td>
                    {useCases.slice(0, 6).map(([useCaseKey]) => (
                      <td key={useCaseKey} className="p-3 text-center">
                        <Link 
                          href={`/ai-solutions/${industryKey}/${useCaseKey}`}
                          className="inline-block w-8 h-8 bg-green-500 hover:bg-green-600 rounded text-white text-xs flex items-center justify-center"
                          title={`${industryInfo.name} ${useCaseData[useCaseKey].name}`}
                        >
                          ✓
                        </Link>
                      </td>
                    ))}
                    <td className="p-3 text-center">
                      <Link href={`/ai-solutions/${industryKey}`}>
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Showing 6x6 preview. Total matrix includes all 12 industries × 12 use cases = 144 solutions.
            </p>
            <Button size="lg">
              <Link href="/ai-solutions/matrix">View Complete Matrix</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect AI Solution?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get a personalized AI strategy session and see how we can deliver results in just 5 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
              <Link href="/schedule-assessment">Schedule Your Assessment</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
              <Link href="/resources/ai-roi-calculator">Calculate Your ROI</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
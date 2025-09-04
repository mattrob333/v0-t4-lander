import { Metadata } from 'next';

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

export default function AISolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
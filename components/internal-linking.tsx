'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import internalLinkingData from '@/lib/internal-linking.json';

interface InternalLinkingProps {
  industry?: string;
  usecase?: string;
  className?: string;
}

// Component for displaying related pages
export function RelatedPages({ industry, usecase, className = '' }: InternalLinkingProps) {
  const relatedPages = [];

  // Get industry-related pages
  if (industry && internalLinkingData.industryLinks[industry]) {
    relatedPages.push(...internalLinkingData.industryLinks[industry]);
  }

  // Get use-case-related pages
  if (usecase && internalLinkingData.useCaseLinks[usecase]) {
    relatedPages.push(...internalLinkingData.useCaseLinks[usecase]);
  }

  // Remove duplicates and current page
  const uniquePages = relatedPages.filter((page, index, self) => 
    index === self.findIndex(p => p.url === page.url) && 
    page.url !== `/ai-solutions/${industry}/${usecase}`
  ).slice(0, 6); // Show max 6 related pages

  if (uniquePages.length === 0) return null;

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Related AI Solutions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniquePages.map((page, index) => (
            <Link
              key={index}
              href={page.url}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-blue-600 hover:text-blue-800">
                {page.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {page.description}
              </p>
              <div className="mt-4 text-blue-600 text-sm font-medium">
                Learn more →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Hook for automatic internal linking in content
export function useInternalLinking() {
  useEffect(() => {
    const addInternalLinks = () => {
      const content = document.querySelector('main');
      if (!content) return;

      let html = content.innerHTML;
      
      // Apply keyword-based internal linking
      Object.entries(internalLinkingData.keywords).forEach(([keyword, url]) => {
        const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b(?![^<]*>)`, 'gi');
        html = html.replace(regex, (match, p1) => {
          // Don't link if already inside a link
          if (html.indexOf(match) > -1 && html.substring(0, html.indexOf(match)).lastIndexOf('<a') > html.substring(0, html.indexOf(match)).lastIndexOf('</a>')) {
            return match;
          }
          return `<a href="${url}" class="internal-link text-blue-600 hover:text-blue-800 underline">${p1}</a>`;
        });
      });
      
      content.innerHTML = html;
    };

    // Run after component mount
    const timer = setTimeout(addInternalLinks, 100);
    return () => clearTimeout(timer);
  }, []);
}

// Component for industry navigation
export function IndustryNavigation({ currentIndustry }: { currentIndustry?: string }) {
  const industries = Object.keys(internalLinkingData.industryLinks);

  return (
    <nav className="bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-700 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <span className="text-sm font-medium text-black/60 dark:text-white/60 mr-4">Industries:</span>
          {industries.map((industry) => (
            <Link
              key={industry}
              href={`/ai-solutions/${industry}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                currentIndustry === industry
                  ? 'bg-[#00A878] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-neutral-800 text-black dark:text-white hover:bg-[#00A878]/10 dark:hover:bg-[#00A878]/20 hover:text-[#00A878]'
              }`}
            >
              {industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Component for use case navigation
export function UseCaseNavigation({ currentUseCase, currentIndustry }: { currentUseCase?: string; currentIndustry?: string }) {
  const useCases = Object.keys(internalLinkingData.useCaseLinks);

  return (
    <nav className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-white/60 mr-4">Use Cases:</span>
          {useCases.map((usecase) => (
            <Link
              key={usecase}
              href={`/ai-solutions/${currentIndustry || 'healthcare'}/${usecase}`}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentUseCase === usecase
                  ? 'bg-[#00A878] text-white'
                  : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600'
              }`}
            >
              {usecase.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Breadcrumb navigation component
export function ProgrammaticBreadcrumb({ industry, usecase }: { industry: string; usecase: string }) {
  return (
    <nav className="bg-gray-100 py-3">
      <div className="container mx-auto px-4">
        <ol className="flex text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link href="/ai-solutions" className="hover:text-blue-600">AI Solutions</Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link href={`/ai-solutions/${industry}`} className="hover:text-blue-600">
              {industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-900 font-medium">
            {usecase.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </li>
        </ol>
      </div>
    </nav>
  );
}

// Main internal linking component that combines all features
export function InternalLinkingSystem({ industry, usecase }: InternalLinkingProps) {
  useInternalLinking();

  return (
    <>
      {industry && usecase && (
        <ProgrammaticBreadcrumb industry={industry} usecase={usecase} />
      )}
      <IndustryNavigation currentIndustry={industry} />
      <UseCaseNavigation currentUseCase={usecase} currentIndustry={industry} />
      <RelatedPages industry={industry} usecase={usecase} />
    </>
  );
}
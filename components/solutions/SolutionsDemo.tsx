'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  SolutionCard,
  SolutionsTileGrid,
  SolutionsMegaMenu,
  CategoryHero,
  FeaturedProducts
} from './index';
import { Solution, SolutionCategory, FeaturedProduct } from '@/types/solutions';

// Mock data for demonstration
const mockCategories: SolutionCategory[] = [
  {
    id: '1',
    name: 'AI Automation',
    slug: 'ai-automation',
    tagline: 'Intelligent process automation powered by AI',
    description: 'Transform your business operations with cutting-edge AI automation solutions.',
    iconName: 'Bot',
    featured: true,
    sortOrder: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Customer Management',
    slug: 'customer-management',
    tagline: 'Comprehensive CRM and customer experience tools',
    iconName: 'UserRoundCog',
    featured: true,
    sortOrder: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Analytics & Reporting',
    slug: 'analytics-reporting',
    tagline: 'Data-driven insights and comprehensive reporting',
    iconName: 'LineChart',
    featured: true,
    sortOrder: 3,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Workflow Optimization',
    slug: 'workflow-optimization',
    tagline: 'Streamline and optimize your business workflows',
    iconName: 'Workflow',
    featured: true,
    sortOrder: 4,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '5',
    name: 'Integration Hub',
    slug: 'integration-hub',
    tagline: 'Connect all your tools and systems seamlessly',
    iconName: 'Boxes',
    featured: true,
    sortOrder: 5,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '6',
    name: 'Training & Education',
    slug: 'training-education',
    tagline: 'Comprehensive training programs and resources',
    iconName: 'GraduationCap',
    featured: true,
    sortOrder: 6,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const mockSolutions: Solution[] = [
  {
    id: '1',
    title: 'Smart Document Processing',
    summary: 'Automatically process and extract data from documents using AI',
    category: mockCategories[0],
    tags: ['AI', 'OCR', 'Automation'],
    featured: true,
    ctaText: 'Learn More',
    ctaUrl: '/solutions/document-processing',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Customer Journey Mapping',
    summary: 'Visualize and optimize your customer experience journey',
    category: mockCategories[1],
    tags: ['CX', 'Journey', 'Optimization'],
    featured: true,
    ctaText: 'Explore',
    ctaUrl: '/solutions/journey-mapping',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    title: 'Real-time Dashboard',
    summary: 'Monitor your KPIs and metrics in real-time',
    category: mockCategories[2],
    tags: ['Dashboard', 'Analytics', 'Real-time'],
    featured: true,
    ctaText: 'View Demo',
    ctaUrl: '/solutions/dashboard',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    title: 'Process Automation Engine',
    summary: 'Automate complex business processes with visual workflow builder',
    category: mockCategories[3],
    tags: ['Automation', 'Workflow', 'Process'],
    featured: true,
    ctaText: 'Try Free',
    ctaUrl: '/solutions/automation-engine',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const mockFeaturedProducts: FeaturedProduct[] = [
  {
    id: '1',
    title: 'T4I Pro Suite',
    description: 'Complete business automation platform with AI-powered tools and integrations.',
    ctaText: 'Start Free Trial',
    ctaUrl: '/products/pro-suite',
    imageUrl: '/images/products/pro-suite.jpg',
    featured: true,
    sortOrder: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Analytics Engine',
    description: 'Advanced analytics and reporting platform for data-driven decision making.',
    ctaText: 'View Pricing',
    ctaUrl: '/products/analytics-engine',
    featured: true,
    sortOrder: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const SolutionsDemo: React.FC = () => {
  const router = useRouter();
  
  const handleSolutionClick = (solution: Solution) => {
    console.log('Solution clicked:', solution.title);
    // Navigate to solution page
    if (solution.ctaUrl) {
      router.push(solution.ctaUrl);
    }
  };

  const handleCategoryClick = (category: SolutionCategory) => {
    console.log('Category clicked:', category.name);
    // Navigate to category page
    router.push(`/solutions/${category.slug}`);
  };

  const handleProductClick = (product: FeaturedProduct) => {
    console.log('Product clicked:', product.title);
    // Navigate to product page
    if (product.ctaUrl) {
      router.push(product.ctaUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation with Mega Menu */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                T4I Solutions
              </div>
              
              <SolutionsMegaMenu
                categories={mockCategories}
                featuredSolutions={mockSolutions}
                onSolutionClick={handleSolutionClick}
                onCategoryClick={handleCategoryClick}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Category Hero Section */}
      <CategoryHero
        category={mockCategories[0]}
        showBreadcrumb={true}
        ctaText="Get Started"
        ctaUrl="/solutions/ai-automation/get-started"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Solutions Tile Grid - Home Variant */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Explore by Category
              </h2>
              <SolutionsTileGrid
                categories={mockCategories}
                variant="home"
                onCategoryClick={handleCategoryClick}
              />
            </section>

            {/* Featured Solutions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Featured Solutions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockSolutions.map((solution) => (
                  <SolutionCard
                    key={solution.id}
                    solution={solution}
                    onClick={handleSolutionClick}
                  />
                ))}
              </div>
            </section>

            {/* Solutions Tile Grid - Landing Variant */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                All Categories (Landing Style)
              </h2>
              <SolutionsTileGrid
                categories={mockCategories}
                variant="landing"
                onCategoryClick={handleCategoryClick}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FeaturedProducts
              products={mockFeaturedProducts}
              onProductClick={handleProductClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsDemo;
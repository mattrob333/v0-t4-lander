'use client';

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CategoryHeroProps } from '@/types/solutions';

export const CategoryHero: React.FC<CategoryHeroProps> = ({
  category,
  showBreadcrumb = true,
  ctaText,
  ctaUrl,
  className
}) => {
  const handleCtaClick = () => {
    if (ctaUrl) {
      window.location.href = ctaUrl;
    }
  };

  return (
    <section className={cn(
      'relative overflow-hidden',
      'bg-gradient-to-br from-gray-50 to-gray-100',
      'dark:from-neutral-900 dark:to-neutral-800',
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, var(--t4i-green) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, var(--t4i-green) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 25px 25px'
          }}
        />
      </div>

      {/* Green accent overlay */}
      <div className={cn(
        'absolute top-0 left-0 w-full h-1',
        'bg-gradient-to-r from-[var(--t4i-green)] to-transparent'
      )} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-20 lg:py-24">
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <nav className="flex items-center space-x-2 text-sm mb-8" aria-label="Breadcrumb">
              <a
                href="/"
                className={cn(
                  'flex items-center text-gray-500 dark:text-neutral-400',
                  'hover:text-[var(--t4i-green)] transition-colors duration-200'
                )}
                aria-label="Go to home page"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </a>
              
              <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
              
              <a
                href="/solutions"
                className={cn(
                  'text-gray-500 dark:text-neutral-400',
                  'hover:text-[var(--t4i-green)] transition-colors duration-200'
                )}
              >
                Solutions
              </a>
              
              <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
              
              <span className="text-gray-900 dark:text-neutral-100 font-medium">
                {category.name}
              </span>
            </nav>
          )}

          {/* Main Content */}
          <div className="max-w-4xl">
            <h1 className={cn(
              'text-4xl sm:text-5xl lg:text-6xl font-bold',
              'text-gray-900 dark:text-neutral-100',
              'leading-tight mb-6'
            )}>
              <span className="block">
                {category.name}
              </span>
              <span className={cn(
                'block text-3xl sm:text-4xl lg:text-5xl',
                'bg-gradient-to-r from-[var(--t4i-green)] to-green-400',
                'bg-clip-text text-transparent'
              )}>
                Solutions
              </span>
            </h1>

            <p className={cn(
              'text-xl sm:text-2xl text-gray-600 dark:text-neutral-300',
              'leading-relaxed mb-8 max-w-3xl'
            )}>
              {category.tagline}
            </p>

            {category.description && (
              <p className={cn(
                'text-lg text-gray-500 dark:text-neutral-400',
                'leading-relaxed mb-10 max-w-2xl'
              )}>
                {category.description}
              </p>
            )}

            {/* CTA Button */}
            {ctaText && ctaUrl && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleCtaClick}
                  className={cn(
                    'bg-[var(--t4i-green)] hover:bg-[var(--t4i-green)]/90',
                    'text-white px-8 py-3 text-lg font-semibold',
                    'shadow-lg hover:shadow-xl hover:-translate-y-0.5',
                    'transition-all duration-300',
                    'group relative overflow-hidden'
                  )}
                  style={{ borderRadius: '12px' }}
                >
                  <span className="relative z-10 flex items-center">
                    {ctaText}
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  
                  {/* Button shimmer effect */}
                  <div className={cn(
                    'absolute inset-0 -translate-x-full',
                    'bg-gradient-to-r from-transparent via-white/20 to-transparent',
                    'group-hover:translate-x-full transition-transform duration-1000'
                  )} />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'border-[var(--t4i-green)] text-[var(--t4i-green)]',
                    'hover:bg-[var(--t4i-green)] hover:text-white',
                    'px-8 py-3 text-lg font-semibold',
                    'transition-all duration-300'
                  )}
                  style={{ borderRadius: '12px' }}
                >
                  Explore All Solutions
                </Button>
              </div>
            )}
          </div>

          {/* Stats or additional info */}
          {category.solutions && category.solutions.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold text-[var(--t4i-green)] mb-2">
                    {category.solutions.length}
                  </div>
                  <div className="text-gray-600 dark:text-neutral-400">
                    Available Solutions
                  </div>
                </div>
                
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold text-[var(--t4i-green)] mb-2">
                    24/7
                  </div>
                  <div className="text-gray-600 dark:text-neutral-400">
                    Expert Support
                  </div>
                </div>
                
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold text-[var(--t4i-green)] mb-2">
                    99.9%
                  </div>
                  <div className="text-gray-600 dark:text-neutral-400">
                    Uptime Guarantee
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
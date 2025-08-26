'use client';

import React from 'react';
import { ExternalLink, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeaturedProductsProps } from '@/types/solutions';

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  className,
  onProductClick
}) => {
  const handleProductClick = (product: typeof products[0]) => {
    if (onProductClick) {
      onProductClick(product);
    } else if (product.ctaUrl) {
      window.open(product.ctaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const featuredProducts = products.filter(product => product.featured);
  const sortedProducts = featuredProducts.sort((a, b) => a.sortOrder - b.sortOrder);

  if (sortedProducts.length === 0) {
    return null;
  }

  return (
    <aside className={cn('space-y-6', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--t4i-white)]">
          Featured Products
        </h2>
        <Badge
          variant="secondary"
          className={cn(
            'bg-[var(--t4i-green)]/10 text-[var(--t4i-green)]',
            'border-[var(--t4i-green)]/20 px-2 py-1'
          )}
        >
          <Star className="h-3 w-3 mr-1" />
          Recommended
        </Badge>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {sortedProducts.map((product, index) => (
          <Card
            key={product.id}
            className={cn(
              'group cursor-pointer transition-all duration-300',
              'hover:shadow-lg hover:-translate-y-0.5',
              'border-gray-200 hover:border-[var(--t4i-green)]/50',
              'bg-white dark:bg-[var(--t4i-black)] dark:border-gray-800',
              'overflow-hidden'
            )}
            onClick={() => handleProductClick(product)}
            style={{ borderRadius: '12px' }}
          >
            {/* Featured indicator for first product */}
            {index === 0 && (
              <div className={cn(
                'h-1 bg-gradient-to-r',
                'from-[var(--t4i-green)] to-green-400'
              )} />
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className={cn(
                  'text-lg text-gray-900 dark:text-[var(--t4i-white)]',
                  'group-hover:text-[var(--t4i-green)] transition-colors duration-300',
                  'leading-tight'
                )}>
                  {product.title}
                </CardTitle>
                
                <ExternalLink className={cn(
                  'h-4 w-4 text-gray-400 group-hover:text-[var(--t4i-green)]',
                  'transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                  'flex-shrink-0 ml-2 mt-1'
                )} />
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Product Image (if available) */}
              {product.imageUrl && (
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className={cn(
                      'w-full h-32 object-cover',
                      'group-hover:scale-105 transition-transform duration-300'
                    )}
                    loading="lazy"
                  />
                  <div className={cn(
                    'absolute inset-0 bg-black/0 group-hover:bg-black/10',
                    'transition-colors duration-300'
                  )} />
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {/* CTA Button */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'w-full border-[var(--t4i-green)]/30 text-[var(--t4i-green)]',
                  'hover:bg-[var(--t4i-green)] hover:text-white hover:border-[var(--t4i-green)]',
                  'transition-all duration-300 group/btn'
                )}
                style={{ borderRadius: '8px' }}
              >
                <span className="flex items-center justify-center">
                  {product.ctaText}
                  <ArrowRight className={cn(
                    'ml-2 h-4 w-4 transition-transform duration-300',
                    'group-hover/btn:translate-x-1'
                  )} />
                </span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* See More Link (if there are more products) */}
      {products.length > featuredProducts.length && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className={cn(
              'w-full text-[var(--t4i-green)] hover:text-[var(--t4i-green)]',
              'hover:bg-[var(--t4i-green)]/10 transition-colors duration-300',
              'group'
            )}
          >
            View All Products
            <ArrowRight className={cn(
              'ml-2 h-4 w-4 transition-transform duration-300',
              'group-hover:translate-x-1'
            )} />
          </Button>
        </div>
      )}

      {/* Promotional Banner */}
      <Card className={cn(
        'bg-gradient-to-br from-[var(--t4i-green)]/5 to-green-400/5',
        'border-[var(--t4i-green)]/20 dark:border-[var(--t4i-green)]/30'
      )}>
        <CardContent className="p-4 text-center">
          <div className="mb-3">
            <Star className="h-8 w-8 text-[var(--t4i-green)] mx-auto" />
          </div>
          
          <h3 className="font-semibold text-gray-900 dark:text-[var(--t4i-white)] mb-2">
            Need Custom Solutions?
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            Our experts can help you design and implement tailored solutions for your unique requirements.
          </p>
          
          <Button
            size="sm"
            className={cn(
              'bg-[var(--t4i-green)] hover:bg-[var(--t4i-green)]/90',
              'text-white px-4 py-2 text-sm',
              'transition-all duration-300 hover:shadow-md'
            )}
            style={{ borderRadius: '8px' }}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
};
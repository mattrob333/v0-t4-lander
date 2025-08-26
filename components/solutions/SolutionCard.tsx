'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SolutionCardProps } from '@/types/solutions';

export const SolutionCard: React.FC<SolutionCardProps> = ({
  solution,
  variant = 'default',
  onClick,
  className
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(solution);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        'border-gray-200 hover:border-[var(--t4i-green)] hover:shadow-[var(--t4i-green)]/20',
        'bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-[var(--t4i-green)]',
        variant === 'compact' && 'p-4',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View solution: ${solution.title}`}
      style={{
        borderRadius: '12px',
      }}
    >
      <CardHeader className={cn(
        'pb-3',
        variant === 'compact' && 'pb-2'
      )}>
        <div className="flex items-start justify-between">
          <CardTitle className={cn(
            'text-gray-900 dark:text-neutral-100 group-hover:text-[var(--t4i-green)]',
            'transition-colors duration-300',
            variant === 'compact' ? 'text-lg leading-tight' : 'text-xl'
          )}>
            {solution.title}
          </CardTitle>
          <ChevronRight 
            className={cn(
              'h-5 w-5 text-gray-400 group-hover:text-[var(--t4i-green)]',
              'transition-all duration-300 group-hover:translate-x-1',
              'flex-shrink-0 ml-2'
            )}
            aria-hidden="true"
          />
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        'pt-0 space-y-3',
        variant === 'compact' && 'space-y-2'
      )}>
        <p className={cn(
          'text-gray-600 dark:text-neutral-300 leading-relaxed',
          variant === 'compact' ? 'text-sm' : 'text-base'
        )}>
          {solution.summary}
        </p>
        
        {solution.tags && solution.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {solution.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  'text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-800',
                  'text-gray-700 dark:text-neutral-300 border-0',
                  'group-hover:bg-[var(--t4i-green)]/10 group-hover:text-[var(--t4i-green)]',
                  'transition-colors duration-300'
                )}
              >
                {tag}
              </Badge>
            ))}
            {solution.tags.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400"
              >
                +{solution.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {solution.ctaText && (
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'p-0 h-auto font-medium text-[var(--t4i-green)]',
                'hover:text-[var(--t4i-green)] hover:bg-transparent',
                'group-hover:underline transition-all duration-300'
              )}
            >
              {solution.ctaText}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
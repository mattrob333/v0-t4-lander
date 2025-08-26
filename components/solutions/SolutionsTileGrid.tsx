'use client';

import React from 'react';
import { 
  Bot, 
  UserRoundCog, 
  LineChart, 
  Workflow, 
  Boxes, 
  GraduationCap,
  LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { SolutionsTileGridProps, IconName } from '@/types/solutions';

// Icon mapping
const iconMap: Record<IconName, LucideIcon> = {
  Bot,
  UserRoundCog,
  LineChart,
  Workflow,
  Boxes,
  GraduationCap,
};

export const SolutionsTileGrid: React.FC<SolutionsTileGridProps> = ({
  categories,
  variant = 'home',
  className,
  onCategoryClick
}) => {
  const handleCategoryClick = (category: typeof categories[0]) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, category: typeof categories[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(category);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as IconName] || Bot;
    return Icon;
  };

  return (
    <div className={cn(className)}>
      <div className={cn(
        'grid gap-4',
        // Responsive grid: mobile 1 column, tablet 2 columns, desktop 3 columns
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        // Adjust for variant
        variant === 'landing' && 'gap-6'
      )}>
        {categories.map((category) => {
          const Icon = getIcon(category.iconName);
          
          return (
            <Card
              key={category.id}
              className={cn(
                'group relative cursor-pointer transition-all duration-300',
                'hover:shadow-lg hover:-translate-y-1',
                'border-gray-200 hover:border-[var(--t4i-green)] hover:shadow-[var(--t4i-green)]/20',
                'bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-[var(--t4i-green)]',
                variant === 'landing' && 'min-h-[200px]'
              )}
              onClick={() => handleCategoryClick(category)}
              onKeyDown={(e) => handleKeyDown(e, category)}
              tabIndex={0}
              role="button"
              aria-label={`Explore ${category.name} solutions`}
              style={{
                borderRadius: '12px',
              }}
            >
              <CardContent className={cn(
                'p-6 flex flex-col items-center text-center space-y-4',
                variant === 'home' && 'p-4 space-y-3'
              )}>
                {/* Icon */}
                <div className={cn(
                  'relative p-4 rounded-xl',
                  'bg-gray-50 dark:bg-neutral-800/50',
                  'group-hover:bg-[var(--t4i-green)]/10',
                  'transition-all duration-300',
                  variant === 'home' && 'p-3'
                )}>
                  <Icon className={cn(
                    'text-gray-600 dark:text-neutral-400',
                    'group-hover:text-[var(--t4i-green)]',
                    'transition-colors duration-300',
                    variant === 'landing' ? 'h-8 w-8' : 'h-6 w-6'
                  )} />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className={cn(
                    'font-semibold text-gray-900 dark:text-neutral-100',
                    'group-hover:text-[var(--t4i-green)] transition-colors duration-300',
                    variant === 'landing' ? 'text-xl' : 'text-lg'
                  )}>
                    {category.name}
                  </h3>
                  
                  <p className={cn(
                    'text-gray-600 dark:text-neutral-300 leading-relaxed',
                    variant === 'landing' ? 'text-base' : 'text-sm'
                  )}>
                    {category.tagline}
                  </p>
                </div>

                {/* Solution count indicator (optional) */}
                {category.solutions && category.solutions.length > 0 && (
                  <div className={cn(
                    'mt-auto pt-2 text-xs text-gray-500 dark:text-neutral-400',
                    'group-hover:text-[var(--t4i-green)] transition-colors duration-300'
                  )}>
                    {category.solutions.length} solution{category.solutions.length !== 1 ? 's' : ''}
                  </div>
                )}

                {/* Hover effect overlay */}
                <div className={cn(
                  'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100',
                  'bg-gradient-to-br from-[var(--t4i-green)]/5 to-transparent',
                  'transition-opacity duration-300 pointer-events-none'
                )} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
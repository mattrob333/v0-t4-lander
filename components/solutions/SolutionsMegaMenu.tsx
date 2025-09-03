'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  UserRoundCog, 
  LineChart, 
  Workflow, 
  Boxes, 
  GraduationCap,
  ChevronRight,
  ArrowRight,
  LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { SolutionsMegaMenuProps, IconName } from '@/types/solutions';

interface SolutionsMegaMenuProps {
  categories: any[];
  featuredSolutions: any[];
  className?: string;
  onSolutionClick?: (solution: any) => void;
  onCategoryClick?: (category: any) => void;
}

type IconName = 'Bot' | 'UserRoundCog' | 'LineChart' | 'Workflow' | 'Boxes' | 'GraduationCap';

// Icon mapping
const iconMap: Record<IconName, LucideIcon> = {
  Bot,
  UserRoundCog,
  LineChart,
  Workflow,
  Boxes,
  GraduationCap,
};

export const SolutionsMegaMenu: React.FC<SolutionsMegaMenuProps> = ({
  categories,
  featuredSolutions,
  className,
  onSolutionClick,
  onCategoryClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isMounted, setIsMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get filtered solutions for hovered category
  const getFilteredSolutions = () => {
    if (!hoveredCategory) {
      return featuredSolutions.slice(0, 4);
    }
    const category = categories.find(cat => cat.id === hoveredCategory);
    return category?.solutions?.slice(0, 4) || featuredSolutions.slice(0, 4);
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as IconName] || Bot;
    return Icon;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev + 1) % categories.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => prev <= 0 ? categories.length - 1 : prev - 1);
          break;
        case 'ArrowRight':
        case 'ArrowLeft':
          e.preventDefault();
          // Handle horizontal navigation between categories
          const currentRow = Math.floor(focusedIndex / 2);
          const currentCol = focusedIndex % 2;
          const newCol = e.key === 'ArrowRight' ? (currentCol + 1) % 2 : currentCol === 0 ? 1 : 0;
          const newIndex = currentRow * 2 + newCol;
          if (newIndex < categories.length) {
            setFocusedIndex(newIndex);
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < categories.length) {
            const category = categories[focusedIndex];
            onCategoryClick?.(category);
            setIsOpen(false);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex, categories, onCategoryClick]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredSolutions = getFilteredSolutions();

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger Button */}
      <Button
        ref={triggerRef}
        variant="ghost"
        className={cn(
          'px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[var(--t4i-green)]',
          'hover:bg-[var(--t4i-green)]/10 transition-colors duration-200',
          isOpen && 'text-[var(--t4i-green)] bg-[var(--t4i-green)]/10'
        )}
        onMouseEnter={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        onClick={(e) => {
          e.preventDefault();
          if (isMounted) {
            router.push('/solutions');
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Solutions menu"
      >
        Solutions
        <ChevronRight 
          className={cn(
            'ml-1 h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-90'
          )} 
        />
      </Button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 z-50 mt-2',
            'w-screen max-w-4xl min-w-[800px]',
            'bg-white dark:bg-gray-900',
            'border border-gray-200 dark:border-white/20',
            'shadow-xl rounded-lg overflow-hidden',
            // Position adjustments
            '-translate-x-1/4'
          )}
          style={{ borderRadius: '12px' }}
          role="menu"
          aria-label="Solutions categories and featured items"
        >
          <div className="flex">
            {/* Left Panel - Categories Grid */}
            <div className="flex-1 p-6 border-r border-gray-200 dark:border-white/20 dark:bg-gray-900">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                Browse by Category
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => {
                  const Icon = getIcon(category.iconName);
                  const isFocused = focusedIndex === index;
                  
                  return (
                    <Card
                      key={category.slug}
                      className={cn(
                        'group cursor-pointer transition-all duration-200',
                        'border border-gray-200 dark:border-white/20 hover:border-[var(--t4i-green)] dark:hover:border-[var(--t4i-green)]',
                        'hover:shadow-md hover:shadow-[var(--t4i-green)]/10',
                        isFocused && 'border-[var(--t4i-green)] ring-1 ring-[var(--t4i-green)]',
                        hoveredCategory === category.slug && 'border-[var(--t4i-green)] bg-[var(--t4i-green)]/5'
                      )}
                      onMouseEnter={() => setHoveredCategory(category.slug)}
                      onClick={() => {
                        onCategoryClick?.(category);
                        setIsOpen(false);
                      }}
                      role="menuitem"
                      tabIndex={isFocused ? 0 : -1}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            'p-2 rounded-lg',
                            'bg-gray-50 dark:bg-gray-900',
                            'group-hover:bg-[var(--t4i-green)]/10',
                            'transition-colors duration-200'
                          )}>
                            <Icon className={cn(
                              'h-5 w-5 text-gray-600 dark:text-gray-400',
                              'group-hover:text-[var(--t4i-green)]',
                              'transition-colors duration-200'
                            )} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={cn(
                              'font-medium text-gray-900 dark:text-white',
                              'group-hover:text-[var(--t4i-green)] dark:group-hover:text-[var(--t4i-green)]',
                              'transition-colors duration-200',
                              'text-sm leading-tight'
                            )}>
                              {category.title === 'Customer Self-Service' ? (
                                <>
                                  Customer<br />Self-Service
                                </>
                              ) : (
                                category.title
                              )}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                              {category.tagline}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - Featured Solutions */}
            <div className="w-80 p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  {hoveredCategory 
                    ? `${categories.find(cat => cat.id === hoveredCategory)?.name} Solutions`
                    : 'Featured Solutions'
                  }
                </h3>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--t4i-green)] hover:text-[var(--t4i-green)] hover:bg-[var(--t4i-green)]/10 p-1 h-auto"
                  onClick={() => {
                    const category = hoveredCategory 
                      ? categories.find(cat => cat.id === hoveredCategory)
                      : null;
                    if (category) {
                      onCategoryClick?.(category);
                    }
                    setIsOpen(false);
                  }}
                >
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-3">
                {filteredSolutions.map((solution) => (
                  <div
                    key={solution.slug}
                    className={cn(
                      'group cursor-pointer p-3 rounded-lg',
                      'hover:bg-white dark:hover:bg-gray-800',
                      'border border-transparent hover:border-gray-200 dark:hover:border-white/20',
                      'transition-all duration-200'
                    )}
                    onClick={() => {
                      onSolutionClick?.(solution);
                      setIsOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          'font-medium text-gray-900 dark:text-white text-sm',
                          'group-hover:text-[var(--t4i-green)] dark:group-hover:text-[var(--t4i-green)]',
                          'transition-colors duration-200'
                        )}>
                          {solution.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                          {solution.summary}
                        </p>
                      </div>
                      
                      <ChevronRight className={cn(
                        'h-4 w-4 text-gray-400 group-hover:text-[var(--t4i-green)]',
                        'transition-all duration-200 group-hover:translate-x-0.5',
                        'flex-shrink-0 ml-2'
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
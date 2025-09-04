'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Building2, 
  Factory, 
  ShoppingCart, 
  Truck, 
  Shield,
  Home,
  GraduationCap,
  Scale,
  UtensilsCrossed,
  Laptop,
  Zap,
  ChevronRight,
  ArrowRight,
  LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import industryData from '@/lib/seo-data/industries.json';
import useCaseData from '@/lib/seo-data/use-cases.json';

interface IndustriesMegaMenuProps {
  className?: string;
  onIndustryClick?: (industry: any) => void;
}

type IconName = 'Heart' | 'Building2' | 'Factory' | 'ShoppingCart' | 'Truck' | 'Shield' | 'Home' | 'GraduationCap' | 'Scale' | 'UtensilsCrossed' | 'Laptop' | 'Zap';

const iconMap: Record<IconName, LucideIcon> = {
  Heart,
  Building2,
  Factory,
  ShoppingCart,
  Truck,
  Shield,
  Home,
  GraduationCap,
  Scale,
  UtensilsCrossed,
  Laptop,
  Zap,
};

// Map industries to icons
const industryIcons: Record<string, IconName> = {
  healthcare: 'Heart',
  finance: 'Building2',
  manufacturing: 'Factory',
  retail: 'ShoppingCart',
  logistics: 'Truck',
  insurance: 'Shield',
  real_estate: 'Home',
  education: 'GraduationCap',
  legal: 'Scale',
  hospitality: 'UtensilsCrossed',
  technology: 'Laptop',
  energy: 'Zap',
};

export function IndustriesMegaMenu({ className, onIndustryClick }: IndustriesMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const industries = Object.entries(industryData);
  const useCases = Object.entries(useCaseData);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredIndustry(null);
    }, 150);
  };

  const handleIndustryClick = (industryKey: string, industryInfo: any) => {
    setIsOpen(false);
    if (onIndustryClick) {
      onIndustryClick({ key: industryKey, ...industryInfo });
    } else {
      router.push(`/ai-solutions/${industryKey}`);
    }
  };

  const handleUseCaseClick = (industryKey: string, useCaseKey: string) => {
    setIsOpen(false);
    router.push(`/ai-solutions/${industryKey}/${useCaseKey}`);
  };

  const getIcon = (industryKey: string) => {
    const iconName = industryIcons[industryKey] || 'Building2';
    return iconMap[iconName];
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
          "text-black/80 hover:text-[#00A878] dark:text-white/80 dark:hover:text-[#00A878]",
          isOpen && "text-[#00A878]"
        )}
      >
        Industries
        <ChevronRight 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-90"
          )} 
        />
      </Button>

      {isOpen && (
        <div className="absolute left-1/2 top-full z-50 w-screen max-w-6xl -translate-x-1/2 pt-2">
          <Card className="overflow-hidden border-gray-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
            <CardContent className="p-0">
              <div className="flex">
                {/* Industries List */}
                <div className="w-1/3 border-r border-gray-200 dark:border-neutral-700">
                  <div className="p-6">
                    <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                      Industries We Serve
                    </h3>
                    <div className="space-y-1">
                      {industries.map(([industryKey, industryInfo]) => {
                        const Icon = getIcon(industryKey);
                        return (
                          <button
                            key={industryKey}
                            onClick={() => handleIndustryClick(industryKey, industryInfo)}
                            onMouseEnter={() => setHoveredIndustry(industryKey)}
                            className={cn(
                              "group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                              "hover:bg-[#00A878]/10 hover:text-[#00A878]",
                              hoveredIndustry === industryKey && "bg-[#00A878]/10 text-[#00A878]"
                            )}
                          >
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                              "bg-gray-100 group-hover:bg-[#00A878]/20 dark:bg-neutral-800",
                              hoveredIndustry === industryKey && "bg-[#00A878]/20"
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{industryInfo.name}</div>
                              <div className="text-xs text-black/60 dark:text-white/60">
                                {industryInfo.compliance} compliant
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Use Cases for Hovered Industry */}
                <div className="flex-1">
                  <div className="p-6">
                    {hoveredIndustry ? (
                      <>
                        <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                          {industryData[hoveredIndustry as keyof typeof industryData].name} Solutions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {useCases.slice(0, 8).map(([useCaseKey, useCaseInfo]) => (
                            <button
                              key={useCaseKey}
                              onClick={() => handleUseCaseClick(hoveredIndustry, useCaseKey)}
                              className="group flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-[#00A878]/10 hover:text-[#00A878]"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm">{useCaseInfo.name}</div>
                                <div className="text-xs text-black/60 dark:text-white/60 line-clamp-2">
                                  {useCaseInfo.description}
                                </div>
                              </div>
                              <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 mt-1" />
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIndustryClick(hoveredIndustry, industryData[hoveredIndustry as keyof typeof industryData])}
                            className="w-full"
                          >
                            View All {industryData[hoveredIndustry as keyof typeof industryData].name} Solutions
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <Building2 className="mx-auto h-12 w-12 text-gray-300 dark:text-neutral-600" />
                          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
                            Hover over an industry to see available solutions
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Featured CTA */}
                <div className="w-80 border-l border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="p-6">
                    <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                      Ready to Get Started?
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-900">
                        <h4 className="font-semibold text-[#00A878]">5-Day Proof of Concept</h4>
                        <p className="mt-1 text-xs text-black/70 dark:text-white/70">
                          Get a working AI prototype with validated ROI in just 5 days.
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-900">
                        <h4 className="font-semibold text-[#00A878]">Industry Expertise</h4>
                        <p className="mt-1 text-xs text-black/70 dark:text-white/70">
                          Solutions built with compliance and domain knowledge built-in.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/contact');
                        }}
                        className="w-full rounded-full bg-[#00A878] text-white hover:bg-[#00936B]"
                      >
                        Schedule Consultation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
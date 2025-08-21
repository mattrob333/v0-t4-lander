"use client";

import { lazy, Suspense, ComponentType, useState, useEffect } from 'react';

// Generic loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Generic loading skeleton
const LoadingSkeleton = ({ height = "200px" }: { height?: string }) => (
  <div 
    className="bg-gray-200 animate-pulse rounded-lg"
    style={{ height }}
  />
);

// Component for lazy loading with error boundary
interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error }>;
  [key: string]: any;
}

export function LazyComponent({ 
  component, 
  fallback: Fallback = LoadingSpinner,
  errorFallback: ErrorFallback,
  ...props 
}: LazyComponentProps) {
  const LazyLoadedComponent = lazy(component);

  return (
    <Suspense fallback={<Fallback />}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  );
}

// Intersection Observer based lazy loader
interface IntersectionLazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function IntersectionLazyLoader({
  children,
  fallback: Fallback = LoadingSkeleton,
  rootMargin = "50px",
  threshold = 0.1,
  className
}: IntersectionLazyLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, rootMargin, threshold, isVisible]);

  return (
    <div ref={setRef} className={className}>
      {isVisible ? children : <Fallback />}
    </div>
  );
}

// Pre-configured lazy loaders for common components
export const LazyFAQSection = () => (
  <LazyComponent 
    component={() => import('@/components/faq-section')} 
    fallback={() => <LoadingSkeleton height="400px" />}
  />
);

export const LazyCaseStudies = () => (
  <LazyComponent 
    component={() => import('@/components/case-studies')} 
    fallback={() => <LoadingSkeleton height="500px" />}
  />
);

export const LazyProcessTimeline = () => (
  <LazyComponent 
    component={() => import('@/components/process-timeline')} 
    fallback={() => <LoadingSkeleton height="600px" />}
  />
);

export const LazyAnalysisEngine = () => (
  <LazyComponent 
    component={() => import('@/components/analysis-engine')} 
    fallback={() => <LoadingSkeleton height="300px" />}
  />
);

export const LazyChatWidget = () => (
  <LazyComponent 
    component={() => import('@/components/chat-widget')} 
    fallback={() => <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />}
  />
);

export const LazyScheduleDialog = () => (
  <LazyComponent 
    component={() => import('@/components/schedule-dialog')} 
    fallback={() => <LoadingSpinner />}
  />
);

// Hook for preloading components
export function usePreloadComponent(componentLoader: () => Promise<any>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      componentLoader();
    }, 2000); // Preload after 2 seconds

    return () => clearTimeout(timer);
  }, [componentLoader]);
}

// Preload components on user interaction
export function useInteractionPreload(componentLoader: () => Promise<any>) {
  useEffect(() => {
    const preload = () => {
      componentLoader();
      // Remove listeners after preloading
      document.removeEventListener('mouseover', preload);
      document.removeEventListener('touchstart', preload);
    };

    document.addEventListener('mouseover', preload, { once: true, passive: true });
    document.addEventListener('touchstart', preload, { once: true, passive: true });

    return () => {
      document.removeEventListener('mouseover', preload);
      document.removeEventListener('touchstart', preload);
    };
  }, [componentLoader]);
}

export default LazyComponent;
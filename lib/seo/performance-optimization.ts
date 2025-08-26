/**
 * Performance Optimization Utilities for Core Web Vitals
 * 
 * Comprehensive performance optimization functions to improve
 * Core Web Vitals scores (LCP, FID, CLS) which are crucial 
 * ranking factors for SEO.
 */

// ============================================================================
// CORE WEB VITALS MONITORING
// ============================================================================

export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
  id: string;
}

/**
 * Core Web Vitals thresholds based on Google's recommendations
 */
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,      // <= 2.5s
    poor: 4000       // > 4s
  },
  // First Input Delay (FID) 
  FID: {
    good: 100,       // <= 100ms
    poor: 300        // > 300ms
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,       // <= 0.1
    poor: 0.25       // > 0.25
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,      // <= 1.8s
    poor: 3000       // > 3s
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,       // <= 0.8s
    poor: 1800       // > 1.8s
  }
};

/**
 * Rate a metric value based on thresholds
 */
export function rateMetric(name: keyof typeof WEB_VITALS_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// ============================================================================
// PERFORMANCE OPTIMIZATION TECHNIQUES
// ============================================================================

/**
 * Generate resource hints for better performance
 */
export function generatePerformanceResourceHints(): string[] {
  const hints: string[] = [];
  
  // DNS prefetch for external resources
  const externalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.googletagmanager.com',
    'www.google-analytics.com',
    'api.tier4intelligence.com'
  ];
  
  externalDomains.forEach(domain => {
    hints.push(`<link rel="dns-prefetch" href="//${domain}" />`);
  });
  
  // Preconnect for critical resources
  const criticalConnections = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  criticalConnections.forEach(url => {
    hints.push(`<link rel="preconnect" href="${url}" crossorigin />`);
  });
  
  // Preload critical assets
  const criticalAssets = [
    {
      href: '/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: true
    },
    {
      href: '/images/tier4-logo-horizontal.png',
      as: 'image'
    }
  ];
  
  criticalAssets.forEach(asset => {
    let preloadTag = `<link rel="preload" href="${asset.href}" as="${asset.as}"`;
    if (asset.type) preloadTag += ` type="${asset.type}"`;
    if (asset.crossorigin) preloadTag += ' crossorigin';
    preloadTag += ' />';
    hints.push(preloadTag);
  });
  
  return hints;
}

/**
 * Generate optimized image loading attributes
 */
export function generateOptimizedImageProps(
  src: string,
  alt: string,
  priority: boolean = false,
  sizes?: string
) {
  const baseProps = {
    src,
    alt,
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const
  };
  
  if (sizes) {
    return {
      ...baseProps,
      sizes
    };
  }
  
  return baseProps;
}

/**
 * Generate critical CSS for above-the-fold content
 */
export function generateCriticalCSS(): string {
  return `
    /* Critical CSS for Core Web Vitals optimization */
    
    /* Prevent layout shift with font loading */
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400 900;
      font-display: swap;
      src: url('/fonts/inter-var.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
    /* Prevent CLS with skeleton loading */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Critical above-the-fold styles */
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Header styles to prevent CLS */
    header {
      position: sticky;
      top: 0;
      height: 4rem;
      z-index: 50;
      backdrop-filter: blur(10px);
    }
    
    /* Hero section to prevent CLS */
    .hero-section {
      min-height: 70vh;
      display: flex;
      align-items: center;
      padding: 5rem 0;
    }
    
    /* Button styles for consistent rendering */
    .btn-primary {
      background: #00A878;
      color: white;
      padding: 0.75rem 2rem;
      border-radius: 9999px;
      border: none;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }
    
    .btn-primary:hover {
      background: #00936B;
      transform: translateY(-1px);
    }
    
    /* Prevent image layout shift */
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    
    /* Container max-widths */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    @media (min-width: 768px) {
      .container {
        padding: 0 1.5rem;
      }
    }
    
    @media (min-width: 1024px) {
      .container {
        padding: 0 2rem;
      }
    }
  `;
}

/**
 * Generate lazy loading intersection observer
 */
export function generateLazyLoadingScript(): string {
  return `
    (function() {
      // Intersection Observer for lazy loading
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              const srcset = img.getAttribute('data-srcset');
              
              if (src) img.src = src;
              if (srcset) img.srcset = srcset;
              
              img.classList.remove('lazy');
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });
        
        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
      
      // Web Vitals measurement
      function measureWebVitals() {
        if ('PerformanceObserver' in window) {
          // Largest Contentful Paint
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            
            // Send to analytics
            if (typeof gtag !== 'undefined') {
              gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: 'LCP',
                value: Math.round(lastEntry.startTime)
              });
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          // First Input Delay
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              console.log('FID:', entry.processingStart - entry.startTime);
              
              if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                  event_category: 'Performance',
                  event_label: 'FID', 
                  value: Math.round(entry.processingStart - entry.startTime)
                });
              }
            });
          }).observe({ entryTypes: ['first-input'] });
          
          // Cumulative Layout Shift
          let clsValue = 0;
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            console.log('CLS:', clsValue);
            
            if (typeof gtag !== 'undefined') {
              gtag('event', 'web_vitals', {
                event_category: 'Performance', 
                event_label: 'CLS',
                value: Math.round(clsValue * 1000)
              });
            }
          }).observe({ entryTypes: ['layout-shift'] });
        }
      }
      
      // Start measuring when DOM is ready
      if (document.readyState === 'complete') {
        measureWebVitals();
      } else {
        window.addEventListener('load', measureWebVitals);
      }
    })();
  `;
}

// ============================================================================
// PERFORMANCE OPTIMIZED COMPONENTS
// ============================================================================

/**
 * Generate service worker for caching strategies
 */
export function generateServiceWorkerCache(): string {
  return `
    const CACHE_NAME = 'tier4-v1';
    const STATIC_ASSETS = [
      '/',
      '/solutions',
      '/contact',
      '/images/tier4-logo-horizontal.png',
      '/fonts/inter-var.woff2',
      '/styles/globals.css'
    ];
    
    // Install event - cache static assets
    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(STATIC_ASSETS))
          .then(() => self.skipWaiting())
      );
    });
    
    // Activate event - cleanup old caches
    self.addEventListener('activate', event => {
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames
              .filter(cacheName => cacheName !== CACHE_NAME)
              .map(cacheName => caches.delete(cacheName))
          );
        }).then(() => self.clients.claim())
      );
    });
    
    // Fetch event - serve from cache, fallback to network
    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            // Return cached version or fetch from network
            return response || fetch(event.request);
          })
      );
    });
  `;
}

/**
 * Generate performance-optimized meta tags
 */
export function generatePerformanceMetaTags(): string[] {
  const tags: string[] = [];
  
  // Optimize resource loading
  tags.push('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />');
  tags.push('<meta name="format-detection" content="telephone=no" />');
  tags.push('<meta name="mobile-web-app-capable" content="yes" />');
  tags.push('<meta name="apple-mobile-web-app-capable" content="yes" />');
  tags.push('<meta name="apple-mobile-web-app-status-bar-style" content="default" />');
  
  // Performance hints
  tags.push('<meta name="color-scheme" content="light dark" />');
  tags.push('<meta name="theme-color" content="#00A878" />');
  tags.push('<meta name="msapplication-TileColor" content="#00A878" />');
  
  return tags;
}

/**
 * Generate critical resource preloads for solutions pages
 */
export function generateSolutionsPagePreloads(categorySlug?: string): string[] {
  const preloads: string[] = [];
  
  // Base preloads for all solution pages
  preloads.push('<link rel="preload" href="/api/solutions" as="fetch" crossorigin />');
  
  // Category-specific preloads
  if (categorySlug) {
    preloads.push(`<link rel="preload" href="/images/categories/${categorySlug}.jpg" as="image" />`);
    preloads.push(`<link rel="prefetch" href="/solutions/${categorySlug}" />`);
  }
  
  // Preload likely next pages
  const likelyNextPages = [
    '/contact',
    '/solutions/customer-self-service',
    '/solutions/agent-employee-copilots'
  ];
  
  likelyNextPages.forEach(page => {
    preloads.push(`<link rel="prefetch" href="${page}" />`);
  });
  
  return preloads;
}

/**
 * Performance monitoring and reporting
 */
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  
  /**
   * Mark a performance timing
   */
  mark(name: string): void {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  }
  
  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark: string): number | null {
    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0] as PerformanceMeasure;
        this.metrics.set(name, measure.duration);
        return measure.duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return null;
      }
    }
    return null;
  }
  
  /**
   * Get all collected metrics
   */
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
  
  /**
   * Report metrics to analytics
   */
  reportToAnalytics(): void {
    const metrics = this.getMetrics();
    
    if (typeof gtag !== 'undefined') {
      Object.entries(metrics).forEach(([name, value]) => {
        gtag('event', 'timing_complete', {
          name,
          value: Math.round(value),
          event_category: 'Performance'
        });
      });
    }
  }
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export default {
  WEB_VITALS_THRESHOLDS,
  rateMetric,
  generatePerformanceResourceHints,
  generateOptimizedImageProps,
  generateCriticalCSS,
  generateLazyLoadingScript,
  generateServiceWorkerCache,
  generatePerformanceMetaTags,
  generateSolutionsPagePreloads,
  PerformanceMonitor
};
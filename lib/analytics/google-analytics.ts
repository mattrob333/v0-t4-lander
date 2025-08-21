// Google Analytics 4 Enhanced Implementation
// Complete setup with conversion tracking, enhanced e-commerce, and custom events

import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

// GA4 Configuration
interface GA4Config {
  measurementId: string;
  cookieFlags: string;
  debugMode?: boolean;
  send_page_view: boolean;
  custom_map?: Record<string, string>;
}

// Enhanced E-commerce Events
interface GAEvent {
  event_name: string;
  event_parameters?: Record<string, any>;
}

interface ConversionGoal {
  conversion_id: string;
  conversion_value: number;
  currency: string;
  transaction_id?: string;
}

class GoogleAnalytics {
  private config: GA4Config;
  private isInitialized: boolean = false;
  private conversionGoals: Record<string, ConversionGoal> = {};

  constructor(measurementId: string, debugMode: boolean = false) {
    this.config = {
      measurementId,
      cookieFlags: 'SameSite=None;Secure',
      debugMode,
      send_page_view: true,
      custom_map: {
        'custom_parameter_1': 'conversion_stage',
        'custom_parameter_2': 'lead_score',
        'custom_parameter_3': 'user_segment',
        'custom_parameter_4': 'content_group',
        'custom_parameter_5': 'traffic_source_detail'
      }
    };

    this.initializeConversionGoals();
  }

  private initializeConversionGoals() {
    this.conversionGoals = {
      'schedule_assessment': {
        conversion_id: 'AW-123456789/abc123',
        conversion_value: 2500,
        currency: 'USD'
      },
      'form_submit': {
        conversion_id: 'AW-123456789/def456',
        conversion_value: 1000,
        currency: 'USD'
      },
      'download_guide': {
        conversion_id: 'AW-123456789/ghi789',
        conversion_value: 500,
        currency: 'USD'
      },
      'phone_call_click': {
        conversion_id: 'AW-123456789/jkl012',
        conversion_value: 3000,
        currency: 'USD'
      },
      'poc_request': {
        conversion_id: 'AW-123456789/mno345',
        conversion_value: 5000,
        currency: 'USD'
      },
      'consultation_book': {
        conversion_id: 'AW-123456789/pqr678',
        conversion_value: 2000,
        currency: 'USD'
      },
      'exit_popup_submit': {
        conversion_id: 'AW-123456789/stu901',
        conversion_value: 750,
        currency: 'USD'
      }
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Load gtag script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', this.config.measurementId, {
        cookie_flags: this.config.cookieFlags,
        debug_mode: this.config.debugMode,
        send_page_view: this.config.send_page_view,
        custom_map: this.config.custom_map,
        // Enhanced measurement settings
        enhanced_measurement: {
          scrolls: true,
          outbound_clicks: true,
          site_search: true,
          video_engagement: true,
          file_downloads: true
        },
        // Consent settings
        ad_storage: 'denied',
        analytics_storage: 'granted',
        personalization_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });

      // Initialize Core Web Vitals tracking
      this.initializeWebVitals();

      // Initialize enhanced user tracking
      this.initializeUserTracking();

      // Initialize conversion tracking
      this.initializeConversionTracking();

      this.isInitialized = true;
      console.log('🚀 Google Analytics 4 initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error);
    }
  }

  private initializeWebVitals(): void {
    // Track Core Web Vitals
    getCLS((metric) => {
      this.trackEvent('web_vitals', {
        metric_name: 'CLS',
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        metric_id: metric.id
      });
    });

    getFID((metric) => {
      this.trackEvent('web_vitals', {
        metric_name: 'FID',
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        metric_id: metric.id
      });
    });

    getFCP((metric) => {
      this.trackEvent('web_vitals', {
        metric_name: 'FCP',
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        metric_id: metric.id
      });
    });

    getLCP((metric) => {
      this.trackEvent('web_vitals', {
        metric_name: 'LCP',
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        metric_id: metric.id,
        lcp_element: metric.element?.tagName || 'unknown'
      });
    });

    getTTFB((metric) => {
      this.trackEvent('web_vitals', {
        metric_name: 'TTFB',
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        metric_id: metric.id
      });
    });
  }

  private initializeUserTracking(): void {
    // Enhanced user tracking
    if (typeof window !== 'undefined') {
      // Track user engagement
      let engagementStartTime = Date.now();
      let isEngaged = false;

      const trackEngagement = () => {
        if (!isEngaged) {
          isEngaged = true;
          this.trackEvent('user_engagement', {
            engagement_time_msec: Date.now() - engagementStartTime
          });
        }
      };

      // Track meaningful interactions
      ['click', 'keydown', 'scroll', 'mousedown'].forEach(eventType => {
        document.addEventListener(eventType, trackEngagement, { 
          once: true, 
          passive: true 
        });
      });

      // Track session duration on page unload
      window.addEventListener('beforeunload', () => {
        const sessionDuration = Date.now() - engagementStartTime;
        this.trackEvent('session_duration', {
          session_duration_msec: sessionDuration,
          engaged_session: isEngaged
        });
      });

      // Track scroll depth
      let maxScrollDepth = 0;
      const trackScrollDepth = () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > maxScrollDepth) {
          maxScrollDepth = scrollPercent;
          
          // Track scroll milestones
          if ([25, 50, 75, 90].includes(scrollPercent)) {
            this.trackEvent('scroll_depth', {
              scroll_depth_percent: scrollPercent,
              scroll_depth_threshold: scrollPercent
            });
          }
        }
      };

      window.addEventListener('scroll', trackScrollDepth, { passive: true });
    }
  }

  private initializeConversionTracking(): void {
    // Set up enhanced conversion tracking
    if (typeof window !== 'undefined' && window.gtag) {
      // Track form interactions
      document.addEventListener('focusin', (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          const form = target.closest('form');
          const formName = form?.getAttribute('name') || form?.id || 'unknown_form';
          
          this.trackEvent('form_start', {
            form_name: formName,
            field_name: target.name || target.id || 'unknown_field'
          });
        }
      });

      // Track outbound link clicks
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const link = target.closest('a') as HTMLAnchorElement;
        
        if (link && link.href && !link.href.includes(window.location.hostname)) {
          this.trackEvent('click', {
            link_domain: new URL(link.href).hostname,
            link_url: link.href,
            outbound: true
          });
        }
      });
    }
  }

  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) {
      console.warn('Google Analytics not initialized');
      return;
    }

    try {
      // Add common parameters
      const enhancedParameters = {
        ...parameters,
        page_location: window.location.href,
        page_title: document.title,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        connection_type: (navigator as any).connection?.effectiveType || 'unknown'
      };

      window.gtag('event', eventName, enhancedParameters);

      // Log in development
      if (this.config.debugMode) {
        console.log('📊 GA4 Event:', eventName, enhancedParameters);
      }

    } catch (error) {
      console.error('Failed to track GA4 event:', error);
    }
  }

  trackConversion(conversionName: string, additionalParams: Record<string, any> = {}): void {
    const goal = this.conversionGoals[conversionName];
    
    if (!goal) {
      console.warn(`Unknown conversion goal: ${conversionName}`);
      return;
    }

    // Track as GA4 conversion event
    this.trackEvent('conversion', {
      conversion_name: conversionName,
      value: goal.conversion_value,
      currency: goal.currency,
      transaction_id: goal.transaction_id || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...additionalParams
    });

    // Track as Google Ads conversion (if applicable)
    if (typeof window !== 'undefined' && window.gtag && goal.conversion_id) {
      window.gtag('event', 'conversion', {
        'send_to': goal.conversion_id,
        'value': goal.conversion_value,
        'currency': goal.currency,
        'transaction_id': goal.transaction_id
      });
    }

    console.log(`💰 Conversion tracked: ${conversionName} ($${goal.conversion_value})`);
  }

  trackPageView(path?: string, title?: string): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) return;

    const pageParams = {
      page_title: title || document.title,
      page_location: path || window.location.href,
      page_referrer: document.referrer,
      content_group1: this.getContentGroup(),
      custom_parameter_4: this.getContentGroup()
    };

    window.gtag('config', this.config.measurementId, pageParams);
    
    // Also track as event for more detailed analytics
    this.trackEvent('page_view', pageParams);
  }

  trackSearch(searchTerm: string, resultsCount?: number): void {
    this.trackEvent('search', {
      search_term: searchTerm,
      search_results_count: resultsCount || 0
    });
  }

  trackVideoEngagement(videoTitle: string, action: 'start' | 'pause' | 'complete' | 'progress', progress?: number): void {
    this.trackEvent('video_' + action, {
      video_title: videoTitle,
      video_progress: progress || 0
    });
  }

  trackFileDownload(fileName: string, fileType: string): void {
    this.trackEvent('file_download', {
      file_name: fileName,
      file_extension: fileType,
      link_url: window.location.href
    });
  }

  private getContentGroup(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const path = window.location.pathname;
    
    if (path.includes('/ai-solutions/')) return 'AI Solutions';
    if (path.includes('/services/')) return 'Services';
    if (path.includes('/resources/')) return 'Resources';
    if (path.includes('/about/')) return 'About';
    if (path === '/') return 'Homepage';
    
    return 'Other';
  }

  updateUserProperties(properties: Record<string, any>): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) return;

    window.gtag('config', this.config.measurementId, {
      custom_map: {
        ...this.config.custom_map,
        ...properties
      }
    });
  }

  enableConsentMode(): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('consent', 'default', {
      'ad_storage': 'denied',
      'analytics_storage': 'granted',
      'personalization_storage': 'denied',
      'functionality_storage': 'granted',
      'security_storage': 'granted'
    });
  }

  updateConsent(consentSettings: Record<string, 'granted' | 'denied'>): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('consent', 'update', consentSettings);
  }
}

// Create singleton instance
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const googleAnalytics = new GoogleAnalytics(GA_MEASUREMENT_ID, IS_DEVELOPMENT);

// Initialize on import in client-side
if (typeof window !== 'undefined') {
  googleAnalytics.initialize();
}

// Export for use in components
export default googleAnalytics;

// Type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
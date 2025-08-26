/**
 * Analytics Integration for Solutions System
 * 
 * Comprehensive analytics tracking for user interactions with solutions,
 * conversion events, and performance monitoring across the solutions ecosystem.
 */

import type { 
  Solution, 
  Category, 
  AnalyticsConfig,
  SolutionsAnalyticsEvents,
  CustomAnalyticsConfig 
} from '@/types/solutions';

// ============================================================================
// ANALYTICS EVENT DEFINITIONS
// ============================================================================

/**
 * Standard analytics events for solutions system
 */
export const SOLUTIONS_EVENTS = {
  // Menu & Navigation Events
  MENU_OPEN: 'solutions_menu_open',
  MENU_CLOSE: 'solutions_menu_close',
  CATEGORY_HOVER: 'solutions_category_hover',
  CATEGORY_CLICK: 'solutions_category_click',
  
  // Page View Events
  SOLUTIONS_LANDING_VIEW: 'solutions_landing_view',
  CATEGORY_PAGE_VIEW: 'category_page_view',
  SOLUTION_PAGE_VIEW: 'solution_page_view',
  
  // Interaction Events
  SOLUTION_CARD_CLICK: 'solution_card_click',
  SOLUTION_TAG_CLICK: 'solution_tag_click',
  SOLUTION_FILTER_APPLY: 'solution_filter_apply',
  SOLUTION_SEARCH: 'solution_search',
  
  // Conversion Events
  CTA_CLICK: 'solution_cta_click',
  CONTACT_FORM_START: 'solution_contact_start',
  CONTACT_FORM_COMPLETE: 'solution_contact_complete',
  OPPORTUNITY_SCAN_REQUEST: 'opportunity_scan_request',
  
  // Engagement Events
  SOLUTION_SHARE: 'solution_share',
  SOLUTION_BOOKMARK: 'solution_bookmark',
  FEATURED_PRODUCT_CLICK: 'featured_product_click',
  RELATED_SOLUTION_CLICK: 'related_solution_click'
} as const;

// ============================================================================
// ANALYTICS TRACKING FUNCTIONS
// ============================================================================

/**
 * Track solutions menu interactions
 */
export function trackMenuInteraction(
  action: 'open' | 'close' | 'category_hover',
  data: {
    source?: 'header' | 'mobile' | 'footer';
    categorySlug?: string;
    categoryTitle?: string;
    duration?: number;
    method?: 'click' | 'hover' | 'keyboard' | 'escape' | 'click_outside';
  } = {}
) {
  const eventName = action === 'open' ? SOLUTIONS_EVENTS.MENU_OPEN :
                   action === 'close' ? SOLUTIONS_EVENTS.MENU_CLOSE :
                   SOLUTIONS_EVENTS.CATEGORY_HOVER;

  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    source: data.source || 'unknown',
    ...data
  };

  // Send to analytics providers
  sendToAnalytics(eventData);
  
  // Send to custom analytics if configured
  sendToCustomAnalytics(eventData, {
    category: 'solutions_navigation',
    action: action,
    label: data.categorySlug || 'menu'
  });
}

/**
 * Track page views with enhanced context
 */
export function trackSolutionPageView(
  pageType: 'landing' | 'category' | 'solution',
  data: {
    categorySlug?: string;
    categoryTitle?: string;
    solutionSlug?: string;
    solutionTitle?: string;
    source?: string;
    referrer?: string;
    searchQuery?: string;
    userAgent?: string;
  } = {}
) {
  const eventName = pageType === 'landing' ? SOLUTIONS_EVENTS.SOLUTIONS_LANDING_VIEW :
                   pageType === 'category' ? SOLUTIONS_EVENTS.CATEGORY_PAGE_VIEW :
                   SOLUTIONS_EVENTS.SOLUTION_PAGE_VIEW;

  const eventData = {
    event: eventName,
    page_type: pageType,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof window !== 'undefined' ? document.referrer : data.referrer,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : data.userAgent,
    ...data
  };

  sendToAnalytics(eventData);
  
  // Enhanced page view tracking
  if (pageType === 'solution' && data.solutionSlug && data.categorySlug) {
    const customData = {
      category: 'solutions_content',
      action: 'solution_view',
      label: `${data.categorySlug}/${data.solutionSlug}`,
      customDimensions: {
        solution_category: data.categoryTitle,
        solution_name: data.solutionTitle,
        traffic_source: data.source
      }
    };
    sendToCustomAnalytics(eventData, customData);
  }
}

/**
 * Track solution interaction events
 */
export function trackSolutionInteraction(
  solution: Solution,
  category: Category,
  action: 'card_click' | 'tag_click' | 'cta_click' | 'share' | 'bookmark',
  context: {
    source?: 'category_page' | 'featured_section' | 'search_results' | 'related_solutions';
    position?: number;
    variant?: 'default' | 'featured' | 'compact';
    ctaText?: string;
    ctaTarget?: string;
    shareMethod?: 'email' | 'linkedin' | 'twitter' | 'copy_link';
    additionalData?: Record<string, any>;
  } = {}
) {
  const eventName = action === 'card_click' ? SOLUTIONS_EVENTS.SOLUTION_CARD_CLICK :
                   action === 'tag_click' ? SOLUTIONS_EVENTS.SOLUTION_TAG_CLICK :
                   action === 'cta_click' ? SOLUTIONS_EVENTS.CTA_CLICK :
                   action === 'share' ? SOLUTIONS_EVENTS.SOLUTION_SHARE :
                   SOLUTIONS_EVENTS.SOLUTION_BOOKMARK;

  const eventData = {
    event: eventName,
    solution_slug: solution.slug,
    solution_title: solution.title,
    category_slug: category.slug,
    category_title: category.title,
    solution_priority: solution.flags.priority,
    solution_featured: solution.flags.featured,
    solution_popular: solution.flags.popular,
    solution_complexity: solution.metrics.complexity,
    solution_implementation_weeks: solution.metrics.implementationWeeks,
    solution_roi_months: solution.metrics.roiTimelineMonths,
    solution_tags: solution.tags.join(', '),
    solution_industries: solution.metrics.industryFit.join(', '),
    timestamp: new Date().toISOString(),
    ...context
  };

  sendToAnalytics(eventData);

  // Track conversion events with enhanced data
  if (action === 'cta_click') {
    trackConversionEvent('solution_cta_click', {
      solutionSlug: solution.slug,
      categorySlug: category.slug,
      ctaText: context.ctaText,
      ctaTarget: context.ctaTarget,
      value: calculateSolutionValue(solution),
      currency: 'USD'
    });
  }
}

/**
 * Track category interaction events
 */
export function trackCategoryInteraction(
  category: Category,
  action: 'view' | 'tile_click' | 'filter_apply',
  context: {
    source?: 'home_page' | 'solutions_landing' | 'mega_menu' | 'breadcrumb';
    position?: number;
    appliedFilters?: string[];
    resultsCount?: number;
    additionalData?: Record<string, any>;
  } = {}
) {
  const eventName = action === 'view' ? SOLUTIONS_EVENTS.CATEGORY_PAGE_VIEW :
                   action === 'tile_click' ? SOLUTIONS_EVENTS.CATEGORY_CLICK :
                   SOLUTIONS_EVENTS.SOLUTION_FILTER_APPLY;

  const eventData = {
    event: eventName,
    category_slug: category.slug,
    category_title: category.title,
    category_solutions_count: category.solutions.length,
    category_featured_count: category.solutions.filter(s => s.flags.featured).length,
    category_popular_count: category.solutions.filter(s => s.flags.popular).length,
    category_sort_order: category.displayConfig.sortOrder,
    timestamp: new Date().toISOString(),
    ...context
  };

  sendToAnalytics(eventData);
}

/**
 * Track search interactions
 */
export function trackSolutionSearch(
  query: string,
  results: Array<{solution: Solution; category: Category}>,
  context: {
    source?: 'header_search' | 'page_search' | 'filter_search';
    selectedResult?: {solution: Solution; category: Category; position: number};
    appliedFilters?: string[];
    searchTime?: number;
  } = {}
) {
  const eventData = {
    event: SOLUTIONS_EVENTS.SOLUTION_SEARCH,
    search_query: query,
    search_results_count: results.length,
    search_source: context.source || 'unknown',
    search_time_ms: context.searchTime,
    has_results: results.length > 0,
    applied_filters: context.appliedFilters?.join(', ') || '',
    timestamp: new Date().toISOString()
  };

  // Add result details if available
  if (results.length > 0) {
    eventData.top_result_solution = results[0].solution.slug;
    eventData.top_result_category = results[0].category.slug;
    eventData.results_categories = [...new Set(results.map(r => r.category.slug))].join(', ');
  }

  // Add selection data if user clicked a result
  if (context.selectedResult) {
    eventData.selected_result_solution = context.selectedResult.solution.slug;
    eventData.selected_result_category = context.selectedResult.category.slug;
    eventData.selected_result_position = context.selectedResult.position;
  }

  sendToAnalytics(eventData);
}

/**
 * Track conversion events with enhanced attribution
 */
export function trackConversionEvent(
  eventType: 'solution_cta_click' | 'contact_form_start' | 'contact_form_complete' | 'opportunity_scan_request',
  data: {
    solutionSlug?: string;
    categorySlug?: string;
    ctaText?: string;
    ctaTarget?: string;
    formType?: string;
    value?: number;
    currency?: string;
    leadScore?: number;
    additionalData?: Record<string, any>;
  } = {}
) {
  const eventData = {
    event: eventType,
    conversion_type: eventType,
    conversion_value: data.value || 0,
    conversion_currency: data.currency || 'USD',
    lead_score: data.leadScore,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    user_journey_step: getUserJourneyStep(),
    ...data
  };

  sendToAnalytics(eventData);

  // Send to conversion tracking APIs
  sendToConversionTracking(eventData);
  
  // Update user journey state
  updateUserJourney(eventType, data);
}

// ============================================================================
// ANALYTICS PROVIDERS INTEGRATION
// ============================================================================

/**
 * Send events to primary analytics provider (Google Analytics)
 */
function sendToAnalytics(eventData: Record<string, any>) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventData.event, {
      event_category: eventData.category || 'solutions',
      event_label: eventData.label,
      value: eventData.value,
      custom_parameters: {
        ...eventData,
        timestamp: eventData.timestamp
      }
    });
  }

  // Google Tag Manager
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventData.event,
      ...eventData
    });
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventData);
  }
}

/**
 * Send events to custom analytics system
 */
function sendToCustomAnalytics(eventData: Record<string, any>, config: CustomAnalyticsConfig) {
  const customEvent = {
    ...eventData,
    ...config,
    session_id: getSessionId(),
    user_id: getUserId(),
    device_info: getDeviceInfo(),
    page_info: getPageInfo()
  };

  // Send to custom analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customEvent)
    }).catch(error => {
      console.warn('Custom analytics tracking failed:', error);
    });
  }
}

/**
 * Send conversion events to specialized tracking
 */
function sendToConversionTracking(eventData: Record<string, any>) {
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_category: eventData.categorySlug,
      content_name: eventData.solutionSlug,
      value: eventData.conversion_value || 0,
      currency: eventData.conversion_currency || 'USD'
    });
  }

  // LinkedIn Insight Tag
  if (typeof window !== 'undefined' && window.lintrk) {
    window.lintrk('track', { conversion_id: process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_ID });
  }

  // HubSpot tracking
  if (typeof window !== 'undefined' && window._hsq) {
    window._hsq.push(['trackEvent', {
      id: eventData.event,
      value: eventData.conversion_value || 0
    }]);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate estimated value of a solution interaction
 */
function calculateSolutionValue(solution: Solution): number {
  // Base value calculation based on solution characteristics
  let baseValue = 100; // Base interaction value

  // Adjust for priority (higher priority = higher value)
  baseValue *= (4 - solution.flags.priority);

  // Boost for featured/popular solutions
  if (solution.flags.featured) baseValue *= 1.5;
  if (solution.flags.popular) baseValue *= 1.3;
  if (solution.flags.enterprise) baseValue *= 2.0;

  // Adjust for complexity (higher complexity = higher value)
  const complexityMultiplier = {
    low: 1.0,
    medium: 1.5,
    high: 2.0
  };
  baseValue *= complexityMultiplier[solution.metrics.complexity];

  // Adjust for ROI timeline (shorter ROI = higher value)
  if (solution.metrics.roiTimelineMonths <= 3) baseValue *= 1.8;
  else if (solution.metrics.roiTimelineMonths <= 6) baseValue *= 1.4;

  return Math.round(baseValue);
}

/**
 * Get or generate session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = sessionStorage.getItem('t4i_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('t4i_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Get or generate user ID
 */
function getUserId(): string {
  if (typeof window === 'undefined') return 'server-user';
  
  let userId = localStorage.getItem('t4i_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('t4i_user_id', userId);
  }
  return userId;
}

/**
 * Get device information
 */
function getDeviceInfo() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { type: 'server', os: 'unknown', browser: 'unknown' };
  }

  const ua = navigator.userAgent;
  return {
    type: /Mobi|Android/i.test(ua) ? 'mobile' : 'desktop',
    os: /Mac OS/i.test(ua) ? 'mac' : /Windows/i.test(ua) ? 'windows' : /Linux/i.test(ua) ? 'linux' : 'unknown',
    browser: /Chrome/i.test(ua) ? 'chrome' : /Firefox/i.test(ua) ? 'firefox' : /Safari/i.test(ua) ? 'safari' : 'unknown',
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`
  };
}

/**
 * Get page information
 */
function getPageInfo() {
  if (typeof window === 'undefined') {
    return { url: 'server-render', title: 'Server Render', referrer: '' };
  }

  return {
    url: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    title: document.title,
    referrer: document.referrer
  };
}

/**
 * Get current user journey step
 */
function getUserJourneyStep(): string {
  if (typeof window === 'undefined') return 'server';
  
  const path = window.location.pathname;
  
  if (path === '/') return 'homepage';
  if (path === '/solutions') return 'solutions_landing';
  if (path.startsWith('/solutions/') && path.split('/').length === 3) return 'category_page';
  if (path.startsWith('/solutions/') && path.split('/').length === 4) return 'solution_page';
  if (path === '/contact') return 'contact';
  if (path === '/book') return 'booking';
  
  return 'other';
}

/**
 * Update user journey tracking
 */
function updateUserJourney(event: string, data: Record<string, any>) {
  if (typeof window === 'undefined') return;

  const journey = JSON.parse(localStorage.getItem('t4i_user_journey') || '[]');
  
  journey.push({
    event,
    timestamp: new Date().toISOString(),
    page: getUserJourneyStep(),
    ...data
  });

  // Keep only last 20 journey steps
  if (journey.length > 20) {
    journey.splice(0, journey.length - 20);
  }

  localStorage.setItem('t4i_user_journey', JSON.stringify(journey));
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Track performance metrics for solutions pages
 */
export function trackPerformanceMetrics(
  pageType: 'landing' | 'category' | 'solution',
  metrics: {
    loadTime?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    cumulativeLayoutShift?: number;
    firstInputDelay?: number;
    interactionToNextPaint?: number;
  }
) {
  const performanceData = {
    event: 'performance_metrics',
    page_type: pageType,
    timestamp: new Date().toISOString(),
    ...metrics
  };

  sendToAnalytics(performanceData);

  // Alert if performance is below thresholds
  if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
    console.warn('LCP performance issue:', metrics.largestContentfulPaint);
  }
  
  if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > 0.1) {
    console.warn('CLS performance issue:', metrics.cumulativeLayoutShift);
  }
}

/**
 * Track error events
 */
export function trackError(
  errorType: 'javascript' | 'api' | 'render' | 'navigation',
  error: Error | string,
  context: {
    solutionSlug?: string;
    categorySlug?: string;
    component?: string;
    action?: string;
    additionalData?: Record<string, any>;
  } = {}
) {
  const errorData = {
    event: 'error_occurred',
    error_type: errorType,
    error_message: typeof error === 'string' ? error : error.message,
    error_stack: typeof error === 'object' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    page_url: typeof window !== 'undefined' ? window.location.href : 'server',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    ...context
  };

  sendToAnalytics(errorData);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Analytics Error Tracking:', errorData);
  }
}

export default {
  // Event tracking
  trackMenuInteraction,
  trackSolutionPageView,
  trackSolutionInteraction,
  trackCategoryInteraction,
  trackSolutionSearch,
  trackConversionEvent,
  
  // Performance & monitoring
  trackPerformanceMetrics,
  trackError,
  
  // Utilities
  calculateSolutionValue,
  getSessionId,
  getUserId,
  getUserJourneyStep
};
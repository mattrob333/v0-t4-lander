// Web Vitals and Performance Analytics
(function() {
  'use strict';

  // Web Vitals tracking with Core Web Vitals
  function initWebVitals() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      
      // Track Largest Contentful Paint (LCP)
      function observeLCP() {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            // Send LCP data
            sendMetric('LCP', lastEntry.startTime, {
              target: lastEntry.element?.tagName || 'unknown',
              url: lastEntry.url || 'unknown',
              size: lastEntry.size || 0
            });
          });
          
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.warn('LCP measurement not supported');
        }
      }

      // Track First Input Delay (FID)
      function observeFID() {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              sendMetric('FID', entry.processingStart - entry.startTime, {
                eventType: entry.name,
                target: entry.target?.tagName || 'unknown'
              });
            });
          });
          
          observer.observe({ type: 'first-input', buffered: true });
        } catch (e) {
          console.warn('FID measurement not supported');
        }
      }

      // Track Cumulative Layout Shift (CLS)
      function observeCLS() {
        try {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            
            // Send CLS data when page visibility changes
            if (clsValue > 0) {
              sendMetric('CLS', clsValue, {
                sessionDuration: Date.now() - performance.timeOrigin
              });
            }
          });
          
          observer.observe({ type: 'layout-shift', buffered: true });
          
          // Send final CLS value on page unload
          window.addEventListener('beforeunload', () => {
            if (clsValue > 0) {
              sendMetric('CLS', clsValue, { final: true });
            }
          });
        } catch (e) {
          console.warn('CLS measurement not supported');
        }
      }

      // Track Time to First Byte (TTFB)
      function measureTTFB() {
        try {
          const { responseStart, requestStart } = performance.getEntriesByType('navigation')[0];
          const ttfb = responseStart - requestStart;
          
          sendMetric('TTFB', ttfb, {
            navigationTiming: true
          });
        } catch (e) {
          console.warn('TTFB measurement failed');
        }
      }

      // Initialize all measurements
      observeLCP();
      observeFID();
      observeCLS();
      measureTTFB();
    }
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    // Track resource loading performance
    function trackResourcePerformance() {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            // Track image loading performance
            if (entry.name.includes('.webp') || entry.name.includes('.jpg') || entry.name.includes('.png')) {
              sendMetric('ImageLoad', entry.duration, {
                resource: entry.name,
                size: entry.transferSize || 0,
                cached: entry.transferSize === 0
              });
            }
            
            // Track CSS loading performance
            if (entry.name.includes('.css')) {
              sendMetric('CSSLoad', entry.duration, {
                resource: entry.name,
                size: entry.transferSize || 0
              });
            }
            
            // Track JS loading performance
            if (entry.name.includes('.js')) {
              sendMetric('JSLoad', entry.duration, {
                resource: entry.name,
                size: entry.transferSize || 0
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
      }
    }

    // Track user interactions
    function trackUserInteractions() {
      ['click', 'keydown', 'scroll'].forEach(eventType => {
        document.addEventListener(eventType, debounce(() => {
          sendMetric('Interaction', Date.now() - performance.timeOrigin, {
            type: eventType,
            engaged: true
          });
        }, 1000), { passive: true });
      });
    }

    trackResourcePerformance();
    trackUserInteractions();
  }

  // Error tracking
  function initErrorTracking() {
    window.addEventListener('error', (event) => {
      sendMetric('JSError', 1, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      sendMetric('PromiseError', 1, {
        reason: event.reason?.toString() || 'Unknown promise rejection'
      });
    });
  }

  // Send metrics to analytics endpoint
  function sendMetric(name, value, metadata = {}) {
    // In development, log to console
    if (location.hostname === 'localhost') {
      console.log(`📊 ${name}:`, {
        value: Math.round(value * 100) / 100,
        metadata,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // In production, send to analytics
    try {
      const data = {
        metric: name,
        value: Math.round(value * 100) / 100,
        metadata,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connection: navigator.connection?.effectiveType || 'unknown'
      };

      // Use sendBeacon for reliable delivery
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/analytics', JSON.stringify(data));
      } else {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(() => {}); // Ignore errors silently
      }
    } catch (e) {
      // Fail silently in production
    }
  }

  // Utility: Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Page visibility tracking
  function initVisibilityTracking() {
    let startTime = Date.now();
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const sessionDuration = Date.now() - startTime;
        sendMetric('SessionDuration', sessionDuration, {
          engaged: sessionDuration > 5000 // 5+ seconds considered engaged
        });
      } else {
        startTime = Date.now();
      }
    });
  }

  // Connection quality monitoring
  function initConnectionMonitoring() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      sendMetric('ConnectionType', 0, {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      });

      connection.addEventListener('change', () => {
        sendMetric('ConnectionChange', 0, {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      });
    }
  }

  // Initialize all monitoring when DOM is ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initWebVitals();
        initPerformanceMonitoring();
        initErrorTracking();
        initVisibilityTracking();
        initConnectionMonitoring();
      });
    } else {
      initWebVitals();
      initPerformanceMonitoring();
      initErrorTracking();
      initVisibilityTracking();
      initConnectionMonitoring();
    }
  }

  // Start monitoring
  init();

  // Log successful initialization
  console.log('🚀 Performance monitoring initialized');
})();
// Lighthouse CI Configuration with Performance Budgets
// Automated performance testing and monitoring

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/ai-solutions/healthcare/automation',
        'http://localhost:3000/ai-solutions/finance/fraud-detection',
        'http://localhost:3000/services/5-day-poc',
        'http://localhost:3000/services/ai-opportunity-assessment'
      ],
      startServerCommand: 'npm run build && npm run start',
      startServerReadyPattern: 'ready on',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: [
          'canonical',
          'robots-txt',
          'tap-targets',
          'hreflang'
        ]
      }
    },
    assert: {
      assertions: {
        // Performance assertions
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],
        
        // Core Web Vitals thresholds
        'first-contentful-paint': ['error', {maxNumericValue: 1800}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'speed-index': ['error', {maxNumericValue: 3400}],
        'interactive': ['error', {maxNumericValue: 5800}],
        
        // Resource optimization
        'total-byte-weight': ['warn', {maxNumericValue: 1500000}], // 1.5MB
        'unused-javascript': ['warn', {maxNumericValue: 40000}], // 40KB
        'unused-css-rules': ['warn', {maxNumericValue: 20000}], // 20KB
        'render-blocking-resources': ['warn', {maxNumericValue: 500}], // 500ms
        
        // Image optimization
        'modern-image-formats': 'error',
        'uses-optimized-images': ['warn', {maxNumericValue: 50000}], // 50KB
        'uses-responsive-images': ['warn', {maxNumericValue: 50000}], // 50KB
        'efficient-animated-content': 'error',
        
        // JavaScript and CSS
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        'uses-text-compression': 'error',
        
        // Caching and loading
        'uses-long-cache-ttl': ['warn', {maxNumericValue: 0.75}],
        'uses-rel-preconnect': 'off', // Can be noisy
        'uses-rel-preload': 'off', // Can be noisy
        
        // User Experience
        'non-composited-animations': 'error',
        'layout-shift-elements': 'error',
      }
    },
    budget: [
      {
        path: '/',
        timings: [
          {
            metric: 'first-contentful-paint',
            budget: 1800,
            tolerance: 100
          },
          {
            metric: 'largest-contentful-paint',
            budget: 2500,
            tolerance: 200
          },
          {
            metric: 'speed-index',
            budget: 3400,
            tolerance: 300
          },
          {
            metric: 'cumulative-layout-shift',
            budget: 0.1,
            tolerance: 0.02
          },
          {
            metric: 'interactive',
            budget: 5800,
            tolerance: 500
          }
        ],
        resourceSizes: [
          {
            resourceType: 'document',
            budget: 50
          },
          {
            resourceType: 'script',
            budget: 300
          },
          {
            resourceType: 'stylesheet',
            budget: 50
          },
          {
            resourceType: 'image',
            budget: 500
          },
          {
            resourceType: 'font',
            budget: 100
          },
          {
            resourceType: 'total',
            budget: 1500
          }
        ],
        resourceCounts: [
          {
            resourceType: 'document',
            budget: 1
          },
          {
            resourceType: 'script',
            budget: 15
          },
          {
            resourceType: 'stylesheet',
            budget: 5
          },
          {
            resourceType: 'image',
            budget: 20
          },
          {
            resourceType: 'font',
            budget: 5
          },
          {
            resourceType: 'total',
            budget: 50
          }
        ]
      },
      {
        path: '/ai-solutions/**',
        timings: [
          {
            metric: 'first-contentful-paint',
            budget: 2000,
            tolerance: 150
          },
          {
            metric: 'largest-contentful-paint',
            budget: 2800,
            tolerance: 250
          },
          {
            metric: 'cumulative-layout-shift',
            budget: 0.1,
            tolerance: 0.02
          }
        ],
        resourceSizes: [
          {
            resourceType: 'total',
            budget: 1200
          }
        ]
      }
    ],
    upload: {
      target: 'temporary-public-storage',
      reportFilenamePattern: 'lighthouse-%%DATETIME%%-%%PATHNAME%%-report.%%EXTENSION%%'
    },
    server: {
      port: 9001,
      storage: './lighthouse-server-storage'
    }
  }
};
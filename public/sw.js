// Service Worker for Tier 4 Intelligence - Advanced Caching Strategy

// Skip service worker in development
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  console.log('🛑 Service Worker disabled in development mode');
  // Don't register any event listeners in development
} else {

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `tier4-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `tier4-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `tier4-images-${CACHE_VERSION}`;

// Cache duration constants (in seconds)
const CACHE_DURATIONS = {
  STATIC: 86400 * 365, // 1 year for static assets
  IMAGES: 86400 * 30,  // 30 days for images
  PAGES: 86400,        // 1 day for pages
  API: 300,            // 5 minutes for API responses
};

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/scripts/analytics.js',
  '/images/optimized/tier4-logo-horizontal.webp',
  '/images/optimized/tier4-logo-horizontal-dark.webp',
];

// Critical pages to cache
const CRITICAL_PAGES = [
  '/',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('💾 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache critical pages
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('📄 Caching critical pages');
        return Promise.all(
          CRITICAL_PAGES.map(url =>
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => {}) // Ignore errors during install
          )
        );
      })
    ]).then(() => {
      console.log('✅ Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== IMAGE_CACHE
          ) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - advanced caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except fonts and analytics)
  if (url.origin !== location.origin && 
      !url.href.includes('fonts.gstatic.com') &&
      !url.href.includes('google-analytics.com')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Advanced request handling with stale-while-revalidate and cache-first strategies
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Strategy 1: Cache-first for static assets
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // Strategy 2: Cache-first for images with long-term caching
    if (isImageRequest(pathname)) {
      return await cacheFirst(request, IMAGE_CACHE);
    }

    // Strategy 3: Stale-while-revalidate for pages
    if (isPageRequest(pathname)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }

    // Strategy 4: Network-first for API requests
    if (isApiRequest(pathname)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // Default: Network-first for everything else
    return await networkFirst(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('SW fetch error:', error);
    return fetch(request);
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if cache is still fresh
    const cacheDate = new Date(cachedResponse.headers.get('date'));
    const now = new Date();
    const maxAge = isImageRequest(request.url) ? CACHE_DURATIONS.IMAGES : CACHE_DURATIONS.STATIC;
    
    if ((now - cacheDate) / 1000 < maxAge) {
      return cachedResponse;
    }
  }

  // Fetch fresh version
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return stale cache if network fails
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-while-revalidate strategy (for pages)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Start revalidation in background
  const revalidate = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {}); // Ignore revalidation errors

  // Return cached version immediately if available
  if (cachedResponse) {
    // Don't await revalidation
    revalidate;
    return cachedResponse;
  }

  // Otherwise wait for network
  return await revalidate;
}

// Network-first strategy (for API and dynamic content)
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Helper functions for request classification
function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/') ||
         pathname.startsWith('/scripts/') ||
         pathname.startsWith('/fonts/') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.woff');
}

function isImageRequest(pathname) {
  return pathname.startsWith('/images/') ||
         pathname.endsWith('.webp') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.gif') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico');
}

function isPageRequest(pathname) {
  return !pathname.startsWith('/api/') &&
         !pathname.startsWith('/_next/') &&
         !isStaticAsset(pathname) &&
         !isImageRequest(pathname);
}

function isApiRequest(pathname) {
  return pathname.startsWith('/api/');
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(processBackgroundSync());
  }
});

async function processBackgroundSync() {
  // Handle offline form submissions
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  
  for (const request of requests) {
    if (request.url.includes('/api/submit-lead') && request.method === 'POST') {
      try {
        await fetch(request);
        await cache.delete(request);
        console.log('📤 Offline form submission synced');
      } catch (error) {
        console.log('🔄 Form submission still pending');
      }
    }
  }
}

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/images/optimized/tier4-logo-horizontal.webp',
    badge: '/images/optimized/tier4-logo-horizontal.webp',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('Tier 4 Intelligence', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

console.log('🛡️ Tier 4 Intelligence Service Worker loaded');

} // End of else block for production environment
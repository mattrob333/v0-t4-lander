import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// import { DebugEnvironment } from "@/components/debug-environment"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Use font-display: swap for better performance
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: "5-Day AI POC | 3-4x ROI Validation | Tier 4 Intelligence",
  description: "Get AI clarity in days, not months. Vendor-neutral AI consulting delivering rapid POCs with proven ROI. No buzzwords, just results for San Francisco enterprises.",
  keywords: "AI consulting, 5-day POC, rapid AI implementation, vendor-neutral AI, AI proof-of-concept, AI ROI validation, executive AI strategy, San Francisco AI consulting",
  authors: [{ name: "Tier 4 Intelligence" }],
  creator: "Tier 4 Intelligence",
  publisher: "Tier 4 Intelligence",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tier4intelligence.com'),
  alternates: {
    canonical: 'https://tier4intelligence.com',
  },
  openGraph: {
    title: "5-Day AI POC with 3-4x ROI | Tier 4 Intelligence",
    description: "Rapid AI implementation without the buzzwords. Get a working proof-of-concept in 5 days with validated ROI for your enterprise.",
    url: "https://tier4intelligence.com",
    siteName: "Tier 4 Intelligence",
    images: [
      {
        url: "https://tier4intelligence.com/images/optimized/tier4-hero-1024w.jpg",
        width: 1200,
        height: 630,
        alt: "Tier 4 Intelligence - 5-Day AI POC with Validated ROI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "5-Day AI POC with 3-4x ROI | Tier 4 Intelligence",
    description: "Rapid AI implementation without the buzzwords. Get working proof of concept in 5 days.",
    images: ["https://tier4intelligence.com/images/optimized/tier4-hero-1024w.jpg"],
    creator: "@tier4intel",
    site: "@tier4intel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        {/* Resource Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tier4intelligence.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        
        {/* Font Preload - Critical for LCP optimization */}
        {/* Removed specific font file preloading to avoid 404 errors */}
        
        {/* Prefetch critical pages */}
        
        {/* Meta tags for crawlers */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="GPTBot" content="index, follow" />
        <meta name="ChatGPT-User" content="index, follow" />
        <meta name="CCBot" content="index, follow" />
        <meta name="anthropic-ai" content="index, follow" />
        <meta name="claude-web" content="index, follow" />
        
        
        {/* Structured Data - Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://tier4intelligence.com/#organization",
                  "name": "Tier 4 Intelligence",
                  "url": "https://tier4intelligence.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://tier4intelligence.com/images/optimized/tier4-logo-horizontal.webp",
                    "width": 600,
                    "height": 60
                  },
                  "description": "AI consulting firm specializing in 5-day proof of concepts with 3-4x ROI validation, vendor-neutral assessments, and executive AI education",
                  "telephone": "+1-415-XXX-XXXX",
                  "email": "contact@tier4intelligence.com",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "San Francisco",
                    "addressRegion": "CA",
                    "addressCountry": "US"
                  },
                  "sameAs": [
                    "https://www.linkedin.com/company/tier4intelligence",
                    "https://twitter.com/tier4intel",
                    "https://github.com/tier4intelligence"
                  ],
                  "knowsAbout": [
                    "Artificial Intelligence",
                    "Machine Learning",
                    "AI Proof of Concept",
                    "Rapid AI Implementation",
                    "Vendor-Neutral AI Consulting",
                    "AI ROI Validation",
                    "Executive AI Strategy"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://tier4intelligence.com/#website",
                  "url": "https://tier4intelligence.com",
                  "name": "Tier 4 Intelligence",
                  "publisher": {"@id": "https://tier4intelligence.com/#organization"},
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://tier4intelligence.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Service",
                  "serviceType": "AI Consulting",
                  "provider": {"@id": "https://tier4intelligence.com/#organization"},
                  "areaServed": "United States",
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "AI Consulting Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "5-Day AI Proof of Concept",
                          "description": "Rapid POC development delivering working AI prototype in 5 days with 3-4x ROI validation"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Opportunity Assessment",
                          "description": "Vendor-neutral evaluation identifying highest-ROI AI opportunities for your business"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "60-Minute Executive AI Briefing",
                          "description": "No-buzzword AI strategy session for C-suite executives"
                        }
                      }
                    ]
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
        
        {/* Load non-critical scripts deferred */}
        <script defer src="/scripts/analytics.js"></script>
        
        {/* Temporary: Clear existing service workers */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Clear any existing service workers in development
              if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                      console.log('🗑️ Cleared existing service worker:', registration);
                    }
                  });
                }
              }
            `
          }}
        />
        
        {/* Service Worker Registration - Only in production */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Completely skip service worker in development
              if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                console.log('🛑 Service Worker registration skipped in development mode');
              } else if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('🛡️ Service Worker registered:', registration);
                  }).catch(function(error) {
                    console.log('❌ Service Worker registration failed:', error);
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  )
}

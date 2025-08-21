const fs = require('fs').promises;
const path = require('path');

// Industry and use case combinations for programmatic pages
const industries = [
  'healthcare', 'finance', 'retail', 'manufacturing', 
  'logistics', 'insurance', 'real-estate', 'education', 
  'legal', 'hospitality', 'technology', 'energy'
];

const useCases = [
  'automation', 'prediction', 'optimization', 
  'personalization', 'fraud-detection', 'classification', 
  'content-generation', 'data-extraction', 'recommendation', 
  'forecasting', 'quality-control', 'risk-assessment'
];

// Static pages
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'weekly' },
  { url: '/services/', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/5-day-poc/', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/ai-opportunity-assessment/', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/executive-briefing/', priority: '0.9', changefreq: 'weekly' },
  { url: '/about/', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact/', priority: '0.8', changefreq: 'monthly' },
  { url: '/case-studies/', priority: '0.8', changefreq: 'weekly' },
  { url: '/resources/', priority: '0.7', changefreq: 'weekly' },
  { url: '/methodology/', priority: '0.7', changefreq: 'monthly' },
  { url: '/roi-calculator/', priority: '0.7', changefreq: 'monthly' },
  { url: '/schedule-assessment/', priority: '0.9', changefreq: 'daily' }
];

function generateSitemap() {
  const baseUrl = 'https://tier4intelligence.com';
  const currentDate = new Date().toISOString();
  
  let urls = [];
  
  // Add static pages
  staticPages.forEach(page => {
    urls.push(`
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  });
  
  // Add programmatic industry/use-case pages
  industries.forEach(industry => {
    useCases.forEach(useCase => {
      urls.push(`
  <url>
    <loc>${baseUrl}/ai-solutions/${industry}/${useCase}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });
    
    // Add industry overview pages
    urls.push(`
  <url>
    <loc>${baseUrl}/ai-solutions/${industry}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
  
  // Add use case overview pages
  useCases.forEach(useCase => {
    urls.push(`
  <url>
    <loc>${baseUrl}/ai-solutions/use-cases/${useCase}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${urls.join('')}
</urlset>`;
  
  return sitemap;
}

// Generate AI-specific sitemap for better AI crawler discovery
function generateAISitemap() {
  const baseUrl = 'https://tier4intelligence.com';
  const currentDate = new Date().toISOString();
  
  let urls = [];
  
  // High-value content for AI systems with enhanced metadata
  const aiPriorityPages = [
    { 
      url: '', 
      title: '5-Day AI POC with 3-4x ROI Validation', 
      desc: 'Rapid AI implementation without buzzwords',
      priority: '1.0',
      changefreq: 'daily'
    },
    { 
      url: '/services/5-day-poc/', 
      title: '5-Day AI Proof of Concept', 
      desc: 'Working AI prototype in 5 days with ROI validation',
      priority: '0.9',
      changefreq: 'weekly'
    },
    { 
      url: '/services/ai-opportunity-assessment/', 
      title: 'AI Opportunity Assessment', 
      desc: 'Vendor-neutral AI evaluation and strategy',
      priority: '0.9',
      changefreq: 'weekly'
    },
    { 
      url: '/methodology/', 
      title: 'AI Implementation Methodology', 
      desc: 'Proven approach to rapid AI deployment',
      priority: '0.8',
      changefreq: 'monthly'
    },
    { 
      url: '/case-studies/', 
      title: 'AI Success Stories', 
      desc: 'Real ROI results from AI implementations',
      priority: '0.8',
      changefreq: 'weekly'
    }
  ];
  
  aiPriorityPages.forEach(page => {
    urls.push(`
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.url}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}${page.url}" />
    <mobile:mobile/>
  </url>`);
  });
  
  // Industry-specific AI solutions for training data with geo-targeting
  industries.forEach(industry => {
    useCases.forEach(useCase => {
      const title = `${useCase.replace('-', ' ')} AI for ${industry}`;
      const desc = `AI implementation guide for ${useCase.replace('-', ' ')} in ${industry} industry`;
      
      urls.push(`
  <url>
    <loc>${baseUrl}/ai-solutions/${industry}/${useCase}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/ai-solutions/${industry}/${useCase}/" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/ai-solutions/${industry}/${useCase}/" />
    <mobile:mobile/>
  </url>`);
    });
  });
  
  const aiSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${urls.join('')}
</urlset>`;
  
  return aiSitemap;
}

// Generate geo-targeted sitemap for local SEO
function generateGeoSitemap() {
  const baseUrl = 'https://tier4intelligence.com';
  const currentDate = new Date().toISOString();
  
  // Target locations for AI consulting services
  const locations = [
    { city: 'san-francisco', state: 'ca', name: 'San Francisco', lat: '37.7749', lng: '-122.4194' },
    { city: 'palo-alto', state: 'ca', name: 'Palo Alto', lat: '37.4419', lng: '-122.1430' },
    { city: 'mountain-view', state: 'ca', name: 'Mountain View', lat: '37.3861', lng: '-122.0839' },
    { city: 'san-jose', state: 'ca', name: 'San Jose', lat: '37.3382', lng: '-121.8863' },
    { city: 'oakland', state: 'ca', name: 'Oakland', lat: '37.8044', lng: '-122.2712' },
    { city: 'berkeley', state: 'ca', name: 'Berkeley', lat: '37.8715', lng: '-122.2730' },
    { city: 'redwood-city', state: 'ca', name: 'Redwood City', lat: '37.4852', lng: '-122.2364' },
    { city: 'sunnyvale', state: 'ca', name: 'Sunnyvale', lat: '37.3688', lng: '-122.0363' }
  ];
  
  let urls = [];
  
  locations.forEach(location => {
    // Main location page
    urls.push(`
  <url>
    <loc>${baseUrl}/locations/${location.city}-${location.state}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <geo:geo>
      <geo:format>kml</geo:format>
    </geo:geo>
  </url>`);
    
    // Location-specific service pages
    ['5-day-poc', 'ai-assessment', 'executive-briefing'].forEach(service => {
      urls.push(`
  <url>
    <loc>${baseUrl}/locations/${location.city}-${location.state}/${service}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
    });
  });
  
  const geoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:geo="http://www.google.com/geo/schemas/sitemap/1.0">
  ${urls.join('')}
</urlset>`;
  
  return geoSitemap;
}

// Generate image sitemap for better image discovery
function generateImageSitemap() {
  const baseUrl = 'https://tier4intelligence.com';
  const currentDate = new Date().toISOString();
  
  // Image assets with metadata
  const images = [
    {
      url: '/images/optimized/tier4-hero-1024w.webp',
      caption: 'Tier 4 Intelligence AI Consulting Hero Image',
      title: '5-Day AI POC Implementation',
      license: 'https://tier4intelligence.com/image-license',
      location: '/services/5-day-poc/'
    },
    {
      url: '/images/optimized/ai-blueprint-clarity-1024w.webp',
      caption: 'AI Blueprint Clarity Visualization',
      title: 'Clear AI Implementation Strategy',
      license: 'https://tier4intelligence.com/image-license',
      location: '/methodology/'
    },
    {
      url: '/images/optimized/strategic-roadmap-executive-1024w.webp',
      caption: 'Strategic AI Roadmap for Executives',
      title: 'Executive AI Strategy Framework',
      license: 'https://tier4intelligence.com/image-license',
      location: '/services/executive-briefing/'
    },
    {
      url: '/images/optimized/with-tier4-roadmap-1024w.webp',
      caption: 'Organized AI Implementation with Tier 4',
      title: 'Structured AI Development Process',
      license: 'https://tier4intelligence.com/image-license',
      location: '/about/'
    },
    {
      url: '/images/optimized/without-tier4-chaos-1024w.webp',
      caption: 'Chaotic AI Implementation Without Structure',
      title: 'Unstructured AI Development Problems',
      license: 'https://tier4intelligence.com/image-license',
      location: '/case-studies/'
    }
  ];
  
  let urls = [];
  
  images.forEach(img => {
    urls.push(`
  <url>
    <loc>${baseUrl}${img.location}</loc>
    <lastmod>${currentDate}</lastmod>
    <image:image>
      <image:loc>${baseUrl}${img.url}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
      <image:license>${img.license}</image:license>
    </image:image>
  </url>`);
  });
  
  const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${urls.join('')}
</urlset>`;
  
  return imageSitemap;
}

// Generate video sitemap (placeholder for future video content)
function generateVideoSitemap() {
  const baseUrl = 'https://tier4intelligence.com';
  const currentDate = new Date().toISOString();
  
  // Placeholder video content structure
  const videos = [
    {
      title: '5-Day AI POC Process Overview',
      description: 'Complete walkthrough of our rapid AI implementation process',
      thumbnail: '/images/video-thumbnails/5-day-poc-overview.jpg',
      url: '/videos/5-day-poc-process.mp4',
      duration: 180,
      location: '/services/5-day-poc/'
    },
    {
      title: 'AI ROI Validation Case Study',
      description: 'Real example of achieving 3-4x ROI with AI implementation',
      thumbnail: '/images/video-thumbnails/roi-case-study.jpg',
      url: '/videos/roi-validation-case-study.mp4',
      duration: 240,
      location: '/case-studies/'
    }
  ];
  
  let urls = [];
  
  videos.forEach(video => {
    urls.push(`
  <url>
    <loc>${baseUrl}${video.location}</loc>
    <lastmod>${currentDate}</lastmod>
    <video:video>
      <video:thumbnail_loc>${baseUrl}${video.thumbnail}</video:thumbnail_loc>
      <video:title>${video.title}</video:title>
      <video:description>${video.description}</video:description>
      <video:content_loc>${baseUrl}${video.url}</video:content_loc>
      <video:duration>${video.duration}</video:duration>
      <video:publication_date>${currentDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
    </video:video>
  </url>`);
  });
  
  const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${urls.join('')}
</urlset>`;
  
  return videoSitemap;
}

async function generateAllSitemaps() {
  try {
    const currentDate = new Date().toISOString();
    
    // Generate main sitemap
    const mainSitemap = generateSitemap();
    await fs.writeFile('./public/sitemap.xml', mainSitemap);
    console.log('✓ Main sitemap generated: ./public/sitemap.xml');
    
    // Generate AI-optimized sitemap
    const aiSitemap = generateAISitemap();
    await fs.writeFile('./public/sitemap-ai.xml', aiSitemap);
    console.log('✓ AI sitemap generated: ./public/sitemap-ai.xml');
    
    // Generate geo-targeted sitemap
    const geoSitemap = generateGeoSitemap();
    await fs.writeFile('./public/sitemap-geo.xml', geoSitemap);
    console.log('✓ Geo sitemap generated: ./public/sitemap-geo.xml');
    
    // Generate image sitemap
    const imageSitemap = generateImageSitemap();
    await fs.writeFile('./public/sitemap-images.xml', imageSitemap);
    console.log('✓ Image sitemap generated: ./public/sitemap-images.xml');
    
    // Generate video sitemap
    const videoSitemap = generateVideoSitemap();
    await fs.writeFile('./public/sitemap-video.xml', videoSitemap);
    console.log('✓ Video sitemap generated: ./public/sitemap-video.xml');
    
    // Generate comprehensive sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://tier4intelligence.com/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://tier4intelligence.com/sitemap-ai.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://tier4intelligence.com/sitemap-geo.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://tier4intelligence.com/sitemap-images.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://tier4intelligence.com/sitemap-video.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
    
    await fs.writeFile('./public/sitemap-index.xml', sitemapIndex);
    console.log('✓ Comprehensive sitemap index generated: ./public/sitemap-index.xml');
    
    // Calculate geo-specific statistics
    const geoLocations = 8;
    const geoServices = 3;
    const geoPages = geoLocations * (1 + geoServices);
    const imageEntries = 5;
    const videoEntries = 2;
    
    console.log(`\n📊 Comprehensive Sitemap Statistics:`);
    console.log(`• Static pages: ${staticPages.length}`);
    console.log(`• Industry pages: ${industries.length}`);
    console.log(`• Use case pages: ${useCases.length}`);
    console.log(`• Programmatic pages: ${industries.length * useCases.length}`);
    console.log(`• Geo-targeted pages: ${geoPages}`);
    console.log(`• Image entries: ${imageEntries}`);
    console.log(`• Video entries: ${videoEntries}`);
    console.log(`• Total URLs: ${staticPages.length + industries.length + useCases.length + (industries.length * useCases.length) + geoPages}`);
    console.log(`• Total specialized entries: ${imageEntries + videoEntries}`);
    console.log(`• Sitemaps generated: 6 (main, AI, geo, images, video, index)`);
    
  } catch (error) {
    console.error('Error generating sitemaps:', error);
  }
}

// Export for use in other scripts
module.exports = {
  generateSitemap,
  generateAISitemap,
  generateGeoSitemap,
  generateImageSitemap,
  generateVideoSitemap,
  generateAllSitemaps,
  industries,
  useCases
};

// Run if called directly
if (require.main === module) {
  generateAllSitemaps();
}
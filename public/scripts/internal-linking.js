// TIER 4 INTELLIGENCE - AUTOMATIC INTERNAL LINKING SYSTEM
// Advanced SEO Internal Linking with Smart Keyword Detection

(function() {
  'use strict';

  // Enhanced keyword mapping with priority levels
  const KEYWORD_MAPPING = {
    // High Priority - Core Services (Priority 1)
    '5-day POC': { url: '/services/5-day-poc/', priority: 1, limit: 2 },
    'AI assessment': { url: '/services/ai-opportunity-assessment/', priority: 1, limit: 2 },
    'executive briefing': { url: '/services/executive-briefing/', priority: 1, limit: 2 },
    'vendor-neutral': { url: '/about/vendor-neutral-approach/', priority: 1, limit: 2 },
    'ROI validation': { url: '/resources/roi-calculator/', priority: 1, limit: 2 },
    
    // Medium Priority - Solutions (Priority 2)
    'rapid implementation': { url: '/methodology/rapid-ai-implementation/', priority: 2, limit: 1 },
    'AI consulting': { url: '/services/', priority: 2, limit: 1 },
    'artificial intelligence': { url: '/ai-solutions/', priority: 2, limit: 1 },
    'machine learning': { url: '/ai-solutions/technology/automation/', priority: 2, limit: 1 },
    
    // Industry Specific (Priority 3)
    'healthcare AI': { url: '/ai-solutions/healthcare/', priority: 3, limit: 1 },
    'finance AI': { url: '/ai-solutions/finance/', priority: 3, limit: 1 },
    'retail AI': { url: '/ai-solutions/retail/', priority: 3, limit: 1 },
    'manufacturing AI': { url: '/ai-solutions/manufacturing/', priority: 3, limit: 1 },
    'insurance AI': { url: '/ai-solutions/insurance/', priority: 3, limit: 1 },
    'logistics AI': { url: '/ai-solutions/logistics/', priority: 3, limit: 1 },
    'real estate AI': { url: '/ai-solutions/real-estate/', priority: 3, limit: 1 },
    'education AI': { url: '/ai-solutions/education/', priority: 3, limit: 1 },
    'legal AI': { url: '/ai-solutions/legal/', priority: 3, limit: 1 },
    'hospitality AI': { url: '/ai-solutions/hospitality/', priority: 3, limit: 1 },
    'technology AI': { url: '/ai-solutions/technology/', priority: 3, limit: 1 },
    'energy AI': { url: '/ai-solutions/energy/', priority: 3, limit: 1 },
    
    // Use Case Specific (Priority 4)
    'fraud detection': { url: '/ai-solutions/finance/fraud-detection/', priority: 4, limit: 1 },
    'predictive analytics': { url: '/ai-solutions/healthcare/prediction/', priority: 4, limit: 1 },
    'automation': { url: '/ai-solutions/manufacturing/automation/', priority: 4, limit: 1 },
    'risk assessment': { url: '/ai-solutions/insurance/risk-assessment/', priority: 4, limit: 1 },
    'personalization': { url: '/ai-solutions/retail/personalization/', priority: 4, limit: 1 },
    'optimization': { url: '/ai-solutions/logistics/optimization/', priority: 4, limit: 1 },
    'classification': { url: '/ai-solutions/healthcare/classification/', priority: 4, limit: 1 },
    'forecasting': { url: '/ai-solutions/retail/forecasting/', priority: 4, limit: 1 },
    'recommendation': { url: '/ai-solutions/retail/recommendation/', priority: 4, limit: 1 },
    'quality control': { url: '/ai-solutions/manufacturing/quality-control/', priority: 4, limit: 1 },
    'content generation': { url: '/ai-solutions/technology/content-generation/', priority: 4, limit: 1 },
    'data extraction': { url: '/ai-solutions/legal/data-extraction/', priority: 4, limit: 1 },
    
    // Compliance (Priority 3)
    'HIPAA': { url: '/compliance/hipaa/', priority: 3, limit: 1 },
    'SOX': { url: '/compliance/sox/', priority: 3, limit: 1 },
    'GDPR': { url: '/compliance/gdpr/', priority: 3, limit: 1 },
    'PCI DSS': { url: '/compliance/pci-dss/', priority: 3, limit: 1 },
    'compliance': { url: '/compliance/', priority: 3, limit: 1 }
  };

  // Track linking statistics
  let linkingStats = {
    totalLinksAdded: 0,
    keywordsProcessed: 0,
    processingTime: 0
  };

  // Advanced text processing with context awareness
  function createInternalLinks() {
    const startTime = performance.now();
    
    // Only process if not already done
    if (document.body.getAttribute('data-internal-links-processed')) {
      return;
    }

    // Get main content areas (avoid navigation, footer, etc.)
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.post-content',
      '.page-content',
      '[role="main"]'
    ];

    let targetElement = null;
    for (const selector of contentSelectors) {
      targetElement = document.querySelector(selector);
      if (targetElement) break;
    }

    if (!targetElement) {
      targetElement = document.body;
    }

    // Get all text nodes
    const textNodes = getTextNodes(targetElement);
    const linkCounts = {};
    
    // Sort keywords by priority and length
    const sortedKeywords = Object.entries(KEYWORD_MAPPING)
      .sort(([a, configA], [b, configB]) => {
        // First by priority (lower number = higher priority)
        if (configA.priority !== configB.priority) {
          return configA.priority - configB.priority;
        }
        // Then by length (longer first to avoid partial matches)
        return b.length - a.length;
      });

    // Process each keyword
    sortedKeywords.forEach(([keyword, config]) => {
      const currentCount = linkCounts[keyword] || 0;
      
      // Skip if limit reached
      if (currentCount >= config.limit) {
        return;
      }

      linkCounts[keyword] = currentCount;
      
      // Create regex for whole word matching
      const regex = new RegExp(
        `\\b(${escapeRegex(keyword)})\\b`,
        'gi'
      );

      // Process text nodes
      textNodes.forEach(node => {
        if (!node.parentNode || linkCounts[keyword] >= config.limit) {
          return;
        }

        // Skip if parent is already a link or in navigation
        if (isInInvalidContext(node)) {
          return;
        }

        const text = node.textContent;
        const matches = text.match(regex);
        
        if (matches && linkCounts[keyword] < config.limit) {
          const remainingLinks = config.limit - linkCounts[keyword];
          const linksToAdd = Math.min(matches.length, remainingLinks);
          
          // Replace text with linked version
          const newHTML = text.replace(regex, (match, g1) => {
            if (linkCounts[keyword] < config.limit) {
              linkCounts[keyword]++;
              linkingStats.totalLinksAdded++;
              
              return `<a href="${config.url}" class="internal-link text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" title="Learn more about ${g1}" data-keyword="${keyword.toLowerCase()}">${g1}</a>`;
            }
            return match;
          });

          // Create new element and replace text node
          if (newHTML !== text) {
            const wrapper = document.createElement('span');
            wrapper.innerHTML = newHTML;
            
            // Replace text node with new content
            const parent = node.parentNode;
            while (wrapper.firstChild) {
              parent.insertBefore(wrapper.firstChild, node);
            }
            parent.removeChild(node);
          }
        }
      });
      
      linkingStats.keywordsProcessed++;
    });

    // Mark as processed
    document.body.setAttribute('data-internal-links-processed', 'true');
    
    // Calculate timing
    linkingStats.processingTime = performance.now() - startTime;
    
    // Log statistics (remove in production)
    console.log('Internal Linking Stats:', linkingStats);
    
    // Dispatch completion event
    document.dispatchEvent(new CustomEvent('internalLinksProcessed', {
      detail: linkingStats
    }));
  }

  // Get all text nodes from an element
  function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip empty or whitespace-only nodes
          if (!node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    return textNodes;
  }

  // Check if node is in invalid context for linking
  function isInInvalidContext(node) {
    let parent = node.parentNode;
    
    while (parent && parent !== document.body) {
      const tagName = parent.tagName ? parent.tagName.toLowerCase() : '';
      const className = parent.className || '';
      
      // Skip links, navigation, scripts, styles, etc.
      if (tagName === 'a' || 
          tagName === 'script' || 
          tagName === 'style' || 
          tagName === 'nav' ||
          tagName === 'header' ||
          tagName === 'footer' ||
          className.includes('nav') ||
          className.includes('menu') ||
          className.includes('breadcrumb') ||
          parent.getAttribute('role') === 'navigation') {
        return true;
      }
      
      parent = parent.parentNode;
    }
    
    return false;
  }

  // Escape special regex characters
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Enhanced link hover effects
  function addLinkEnhancements() {
    document.addEventListener('mouseover', function(e) {
      if (e.target.classList.contains('internal-link')) {
        const keyword = e.target.getAttribute('data-keyword');
        
        // Add tooltip or preview functionality here
        e.target.setAttribute('data-tooltip', `Explore ${keyword} solutions`);
      }
    });

    // Track link clicks for analytics
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('internal-link')) {
        const keyword = e.target.getAttribute('data-keyword');
        const url = e.target.getAttribute('href');
        
        // Send analytics event (replace with your analytics system)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'internal_link_click', {
            'keyword': keyword,
            'destination_url': url,
            'source_page': window.location.pathname
          });
        }
        
        console.log('Internal link clicked:', { keyword, url, source: window.location.pathname });
      }
    });
  }

  // Initialize the system
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(createInternalLinks, 100);
        addLinkEnhancements();
      });
    } else {
      setTimeout(createInternalLinks, 100);
      addLinkEnhancements();
    }

    // Re-process on dynamic content changes
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if significant content was added
            const hasTextContent = Array.from(mutation.addedNodes).some(node => 
              node.nodeType === Node.ELEMENT_NODE && 
              node.textContent && 
              node.textContent.trim().length > 50
            );
            
            if (hasTextContent) {
              // Reset processing flag and reprocess
              document.body.removeAttribute('data-internal-links-processed');
              setTimeout(createInternalLinks, 200);
            }
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Start the system
  init();

  // Expose API for manual triggering
  window.TierFourInternalLinking = {
    reprocess: function() {
      document.body.removeAttribute('data-internal-links-processed');
      createInternalLinks();
    },
    getStats: function() {
      return linkingStats;
    },
    addKeyword: function(keyword, url, priority = 4, limit = 1) {
      KEYWORD_MAPPING[keyword] = { url, priority, limit };
    }
  };

})();
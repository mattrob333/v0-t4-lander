/**
 * Search Engine Submission Automation
 * Automates sitemap submission and URL indexing requests to multiple search engines
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class SearchEngineSubmission {
  constructor(baseUrl = 'https://tier4intelligence.com') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.sitemaps = [
      '/sitemap-index.xml',
      '/sitemap.xml',
      '/sitemap-ai.xml',
      '/sitemap-geo.xml',
      '/sitemap-images.xml',
      '/sitemap-video.xml'
    ];
    
    this.priorityPages = [
      '/',
      '/services/5-day-poc/',
      '/services/ai-opportunity-assessment/',
      '/services/executive-briefing/',
      '/ai-solutions/healthcare/automation/',
      '/ai-solutions/finance/fraud-detection/',
      '/ai-solutions/retail/personalization/',
      '/ai-solutions/manufacturing/quality-control/',
      '/case-studies/',
      '/about/',
      '/contact/',
      '/schedule-assessment/'
    ];

    this.searchEngines = {
      google: {
        ping: 'https://www.google.com/ping',
        indexNow: 'https://api.indexnow.org/indexnow',
        searchConsole: 'https://www.googleapis.com/webmasters/v3/sites'
      },
      bing: {
        ping: 'https://www.bing.com/ping',
        indexNow: 'https://api.indexnow.org/indexnow',
        webmasterTools: 'https://ssl.bing.com/webmaster/api.svc/json'
      },
      yandex: {
        ping: 'https://webmaster.yandex.com/ping'
      },
      baidu: {
        ping: 'http://ping.baidu.com/ping/RPC2'
      }
    };
  }

  /**
   * Submit all sitemaps to search engines
   */
  async submitAllSitemaps() {
    console.log('🔍 Starting search engine submission process...\n');
    
    const results = {
      successful: [],
      failed: [],
      errors: []
    };

    for (const sitemap of this.sitemaps) {
      const sitemapUrl = this.baseUrl + sitemap;
      console.log(`📄 Submitting sitemap: ${sitemapUrl}`);
      
      // Submit to each search engine
      for (const [engine, config] of Object.entries(this.searchEngines)) {
        try {
          if (config.ping) {
            const success = await this.pingSearchEngine(engine, config.ping, sitemapUrl);
            if (success) {
              results.successful.push(`${engine}: ${sitemap}`);
              console.log(`  ✅ ${engine}: Success`);
            } else {
              results.failed.push(`${engine}: ${sitemap}`);
              console.log(`  ❌ ${engine}: Failed`);
            }
          }
        } catch (error) {
          results.errors.push(`${engine}: ${sitemap} - ${error.message}`);
          console.log(`  ⚠️  ${engine}: Error - ${error.message}`);
        }
      }
      console.log('');
    }

    return results;
  }

  /**
   * Ping search engine with sitemap URL
   */
  async pingSearchEngine(engine, pingUrl, sitemapUrl) {
    return new Promise((resolve) => {
      const fullUrl = `${pingUrl}?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const urlObj = new URL(fullUrl);
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'Tier4Intelligence-SEO-Bot/1.0 (+https://tier4intelligence.com/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      };

      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const success = res.statusCode >= 200 && res.statusCode < 300;
          resolve(success);
        });
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  }

  /**
   * Submit URLs using IndexNow protocol
   */
  async submitWithIndexNow(urls = this.priorityPages) {
    console.log('🚀 Submitting URLs via IndexNow protocol...\n');
    
    const indexNowKey = this.generateIndexNowKey();
    const fullUrls = urls.map(url => url.startsWith('http') ? url : this.baseUrl + url);
    
    const payload = {
      host: new URL(this.baseUrl).hostname,
      key: indexNowKey,
      keyLocation: `${this.baseUrl}/${indexNowKey}.txt`,
      urlList: fullUrls
    };

    console.log(`📝 Submitting ${fullUrls.length} URLs to IndexNow`);
    
    try {
      const success = await this.postToIndexNow(payload);
      if (success) {
        console.log('✅ IndexNow submission successful');
        
        // Create key file for verification
        await this.createIndexNowKeyFile(indexNowKey);
        
        return { success: true, urls: fullUrls };
      } else {
        console.log('❌ IndexNow submission failed');
        return { success: false, urls: fullUrls };
      }
    } catch (error) {
      console.log(`⚠️  IndexNow error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate IndexNow key
   */
  generateIndexNowKey() {
    return 'tier4intelligence-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * POST to IndexNow API
   */
  async postToIndexNow(payload) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(payload);
      
      const options = {
        hostname: 'api.indexnow.org',
        port: 443,
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'User-Agent': 'Tier4Intelligence-IndexNow/1.0'
        },
        timeout: 15000
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          const success = res.statusCode >= 200 && res.statusCode < 300;
          if (success) {
            resolve(true);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(data);
      req.end();
    });
  }

  /**
   * Create IndexNow key verification file
   */
  async createIndexNowKeyFile(key) {
    const fs = require('fs').promises;
    const keyFilePath = `./public/${key}.txt`;
    
    try {
      await fs.writeFile(keyFilePath, key);
      console.log(`📄 Created IndexNow key file: ${key}.txt`);
      return true;
    } catch (error) {
      console.log(`⚠️  Failed to create key file: ${error.message}`);
      return false;
    }
  }

  /**
   * Submit individual URL for immediate indexing
   */
  async submitUrgentUrl(url) {
    console.log(`🚨 Urgent submission for: ${url}`);
    
    const fullUrl = url.startsWith('http') ? url : this.baseUrl + url;
    const results = {};

    // Submit to Google via ping
    try {
      const googleSuccess = await this.pingSearchEngine(
        'google', 
        this.searchEngines.google.ping, 
        fullUrl
      );
      results.google = googleSuccess;
      console.log(`  Google: ${googleSuccess ? '✅' : '❌'}`);
    } catch (error) {
      results.google = false;
      console.log(`  Google: ⚠️  ${error.message}`);
    }

    // Submit to Bing via ping
    try {
      const bingSuccess = await this.pingSearchEngine(
        'bing', 
        this.searchEngines.bing.ping, 
        fullUrl
      );
      results.bing = bingSuccess;
      console.log(`  Bing: ${bingSuccess ? '✅' : '❌'}`);
    } catch (error) {
      results.bing = false;
      console.log(`  Bing: ⚠️  ${error.message}`);
    }

    // Submit via IndexNow
    try {
      const indexNowResult = await this.submitWithIndexNow([url]);
      results.indexNow = indexNowResult.success;
      console.log(`  IndexNow: ${indexNowResult.success ? '✅' : '❌'}`);
    } catch (error) {
      results.indexNow = false;
      console.log(`  IndexNow: ⚠️  ${error.message}`);
    }

    return results;
  }

  /**
   * Check indexing status of URLs
   */
  async checkIndexingStatus(urls = this.priorityPages) {
    console.log('🔍 Checking indexing status...\n');
    
    const results = {
      indexed: [],
      notIndexed: [],
      errors: []
    };

    for (const url of urls) {
      const fullUrl = url.startsWith('http') ? url : this.baseUrl + url;
      console.log(`Checking: ${fullUrl}`);
      
      try {
        // Check Google indexing via site: search
        const isIndexed = await this.checkGoogleIndexing(fullUrl);
        if (isIndexed) {
          results.indexed.push(fullUrl);
          console.log('  ✅ Indexed');
        } else {
          results.notIndexed.push(fullUrl);
          console.log('  ❌ Not indexed');
        }
      } catch (error) {
        results.errors.push({ url: fullUrl, error: error.message });
        console.log(`  ⚠️  Error: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Check if URL is indexed in Google
   */
  async checkGoogleIndexing(url) {
    return new Promise((resolve) => {
      const searchQuery = `site:${encodeURIComponent(url)}`;
      const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
      
      const options = {
        hostname: 'www.google.com',
        port: 443,
        path: `/search?q=${searchQuery}`,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Tier4Intelligence-Bot/1.0; +https://tier4intelligence.com/bot)'
        },
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // Check if results contain the URL (basic heuristic)
          const isIndexed = data.includes(url) && !data.includes('did not match any documents');
          resolve(isIndexed);
        });
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  }

  /**
   * Generate comprehensive submission report
   */
  async generateSubmissionReport() {
    console.log('📊 Generating comprehensive SEO submission report...\n');
    
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      sitemaps: this.sitemaps.length,
      priorityPages: this.priorityPages.length,
      results: {}
    };

    // Submit sitemaps
    console.log('=== SITEMAP SUBMISSION ===');
    report.results.sitemapSubmission = await this.submitAllSitemaps();

    // Submit priority URLs via IndexNow
    console.log('=== INDEXNOW SUBMISSION ===');
    report.results.indexNowSubmission = await this.submitWithIndexNow();

    // Check indexing status
    console.log('=== INDEXING STATUS CHECK ===');
    report.results.indexingStatus = await this.checkIndexingStatus();

    // Generate summary
    const summary = this.generateSummary(report.results);
    report.summary = summary;

    console.log('\n📋 SUBMISSION SUMMARY');
    console.log('====================');
    console.log(`✅ Successful submissions: ${summary.successfulSubmissions}`);
    console.log(`❌ Failed submissions: ${summary.failedSubmissions}`);
    console.log(`📄 Sitemaps submitted: ${this.sitemaps.length}`);
    console.log(`🔗 URLs submitted via IndexNow: ${this.priorityPages.length}`);
    console.log(`📈 Currently indexed URLs: ${summary.indexedUrls}`);
    console.log(`📉 Not indexed URLs: ${summary.notIndexedUrls}`);

    return report;
  }

  /**
   * Generate summary statistics
   */
  generateSummary(results) {
    return {
      successfulSubmissions: results.sitemapSubmission.successful.length,
      failedSubmissions: results.sitemapSubmission.failed.length,
      indexNowSuccess: results.indexNowSubmission.success,
      indexedUrls: results.indexingStatus.indexed.length,
      notIndexedUrls: results.indexingStatus.notIndexed.length,
      totalErrors: results.sitemapSubmission.errors.length + results.indexingStatus.errors.length
    };
  }

  /**
   * Schedule automatic submissions
   */
  scheduleSubmissions(intervalHours = 24) {
    console.log(`⏰ Scheduling automatic submissions every ${intervalHours} hours`);
    
    const interval = intervalHours * 60 * 60 * 1000; // Convert to milliseconds
    
    // Initial submission
    this.generateSubmissionReport().catch(console.error);
    
    // Schedule recurring submissions
    setInterval(() => {
      console.log('\n🔄 Running scheduled submission...');
      this.generateSubmissionReport().catch(console.error);
    }, interval);

    return interval;
  }
}

// Export for use as module
module.exports = SearchEngineSubmission;

// Run if called directly
if (require.main === module) {
  const submission = new SearchEngineSubmission();
  
  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--schedule')) {
    const hours = parseInt(args[args.indexOf('--schedule') + 1]) || 24;
    submission.scheduleSubmissions(hours);
  } else if (args.includes('--urgent')) {
    const url = args[args.indexOf('--urgent') + 1];
    if (url) {
      submission.submitUrgentUrl(url).catch(console.error);
    } else {
      console.log('Please provide a URL for urgent submission');
    }
  } else if (args.includes('--check')) {
    submission.checkIndexingStatus().then(results => {
      console.log('\nIndexing Status Results:');
      console.log('Indexed:', results.indexed.length);
      console.log('Not Indexed:', results.notIndexed.length);
      console.log('Errors:', results.errors.length);
    }).catch(console.error);
  } else {
    // Default: run full submission report
    submission.generateSubmissionReport().catch(console.error);
  }
}
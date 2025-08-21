// Google Search Console Integration and SEO Performance Monitoring
// Complete system for tracking rankings, indexing, and organic performance

interface SearchConsoleConfig {
  siteUrl: string;
  credentials?: string;
  refreshToken?: string;
}

interface SearchAnalyticsQuery {
  startDate: string;
  endDate: string;
  dimensions?: ('country' | 'device' | 'page' | 'query' | 'searchAppearance')[];
  filters?: SearchAnalyticsFilter[];
  aggregationType?: 'auto' | 'byPage' | 'byProperty';
  rowLimit?: number;
  startRow?: number;
}

interface SearchAnalyticsFilter {
  dimension: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains';
  expression: string;
}

interface SearchAnalyticsResponse {
  rows: SearchAnalyticsRow[];
  responseAggregationType: string;
}

interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface IndexingStatus {
  originalUrl: string;
  inspectionResult: {
    indexStatusResult: {
      coverageState: string;
      robotsTxtState: string;
      indexingState: string;
      lastCrawlTime: string;
      pageFetchState: string;
      googleCanonical: string;
      userCanonical: string;
    };
    mobileUsabilityResult?: {
      verdict: string;
      issues: Array<{
        issueType: string;
        message: string;
      }>;
    };
    richResultsResult?: {
      detectedItems: Array<{
        richResultType: string;
        items: Array<{
          name: string;
        }>;
      }>;
    };
  };
}

interface SEOMetrics {
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  indexedPages: number;
  crawlErrors: number;
  mobileUsabilityIssues: number;
  richResultsCount: number;
  topQueries: SearchAnalyticsRow[];
  topPages: SearchAnalyticsRow[];
  performanceByDevice: SearchAnalyticsRow[];
  performanceByCountry: SearchAnalyticsRow[];
}

class SearchConsoleMonitor {
  private config: SearchConsoleConfig;
  private apiBaseUrl = 'https://www.googleapis.com/webmasters/v3';
  private accessToken: string | null = null;

  constructor(config: SearchConsoleConfig) {
    this.config = config;
  }

  // Initialize authentication (for server-side use)
  async authenticate(): Promise<boolean> {
    try {
      if (this.config.refreshToken) {
        // Use refresh token to get access token
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            refresh_token: this.config.refreshToken,
            grant_type: 'refresh_token',
          }),
        });

        const data = await response.json();
        this.accessToken = data.access_token;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Search Console authentication failed:', error);
      return false;
    }
  }

  // Get search analytics data
  async getSearchAnalytics(query: SearchAnalyticsQuery): Promise<SearchAnalyticsResponse | null> {
    if (!this.accessToken) {
      console.warn('Search Console not authenticated');
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/sites/${encodeURIComponent(this.config.siteUrl)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(query),
        }
      );

      if (!response.ok) {
        throw new Error(`Search Console API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch search analytics:', error);
      return null;
    }
  }

  // Get URL inspection results
  async inspectUrl(url: string): Promise<IndexingStatus | null> {
    if (!this.accessToken) {
      console.warn('Search Console not authenticated');
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/urlInspection/index:inspect`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inspectionUrl: url,
            siteUrl: this.config.siteUrl,
            languageCode: 'en-US'
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`URL Inspection API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to inspect URL:', error);
      return null;
    }
  }

  // Submit URL for indexing
  async submitUrlForIndexing(url: string): Promise<boolean> {
    if (!this.accessToken) {
      console.warn('Search Console not authenticated');
      return false;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/urlNotifications:publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            type: 'URL_UPDATED'
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Failed to submit URL for indexing:', error);
      return false;
    }
  }

  // Get comprehensive SEO metrics
  async getSEOMetrics(startDate: string, endDate: string): Promise<SEOMetrics | null> {
    const baseQuery = {
      startDate,
      endDate,
      rowLimit: 1000
    };

    try {
      // Get overall performance
      const overallData = await this.getSearchAnalytics({
        ...baseQuery,
        dimensions: []
      });

      // Get top queries
      const queryData = await this.getSearchAnalytics({
        ...baseQuery,
        dimensions: ['query'],
        rowLimit: 50
      });

      // Get top pages
      const pageData = await this.getSearchAnalytics({
        ...baseQuery,
        dimensions: ['page'],
        rowLimit: 50
      });

      // Get device performance
      const deviceData = await this.getSearchAnalytics({
        ...baseQuery,
        dimensions: ['device']
      });

      // Get country performance
      const countryData = await this.getSearchAnalytics({
        ...baseQuery,
        dimensions: ['country'],
        rowLimit: 20
      });

      if (!overallData || !overallData.rows || overallData.rows.length === 0) {
        return null;
      }

      const overall = overallData.rows[0];

      return {
        totalClicks: overall.clicks,
        totalImpressions: overall.impressions,
        averageCTR: overall.ctr,
        averagePosition: overall.position,
        indexedPages: 0, // Will be populated by separate indexing check
        crawlErrors: 0, // Will be populated by separate crawl error check
        mobileUsabilityIssues: 0, // Will be populated by separate mobile check
        richResultsCount: 0, // Will be populated by separate rich results check
        topQueries: queryData?.rows || [],
        topPages: pageData?.rows || [],
        performanceByDevice: deviceData?.rows || [],
        performanceByCountry: countryData?.rows || []
      };
    } catch (error) {
      console.error('Failed to get SEO metrics:', error);
      return null;
    }
  }

  // Monitor keyword rankings for specific terms
  async monitorKeywordRankings(keywords: string[], startDate: string, endDate: string): Promise<Record<string, SearchAnalyticsRow[]>> {
    const results: Record<string, SearchAnalyticsRow[]> = {};

    for (const keyword of keywords) {
      try {
        const data = await this.getSearchAnalytics({
          startDate,
          endDate,
          dimensions: ['query'],
          filters: [
            {
              dimension: 'query',
              operator: 'contains',
              expression: keyword
            }
          ],
          rowLimit: 100
        });

        results[keyword] = data?.rows || [];
      } catch (error) {
        console.error(`Failed to monitor keyword: ${keyword}`, error);
        results[keyword] = [];
      }
    }

    return results;
  }

  // Check indexing status for multiple URLs
  async checkIndexingStatus(urls: string[]): Promise<Record<string, IndexingStatus | null>> {
    const results: Record<string, IndexingStatus | null> = {};

    for (const url of urls) {
      try {
        const status = await this.inspectUrl(url);
        results[url] = status;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to check indexing for: ${url}`, error);
        results[url] = null;
      }
    }

    return results;
  }

  // Get competitor analysis (requires manual setup)
  async getCompetitorAnalysis(competitorQueries: string[]): Promise<Record<string, SearchAnalyticsRow[]>> {
    const results: Record<string, SearchAnalyticsRow[]> = {};

    for (const query of competitorQueries) {
      try {
        const data = await this.getSearchAnalytics({
          startDate: this.getDateDaysAgo(30),
          endDate: this.getDateDaysAgo(1),
          dimensions: ['query', 'page'],
          filters: [
            {
              dimension: 'query',
              operator: 'contains',
              expression: query
            }
          ],
          rowLimit: 20
        });

        results[query] = data?.rows || [];
      } catch (error) {
        console.error(`Failed to analyze competitor query: ${query}`, error);
        results[query] = [];
      }
    }

    return results;
  }

  // Utility methods
  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  // Generate automated SEO report
  async generateSEOReport(): Promise<string> {
    const endDate = this.getDateDaysAgo(1);
    const startDate = this.getDateDaysAgo(30);
    
    const metrics = await this.getSEOMetrics(startDate, endDate);
    
    if (!metrics) {
      return 'Unable to generate SEO report - Search Console data not available.';
    }

    const report = `
# SEO Performance Report
Generated: ${new Date().toLocaleDateString()}
Period: ${startDate} to ${endDate}

## Overview
- **Total Clicks:** ${metrics.totalClicks.toLocaleString()}
- **Total Impressions:** ${metrics.totalImpressions.toLocaleString()}
- **Average CTR:** ${(metrics.averageCTR * 100).toFixed(2)}%
- **Average Position:** ${metrics.averagePosition.toFixed(1)}

## Top Performing Queries
${metrics.topQueries.slice(0, 10).map((query, index) => 
  `${index + 1}. "${query.keys[0]}" - ${query.clicks} clicks, ${query.impressions} impressions, ${(query.ctr * 100).toFixed(2)}% CTR, Position ${query.position.toFixed(1)}`
).join('\n')}

## Top Performing Pages
${metrics.topPages.slice(0, 10).map((page, index) => 
  `${index + 1}. ${page.keys[0]} - ${page.clicks} clicks, ${page.impressions} impressions, ${(page.ctr * 100).toFixed(2)}% CTR`
).join('\n')}

## Device Performance
${metrics.performanceByDevice.map(device => 
  `- **${device.keys[0]}:** ${device.clicks} clicks, ${device.impressions} impressions, ${(device.ctr * 100).toFixed(2)}% CTR`
).join('\n')}

## Geographic Performance (Top 10)
${metrics.performanceByCountry.slice(0, 10).map(country => 
  `- **${country.keys[0]}:** ${country.clicks} clicks, ${country.impressions} impressions, ${(country.ctr * 100).toFixed(2)}% CTR`
).join('\n')}
`;

    return report;
  }
}

// Client-side SEO monitoring utilities
export class ClientSEOMonitor {
  private keywordTracking: Record<string, number> = {};
  private rankingHistory: Array<{
    keyword: string;
    position: number;
    timestamp: Date;
  }> = [];

  // Track keyword rankings manually (for client-side)
  trackKeywordRanking(keyword: string, position: number): void {
    this.keywordTracking[keyword] = position;
    this.rankingHistory.push({
      keyword,
      position,
      timestamp: new Date()
    });

    // Keep only last 100 entries
    if (this.rankingHistory.length > 100) {
      this.rankingHistory.shift();
    }

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('seo-rankings', JSON.stringify(this.rankingHistory));
    }
  }

  // Get ranking trends
  getRankingTrends(keyword: string): Array<{ position: number; timestamp: Date }> {
    return this.rankingHistory
      .filter(entry => entry.keyword === keyword)
      .map(entry => ({
        position: entry.position,
        timestamp: entry.timestamp
      }));
  }

  // Monitor SERP features
  async checkSERPFeatures(query: string): Promise<{
    hasLocalPack: boolean;
    hasFeaturedSnippet: boolean;
    hasKnowledgeGraph: boolean;
    hasImagePack: boolean;
  }> {
    // This would typically use a SERP API like SerpApi or DataForSEO
    // For now, return mock data
    return {
      hasLocalPack: Math.random() > 0.7,
      hasFeaturedSnippet: Math.random() > 0.8,
      hasKnowledgeGraph: Math.random() > 0.9,
      hasImagePack: Math.random() > 0.6
    };
  }

  // Export rankings data
  exportRankingsData(): string {
    return JSON.stringify({
      currentRankings: this.keywordTracking,
      rankingHistory: this.rankingHistory,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }
}

// Create singleton instances
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tier4intelligence.com';
const SEARCH_CONSOLE_REFRESH_TOKEN = process.env.SEARCH_CONSOLE_REFRESH_TOKEN;

export const searchConsoleMonitor = new SearchConsoleMonitor({
  siteUrl: SITE_URL,
  refreshToken: SEARCH_CONSOLE_REFRESH_TOKEN
});

export const clientSEOMonitor = new ClientSEOMonitor();

export default searchConsoleMonitor;
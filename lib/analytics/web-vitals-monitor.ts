// Core Web Vitals Real-time Monitoring System
// Complete monitoring with alerts, regression detection, and performance optimization

import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

interface WebVitalsThresholds {
  LCP: { good: number; needs_improvement: number };
  FID: { good: number; needs_improvement: number };
  CLS: { good: number; needs_improvement: number };
  FCP: { good: number; needs_improvement: number };
  TTFB: { good: number; needs_improvement: number };
}

interface WebVitalsData {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  url: string;
  timestamp: number;
  sessionId: string;
  device: 'mobile' | 'tablet' | 'desktop';
  connection: string;
  userAgent: string;
  referrer: string;
}

interface PerformanceAlert {
  type: 'warning' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
  url: string;
  sessionId: string;
}

interface PerformanceTrend {
  metric: string;
  values: number[];
  timestamps: number[];
  trend: 'improving' | 'degrading' | 'stable';
  percentChange: number;
}

class WebVitalsMonitor {
  private thresholds: WebVitalsThresholds;
  private vitalsData: WebVitalsData[] = [];
  private alerts: PerformanceAlert[] = [];
  private isMonitoring: boolean = false;
  private sessionId: string;
  private alertCallback?: (alert: PerformanceAlert) => void;
  private analyticsCallback?: (data: WebVitalsData) => void;

  constructor() {
    this.thresholds = {
      LCP: { good: 2500, needs_improvement: 4000 },
      FID: { good: 100, needs_improvement: 300 },
      CLS: { good: 0.1, needs_improvement: 0.25 },
      FCP: { good: 1800, needs_improvement: 3000 },
      TTFB: { good: 800, needs_improvement: 1800 }
    };
    
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `vitals_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      return 'mobile';
    }
    if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private getConnectionType(): string {
    if (typeof window === 'undefined') return 'unknown';
    return (navigator as any).connection?.effectiveType || 'unknown';
  }

  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[metric as keyof WebVitalsThresholds];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needs_improvement) return 'needs-improvement';
    return 'poor';
  }

  private processMetric(metric: Metric): void {
    const vitalsData: WebVitalsData = {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating || this.getRating(metric.name, metric.value),
      delta: metric.delta,
      id: metric.id,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      device: this.getDeviceType(),
      connection: this.getConnectionType(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    this.vitalsData.push(vitalsData);

    // Check for alerts
    this.checkForAlerts(vitalsData);

    // Store in localStorage for persistence
    this.persistData();

    // Send to analytics callback
    if (this.analyticsCallback) {
      this.analyticsCallback(vitalsData);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Web Vitals: ${vitalsData.metric}`, {
        value: `${Math.round(vitalsData.value)}ms`,
        rating: vitalsData.rating,
        device: vitalsData.device
      });
    }
  }

  private checkForAlerts(data: WebVitalsData): void {
    const threshold = this.thresholds[data.metric as keyof WebVitalsThresholds];
    if (!threshold) return;

    let alert: PerformanceAlert | null = null;

    if (data.value > threshold.needs_improvement) {
      alert = {
        type: data.value > (threshold.needs_improvement * 1.5) ? 'critical' : 'warning',
        metric: data.metric,
        value: data.value,
        threshold: threshold.needs_improvement,
        message: this.generateAlertMessage(data.metric, data.value, data.rating),
        timestamp: data.timestamp,
        url: data.url,
        sessionId: data.sessionId
      };
    }

    if (alert) {
      this.alerts.push(alert);
      
      // Trigger alert callback
      if (this.alertCallback) {
        this.alertCallback(alert);
      }

      // Show browser notification if permission granted
      this.showBrowserNotification(alert);
    }
  }

  private generateAlertMessage(metric: string, value: number, rating: string): string {
    const messages = {
      LCP: `Largest Contentful Paint is ${Math.round(value)}ms (${rating}). Consider optimizing images and server response time.`,
      FID: `First Input Delay is ${Math.round(value)}ms (${rating}). Consider reducing JavaScript execution time.`,
      CLS: `Cumulative Layout Shift is ${value.toFixed(3)} (${rating}). Consider adding size attributes to images and avoiding dynamic content insertion.`,
      FCP: `First Contentful Paint is ${Math.round(value)}ms (${rating}). Consider optimizing critical resources.`,
      TTFB: `Time to First Byte is ${Math.round(value)}ms (${rating}). Consider optimizing server response time.`
    };

    return messages[metric as keyof typeof messages] || `${metric} performance is ${rating}`;
  }

  private async showBrowserNotification(alert: PerformanceAlert): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(`Performance Alert: ${alert.metric}`, {
        body: alert.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(`Performance Alert: ${alert.metric}`, {
          body: alert.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    }
  }

  private persistData(): void {
    if (typeof window === 'undefined') return;

    // Keep only last 100 measurements per metric
    const dataByMetric: Record<string, WebVitalsData[]> = {};
    
    this.vitalsData.forEach(data => {
      if (!dataByMetric[data.metric]) {
        dataByMetric[data.metric] = [];
      }
      dataByMetric[data.metric].push(data);
    });

    // Trim to last 100 per metric
    Object.keys(dataByMetric).forEach(metric => {
      if (dataByMetric[metric].length > 100) {
        dataByMetric[metric] = dataByMetric[metric].slice(-100);
      }
    });

    // Flatten back
    this.vitalsData = Object.values(dataByMetric).flat();

    // Store in localStorage
    localStorage.setItem('web-vitals-data', JSON.stringify(this.vitalsData));
    localStorage.setItem('web-vitals-alerts', JSON.stringify(this.alerts.slice(-50))); // Keep last 50 alerts
  }

  private loadPersistedData(): void {
    if (typeof window === 'undefined') return;

    try {
      const savedData = localStorage.getItem('web-vitals-data');
      const savedAlerts = localStorage.getItem('web-vitals-alerts');

      if (savedData) {
        this.vitalsData = JSON.parse(savedData);
      }

      if (savedAlerts) {
        this.alerts = JSON.parse(savedAlerts);
      }
    } catch (error) {
      console.warn('Failed to load persisted Web Vitals data:', error);
    }
  }

  // Public methods
  startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;

    this.loadPersistedData();

    // Initialize Web Vitals monitoring
    getCLS((metric) => this.processMetric(metric));
    getFID((metric) => this.processMetric(metric));
    getFCP((metric) => this.processMetric(metric));
    getLCP((metric) => this.processMetric(metric));
    getTTFB((metric) => this.processMetric(metric));

    this.isMonitoring = true;
    console.log('🚀 Web Vitals monitoring started');
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('⏹️ Web Vitals monitoring stopped');
  }

  setAlertCallback(callback: (alert: PerformanceAlert) => void): void {
    this.alertCallback = callback;
  }

  setAnalyticsCallback(callback: (data: WebVitalsData) => void): void {
    this.analyticsCallback = callback;
  }

  getMetricData(metric?: string): WebVitalsData[] {
    if (metric) {
      return this.vitalsData.filter(data => data.metric === metric);
    }
    return this.vitalsData;
  }

  getAlerts(): PerformanceAlert[] {
    return this.alerts;
  }

  getLatestMetrics(): Record<string, WebVitalsData | null> {
    const latest: Record<string, WebVitalsData | null> = {
      LCP: null,
      FID: null,
      CLS: null,
      FCP: null,
      TTFB: null
    };

    this.vitalsData.forEach(data => {
      if (!latest[data.metric] || data.timestamp > latest[data.metric]!.timestamp) {
        latest[data.metric] = data;
      }
    });

    return latest;
  }

  getPerformanceTrends(metric: string, timeWindow: number = 24 * 60 * 60 * 1000): PerformanceTrend | null {
    const cutoffTime = Date.now() - timeWindow;
    const recentData = this.vitalsData
      .filter(data => data.metric === metric && data.timestamp > cutoffTime)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (recentData.length < 2) return null;

    const values = recentData.map(d => d.value);
    const timestamps = recentData.map(d => d.timestamp);
    
    // Calculate trend
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const percentChange = ((lastValue - firstValue) / firstValue) * 100;

    let trend: 'improving' | 'degrading' | 'stable' = 'stable';
    if (Math.abs(percentChange) > 5) {
      // For most metrics, lower is better (except for connection metrics)
      trend = percentChange > 0 ? 'degrading' : 'improving';
    }

    return {
      metric,
      values,
      timestamps,
      trend,
      percentChange
    };
  }

  generatePerformanceReport(): string {
    const latest = this.getLatestMetrics();
    const recentAlerts = this.alerts.filter(alert => 
      Date.now() - alert.timestamp < 24 * 60 * 60 * 1000
    );

    const report = `
# Web Vitals Performance Report
Generated: ${new Date().toLocaleString()}
Session: ${this.sessionId}

## Current Core Web Vitals
- **LCP (Largest Contentful Paint):** ${latest.LCP ? `${Math.round(latest.LCP.value)}ms (${latest.LCP.rating})` : 'Not measured'}
- **FID (First Input Delay):** ${latest.FID ? `${Math.round(latest.FID.value)}ms (${latest.FID.rating})` : 'Not measured'}
- **CLS (Cumulative Layout Shift):** ${latest.CLS ? `${latest.CLS.value.toFixed(3)} (${latest.CLS.rating})` : 'Not measured'}
- **FCP (First Contentful Paint):** ${latest.FCP ? `${Math.round(latest.FCP.value)}ms (${latest.FCP.rating})` : 'Not measured'}
- **TTFB (Time to First Byte):** ${latest.TTFB ? `${Math.round(latest.TTFB.value)}ms (${latest.TTFB.rating})` : 'Not measured'}

## Performance Score
${this.calculateOverallScore(latest)}/100

## Recent Alerts (Last 24h)
${recentAlerts.length === 0 ? 'No alerts' : recentAlerts.map(alert => 
  `- **${alert.type.toUpperCase()}:** ${alert.metric} - ${alert.message}`
).join('\n')}

## Recommendations
${this.generateRecommendations(latest)}
`;

    return report;
  }

  private calculateOverallScore(latest: Record<string, WebVitalsData | null>): number {
    const scores = {
      good: 100,
      'needs-improvement': 75,
      poor: 50
    };

    let totalScore = 0;
    let metricCount = 0;

    Object.values(latest).forEach(metric => {
      if (metric) {
        totalScore += scores[metric.rating];
        metricCount++;
      }
    });

    return metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
  }

  private generateRecommendations(latest: Record<string, WebVitalsData | null>): string {
    const recommendations: string[] = [];

    if (latest.LCP && latest.LCP.rating !== 'good') {
      recommendations.push('**LCP:** Optimize images, improve server response time, implement critical resource preloading');
    }

    if (latest.FID && latest.FID.rating !== 'good') {
      recommendations.push('**FID:** Reduce JavaScript execution time, implement code splitting, defer non-critical JavaScript');
    }

    if (latest.CLS && latest.CLS.rating !== 'good') {
      recommendations.push('**CLS:** Add size attributes to images, avoid dynamic content insertion, use transform/opacity for animations');
    }

    if (latest.FCP && latest.FCP.rating !== 'good') {
      recommendations.push('**FCP:** Optimize critical resources, implement resource hints, minimize render-blocking resources');
    }

    if (latest.TTFB && latest.TTFB.rating !== 'good') {
      recommendations.push('**TTFB:** Optimize server response time, implement caching, use CDN');
    }

    return recommendations.length > 0 ? recommendations.join('\n') : 'All metrics are performing well!';
  }

  // Export data for analysis
  exportData(): string {
    return JSON.stringify({
      vitalsData: this.vitalsData,
      alerts: this.alerts,
      sessionId: this.sessionId,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  // Clear all data
  clearData(): void {
    this.vitalsData = [];
    this.alerts = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('web-vitals-data');
      localStorage.removeItem('web-vitals-alerts');
    }
  }
}

// Create singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();

// Initialize monitoring on import (client-side only)
if (typeof window !== 'undefined') {
  webVitalsMonitor.startMonitoring();
}

export default webVitalsMonitor;
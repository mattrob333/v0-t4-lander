// Automated Performance Monitoring and Alerting System
// Real-time monitoring with intelligent regression detection

import webVitalsMonitor from '@/lib/analytics/web-vitals-monitor';
import googleAnalytics from '@/lib/analytics/google-analytics';

interface PerformanceBudget {
  metric: string;
  threshold: number;
  critical: number;
  timeWindow: number; // in milliseconds
  consecutiveFailures: number; // how many failures before alert
}

interface PerformanceSnapshot {
  timestamp: number;
  url: string;
  sessionId: string;
  metrics: {
    LCP?: number;
    FID?: number;
    CLS?: number;
    FCP?: number;
    TTFB?: number;
  };
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop';
    connection: string;
    userAgent: string;
  };
  pageInfo: {
    title: string;
    referrer: string;
    loadTime: number;
    domElements: number;
    resourceCount: number;
  };
}

interface PerformanceRegression {
  metric: string;
  currentValue: number;
  previousValue: number;
  percentageIncrease: number;
  severity: 'minor' | 'major' | 'critical';
  affectedUsers: number;
  detectedAt: number;
  potentialCauses: string[];
}

interface AlertNotification {
  id: string;
  type: 'budget_exceeded' | 'regression_detected' | 'critical_failure' | 'user_experience';
  severity: 'warning' | 'critical';
  title: string;
  message: string;
  metric: string;
  value: number;
  threshold: number;
  affectedUsers: number;
  timestamp: number;
  actions: string[];
  acknowledged: boolean;
}

class PerformanceMonitoringSystem {
  private budgets: PerformanceBudget[];
  private snapshots: PerformanceSnapshot[] = [];
  private regressions: PerformanceRegression[] = [];
  private alerts: AlertNotification[] = [];
  private failureCounts: Map<string, number> = new Map();
  private alertCallbacks: Array<(alert: AlertNotification) => void> = [];
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.budgets = [
      {
        metric: 'LCP',
        threshold: 2500,
        critical: 4000,
        timeWindow: 300000, // 5 minutes
        consecutiveFailures: 3
      },
      {
        metric: 'FID',
        threshold: 100,
        critical: 300,
        timeWindow: 300000,
        consecutiveFailures: 3
      },
      {
        metric: 'CLS',
        threshold: 0.1,
        critical: 0.25,
        timeWindow: 300000,
        consecutiveFailures: 3
      },
      {
        metric: 'FCP',
        threshold: 1800,
        critical: 3000,
        timeWindow: 300000,
        consecutiveFailures: 3
      },
      {
        metric: 'TTFB',
        threshold: 800,
        critical: 1800,
        timeWindow: 300000,
        consecutiveFailures: 3
      }
    ];

    this.loadPersistedData();
  }

  private loadPersistedData(): void {
    if (typeof window === 'undefined') return;

    try {
      const savedSnapshots = localStorage.getItem('performance-snapshots');
      const savedAlerts = localStorage.getItem('performance-alerts');
      const savedRegressions = localStorage.getItem('performance-regressions');

      if (savedSnapshots) {
        this.snapshots = JSON.parse(savedSnapshots).slice(-500); // Keep last 500 snapshots
      }

      if (savedAlerts) {
        this.alerts = JSON.parse(savedAlerts).slice(-100); // Keep last 100 alerts
      }

      if (savedRegressions) {
        this.regressions = JSON.parse(savedRegressions).slice(-50); // Keep last 50 regressions
      }
    } catch (error) {
      console.warn('Failed to load persisted monitoring data:', error);
    }
  }

  private persistData(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('performance-snapshots', JSON.stringify(this.snapshots.slice(-500)));
      localStorage.setItem('performance-alerts', JSON.stringify(this.alerts.slice(-100)));
      localStorage.setItem('performance-regressions', JSON.stringify(this.regressions.slice(-50)));
    } catch (error) {
      console.warn('Failed to persist monitoring data:', error);
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;

    this.isMonitoring = true;

    // Set up Web Vitals callback
    webVitalsMonitor.setAnalyticsCallback((data) => {
      this.processMetricData({
        metric: data.metric,
        value: data.value,
        timestamp: data.timestamp,
        url: data.url,
        sessionId: data.sessionId,
        deviceInfo: {
          type: data.device,
          connection: data.connection,
          userAgent: data.userAgent
        }
      });
    });

    // Start periodic monitoring
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
      this.detectRegressions();
      this.cleanupOldData();
    }, 60000); // Check every minute

    console.log('🔍 Performance monitoring started');
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('⏹️ Performance monitoring stopped');
  }

  private processMetricData(data: {
    metric: string;
    value: number;
    timestamp: number;
    url: string;
    sessionId: string;
    deviceInfo: {
      type: 'mobile' | 'tablet' | 'desktop';
      connection: string;
      userAgent: string;
    };
  }): void {
    // Create performance snapshot
    const snapshot: PerformanceSnapshot = {
      timestamp: data.timestamp,
      url: data.url,
      sessionId: data.sessionId,
      metrics: {
        [data.metric]: data.value
      },
      deviceInfo: data.deviceInfo,
      pageInfo: {
        title: document.title,
        referrer: document.referrer,
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domElements: document.getElementsByTagName('*').length,
        resourceCount: performance.getEntriesByType('resource').length
      }
    };

    this.snapshots.push(snapshot);
    this.persistData();

    // Check against budgets
    this.checkBudgets(data.metric, data.value, data.timestamp);

    // Track to Google Analytics
    googleAnalytics.trackEvent('performance_monitored', {
      metric: data.metric,
      value: data.value,
      device_type: data.deviceInfo.type,
      connection_type: data.deviceInfo.connection,
      budget_exceeded: this.isBudgetExceeded(data.metric, data.value)
    });
  }

  private checkBudgets(metric: string, value: number, timestamp: number): void {
    const budget = this.budgets.find(b => b.metric === metric);
    if (!budget) return;

    const isExceeded = value > budget.threshold;
    const isCritical = value > budget.critical;

    if (isExceeded) {
      // Increment failure count
      const currentCount = this.failureCounts.get(metric) || 0;
      this.failureCounts.set(metric, currentCount + 1);

      // Check if we've exceeded consecutive failures threshold
      if (currentCount + 1 >= budget.consecutiveFailures) {
        this.triggerAlert({
          type: 'budget_exceeded',
          severity: isCritical ? 'critical' : 'warning',
          metric,
          value,
          threshold: budget.threshold,
          timestamp,
          consecutiveFailures: currentCount + 1
        });

        // Reset counter after alerting
        this.failureCounts.set(metric, 0);
      }
    } else {
      // Reset failure count on success
      this.failureCounts.set(metric, 0);
    }
  }

  private isBudgetExceeded(metric: string, value: number): boolean {
    const budget = this.budgets.find(b => b.metric === metric);
    return budget ? value > budget.threshold : false;
  }

  private detectRegressions(): void {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    // Get recent snapshots (last hour)
    const recentSnapshots = this.snapshots.filter(s => s.timestamp > oneHourAgo);
    
    // Get comparison snapshots (same hour yesterday)
    const comparisonSnapshots = this.snapshots.filter(s => 
      s.timestamp > oneDayAgo - (60 * 60 * 1000) && 
      s.timestamp < oneDayAgo
    );

    if (recentSnapshots.length < 10 || comparisonSnapshots.length < 10) return;

    // Calculate averages for each metric
    const metrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
    
    metrics.forEach(metric => {
      const recentValues = recentSnapshots
        .map(s => s.metrics[metric as keyof typeof s.metrics])
        .filter(v => v !== undefined) as number[];
      
      const comparisonValues = comparisonSnapshots
        .map(s => s.metrics[metric as keyof typeof s.metrics])
        .filter(v => v !== undefined) as number[];

      if (recentValues.length === 0 || comparisonValues.length === 0) return;

      const recentAvg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
      const comparisonAvg = comparisonValues.reduce((sum, val) => sum + val, 0) / comparisonValues.length;

      const percentageIncrease = ((recentAvg - comparisonAvg) / comparisonAvg) * 100;

      // Detect significant regressions (>20% increase)
      if (percentageIncrease > 20) {
        const severity = percentageIncrease > 50 ? 'critical' : percentageIncrease > 35 ? 'major' : 'minor';
        
        const regression: PerformanceRegression = {
          metric,
          currentValue: recentAvg,
          previousValue: comparisonAvg,
          percentageIncrease,
          severity,
          affectedUsers: recentSnapshots.length,
          detectedAt: now,
          potentialCauses: this.identifyPotentialCauses(metric, percentageIncrease)
        };

        this.regressions.push(regression);

        // Only alert for major/critical regressions
        if (severity !== 'minor') {
          this.triggerAlert({
            type: 'regression_detected',
            severity: severity === 'critical' ? 'critical' : 'warning',
            metric,
            value: recentAvg,
            threshold: comparisonAvg,
            timestamp: now,
            regression
          });
        }
      }
    });
  }

  private identifyPotentialCauses(metric: string, percentageIncrease: number): string[] {
    const causes: string[] = [];

    const commonCauses = {
      LCP: [
        'Large image files or unoptimized images',
        'Slow server response time',
        'Render-blocking resources',
        'Client-side rendering issues',
        'Third-party script interference'
      ],
      FID: [
        'Heavy JavaScript execution',
        'Long-running tasks blocking main thread',
        'Unoptimized event handlers',
        'Third-party scripts causing delays',
        'Large bundle sizes'
      ],
      CLS: [
        'Images without dimensions',
        'Dynamic content insertion',
        'Web fonts causing layout shifts',
        'Ads or embeds loading asynchronously',
        'DOM manipulation after page load'
      ],
      FCP: [
        'Render-blocking CSS or JavaScript',
        'Large CSS files',
        'Slow server response',
        'Missing resource hints',
        'Font loading delays'
      ],
      TTFB: [
        'Database query performance issues',
        'Server overload or resource constraints',
        'CDN configuration problems',
        'Network connectivity issues',
        'Caching strategy problems'
      ]
    };

    const metricCauses = commonCauses[metric as keyof typeof commonCauses] || [];
    
    // Add severity-based causes
    if (percentageIncrease > 50) {
      causes.push('Recent deployment or configuration change');
      causes.push('Infrastructure issues or outages');
    }

    return [...metricCauses.slice(0, 3), ...causes];
  }

  private triggerAlert(params: {
    type: AlertNotification['type'];
    severity: AlertNotification['severity'];
    metric: string;
    value: number;
    threshold: number;
    timestamp: number;
    consecutiveFailures?: number;
    regression?: PerformanceRegression;
  }): void {
    const alertId = `${params.type}_${params.metric}_${params.timestamp}`;
    
    let title: string;
    let message: string;
    let actions: string[];

    switch (params.type) {
      case 'budget_exceeded':
        title = `Performance Budget Exceeded: ${params.metric}`;
        message = `${params.metric} is ${Math.round(params.value)}${params.metric === 'CLS' ? '' : 'ms'}, exceeding the budget of ${params.threshold}${params.metric === 'CLS' ? '' : 'ms'} for ${params.consecutiveFailures} consecutive measurements.`;
        actions = [
          'Review recent deployments',
          'Check server performance',
          'Optimize critical resources',
          'Monitor user impact'
        ];
        break;

      case 'regression_detected':
        title = `Performance Regression Detected: ${params.metric}`;
        message = `${params.metric} has increased by ${params.regression?.percentageIncrease.toFixed(1)}% compared to yesterday (${Math.round(params.value)} vs ${Math.round(params.threshold)}).`;
        actions = [
          'Investigate recent changes',
          'Compare with deployment timeline',
          'Check infrastructure metrics',
          'Consider rollback if critical'
        ];
        break;

      default:
        title = `Performance Alert: ${params.metric}`;
        message = `${params.metric} performance issue detected`;
        actions = ['Investigate immediately'];
    }

    const alert: AlertNotification = {
      id: alertId,
      type: params.type,
      severity: params.severity,
      title,
      message,
      metric: params.metric,
      value: params.value,
      threshold: params.threshold,
      affectedUsers: this.getAffectedUserCount(params.timestamp),
      timestamp: params.timestamp,
      actions,
      acknowledged: false
    };

    this.alerts.push(alert);
    this.persistData();

    // Notify callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    });

    // Send to external monitoring services
    this.sendToExternalServices(alert);

    console.warn(`🚨 Performance Alert: ${title}`, { alert });
  }

  private getAffectedUserCount(timestamp: number): number {
    const fiveMinutesAgo = timestamp - (5 * 60 * 1000);
    const uniqueSessions = new Set(
      this.snapshots
        .filter(s => s.timestamp > fiveMinutesAgo)
        .map(s => s.sessionId)
    );
    return uniqueSessions.size;
  }

  private sendToExternalServices(alert: AlertNotification): void {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_alert', {
        event_category: 'Performance',
        event_label: alert.metric,
        value: Math.round(alert.value),
        custom_severity: alert.severity,
        custom_type: alert.type,
        custom_affected_users: alert.affectedUsers
      });
    }

    // Send webhook notification (if configured)
    const webhookUrl = process.env.NEXT_PUBLIC_PERFORMANCE_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Performance Alert: ${alert.title}`,
          attachments: [{
            color: alert.severity === 'critical' ? 'danger' : 'warning',
            title: alert.title,
            text: alert.message,
            fields: [
              {
                title: 'Metric',
                value: alert.metric,
                short: true
              },
              {
                title: 'Value',
                value: `${Math.round(alert.value)}${alert.metric === 'CLS' ? '' : 'ms'}`,
                short: true
              },
              {
                title: 'Threshold',
                value: `${alert.threshold}${alert.metric === 'CLS' ? '' : 'ms'}`,
                short: true
              },
              {
                title: 'Affected Users',
                value: alert.affectedUsers.toString(),
                short: true
              }
            ],
            actions: alert.actions.map(action => ({ text: action }))
          }]
        })
      }).catch(error => console.error('Failed to send webhook:', error));
    }

    // Browser notification (if permission granted)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(alert.title, {
        body: alert.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: alert.id,
        requireInteraction: alert.severity === 'critical'
      });
    }
  }

  private performHealthCheck(): void {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    
    // Check if we have recent data
    const recentSnapshots = this.snapshots.filter(s => s.timestamp > fiveMinutesAgo);
    
    if (recentSnapshots.length === 0) {
      console.warn('⚠️ No recent performance data - monitoring may not be working');
      return;
    }

    // Check for critical user experience issues
    const criticalSnapshots = recentSnapshots.filter(s => {
      return (s.metrics.LCP && s.metrics.LCP > 4000) ||
             (s.metrics.FID && s.metrics.FID > 300) ||
             (s.metrics.CLS && s.metrics.CLS > 0.25);
    });

    if (criticalSnapshots.length > recentSnapshots.length * 0.3) {
      this.triggerAlert({
        type: 'critical_failure',
        severity: 'critical',
        metric: 'Overall',
        value: (criticalSnapshots.length / recentSnapshots.length) * 100,
        threshold: 30,
        timestamp: now
      });
    }
  }

  private cleanupOldData(): void {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Clean up old snapshots (keep last 7 days)
    this.snapshots = this.snapshots.filter(s => s.timestamp > sevenDaysAgo);
    
    // Clean up old alerts (keep last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(a => a.timestamp > thirtyDaysAgo);
    
    // Clean up old regressions (keep last 14 days)
    const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
    this.regressions = this.regressions.filter(r => r.detectedAt > fourteenDaysAgo);
    
    this.persistData();
  }

  // Public methods
  onAlert(callback: (alert: AlertNotification) => void): void {
    this.alertCallbacks.push(callback);
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.persistData();
    }
  }

  getRecentAlerts(timeWindow: number = 24 * 60 * 60 * 1000): AlertNotification[] {
    const cutoff = Date.now() - timeWindow;
    return this.alerts.filter(a => a.timestamp > cutoff);
  }

  getPerformanceSnapshots(timeWindow: number = 24 * 60 * 60 * 1000): PerformanceSnapshot[] {
    const cutoff = Date.now() - timeWindow;
    return this.snapshots.filter(s => s.timestamp > cutoff);
  }

  getRegressions(timeWindow: number = 7 * 24 * 60 * 60 * 1000): PerformanceRegression[] {
    const cutoff = Date.now() - timeWindow;
    return this.regressions.filter(r => r.detectedAt > cutoff);
  }

  updateBudgets(newBudgets: Partial<PerformanceBudget>[]): void {
    newBudgets.forEach(newBudget => {
      const index = this.budgets.findIndex(b => b.metric === newBudget.metric);
      if (index !== -1) {
        this.budgets[index] = { ...this.budgets[index], ...newBudget };
      }
    });
  }

  getBudgets(): PerformanceBudget[] {
    return [...this.budgets];
  }

  generateHealthReport(): string {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const recentAlerts = this.getRecentAlerts();
    const recentSnapshots = this.getPerformanceSnapshots();
    const recentRegressions = this.getRegressions();

    const criticalAlerts = recentAlerts.filter(a => a.severity === 'critical').length;
    const warningAlerts = recentAlerts.filter(a => a.severity === 'warning').length;

    return `
# Performance Monitoring Health Report
Generated: ${new Date().toLocaleString()}
Monitoring Status: ${this.isMonitoring ? 'Active' : 'Inactive'}

## Alert Summary (Last 24h)
- Critical Alerts: ${criticalAlerts}
- Warning Alerts: ${warningAlerts}
- Total Alerts: ${recentAlerts.length}

## Performance Budget Status
${this.budgets.map(budget => {
  const recentValues = recentSnapshots
    .map(s => s.metrics[budget.metric as keyof typeof s.metrics])
    .filter(v => v !== undefined) as number[];
  
  if (recentValues.length === 0) return `- ${budget.metric}: No data`;
  
  const average = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
  const status = average <= budget.threshold ? '✅ Good' : average <= budget.critical ? '⚠️ Warning' : '❌ Critical';
  
  return `- ${budget.metric}: ${Math.round(average)}${budget.metric === 'CLS' ? '' : 'ms'} (Budget: ${budget.threshold}${budget.metric === 'CLS' ? '' : 'ms'}) ${status}`;
}).join('\n')}

## Recent Regressions
${recentRegressions.length === 0 ? 'None detected' : 
  recentRegressions.map(r => 
    `- ${r.metric}: ${r.percentageIncrease.toFixed(1)}% increase (${r.severity})`
  ).join('\n')}

## Data Points
- Snapshots collected: ${recentSnapshots.length.toLocaleString()}
- Monitoring duration: ${Math.round((now - (recentSnapshots[0]?.timestamp || now)) / 1000 / 60)} minutes
- Unique sessions: ${new Set(recentSnapshots.map(s => s.sessionId)).size}

## Recommendations
${this.generateRecommendations(recentAlerts, recentRegressions)}
`;
  }

  private generateRecommendations(alerts: AlertNotification[], regressions: PerformanceRegression[]): string {
    const recommendations: string[] = [];

    if (alerts.some(a => a.metric === 'LCP' && a.severity === 'critical')) {
      recommendations.push('Immediate action needed: Optimize Largest Contentful Paint - check server response times and image optimization');
    }

    if (regressions.some(r => r.severity === 'critical')) {
      recommendations.push('Critical regression detected: Review recent deployments and consider rollback');
    }

    if (alerts.filter(a => a.severity === 'critical').length > 3) {
      recommendations.push('Multiple critical alerts: Activate incident response team and investigate infrastructure');
    }

    if (recommendations.length === 0) {
      recommendations.push('All systems operating within normal parameters');
    }

    return recommendations.join('\n');
  }

  exportData(): string {
    return JSON.stringify({
      budgets: this.budgets,
      snapshots: this.snapshots.slice(-1000), // Last 1000 snapshots
      alerts: this.alerts.slice(-100), // Last 100 alerts
      regressions: this.regressions.slice(-50), // Last 50 regressions
      exportedAt: new Date().toISOString(),
      monitoringStatus: {
        isActive: this.isMonitoring,
        startedAt: this.isMonitoring ? 'Currently active' : 'Not active'
      }
    }, null, 2);
  }

  clearData(): void {
    this.snapshots = [];
    this.alerts = [];
    this.regressions = [];
    this.failureCounts.clear();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('performance-snapshots');
      localStorage.removeItem('performance-alerts');
      localStorage.removeItem('performance-regressions');
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitoringSystem();

// Initialize on import (client-side only)
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
}

export default performanceMonitor;
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Target, 
  Zap,
  Search,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Share2
} from 'lucide-react';
import googleAnalytics from '@/lib/analytics/google-analytics';
import webVitalsMonitor from '@/lib/analytics/web-vitals-monitor';
import conversionFunnelAnalyzer from '@/lib/analytics/conversion-funnel';
import { searchConsoleMonitor, clientSEOMonitor } from '@/lib/analytics/search-console';

interface DashboardData {
  webVitals: {
    LCP: number | null;
    FID: number | null;
    CLS: number | null;
    FCP: number | null;
    TTFB: number | null;
  };
  conversions: {
    totalUsers: number;
    conversionRate: number;
    totalRevenue: number;
    topDropOffs: Array<{
      stage: string;
      dropOffRate: number;
      users: number;
    }>;
  };
  seo: {
    totalClicks: number;
    totalImpressions: number;
    averageCTR: number;
    averagePosition: number;
    indexedPages: number;
  };
  alerts: Array<{
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
  }>;
  performance: {
    score: number;
    recommendations: string[];
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'critical';
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, status, description }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <Card className={`${getStatusColor()} border-2`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface WebVitalsChartProps {
  data: DashboardData['webVitals'];
}

const WebVitalsChart: React.FC<WebVitalsChartProps> = ({ data }) => {
  const getVitalStatus = (metric: string, value: number | null) => {
    if (value === null) return 'warning';
    
    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
      TTFB: { good: 800, needsImprovement: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'warning';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'warning';
    return 'critical';
  };

  const formatValue = (metric: string, value: number | null) => {
    if (value === null) return 'N/A';
    if (metric === 'CLS') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Object.entries(data).map(([metric, value]) => (
        <Card key={metric} className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{metric}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-2 ${
              getVitalStatus(metric, value) === 'good' ? 'text-green-600' :
              getVitalStatus(metric, value) === 'warning' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {formatValue(metric, value)}
            </div>
            <Badge 
              variant={getVitalStatus(metric, value) === 'good' ? 'default' : 
                     getVitalStatus(metric, value) === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {getVitalStatus(metric, value)}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface AlertsPanelProps {
  alerts: DashboardData['alerts'];
  onDismiss: (index: number) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onDismiss }) => {
  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      default: return 'default';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Systems Operational</h3>
              <p className="text-gray-500">No alerts or issues detected</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        alerts.map((alert, index) => (
          <Alert key={index} variant={getAlertVariant(alert.type)} className="relative">
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <AlertTitle className="text-sm font-medium">
                  {alert.title}
                </AlertTitle>
                <AlertDescription className="text-sm mt-1">
                  {alert.message}
                </AlertDescription>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onDismiss(index)}
            >
              ×
            </Button>
          </Alert>
        ))
      )}
    </div>
  );
};

interface ConversionFunnelViewProps {
  data: DashboardData['conversions'];
}

const ConversionFunnelView: React.FC<ConversionFunnelViewProps> = ({ data }) => {
  const stages = [
    { name: 'Awareness', users: data.totalUsers, rate: 100 },
    { name: 'Interest', users: Math.round(data.totalUsers * 0.75), rate: 75 },
    { name: 'Consideration', users: Math.round(data.totalUsers * 0.50), rate: 50 },
    { name: 'Intent', users: Math.round(data.totalUsers * 0.30), rate: 30 },
    { name: 'Lead', users: Math.round(data.totalUsers * 0.15), rate: 15 },
    { name: 'Conversion', users: Math.round(data.totalUsers * (data.conversionRate / 100)), rate: data.conversionRate }
  ];

  return (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex items-center space-x-4">
            <div className="w-24 text-sm font-medium text-gray-600">
              {stage.name}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <Progress 
                  value={stage.rate} 
                  className="flex-1" 
                />
                <div className="text-sm font-semibold w-16">
                  {stage.rate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 w-20">
                  {stage.users.toLocaleString()} users
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Drop-off Points */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Drop-off Points</CardTitle>
          <CardDescription>Areas with highest user abandonment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.topDropOffs.map((dropOff, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-red-900">{dropOff.stage}</div>
                  <div className="text-sm text-red-600">{dropOff.users} users affected</div>
                </div>
                <Badge variant="destructive">
                  {dropOff.dropOffRate.toFixed(1)}% drop-off
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function AnalyticsMonitoringDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    webVitals: { LCP: null, FID: null, CLS: null, FCP: null, TTFB: null },
    conversions: { totalUsers: 0, conversionRate: 0, totalRevenue: 0, topDropOffs: [] },
    seo: { totalClicks: 0, totalImpressions: 0, averageCTR: 0, averagePosition: 0, indexedPages: 0 },
    alerts: [],
    performance: { score: 0, recommendations: [] }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load Web Vitals data
      const latestWebVitals = webVitalsMonitor.getLatestMetrics();
      const webVitalsData = {
        LCP: latestWebVitals.LCP?.value || null,
        FID: latestWebVitals.FID?.value || null,
        CLS: latestWebVitals.CLS?.value || null,
        FCP: latestWebVitals.FCP?.value || null,
        TTFB: latestWebVitals.TTFB?.value || null,
      };

      // Load Conversion Funnel data
      const funnelAnalytics = conversionFunnelAnalyzer.generateAnalytics();
      const conversionData = {
        totalUsers: funnelAnalytics.totalUsers,
        conversionRate: funnelAnalytics.overallConversionRate,
        totalRevenue: funnelAnalytics.totalRevenue,
        topDropOffs: funnelAnalytics.topDropOffPoints.slice(0, 3).map(dropOff => ({
          stage: dropOff.fromStage,
          dropOffRate: dropOff.dropOffRate,
          users: dropOff.users
        }))
      };

      // Load SEO data (mock data for now, would integrate with Search Console API)
      const seoData = {
        totalClicks: 1250,
        totalImpressions: 45000,
        averageCTR: 2.78,
        averagePosition: 12.4,
        indexedPages: 144
      };

      // Load alerts from Web Vitals and other sources
      const vitalsAlerts = webVitalsMonitor.getAlerts().slice(-5).map(alert => ({
        type: alert.type as 'critical' | 'warning' | 'info',
        title: `Performance Alert: ${alert.metric}`,
        message: alert.message,
        timestamp: alert.timestamp
      }));

      const optimizationOpportunities = conversionFunnelAnalyzer.identifyOptimizationOpportunities();
      const conversionAlerts = optimizationOpportunities.slice(0, 3).map(opp => ({
        type: opp.priority === 'high' ? 'critical' as const : 'warning' as const,
        title: `Conversion Optimization`,
        message: opp.description,
        timestamp: Date.now()
      }));

      const allAlerts = [...vitalsAlerts, ...conversionAlerts];

      // Calculate performance score
      const webVitalsScore = Object.values(webVitalsData).filter(v => v !== null).length * 20;
      const performanceScore = Math.min(webVitalsScore, 100);

      // Generate recommendations
      const recommendations = [];
      if (webVitalsData.LCP && webVitalsData.LCP > 2500) {
        recommendations.push('Optimize Largest Contentful Paint by compressing images and improving server response time');
      }
      if (webVitalsData.CLS && webVitalsData.CLS > 0.1) {
        recommendations.push('Reduce Cumulative Layout Shift by adding size attributes to images');
      }
      if (conversionData.conversionRate < 5) {
        recommendations.push('Improve conversion rate by optimizing call-to-action placement and messaging');
      }

      setDashboardData({
        webVitals: webVitalsData,
        conversions: conversionData,
        seo: seoData,
        alerts: allAlerts,
        performance: {
          score: performanceScore,
          recommendations
        }
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissAlert = (index: number) => {
    setDashboardData(prev => ({
      ...prev,
      alerts: prev.alerts.filter((_, i) => i !== index)
    }));
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      webVitals: dashboardData.webVitals,
      conversions: dashboardData.conversions,
      seo: dashboardData.seo,
      performance: dashboardData.performance,
      recommendations: dashboardData.performance.recommendations
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareReport = async () => {
    const reportData = `
Analytics Report - ${new Date().toLocaleDateString()}

Performance Score: ${dashboardData.performance.score}/100

Core Web Vitals:
- LCP: ${dashboardData.webVitals.LCP ? Math.round(dashboardData.webVitals.LCP) + 'ms' : 'N/A'}
- FID: ${dashboardData.webVitals.FID ? Math.round(dashboardData.webVitals.FID) + 'ms' : 'N/A'}
- CLS: ${dashboardData.webVitals.CLS ? dashboardData.webVitals.CLS.toFixed(3) : 'N/A'}

Conversions:
- Total Users: ${dashboardData.conversions.totalUsers.toLocaleString()}
- Conversion Rate: ${dashboardData.conversions.conversionRate.toFixed(2)}%
- Revenue: $${dashboardData.conversions.totalRevenue.toLocaleString()}

SEO Performance:
- Total Clicks: ${dashboardData.seo.totalClicks.toLocaleString()}
- CTR: ${dashboardData.seo.averageCTR.toFixed(2)}%
- Average Position: ${dashboardData.seo.averagePosition.toFixed(1)}
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Analytics Report',
          text: reportData,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(reportData);
        alert('Report copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh every 5 minutes
    intervalRef.current = setInterval(loadDashboardData, 5 * 60 * 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (isLoading && !lastUpdated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Monitoring Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Real-time performance, SEO, and conversion tracking
              {lastUpdated && (
                <span className="ml-2 text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={loadDashboardData} disabled={isLoading}>
              <Activity className="h-4 w-4 mr-2" />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={shareReport}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Performance Score"
            value={`${dashboardData.performance.score}/100`}
            change={5.2}
            icon={<Zap className="h-4 w-4" />}
            status={dashboardData.performance.score >= 90 ? 'good' : dashboardData.performance.score >= 70 ? 'warning' : 'critical'}
            description="Overall site performance"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${dashboardData.conversions.conversionRate.toFixed(2)}%`}
            change={2.1}
            icon={<Target className="h-4 w-4" />}
            status={dashboardData.conversions.conversionRate >= 5 ? 'good' : dashboardData.conversions.conversionRate >= 2 ? 'warning' : 'critical'}
            description="Overall funnel conversion"
          />
          <MetricCard
            title="SEO Clicks"
            value={dashboardData.seo.totalClicks.toLocaleString()}
            change={12.5}
            icon={<Search className="h-4 w-4" />}
            status="good"
            description="Organic search clicks"
          />
          <MetricCard
            title="Active Users"
            value={dashboardData.conversions.totalUsers.toLocaleString()}
            change={8.3}
            icon={<Users className="h-4 w-4" />}
            status="good"
            description="Total funnel users"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals</CardTitle>
                  <CardDescription>Real-time performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <WebVitalsChart data={dashboardData.webVitals} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {dashboardData.alerts.slice(0, 5).map((alert, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        'bg-blue-50 border-blue-500'
                      }`}>
                        <div className="font-medium text-sm">{alert.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
                      </div>
                    ))}
                    {dashboardData.alerts.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <p>No alerts</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Recommendations</CardTitle>
                <CardDescription>AI-powered optimization suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.performance.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.performance.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-900">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p>No optimization recommendations at this time</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals Details</CardTitle>
                  <CardDescription>Comprehensive performance metrics breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <WebVitalsChart data={dashboardData.webVitals} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Monitor className="h-5 w-5" />
                      <span>Desktop</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">94</div>
                    <p className="text-sm text-gray-600">Performance Score</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Tablet className="h-5 w-5" />
                      <span>Tablet</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">78</div>
                    <p className="text-sm text-gray-600">Performance Score</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5" />
                      <span>Mobile</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">65</div>
                    <p className="text-sm text-gray-600">Performance Score</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conversions">
            <ConversionFunnelView data={dashboardData.conversions} />
          </TabsContent>

          <TabsContent value="seo">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Clicks"
                  value={dashboardData.seo.totalClicks.toLocaleString()}
                  change={12.5}
                  icon={<BarChart3 className="h-4 w-4" />}
                  status="good"
                />
                <MetricCard
                  title="Impressions"
                  value={dashboardData.seo.totalImpressions.toLocaleString()}
                  change={8.2}
                  icon={<Globe className="h-4 w-4" />}
                  status="good"
                />
                <MetricCard
                  title="Average CTR"
                  value={`${dashboardData.seo.averageCTR.toFixed(2)}%`}
                  change={0.3}
                  icon={<Target className="h-4 w-4" />}
                  status={dashboardData.seo.averageCTR >= 3 ? 'good' : 'warning'}
                />
                <MetricCard
                  title="Average Position"
                  value={dashboardData.seo.averagePosition.toFixed(1)}
                  change={-2.1}
                  icon={<TrendingUp className="h-4 w-4" />}
                  status={dashboardData.seo.averagePosition <= 10 ? 'good' : 'warning'}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Performance Overview</CardTitle>
                  <CardDescription>Search Console data and ranking metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Indexed Pages</h4>
                        <div className="text-3xl font-bold text-green-600">{dashboardData.seo.indexedPages}</div>
                        <p className="text-sm text-gray-600">Pages indexed by Google</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Schema Markup</h4>
                        <div className="text-3xl font-bold text-green-600">100%</div>
                        <p className="text-sm text-gray-600">Coverage across all pages</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel alerts={dashboardData.alerts} onDismiss={dismissAlert} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
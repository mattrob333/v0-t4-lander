"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { searchConsoleMonitor, clientSEOMonitor } from "@/lib/analytics/search-console"
import { webVitalsMonitor } from "@/lib/analytics/web-vitals-monitor"

interface SEOMetrics {
  totalClicks: number
  totalImpressions: number
  averageCTR: number
  averagePosition: number
  indexedPages: number
  crawlErrors: number
  mobileUsabilityIssues: number
  richResultsCount: number
}

interface KeywordRanking {
  keyword: string
  position: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface WebVitalsScore {
  LCP: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  FID: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  CLS: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  FCP: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  TTFB: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  score: number
}

export function SEOPerformanceDashboard() {
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null)
  const [keywordRankings, setKeywordRankings] = useState<KeywordRanking[]>([])
  const [webVitals, setWebVitals] = useState<WebVitalsScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d')
  const [alerts, setAlerts] = useState<any[]>([])

  // Mock data for demonstration - replace with real API calls
  const mockSEOMetrics: SEOMetrics = {
    totalClicks: 2850,
    totalImpressions: 45200,
    averageCTR: 6.3,
    averagePosition: 12.4,
    indexedPages: 144,
    crawlErrors: 2,
    mobileUsabilityIssues: 0,
    richResultsCount: 89
  }

  const mockKeywordRankings: KeywordRanking[] = [
    { keyword: "AI consulting", position: 8, change: +2, trend: 'up' },
    { keyword: "5-day POC", position: 3, change: 0, trend: 'stable' },
    { keyword: "rapid AI implementation", position: 12, change: -1, trend: 'down' },
    { keyword: "vendor-neutral AI", position: 5, change: +3, trend: 'up' },
    { keyword: "AI proof of concept", position: 7, change: +1, trend: 'up' },
    { keyword: "executive AI briefing", position: 4, change: +1, trend: 'up' }
  ]

  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time Web Vitals monitoring
    const updateWebVitals = () => {
      const latestMetrics = webVitalsMonitor.getLatestMetrics()
      const vitalsScore = calculateWebVitalsScore(latestMetrics)
      setWebVitals(vitalsScore)
    }

    // Update Web Vitals every 10 seconds
    const vitalsInterval = setInterval(updateWebVitals, 10000)
    updateWebVitals() // Initial load

    // Set up alerts monitoring
    webVitalsMonitor.setAlertCallback((alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 9)]) // Keep last 10 alerts
    })

    return () => {
      clearInterval(vitalsInterval)
    }
  }, [selectedTimeframe])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // In a real implementation, these would be API calls
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      setSeoMetrics(mockSEOMetrics)
      setKeywordRankings(mockKeywordRankings)
      
    } catch (error) {
      console.error('Failed to load SEO data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateWebVitalsScore = (metrics: any): WebVitalsScore | null => {
    if (!metrics.LCP && !metrics.FID && !metrics.CLS) return null

    const scores = {
      good: 100,
      'needs-improvement': 75,
      poor: 50
    }

    let totalScore = 0
    let metricCount = 0

    const result: any = { score: 0 }

    Object.entries(metrics).forEach(([key, metric]: [string, any]) => {
      if (metric) {
        result[key] = {
          value: metric.value,
          rating: metric.rating
        }
        totalScore += scores[metric.rating as keyof typeof scores]
        metricCount++
      }
    })

    result.score = metricCount > 0 ? Math.round(totalScore / metricCount) : 0

    return result
  }

  const getRatingColor = (rating: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good': return 'bg-green-500'
      case 'needs-improvement': return 'bg-yellow-500'
      case 'poor': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '➡️'
      default: return '➡️'
    }
  }

  const exportReport = () => {
    const report = {
      seoMetrics,
      keywordRankings,
      webVitals,
      alerts,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Performance Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of search performance and technical SEO</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
          <Button onClick={exportReport} variant="outline">
            Export Report
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Performance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.type}
                    </Badge>
                    <span className="font-medium">{alert.metric}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Web Vitals */}
      {webVitals && (
        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals</CardTitle>
            <CardDescription>Real-time performance monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{webVitals.score}</div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <Progress value={webVitals.score} className="mt-2" />
              </div>
              
              {Object.entries(webVitals).filter(([key]) => key !== 'score').map(([metric, data]: [string, any]) => (
                <div key={metric} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getRatingColor(data.rating)}`}></div>
                    <span className="font-medium">{metric}</span>
                  </div>
                  <div className="text-lg font-bold mt-1">
                    {metric === 'CLS' ? data.value.toFixed(3) : `${Math.round(data.value)}ms`}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">{data.rating.replace('-', ' ')}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoMetrics?.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+12% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoMetrics?.totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+8% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoMetrics?.averageCTR.toFixed(1)}%</div>
            <p className="text-xs text-green-600 mt-1">+0.3% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoMetrics?.averagePosition.toFixed(1)}</div>
            <p className="text-xs text-green-600 mt-1">-0.8 from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Technical SEO Health */}
      <Card>
        <CardHeader>
          <CardTitle>Technical SEO Health</CardTitle>
          <CardDescription>Indexing, crawling, and technical performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{seoMetrics?.indexedPages}</div>
              <div className="text-sm text-gray-600">Indexed Pages</div>
              <Badge variant="outline" className="mt-2">✓ Good</Badge>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{seoMetrics?.crawlErrors}</div>
              <div className="text-sm text-gray-600">Crawl Errors</div>
              <Badge variant="outline" className="mt-2">✓ Excellent</Badge>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{seoMetrics?.mobileUsabilityIssues}</div>
              <div className="text-sm text-gray-600">Mobile Issues</div>
              <Badge variant="outline" className="mt-2">✓ Perfect</Badge>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{seoMetrics?.richResultsCount}</div>
              <div className="text-sm text-gray-600">Rich Results</div>
              <Badge variant="outline" className="mt-2">✓ Enhanced</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Rankings</CardTitle>
          <CardDescription>Top performing keywords and position changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keywordRankings.map((ranking, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{ranking.keyword}</div>
                  <div className="text-sm text-gray-600">Position {ranking.position}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTrendIcon(ranking.trend)}</span>
                    {ranking.change !== 0 && (
                      <span className={`text-sm font-medium ${
                        ranking.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {ranking.change > 0 ? '+' : ''}{ranking.change}
                      </span>
                    )}
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      ranking.position <= 3 ? 'border-green-500 text-green-700' :
                      ranking.position <= 10 ? 'border-yellow-500 text-yellow-700' :
                      'border-red-500 text-red-700'
                    }
                  >
                    #{ranking.position}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🔍</span>
              <span className="text-sm">Run SEO Audit</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🚀</span>
              <span className="text-sm">Submit to Google</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
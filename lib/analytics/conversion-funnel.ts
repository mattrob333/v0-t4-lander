// Advanced Conversion Funnel Analysis and Optimization System
// Complete system for tracking user journeys and optimizing conversion paths

interface FunnelStage {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  requiredEvents?: string[];
  goalValue?: number;
  timeWindow?: number; // in milliseconds
}

interface FunnelEvent {
  eventName: string;
  timestamp: number;
  userId: string;
  sessionId: string;
  pageUrl: string;
  metadata: Record<string, any>;
  value?: number;
  currency?: string;
}

interface FunnelProgress {
  userId: string;
  sessionId: string;
  startTime: number;
  currentStage: string;
  completedStages: string[];
  abandonedAt?: string;
  totalValue: number;
  events: FunnelEvent[];
  deviceType: string;
  trafficSource: string;
  lastActivity: number;
}

interface FunnelAnalytics {
  totalUsers: number;
  stageAnalytics: Record<string, {
    users: number;
    conversions: number;
    conversionRate: number;
    averageTimeInStage: number;
    dropOffRate: number;
    revenue: number;
  }>;
  overallConversionRate: number;
  averageTime: number;
  totalRevenue: number;
  topDropOffPoints: Array<{
    fromStage: string;
    toStage: string;
    dropOffRate: number;
    users: number;
  }>;
}

interface OptimizationOpportunity {
  type: 'high_drop_off' | 'slow_progression' | 'low_engagement' | 'device_specific' | 'traffic_source_specific';
  priority: 'high' | 'medium' | 'low';
  stage: string;
  description: string;
  potentialImpact: number;
  recommendations: string[];
  dataPoints: Record<string, any>;
}

class ConversionFunnelAnalyzer {
  private funnelStages: FunnelStage[];
  private userProgressMap: Map<string, FunnelProgress> = new Map();
  private completedFunnels: FunnelProgress[] = [];
  private events: FunnelEvent[] = [];
  private optimizationOpportunities: OptimizationOpportunity[] = [];

  constructor() {
    this.funnelStages = [
      {
        id: 'awareness',
        name: 'Awareness',
        description: 'User discovers the website',
        triggers: ['page-view', 'organic-search', 'paid-ad-click'],
        timeWindow: 30 * 1000 // 30 seconds
      },
      {
        id: 'interest',
        name: 'Interest',
        description: 'User shows engagement with content',
        triggers: ['scroll-depth', 'time-on-page', 'multiple-pages'],
        requiredEvents: ['page-view'],
        timeWindow: 120 * 1000 // 2 minutes
      },
      {
        id: 'consideration',
        name: 'Consideration',
        description: 'User engages with key content or features',
        triggers: ['service-page-view', 'case-study-read', 'pricing-view', 'resource-download'],
        requiredEvents: ['scroll-depth'],
        timeWindow: 300 * 1000 // 5 minutes
      },
      {
        id: 'intent',
        name: 'Intent',
        description: 'User shows purchasing intent',
        triggers: ['form-start', 'contact-info-view', 'phone-number-click', 'calendar-view'],
        requiredEvents: ['consideration'],
        goalValue: 500,
        timeWindow: 600 * 1000 // 10 minutes
      },
      {
        id: 'lead',
        name: 'Lead Generation',
        description: 'User provides contact information',
        triggers: ['form-submit', 'schedule-assessment', 'download-guide', 'consultation-request'],
        requiredEvents: ['intent'],
        goalValue: 1000,
        timeWindow: 1800 * 1000 // 30 minutes
      },
      {
        id: 'qualified-lead',
        name: 'Qualified Lead',
        description: 'User shows high purchase intent',
        triggers: ['poc-request', 'consultation-book', 'phone-call-click'],
        requiredEvents: ['lead'],
        goalValue: 2500,
        timeWindow: 3600 * 1000 // 1 hour
      },
      {
        id: 'conversion',
        name: 'Conversion',
        description: 'User converts to customer',
        triggers: ['contract-signed', 'payment-completed', 'project-started'],
        requiredEvents: ['qualified-lead'],
        goalValue: 5000,
        timeWindow: 7 * 24 * 3600 * 1000 // 7 days
      }
    ];

    this.loadPersistedData();
  }

  private loadPersistedData(): void {
    if (typeof window === 'undefined') return;

    try {
      const savedProgress = localStorage.getItem('funnel-progress');
      const savedEvents = localStorage.getItem('funnel-events');
      const savedCompleted = localStorage.getItem('completed-funnels');

      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        Object.entries(progressData).forEach(([userId, progress]: [string, any]) => {
          this.userProgressMap.set(userId, progress);
        });
      }

      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      }

      if (savedCompleted) {
        this.completedFunnels = JSON.parse(savedCompleted);
      }
    } catch (error) {
      console.warn('Failed to load funnel data:', error);
    }
  }

  private persistData(): void {
    if (typeof window === 'undefined') return;

    try {
      const progressData = Object.fromEntries(this.userProgressMap.entries());
      localStorage.setItem('funnel-progress', JSON.stringify(progressData));
      localStorage.setItem('funnel-events', JSON.stringify(this.events.slice(-1000))); // Keep last 1000 events
      localStorage.setItem('completed-funnels', JSON.stringify(this.completedFunnels.slice(-100))); // Keep last 100 completed funnels
    } catch (error) {
      console.warn('Failed to persist funnel data:', error);
    }
  }

  trackEvent(event: FunnelEvent): void {
    this.events.push(event);
    this.processEvent(event);
    this.persistData();
  }

  private processEvent(event: FunnelEvent): void {
    let userProgress = this.userProgressMap.get(event.userId);

    // Initialize new user progress if needed
    if (!userProgress) {
      userProgress = {
        userId: event.userId,
        sessionId: event.sessionId,
        startTime: event.timestamp,
        currentStage: 'awareness',
        completedStages: [],
        totalValue: 0,
        events: [],
        deviceType: this.getDeviceType(),
        trafficSource: this.getTrafficSource(),
        lastActivity: event.timestamp
      };
    }

    // Update last activity
    userProgress.lastActivity = event.timestamp;

    // Add event to user's event history
    userProgress.events.push(event);

    // Check for stage progression
    this.checkStageProgression(userProgress, event);

    // Update user progress
    this.userProgressMap.set(event.userId, userProgress);

    // Check for funnel completion or abandonment
    this.checkFunnelStatus(userProgress);
  }

  private checkStageProgression(userProgress: FunnelProgress, event: FunnelEvent): void {
    const currentStageIndex = this.funnelStages.findIndex(stage => stage.id === userProgress.currentStage);
    
    if (currentStageIndex === -1) return;

    // Check if user can advance to next stages
    for (let i = currentStageIndex; i < this.funnelStages.length; i++) {
      const stage = this.funnelStages[i];
      
      // Check if event triggers this stage
      if (stage.triggers.includes(event.eventName)) {
        // Check if required previous events are satisfied
        if (this.checkRequiredEvents(userProgress, stage)) {
          // Check if within time window
          if (this.checkTimeWindow(userProgress, stage, event.timestamp)) {
            // Advance to this stage if not already completed
            if (!userProgress.completedStages.includes(stage.id)) {
              userProgress.completedStages.push(stage.id);
              userProgress.currentStage = stage.id;
              
              // Add goal value if applicable
              if (stage.goalValue) {
                userProgress.totalValue += stage.goalValue;
              }

              console.log(`🎯 User ${userProgress.userId} progressed to: ${stage.name}`);
              
              // Fire progression event
              this.fireProgressionEvent(userProgress, stage);
            }
          }
        }
      }
    }
  }

  private checkRequiredEvents(userProgress: FunnelProgress, stage: FunnelStage): boolean {
    if (!stage.requiredEvents) return true;

    return stage.requiredEvents.every(requiredEvent => 
      userProgress.completedStages.includes(requiredEvent)
    );
  }

  private checkTimeWindow(userProgress: FunnelProgress, stage: FunnelStage, eventTimestamp: number): boolean {
    if (!stage.timeWindow) return true;

    const timeSinceStart = eventTimestamp - userProgress.startTime;
    return timeSinceStart <= stage.timeWindow;
  }

  private fireProgressionEvent(userProgress: FunnelProgress, stage: FunnelStage): void {
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'funnel_progression', {
        stage_id: stage.id,
        stage_name: stage.name,
        user_id: userProgress.userId,
        session_id: userProgress.sessionId,
        total_value: userProgress.totalValue,
        time_to_stage: Date.now() - userProgress.startTime
      });
    }

    // Custom callback for other analytics systems
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('funnelProgression', {
        detail: { userProgress, stage }
      }));
    }
  }

  private checkFunnelStatus(userProgress: FunnelProgress): void {
    const lastStage = this.funnelStages[this.funnelStages.length - 1];
    
    // Check if funnel is completed
    if (userProgress.completedStages.includes(lastStage.id)) {
      this.completedFunnels.push({...userProgress});
      this.userProgressMap.delete(userProgress.userId);
      console.log(`✅ Funnel completed for user ${userProgress.userId}`);
      return;
    }

    // Check for abandonment (no activity for 24 hours)
    const timeSinceLastActivity = Date.now() - userProgress.lastActivity;
    if (timeSinceLastActivity > 24 * 60 * 60 * 1000) {
      userProgress.abandonedAt = userProgress.currentStage;
      this.completedFunnels.push({...userProgress});
      this.userProgressMap.delete(userProgress.userId);
      console.log(`❌ Funnel abandoned at ${userProgress.currentStage} for user ${userProgress.userId}`);
    }
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      return 'mobile';
    }
    if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private getTrafficSource(): string {
    if (typeof window === 'undefined') return 'direct';
    
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('utm_source')) {
      return urlParams.get('utm_source') || 'unknown';
    }
    
    if (referrer.includes('google.com')) return 'google-organic';
    if (referrer.includes('bing.com')) return 'bing-organic';
    if (referrer.includes('linkedin.com')) return 'linkedin';
    if (referrer.includes('twitter.com')) return 'twitter';
    
    return referrer ? 'referral' : 'direct';
  }

  generateAnalytics(): FunnelAnalytics {
    const allUsers = [...this.userProgressMap.values(), ...this.completedFunnels];
    const totalUsers = allUsers.length;

    if (totalUsers === 0) {
      return {
        totalUsers: 0,
        stageAnalytics: {},
        overallConversionRate: 0,
        averageTime: 0,
        totalRevenue: 0,
        topDropOffPoints: []
      };
    }

    // Calculate stage analytics
    const stageAnalytics: Record<string, any> = {};
    let totalRevenue = 0;
    let totalTime = 0;
    let conversions = 0;

    this.funnelStages.forEach(stage => {
      const stageUsers = allUsers.filter(user => user.completedStages.includes(stage.id));
      const nextStageIndex = this.funnelStages.findIndex(s => s.id === stage.id) + 1;
      const nextStage = this.funnelStages[nextStageIndex];
      const nextStageUsers = nextStage ? allUsers.filter(user => user.completedStages.includes(nextStage.id)) : [];
      
      const users = stageUsers.length;
      const nextUsers = nextStageUsers.length;
      const conversionRate = users > 0 ? (nextUsers / users) * 100 : 0;
      const dropOffRate = users > 0 ? ((users - nextUsers) / users) * 100 : 0;

      // Calculate average time in stage
      const stageTimes = stageUsers.map(user => {
        const stageEvents = user.events.filter(event => 
          this.funnelStages.find(s => s.triggers.includes(event.eventName))?.id === stage.id
        );
        return stageEvents.length > 0 ? stageEvents[0].timestamp - user.startTime : 0;
      });
      const averageTimeInStage = stageTimes.length > 0 ? 
        stageTimes.reduce((sum, time) => sum + time, 0) / stageTimes.length : 0;

      // Calculate stage revenue
      const stageRevenue = stageUsers.reduce((sum, user) => sum + (user.totalValue || 0), 0);

      stageAnalytics[stage.id] = {
        users,
        conversions: nextUsers,
        conversionRate,
        averageTimeInStage,
        dropOffRate,
        revenue: stageRevenue
      };

      totalRevenue += stageRevenue;
    });

    // Calculate overall metrics
    const completedUsers = this.completedFunnels.filter(user => !user.abandonedAt);
    const overallConversionRate = totalUsers > 0 ? (completedUsers.length / totalUsers) * 100 : 0;
    
    // Calculate average funnel completion time
    const completionTimes = completedUsers.map(user => 
      user.lastActivity - user.startTime
    );
    const averageTime = completionTimes.length > 0 ? 
      completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length : 0;

    // Calculate top drop-off points
    const topDropOffPoints = this.calculateTopDropOffPoints(stageAnalytics);

    return {
      totalUsers,
      stageAnalytics,
      overallConversionRate,
      averageTime,
      totalRevenue,
      topDropOffPoints
    };
  }

  private calculateTopDropOffPoints(stageAnalytics: Record<string, any>): Array<{
    fromStage: string;
    toStage: string;
    dropOffRate: number;
    users: number;
  }> {
    const dropOffPoints: Array<{
      fromStage: string;
      toStage: string;
      dropOffRate: number;
      users: number;
    }> = [];

    for (let i = 0; i < this.funnelStages.length - 1; i++) {
      const currentStage = this.funnelStages[i];
      const nextStage = this.funnelStages[i + 1];
      
      const currentStageData = stageAnalytics[currentStage.id];
      const dropOffUsers = currentStageData.users - currentStageData.conversions;
      
      if (dropOffUsers > 0) {
        dropOffPoints.push({
          fromStage: currentStage.name,
          toStage: nextStage.name,
          dropOffRate: currentStageData.dropOffRate,
          users: dropOffUsers
        });
      }
    }

    return dropOffPoints.sort((a, b) => b.dropOffRate - a.dropOffRate).slice(0, 5);
  }

  identifyOptimizationOpportunities(): OptimizationOpportunity[] {
    const analytics = this.generateAnalytics();
    const opportunities: OptimizationOpportunity[] = [];

    // Identify high drop-off stages
    Object.entries(analytics.stageAnalytics).forEach(([stageId, data]: [string, any]) => {
      const stage = this.funnelStages.find(s => s.id === stageId);
      if (!stage) return;

      if (data.dropOffRate > 70) {
        opportunities.push({
          type: 'high_drop_off',
          priority: 'high',
          stage: stage.name,
          description: `High drop-off rate (${data.dropOffRate.toFixed(1)}%) at ${stage.name} stage`,
          potentialImpact: data.users * 0.1, // Potential users that could be recovered
          recommendations: [
            'A/B test different messaging and value propositions',
            'Simplify the user experience at this stage',
            'Add social proof or testimonials',
            'Implement exit-intent popups with offers',
            'Analyze user session recordings to identify friction points'
          ],
          dataPoints: {
            currentDropOffRate: data.dropOffRate,
            usersAffected: data.users,
            currentConversionRate: data.conversionRate
          }
        });
      }

      if (data.averageTimeInStage > 5 * 60 * 1000) { // More than 5 minutes
        opportunities.push({
          type: 'slow_progression',
          priority: 'medium',
          stage: stage.name,
          description: `Users spending too long (${Math.round(data.averageTimeInStage / 1000 / 60)} minutes) at ${stage.name}`,
          potentialImpact: data.users * 0.05,
          recommendations: [
            'Streamline the user flow',
            'Add progress indicators',
            'Implement guided onboarding',
            'Reduce cognitive load with simpler messaging',
            'Add urgency elements to encourage action'
          ],
          dataPoints: {
            averageTime: data.averageTimeInStage,
            usersAffected: data.users
          }
        });
      }
    });

    // Device-specific opportunities
    const deviceAnalytics = this.analyzeByDevice();
    Object.entries(deviceAnalytics).forEach(([device, performance]: [string, any]) => {
      if (performance.conversionRate < analytics.overallConversionRate * 0.7) {
        opportunities.push({
          type: 'device_specific',
          priority: 'high',
          stage: 'Overall',
          description: `Poor performance on ${device} devices (${performance.conversionRate.toFixed(1)}% vs ${analytics.overallConversionRate.toFixed(1)}% overall)`,
          potentialImpact: performance.users * 0.15,
          recommendations: [
            `Optimize mobile experience for ${device}`,
            'Implement device-specific testing',
            'Reduce page load times for mobile',
            'Simplify forms for touch interfaces',
            'Add device-specific call-to-action buttons'
          ],
          dataPoints: {
            deviceConversionRate: performance.conversionRate,
            overallConversionRate: analytics.overallConversionRate,
            usersAffected: performance.users
          }
        });
      }
    });

    this.optimizationOpportunities = opportunities;
    return opportunities.sort((a, b) => b.potentialImpact - a.potentialImpact);
  }

  private analyzeByDevice(): Record<string, { users: number; conversions: number; conversionRate: number }> {
    const allUsers = [...this.userProgressMap.values(), ...this.completedFunnels];
    const deviceStats: Record<string, { users: number; conversions: number }> = {};

    allUsers.forEach(user => {
      if (!deviceStats[user.deviceType]) {
        deviceStats[user.deviceType] = { users: 0, conversions: 0 };
      }
      
      deviceStats[user.deviceType].users++;
      
      if (user.completedStages.includes('conversion')) {
        deviceStats[user.deviceType].conversions++;
      }
    });

    const result: Record<string, { users: number; conversions: number; conversionRate: number }> = {};
    Object.entries(deviceStats).forEach(([device, stats]) => {
      result[device] = {
        ...stats,
        conversionRate: stats.users > 0 ? (stats.conversions / stats.users) * 100 : 0
      };
    });

    return result;
  }

  generateOptimizationReport(): string {
    const analytics = this.generateAnalytics();
    const opportunities = this.identifyOptimizationOpportunities();

    return `
# Conversion Funnel Optimization Report
Generated: ${new Date().toLocaleString()}

## Overview
- **Total Users:** ${analytics.totalUsers.toLocaleString()}
- **Overall Conversion Rate:** ${analytics.overallConversionRate.toFixed(2)}%
- **Average Funnel Time:** ${Math.round(analytics.averageTime / 1000 / 60)} minutes
- **Total Revenue:** $${analytics.totalRevenue.toLocaleString()}

## Stage Performance
${this.funnelStages.map(stage => {
  const data = analytics.stageAnalytics[stage.id];
  if (!data) return '';
  
  return `
### ${stage.name}
- Users: ${data.users.toLocaleString()}
- Conversion Rate: ${data.conversionRate.toFixed(2)}%
- Drop-off Rate: ${data.dropOffRate.toFixed(2)}%
- Average Time: ${Math.round(data.averageTimeInStage / 1000 / 60)} minutes
- Revenue: $${data.revenue.toLocaleString()}
`;
}).join('')}

## Top Drop-off Points
${analytics.topDropOffPoints.map((dropOff, index) => 
  `${index + 1}. ${dropOff.fromStage} → ${dropOff.toStage}: ${dropOff.dropOffRate.toFixed(1)}% (${dropOff.users} users)`
).join('\n')}

## Optimization Opportunities
${opportunities.map((opp, index) => `
### ${index + 1}. ${opp.description}
**Priority:** ${opp.priority.toUpperCase()}
**Potential Impact:** ${Math.round(opp.potentialImpact)} users
**Recommendations:**
${opp.recommendations.map(rec => `- ${rec}`).join('\n')}
`).join('')}

## Next Steps
1. Prioritize high-impact, high-priority opportunities
2. Implement A/B tests for top recommendations
3. Monitor conversion rates after changes
4. Continue tracking and optimizing based on data
`;
  }

  exportData(): string {
    return JSON.stringify({
      funnelStages: this.funnelStages,
      userProgress: Object.fromEntries(this.userProgressMap.entries()),
      completedFunnels: this.completedFunnels,
      events: this.events.slice(-1000),
      analytics: this.generateAnalytics(),
      optimizationOpportunities: this.optimizationOpportunities,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  clearData(): void {
    this.userProgressMap.clear();
    this.completedFunnels = [];
    this.events = [];
    this.optimizationOpportunities = [];
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('funnel-progress');
      localStorage.removeItem('funnel-events');
      localStorage.removeItem('completed-funnels');
    }
  }
}

// Create singleton instance
export const conversionFunnelAnalyzer = new ConversionFunnelAnalyzer();

export default conversionFunnelAnalyzer;
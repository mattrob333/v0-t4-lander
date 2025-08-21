#!/usr/bin/env node

// Lighthouse CI Integration Script
// Automated performance testing with budget monitoring and alerting

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class LighthouseCIIntegration {
  constructor() {
    this.reportDir = './lighthouse-reports';
    this.budgetThresholds = {
      performance: 90,
      accessibility: 90,
      bestPractices: 90,
      seo: 90,
      lcp: 2500,
      fcp: 1800,
      cls: 0.1,
      si: 3400,
      tti: 5800
    };
    this.alertWebhook = process.env.LIGHTHOUSE_WEBHOOK_URL;
  }

  async init() {
    try {
      await fs.mkdir(this.reportDir, { recursive: true });
      console.log('🚀 Lighthouse CI Integration initialized');
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }

  async runLighthouseCI(options = {}) {
    const {
      urls = ['http://localhost:3000'],
      preset = 'desktop',
      numberOfRuns = 3,
      buildContext = 'local'
    } = options;

    console.log('🔍 Running Lighthouse CI analysis...');
    console.log(`URLs: ${urls.join(', ')}`);
    console.log(`Preset: ${preset}`);
    console.log(`Runs per URL: ${numberOfRuns}`);

    try {
      // Run LHCI collect
      const collectResult = await this.runCommand('npx', [
        'lhci', 'collect',
        `--numberOfRuns=${numberOfRuns}`,
        '--headful=false',
        `--settings.preset=${preset}`,
        ...urls.map(url => `--url=${url}`)
      ]);

      if (collectResult.success) {
        console.log('✅ Lighthouse collection completed');
        
        // Run assertions
        const assertResult = await this.runAssertions();
        
        // Upload results
        const uploadResult = await this.uploadResults(buildContext);
        
        // Process and analyze results
        const analysis = await this.analyzeResults();
        
        return {
          success: collectResult.success && assertResult.success,
          collection: collectResult,
          assertions: assertResult,
          upload: uploadResult,
          analysis
        };
      } else {
        throw new Error('Lighthouse collection failed');
      }
    } catch (error) {
      console.error('❌ Lighthouse CI run failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async runAssertions() {
    console.log('🧪 Running performance assertions...');
    
    try {
      const result = await this.runCommand('npx', ['lhci', 'assert']);
      
      if (result.success) {
        console.log('✅ All assertions passed');
      } else {
        console.log('⚠️ Some assertions failed');
        await this.handleAssertionFailures(result.output);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Assertion run failed:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadResults(buildContext) {
    console.log('📤 Uploading results...');
    
    try {
      const result = await this.runCommand('npx', [
        'lhci', 'upload',
        `--buildContext.branch=${buildContext}`,
        `--buildContext.commitSha=${this.getCommitSha()}`,
        `--buildContext.buildUrl=${process.env.BUILD_URL || 'local'}`
      ]);
      
      if (result.success) {
        console.log('✅ Results uploaded successfully');
        this.extractReportUrls(result.output);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Upload failed:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeResults() {
    console.log('📊 Analyzing performance results...');
    
    try {
      // Read the latest manifest
      const lhciDir = './.lighthouseci';
      const manifestPath = path.join(lhciDir, 'manifest.json');
      
      const manifestContent = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestContent);
      
      const analysis = {
        timestamp: new Date().toISOString(),
        runs: manifest.length,
        results: {},
        budgetStatus: {},
        recommendations: [],
        alerts: []
      };

      // Analyze each result
      for (const entry of manifest) {
        const reportPath = path.join(lhciDir, entry.jsonPath);
        const reportContent = await fs.readFile(reportPath, 'utf8');
        const report = JSON.parse(reportContent);
        
        const url = report.finalUrl;
        const categories = report.categories;
        const audits = report.audits;
        
        // Extract key metrics
        const metrics = {
          performance: categories.performance.score * 100,
          accessibility: categories.accessibility.score * 100,
          bestPractices: categories['best-practices'].score * 100,
          seo: categories.seo.score * 100,
          fcp: audits['first-contentful-paint'].numericValue,
          lcp: audits['largest-contentful-paint'].numericValue,
          cls: audits['cumulative-layout-shift'].numericValue,
          si: audits['speed-index'].numericValue,
          tti: audits['interactive'].numericValue,
          totalByteWeight: audits['total-byte-weight'].numericValue,
          unusedJavaScript: audits['unused-javascript'].details?.overallSavingsBytes || 0,
          unusedCSS: audits['unused-css-rules'].details?.overallSavingsBytes || 0
        };

        analysis.results[url] = metrics;

        // Check budget compliance
        const budgetStatus = this.checkBudgetCompliance(metrics);
        analysis.budgetStatus[url] = budgetStatus;

        // Generate recommendations
        const recommendations = this.generateRecommendations(audits);
        analysis.recommendations.push(...recommendations);

        // Generate alerts for failures
        const alerts = this.generateAlerts(url, metrics, budgetStatus);
        analysis.alerts.push(...alerts);
      }

      // Save analysis
      const analysisPath = path.join(this.reportDir, `analysis-${Date.now()}.json`);
      await fs.writeFile(analysisPath, JSON.stringify(analysis, null, 2));

      // Send notifications if needed
      if (analysis.alerts.length > 0) {
        await this.sendAlertNotifications(analysis.alerts);
      }

      console.log('📈 Analysis completed');
      this.logAnalysisSummary(analysis);

      return analysis;
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      return { error: error.message };
    }
  }

  checkBudgetCompliance(metrics) {
    const status = {};
    
    Object.entries(this.budgetThresholds).forEach(([metric, threshold]) => {
      const value = metrics[metric];
      
      if (value !== undefined) {
        let compliant = false;
        let severity = 'info';
        
        if (['performance', 'accessibility', 'bestPractices', 'seo'].includes(metric)) {
          compliant = value >= threshold;
          severity = value < threshold - 10 ? 'critical' : 'warning';
        } else {
          // Lower is better for timing metrics
          compliant = value <= threshold;
          severity = value > threshold * 1.5 ? 'critical' : 'warning';
        }
        
        status[metric] = {
          value,
          threshold,
          compliant,
          severity: compliant ? 'info' : severity
        };
      }
    });
    
    return status;
  }

  generateRecommendations(audits) {
    const recommendations = [];
    
    // Check for major optimization opportunities
    if (audits['unused-javascript'].details?.overallSavingsBytes > 50000) {
      recommendations.push({
        type: 'javascript',
        priority: 'high',
        message: `Remove ${Math.round(audits['unused-javascript'].details.overallSavingsBytes / 1024)}KB of unused JavaScript`,
        impact: 'Reduce bundle size and improve load times'
      });
    }
    
    if (audits['unused-css-rules'].details?.overallSavingsBytes > 20000) {
      recommendations.push({
        type: 'css',
        priority: 'medium',
        message: `Remove ${Math.round(audits['unused-css-rules'].details.overallSavingsBytes / 1024)}KB of unused CSS`,
        impact: 'Reduce stylesheet size and improve rendering'
      });
    }
    
    if (audits['modern-image-formats'].score < 1) {
      recommendations.push({
        type: 'images',
        priority: 'high',
        message: 'Serve images in modern formats like WebP',
        impact: 'Reduce image file sizes by 25-50%'
      });
    }
    
    if (audits['render-blocking-resources'].score < 1) {
      recommendations.push({
        type: 'resources',
        priority: 'high',
        message: 'Eliminate render-blocking resources',
        impact: 'Improve First Contentful Paint and Largest Contentful Paint'
      });
    }
    
    if (audits['cumulative-layout-shift'].numericValue > 0.1) {
      recommendations.push({
        type: 'layout',
        priority: 'high',
        message: 'Reduce Cumulative Layout Shift',
        impact: 'Improve user experience and Core Web Vitals',
        suggestions: [
          'Add size attributes to images',
          'Reserve space for dynamic content',
          'Avoid inserting content above existing content'
        ]
      });
    }
    
    return recommendations;
  }

  generateAlerts(url, metrics, budgetStatus) {
    const alerts = [];
    
    Object.entries(budgetStatus).forEach(([metric, status]) => {
      if (!status.compliant && status.severity === 'critical') {
        alerts.push({
          type: 'budget_violation',
          severity: 'critical',
          url,
          metric,
          value: status.value,
          threshold: status.threshold,
          message: `Critical performance regression: ${metric} is ${
            typeof status.value === 'number' ? status.value.toFixed(2) : status.value
          }, exceeding budget of ${status.threshold}`
        });
      }
    });
    
    // Overall performance alert
    if (metrics.performance < 80) {
      alerts.push({
        type: 'performance_degradation',
        severity: metrics.performance < 60 ? 'critical' : 'warning',
        url,
        metric: 'overall_performance',
        value: metrics.performance,
        threshold: 90,
        message: `Overall performance score (${metrics.performance}) is below acceptable threshold`
      });
    }
    
    return alerts;
  }

  async sendAlertNotifications(alerts) {
    if (!this.alertWebhook) {
      console.log('⚠️ No webhook configured for alerts');
      return;
    }
    
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'warning');
    
    if (criticalAlerts.length === 0 && warningAlerts.length === 0) {
      return;
    }
    
    try {
      const payload = {
        text: `Lighthouse CI Performance Alert`,
        attachments: [{
          color: criticalAlerts.length > 0 ? 'danger' : 'warning',
          title: `Performance Budget Violations Detected`,
          fields: [
            {
              title: 'Critical Alerts',
              value: criticalAlerts.length.toString(),
              short: true
            },
            {
              title: 'Warning Alerts',
              value: warningAlerts.length.toString(),
              short: true
            }
          ],
          text: [...criticalAlerts, ...warningAlerts]
            .slice(0, 10)
            .map(alert => `• ${alert.message}`)
            .join('\n')
        }]
      };
      
      const response = await fetch(this.alertWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log('📢 Alert notifications sent');
      } else {
        console.error('❌ Failed to send alerts:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Failed to send alert notifications:', error);
    }
  }

  logAnalysisSummary(analysis) {
    console.log('\n📊 LIGHTHOUSE CI ANALYSIS SUMMARY');
    console.log('==================================');
    
    Object.entries(analysis.results).forEach(([url, metrics]) => {
      console.log(`\n🌐 ${url}`);
      console.log(`Performance: ${metrics.performance.toFixed(0)}/100`);
      console.log(`Accessibility: ${metrics.accessibility.toFixed(0)}/100`);
      console.log(`Best Practices: ${metrics.bestPractices.toFixed(0)}/100`);
      console.log(`SEO: ${metrics.seo.toFixed(0)}/100`);
      console.log(`LCP: ${Math.round(metrics.lcp)}ms`);
      console.log(`FCP: ${Math.round(metrics.fcp)}ms`);
      console.log(`CLS: ${metrics.cls.toFixed(3)}`);
      
      const budgetStatus = analysis.budgetStatus[url];
      const violations = Object.values(budgetStatus).filter(s => !s.compliant);
      
      if (violations.length > 0) {
        console.log(`❌ Budget violations: ${violations.length}`);
      } else {
        console.log('✅ All budgets met');
      }
    });
    
    if (analysis.recommendations.length > 0) {
      console.log('\n💡 TOP RECOMMENDATIONS:');
      analysis.recommendations
        .slice(0, 5)
        .forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.message} (${rec.priority} priority)`);
        });
    }
    
    console.log('\n==================================\n');
  }

  async runCommand(command, args) {
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        stdio: ['inherit', 'pipe', 'pipe'],
        shell: process.platform === 'win32'
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout?.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        process.stdout.write(output);
      });
      
      child.stderr?.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        process.stderr.write(output);
      });
      
      child.on('close', (code) => {
        resolve({
          success: code === 0,
          code,
          output: stdout,
          error: stderr
        });
      });
    });
  }

  async handleAssertionFailures(output) {
    console.log('📝 Processing assertion failures...');
    
    // Parse output to extract specific failures
    // This would be more sophisticated in a real implementation
    const lines = output.split('\n');
    const failures = lines
      .filter(line => line.includes('expected') || line.includes('assertion failed'))
      .map(line => line.trim());
    
    if (failures.length > 0) {
      console.log('⚠️ Assertion Failures:');
      failures.forEach((failure, index) => {
        console.log(`${index + 1}. ${failure}`);
      });
    }
  }

  extractReportUrls(output) {
    const lines = output.split('\n');
    const urlLine = lines.find(line => line.includes('View report at'));
    
    if (urlLine) {
      const url = urlLine.match(/(https?:\/\/[^\s]+)/)?.[1];
      if (url) {
        console.log(`📊 View detailed report: ${url}`);
      }
    }
  }

  getCommitSha() {
    try {
      const { execSync } = require('child_process');
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  async generateCIConfig() {
    const config = {
      name: 'Lighthouse CI Performance Testing',
      on: {
        push: {
          branches: ['main', 'development']
        },
        pull_request: {
          branches: ['main']
        }
      },
      jobs: {
        lighthouse: {
          'runs-on': 'ubuntu-latest',
          steps: [
            {
              uses: 'actions/checkout@v3'
            },
            {
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v3',
              with: {
                'node-version': '18',
                cache: 'npm'
              }
            },
            {
              name: 'Install dependencies',
              run: 'npm ci'
            },
            {
              name: 'Build application',
              run: 'npm run build'
            },
            {
              name: 'Run Lighthouse CI',
              run: 'npm run lighthouse:ci'
            }
          ]
        }
      }
    };
    
    const yamlContent = `# ${config.name}
name: ${config.name}

on:
  push:
    branches: [ main, development ]
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Run Lighthouse CI
      run: npm run lighthouse:ci
      env:
        LIGHTHOUSE_WEBHOOK_URL: \${{ secrets.LIGHTHOUSE_WEBHOOK_URL }}
`;
    
    const workflowDir = '.github/workflows';
    await fs.mkdir(workflowDir, { recursive: true });
    await fs.writeFile(path.join(workflowDir, 'lighthouse-ci.yml'), yamlContent);
    
    console.log('✅ GitHub Actions workflow generated');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  
  const lhci = new LighthouseCIIntegration();
  await lhci.init();
  
  switch (command) {
    case 'run':
      const options = {
        urls: args.includes('--urls') ? 
          args[args.indexOf('--urls') + 1].split(',') : 
          ['http://localhost:3000'],
        preset: args.includes('--preset') ? 
          args[args.indexOf('--preset') + 1] : 
          'desktop',
        numberOfRuns: args.includes('--runs') ? 
          parseInt(args[args.indexOf('--runs') + 1]) : 
          3
      };
      
      const result = await lhci.runLighthouseCI(options);
      process.exit(result.success ? 0 : 1);
      break;
      
    case 'generate-config':
      await lhci.generateCIConfig();
      break;
      
    default:
      console.log(`
Usage: node lighthouse-ci-integration.js [command] [options]

Commands:
  run                 Run Lighthouse CI analysis (default)
  generate-config     Generate GitHub Actions workflow

Options:
  --urls <urls>       Comma-separated list of URLs to test
  --preset <preset>   Lighthouse preset (mobile|desktop)
  --runs <number>     Number of runs per URL

Examples:
  node lighthouse-ci-integration.js run
  node lighthouse-ci-integration.js run --urls "http://localhost:3000,http://localhost:3000/about"
  node lighthouse-ci-integration.js run --preset mobile --runs 5
  node lighthouse-ci-integration.js generate-config
`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = LighthouseCIIntegration;
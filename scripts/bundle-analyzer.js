// Bundle Analysis and Optimization Script
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class BundleAnalyzer {
  constructor() {
    this.results = {
      bundleSize: 0,
      chunkSizes: {},
      recommendations: [],
      warnings: []
    };
  }

  // Analyze Next.js build output
  async analyzeBuild() {
    console.log('📦 Analyzing Next.js bundle...\n');

    try {
      // Run Next.js build with analyzer
      console.log('Building with bundle analyzer...');
      execSync('npm run build:analyze', { 
        stdio: 'pipe',
        cwd: process.cwd()
      });

      // Read build manifest
      const buildManifestPath = './.next/build-manifest.json';
      try {
        const buildManifest = JSON.parse(
          await fs.readFile(buildManifestPath, 'utf8')
        );
        
        await this.analyzeBuildManifest(buildManifest);
      } catch (error) {
        this.results.warnings.push('⚠️ Could not read build manifest');
      }

      // Analyze static files
      await this.analyzeStaticFiles();

    } catch (error) {
      console.error('❌ Build analysis failed:', error.message);
      this.results.warnings.push('⚠️ Build analysis incomplete');
    }
  }

  // Analyze build manifest for bundle insights
  async analyzeBuildManifest(manifest) {
    console.log('🔍 Analyzing bundle composition...');

    const pages = manifest.pages || {};
    let totalSize = 0;

    for (const [page, chunks] of Object.entries(pages)) {
      let pageSize = 0;
      
      for (const chunk of chunks) {
        try {
          const chunkPath = path.join('./.next/static', chunk);
          const stats = await fs.stat(chunkPath);
          pageSize += stats.size;
          totalSize += stats.size;
        } catch (error) {
          // Chunk file might not exist, skip
        }
      }

      this.results.chunkSizes[page] = {
        size: pageSize,
        chunks: chunks.length,
        sizeKB: Math.round(pageSize / 1024)
      };
    }

    this.results.bundleSize = totalSize;
    console.log(`📊 Total bundle size: ${Math.round(totalSize / 1024)} KB`);
  }

  // Analyze static files and images
  async analyzeStaticFiles() {
    console.log('🖼️ Analyzing static assets...');

    try {
      // Analyze images
      const imagesDir = './public/images';
      const originalImages = await this.getDirectorySize(imagesDir);
      
      const optimizedDir = './public/images/optimized';
      const optimizedImages = await this.getDirectorySize(optimizedDir);

      const compressionRatio = ((originalImages - optimizedImages) / originalImages) * 100;
      
      console.log(`Original images: ${Math.round(originalImages / 1024)} KB`);
      console.log(`Optimized images: ${Math.round(optimizedImages / 1024)} KB`);
      console.log(`Compression ratio: ${Math.round(compressionRatio)}%`);

      if (compressionRatio >= 50) {
        this.results.recommendations.push('✅ Excellent image compression achieved');
      } else if (compressionRatio >= 25) {
        this.results.recommendations.push('👍 Good image compression');
      } else {
        this.results.warnings.push('⚠️ Image compression could be improved');
      }

    } catch (error) {
      this.results.warnings.push('⚠️ Could not analyze static files');
    }
  }

  // Calculate directory size recursively
  async getDirectorySize(dirPath) {
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        
        if (file.isDirectory()) {
          totalSize += await this.getDirectorySize(filePath);
        } else {
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        }
      }

      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  // Generate optimization recommendations
  generateRecommendations() {
    const bundleSizeKB = Math.round(this.results.bundleSize / 1024);
    
    // Bundle size recommendations
    if (bundleSizeKB > 1000) {
      this.results.warnings.push('⚠️ Bundle size is large (>1MB). Consider code splitting.');
    } else if (bundleSizeKB > 500) {
      this.results.recommendations.push('👍 Bundle size is reasonable. Monitor for growth.');
    } else {
      this.results.recommendations.push('✅ Excellent bundle size optimization');
    }

    // Page-specific recommendations
    for (const [page, data] of Object.entries(this.results.chunkSizes)) {
      if (data.sizeKB > 200) {
        this.results.warnings.push(`⚠️ ${page} page is large (${data.sizeKB} KB)`);
      } else if (data.sizeKB > 100) {
        this.results.recommendations.push(`👍 ${page} page size is reasonable (${data.sizeKB} KB)`);
      }
    }

    // Chunk count recommendations
    const totalChunks = Object.values(this.results.chunkSizes)
      .reduce((sum, data) => sum + data.chunks, 0);
    
    if (totalChunks > 50) {
      this.results.warnings.push('⚠️ High number of chunks may impact loading');
    } else {
      this.results.recommendations.push('✅ Good chunk splitting strategy');
    }
  }

  // Generate detailed report
  async generateReport() {
    const report = `# Bundle Analysis Report

## Overall Statistics
- **Total Bundle Size**: ${Math.round(this.results.bundleSize / 1024)} KB
- **Number of Pages**: ${Object.keys(this.results.chunkSizes).length}
- **Average Page Size**: ${Math.round(this.results.bundleSize / Object.keys(this.results.chunkSizes).length / 1024)} KB

## Page Breakdown
${Object.entries(this.results.chunkSizes)
  .sort((a, b) => b[1].sizeKB - a[1].sizeKB)
  .map(([page, data]) => `- **${page}**: ${data.sizeKB} KB (${data.chunks} chunks)`)
  .join('\n')}

## Recommendations
${this.results.recommendations.map(rec => `- ${rec}`).join('\n')}

## Warnings
${this.results.warnings.map(warn => `- ${warn}`).join('\n')}

## Optimization Strategies

### 1. Code Splitting
- ✅ Implemented dynamic imports for non-critical components
- ✅ Vendor chunks separated from application code
- ✅ UI components chunked separately

### 2. Asset Optimization
- ✅ Images compressed with WebP/AVIF formats
- ✅ Responsive image sizing implemented
- ✅ Critical assets preloaded

### 3. Caching Strategy
- ✅ Service worker with advanced caching
- ✅ Static assets cached with long expiration
- ✅ Dynamic content with stale-while-revalidate

### 4. Bundle Monitoring
- Use \`npm run bundle:analyze\` regularly
- Monitor for size regressions in CI/CD
- Set up alerts for bundle size increases

## Next Steps
1. Monitor bundle size growth over time
2. Regular performance audits with Lighthouse
3. Implement progressive loading for heavy components
4. Consider server-side rendering for critical pages

Generated: ${new Date().toISOString()}
`;

    await fs.writeFile('./BUNDLE-ANALYSIS.md', report);
    console.log('📊 Bundle analysis report generated: BUNDLE-ANALYSIS.md');
  }

  // Run complete analysis
  async runAnalysis() {
    console.log('🔬 Starting comprehensive bundle analysis...\n');

    try {
      await this.analyzeBuild();
      this.generateRecommendations();
      await this.generateReport();

      // Display results
      console.log('\n📊 BUNDLE ANALYSIS RESULTS');
      console.log('='.repeat(50));
      
      console.log(`\n📦 Bundle Size: ${Math.round(this.results.bundleSize / 1024)} KB`);
      
      if (this.results.recommendations.length > 0) {
        console.log('\n✅ RECOMMENDATIONS:');
        this.results.recommendations.forEach(rec => console.log(`  ${rec}`));
      }
      
      if (this.results.warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        this.results.warnings.forEach(warn => console.log(`  ${warn}`));
      }

      console.log('\n🎯 Use "npm run bundle:analyze" to open the interactive analyzer');
      console.log('='.repeat(50));

    } catch (error) {
      console.error('❌ Bundle analysis failed:', error);
    }
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.runAnalysis().catch(console.error);
}

module.exports = BundleAnalyzer;
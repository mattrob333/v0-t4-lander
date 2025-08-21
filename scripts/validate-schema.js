/**
 * Comprehensive Structured Data Validation Tool
 * Validates Schema.org markup, generates validation reports, and provides optimization recommendations
 */

const https = require('https');
const fs = require('fs').promises;

class StructuredDataValidator {
  constructor() {
    this.validationRules = this.initializeValidationRules();
    this.schemaTypes = this.getSchemaTypes();
    this.aiOptimizationRules = this.initializeAiOptimizationRules();
  }

  /**
   * Initialize comprehensive validation rules
   */
  initializeValidationRules() {
    return {
      organization: {
        required: ['@type', 'name', 'url'],
        recommended: ['logo', 'description', 'address', 'telephone', 'email', 'sameAs'],
        aiOptimized: ['knowsAbout', 'areaServed', 'foundingDate', 'numberOfEmployees']
      },
      website: {
        required: ['@type', 'name', 'url'],
        recommended: ['publisher', 'potentialAction'],
        aiOptimized: ['inLanguage', 'audience', 'keywords']
      },
      service: {
        required: ['@type', 'name', 'provider'],
        recommended: ['description', 'serviceType', 'areaServed'],
        aiOptimized: ['offers', 'hasOfferCatalog', 'audience', 'serviceOutput']
      },
      article: {
        required: ['@type', 'headline', 'author', 'publisher', 'datePublished'],
        recommended: ['description', 'image', 'dateModified'],
        aiOptimized: ['keywords', 'about', 'audience', 'educationalLevel']
      },
      webpage: {
        required: ['@type', 'name', 'url'],
        recommended: ['description', 'inLanguage', 'isPartOf'],
        aiOptimized: ['about', 'audience', 'keywords', 'learningResourceType']
      },
      localBusiness: {
        required: ['@type', 'name', 'address', 'telephone'],
        recommended: ['url', 'openingHours', 'geo', 'image'],
        aiOptimized: ['areaServed', 'knowsAbout', 'paymentAccepted', 'priceRange']
      },
      faqPage: {
        required: ['@type', 'mainEntity'],
        recommended: ['name', 'description'],
        aiOptimized: ['about', 'audience', 'inLanguage']
      },
      breadcrumbList: {
        required: ['@type', 'itemListElement'],
        recommended: ['numberOfItems'],
        aiOptimized: ['name', 'description']
      }
    };
  }

  /**
   * Get supported Schema.org types
   */
  getSchemaTypes() {
    return [
      'Organization', 'WebSite', 'Service', 'Article', 'WebPage',
      'LocalBusiness', 'FAQPage', 'BreadcrumbList', 'Person',
      'Product', 'Review', 'Event', 'CreativeWork', 'Place'
    ];
  }

  /**
   * Initialize AI optimization rules
   */
  initializeAiOptimizationRules() {
    return {
      contentDepth: {
        description: 'AI systems prefer detailed, comprehensive content descriptions',
        check: (schema) => schema.description && schema.description.length >= 100,
        recommendation: 'Add detailed description (100+ characters) for better AI understanding'
      },
      semanticContext: {
        description: 'AI systems benefit from explicit semantic relationships',
        check: (schema) => schema.about || schema.keywords || schema.category,
        recommendation: 'Add "about", "keywords", or "category" properties for semantic context'
      },
      audienceSpecification: {
        description: 'AI systems use audience data for better content matching',
        check: (schema) => schema.audience,
        recommendation: 'Specify target audience using "audience" property'
      },
      educationalLevel: {
        description: 'AI systems consider content complexity for appropriate matching',
        check: (schema) => schema.educationalLevel || schema.learningResourceType,
        recommendation: 'Add "educationalLevel" or "learningResourceType" for AI optimization'
      },
      structuredRelationships: {
        description: 'AI systems understand interconnected data better',
        check: (schema) => schema.isPartOf || schema.hasPart || schema.relatedLink,
        recommendation: 'Add relationship properties like "isPartOf" or "hasPart"'
      }
    };
  }

  /**
   * Extract structured data from HTML using regex (lightweight alternative to jsdom)
   */
  extractStructuredData(html) {
    const structuredData = [];

    // Extract JSON-LD using regex
    const jsonLdRegex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis;
    let match;
    let index = 0;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const jsonContent = match[1].trim();
        const data = JSON.parse(jsonContent);
        structuredData.push({
          type: 'json-ld',
          index,
          data,
          source: 'script'
        });
      } catch (error) {
        structuredData.push({
          type: 'json-ld',
          index,
          error: `Invalid JSON: ${error.message}`,
          source: 'script'
        });
      }
      index++;
    }

    // Extract basic microdata using regex patterns
    const microdataMatches = html.match(/<[^>]*itemscope[^>]*>/gi);
    if (microdataMatches) {
      microdataMatches.forEach((match, index) => {
        const microdata = this.extractMicrodataFromString(html, match);
        if (microdata) {
          structuredData.push({
            type: 'microdata',
            index,
            data: microdata,
            source: 'html'
          });
        }
      });
    }

    return structuredData;
  }

  /**
   * Extract microdata from HTML string (simplified regex-based approach)
   */
  extractMicrodataFromString(html, itemScopeMatch) {
    // Extract itemtype from the itemscope element
    const itemTypeMatch = itemScopeMatch.match(/itemtype\s*=\s*["']([^"']+)["']/i);
    if (!itemTypeMatch) return null;

    const itemType = itemTypeMatch[1];
    const data = {
      '@type': itemType.split('/').pop(),
      '@context': 'https://schema.org'
    };

    // Find itemprop attributes in nearby HTML (simplified approach)
    const itemPropRegex = /itemprop\s*=\s*["']([^"']+)["'][^>]*(?:content\s*=\s*["']([^"']+)["']|href\s*=\s*["']([^"']+)["']|>([^<]+))/gi;
    let propMatch;
    
    while ((propMatch = itemPropRegex.exec(html)) !== null) {
      const propName = propMatch[1];
      const propValue = propMatch[2] || propMatch[3] || (propMatch[4] ? propMatch[4].trim() : '');
      if (propValue) {
        data[propName] = propValue;
      }
    }

    return Object.keys(data).length > 2 ? data : null; // Return only if we found actual properties
  }

  /**
   * Validate individual schema object
   */
  validateSchema(schema) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      recommendations: [],
      aiOptimizations: [],
      score: 0
    };

    if (!schema['@type']) {
      validation.errors.push('Missing required @type property');
      validation.valid = false;
      return validation;
    }

    const schemaType = schema['@type'].toLowerCase();
    const rules = this.validationRules[schemaType];

    if (!rules) {
      validation.warnings.push(`Unknown schema type: ${schema['@type']}`);
      validation.score += 50; // Base score for valid structure
      return validation;
    }

    let score = 0;

    // Check required properties
    rules.required.forEach(prop => {
      if (!schema[prop]) {
        validation.errors.push(`Missing required property: ${prop}`);
        validation.valid = false;
      } else {
        score += 20;
      }
    });

    // Check recommended properties
    rules.recommended.forEach(prop => {
      if (!schema[prop]) {
        validation.warnings.push(`Missing recommended property: ${prop}`);
        validation.recommendations.push(`Add ${prop} property for better SEO`);
      } else {
        score += 10;
      }
    });

    // Check AI-optimized properties
    rules.aiOptimized.forEach(prop => {
      if (!schema[prop]) {
        validation.recommendations.push(`Add ${prop} property for AI optimization`);
      } else {
        score += 15;
      }
    });

    // Check AI optimization rules
    Object.entries(this.aiOptimizationRules).forEach(([key, rule]) => {
      if (!rule.check(schema)) {
        validation.aiOptimizations.push(rule.recommendation);
      } else {
        score += 10;
      }
    });

    // Additional validations
    this.validateUrls(schema, validation);
    this.validateDates(schema, validation);
    this.validateImages(schema, validation);
    this.validateStructure(schema, validation);

    validation.score = Math.min(100, score);
    return validation;
  }

  /**
   * Validate URLs in schema
   */
  validateUrls(schema, validation) {
    const urlProperties = ['url', 'sameAs', 'logo', 'image'];
    urlProperties.forEach(prop => {
      const value = schema[prop];
      if (value) {
        const urls = Array.isArray(value) ? value : [value];
        urls.forEach(url => {
          if (typeof url === 'string' && !this.isValidUrl(url)) {
            validation.errors.push(`Invalid URL in ${prop}: ${url}`);
            validation.valid = false;
          }
        });
      }
    });
  }

  /**
   * Validate dates in schema
   */
  validateDates(schema, validation) {
    const dateProperties = ['datePublished', 'dateModified', 'foundingDate'];
    dateProperties.forEach(prop => {
      const value = schema[prop];
      if (value && !this.isValidDate(value)) {
        validation.errors.push(`Invalid date format in ${prop}: ${value}`);
        validation.valid = false;
      }
    });
  }

  /**
   * Validate images in schema
   */
  validateImages(schema, validation) {
    if (schema.image) {
      const images = Array.isArray(schema.image) ? schema.image : [schema.image];
      images.forEach(image => {
        if (typeof image === 'object') {
          if (!image.url) {
            validation.errors.push('Image object missing url property');
            validation.valid = false;
          }
          if (!image.width || !image.height) {
            validation.warnings.push('Image missing width/height properties');
          }
        }
      });
    }
  }

  /**
   * Validate overall structure
   */
  validateStructure(schema, validation) {
    // Check for circular references
    try {
      JSON.stringify(schema);
    } catch (error) {
      validation.errors.push('Circular reference detected in schema');
      validation.valid = false;
    }

    // Check for empty objects
    Object.entries(schema).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
        validation.warnings.push(`Empty object in property: ${key}`);
      }
    });
  }

  /**
   * Validate URL format
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate date format
   */
  isValidDate(dateString) {
    // Check ISO 8601 format
    const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
    if (!isoRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Validate structured data from URL
   */
  async validateUrl(url) {
    try {
      const html = await this.fetchHtml(url);
      const structuredData = this.extractStructuredData(html);
      
      const results = {
        url,
        timestamp: new Date().toISOString(),
        structuredData: structuredData.length,
        validations: [],
        summary: {
          valid: 0,
          invalid: 0,
          warnings: 0,
          averageScore: 0
        }
      };

      let totalScore = 0;
      let validCount = 0;

      structuredData.forEach((item, index) => {
        if (item.error) {
          results.validations.push({
            index,
            type: item.type,
            valid: false,
            errors: [item.error],
            score: 0
          });
          results.summary.invalid++;
        } else {
          const validation = this.validateSchema(item.data);
          results.validations.push({
            index,
            type: item.type,
            schemaType: item.data['@type'],
            ...validation
          });

          if (validation.valid) {
            validCount++;
          } else {
            results.summary.invalid++;
          }

          totalScore += validation.score;
          results.summary.warnings += validation.warnings.length;
        }
      });

      results.summary.valid = validCount;
      results.summary.averageScore = structuredData.length > 0 ? 
        Math.round(totalScore / structuredData.length) : 0;

      return results;
    } catch (error) {
      return {
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Fetch HTML from URL
   */
  async fetchHtml(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let html = '';
        res.on('data', chunk => html += chunk);
        res.on('end', () => resolve(html));
      }).on('error', reject);
    });
  }

  /**
   * Generate AI-optimized schema template
   */
  generateAiOptimizedSchema(type, data = {}) {
    const templates = {
      Organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name || 'Tier 4 Intelligence',
        url: data.url || 'https://tier4intelligence.com',
        logo: {
          '@type': 'ImageObject',
          url: data.logoUrl || 'https://tier4intelligence.com/logo.png',
          width: 600,
          height: 60
        },
        description: data.description || 'AI consulting firm specializing in rapid POC development',
        knowsAbout: data.expertise || [
          'Artificial Intelligence',
          'Machine Learning',
          'AI Proof of Concept',
          'Rapid AI Implementation'
        ],
        areaServed: {
          '@type': 'Place',
          name: 'San Francisco Bay Area'
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Business Decision Makers'
        }
      },
      
      WebPage: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: data.title || 'AI Consulting Services',
        url: data.url || 'https://tier4intelligence.com',
        description: data.description || 'Professional AI consulting with rapid implementation',
        inLanguage: 'en-US',
        about: {
          '@type': 'Service',
          serviceType: 'AI Consulting'
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Business Executives'
        },
        keywords: data.keywords || 'AI consulting, machine learning, rapid implementation',
        learningResourceType: 'consulting-content',
        educationalLevel: 'professional'
      }
    };

    return templates[type] || null;
  }

  /**
   * Generate comprehensive validation report
   */
  async generateValidationReport(urls) {
    console.log('🔍 Starting comprehensive structured data validation...\n');
    
    const report = {
      timestamp: new Date().toISOString(),
      totalUrls: urls.length,
      results: [],
      summary: {
        totalStructuredData: 0,
        validSchemas: 0,
        invalidSchemas: 0,
        averageScore: 0,
        commonIssues: {},
        aiOptimizationOpportunities: 0
      }
    };

    for (const url of urls) {
      console.log(`Validating: ${url}`);
      const result = await this.validateUrl(url);
      report.results.push(result);
      
      if (result.validations) {
        report.summary.totalStructuredData += result.structuredData;
        report.summary.validSchemas += result.summary.valid;
        report.summary.invalidSchemas += result.summary.invalid;
        
        // Track common issues
        result.validations.forEach(validation => {
          validation.errors?.forEach(error => {
            report.summary.commonIssues[error] = (report.summary.commonIssues[error] || 0) + 1;
          });
          
          if (validation.aiOptimizations?.length > 0) {
            report.summary.aiOptimizationOpportunities++;
          }
        });
      }
    }

    // Calculate average score
    const totalScores = report.results
      .filter(r => r.summary)
      .reduce((sum, r) => sum + r.summary.averageScore, 0);
    
    report.summary.averageScore = report.results.length > 0 ? 
      Math.round(totalScores / report.results.length) : 0;

    // Generate recommendations
    report.recommendations = this.generateRecommendations(report);

    return report;
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(report) {
    const recommendations = [];
    
    if (report.summary.averageScore < 70) {
      recommendations.push('Overall schema score is low. Focus on adding required properties.');
    }
    
    if (report.summary.aiOptimizationOpportunities > 0) {
      recommendations.push('Multiple AI optimization opportunities found. Add semantic context and audience data.');
    }

    // Analyze common issues
    const topIssues = Object.entries(report.summary.commonIssues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    topIssues.forEach(([issue, count]) => {
      recommendations.push(`Common issue (${count} occurrences): ${issue}`);
    });

    return recommendations;
  }
}

// Export for use as module
module.exports = StructuredDataValidator;

// Run if called directly
if (require.main === module) {
  const validator = new StructuredDataValidator();
  
  // Test URLs for validation
  const testUrls = [
    'https://tier4intelligence.com',
    'https://tier4intelligence.com/services/5-day-poc/',
    'https://tier4intelligence.com/ai-solutions/healthcare/automation/',
    'https://tier4intelligence.com/about/'
  ];

  validator.generateValidationReport(testUrls)
    .then(report => {
      console.log('\n📊 VALIDATION REPORT SUMMARY');
      console.log('============================');
      console.log(`Total URLs validated: ${report.totalUrls}`);
      console.log(`Total structured data items: ${report.summary.totalStructuredData}`);
      console.log(`Valid schemas: ${report.summary.validSchemas}`);
      console.log(`Invalid schemas: ${report.summary.invalidSchemas}`);
      console.log(`Average score: ${report.summary.averageScore}/100`);
      console.log(`AI optimization opportunities: ${report.summary.aiOptimizationOpportunities}`);
      
      if (report.recommendations.length > 0) {
        console.log('\n📝 RECOMMENDATIONS:');
        report.recommendations.forEach(rec => console.log(`• ${rec}`));
      }
    })
    .catch(console.error);
}
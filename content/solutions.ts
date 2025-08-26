/**
 * Solutions Data Schema - Single Source of Truth
 * 
 * This file defines the complete data structure for the T4I Solutions system
 * Supporting: mega-menu, home page tiles, solutions landing, category pages,
 * SEO optimization, analytics tracking, and future solution detail pages.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * SEO metadata interface for optimized search visibility
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}

/**
 * Analytics tracking configuration
 */
export interface AnalyticsConfig {
  category: string;
  action: string;
  label?: string;
  value?: number;
  customDimensions?: Record<string, string | number>;
}

/**
 * Solution priority and visibility flags
 */
export interface SolutionFlags {
  featured: boolean;           // Show in featured sections
  popular: boolean;           // Mark as popular solution
  new: boolean;              // Mark as new solution
  enterprise: boolean;        // Enterprise-focused solution
  priority: 1 | 2 | 3;       // Display priority (1 = highest)
}

/**
 * Solution complexity and engagement metrics
 */
export interface SolutionMetrics {
  implementationWeeks: number;  // Typical implementation time
  roiTimelineMonths: number;   // Expected ROI timeline
  complexity: 'low' | 'medium' | 'high';
  industryFit: string[];       // Best-fit industries
}

/**
 * Individual AI Solution definition
 */
export interface Solution {
  // Core identifiers
  title: string;
  slug: string;                // URL-safe identifier
  
  // Content
  summary: string;             // 1-line description for cards
  description?: string;        // Longer description for detail pages
  
  // Categorization
  tags: string[];             // Filterable tags ["Chat", "Voice", "CRM"]
  category: string;           // Parent category slug
  
  // UI & UX
  icon?: string;              // Lucide icon name
  color?: string;             // Theme color override
  
  // Flags & Priority
  flags: SolutionFlags;
  metrics: SolutionMetrics;
  
  // SEO & Marketing
  seo: SEOMetadata;
  
  // Analytics
  analytics: AnalyticsConfig;
  
  // Future extensibility
  features?: string[];        // Key feature list
  benefits?: string[];        // Business benefits
  useCases?: string[];        // Specific use cases
  integrations?: string[];    // Compatible integrations
  pricing?: {
    model: 'fixed' | 'usage' | 'subscription' | 'custom';
    startingPrice?: number;
    currency?: string;
  };
  
  // Content for future detail pages
  content?: {
    hero?: {
      headline: string;
      subheadline: string;
      backgroundImage?: string;
    };
    sections?: Array<{
      type: 'features' | 'benefits' | 'process' | 'faq' | 'cta';
      title: string;
      content: any;
    }>;
  };
}

/**
 * Solution Category definition
 */
export interface Category {
  // Core identifiers
  title: string;
  slug: string;                // Must match route parameter
  
  // Content
  tagline: string;            // 1-line description
  description?: string;       // Longer description for landing page
  
  // UI
  icon: string;               // Lucide icon name
  color?: string;             // Theme color
  gradient?: {
    from: string;
    to: string;
  };
  
  // Solutions
  solutions: Solution[];
  
  // SEO
  seo: SEOMetadata;
  
  // Analytics
  analytics: AnalyticsConfig;
  
  // Display configuration
  displayConfig: {
    featuredSolutionsCount: number;  // How many to show in mega-menu
    gridLayout: '2x3' | '3x2' | '1x6';  // Preferred layout
    showInNav: boolean;              // Include in main navigation
    sortOrder: number;               // Display order
  };
  
  // Future extensibility
  heroContent?: {
    headline: string;
    subheadline: string;
    backgroundImage?: string;
    ctaText: string;
    ctaHref: string;
  };
}

/**
 * Featured products configuration for right rail/sidebar
 */
export interface FeaturedProduct {
  title: string;
  slug: string;
  blurb: string;
  icon?: string;
  href: string;
  analytics: AnalyticsConfig;
}

/**
 * Global solutions configuration
 */
export interface SolutionsConfig {
  // Mega-menu configuration
  megaMenu: {
    columnsCount: number;
    featuredSolutionsCount: number;
    showViewAllLink: boolean;
  };
  
  // Home page configuration
  homePage: {
    sectionTitle: string;
    sectionSubtitle?: string;
    tilesLayout: '2x3' | '3x2' | '1x6';
  };
  
  // Solutions landing configuration
  landingPage: {
    hero: {
      title: string;
      subtitle: string;
      backgroundImage?: string;
    };
    cardsLayout: '2x3' | '3x2' | '1x6';
  };
  
  // Global CTAs
  ctas: {
    primary: {
      text: string;
      href: string;
      analytics: AnalyticsConfig;
    };
    secondary?: {
      text: string;
      href: string;
      analytics: AnalyticsConfig;
    };
  };
  
  // Analytics configuration
  analytics: {
    categoryPrefix: string;
    trackingEvents: {
      menuOpen: string;
      categoryClick: string;
      solutionClick: string;
      ctaClick: string;
    };
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate SEO-friendly URL slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get featured solutions from a category
 */
export function getFeaturedSolutions(category: Category, count?: number): Solution[] {
  const featuredCount = count || category.displayConfig.featuredSolutionsCount;
  return category.solutions
    .filter(solution => solution.flags.featured)
    .sort((a, b) => a.flags.priority - b.flags.priority)
    .slice(0, featuredCount);
}

/**
 * Get solutions by tag
 */
export function getSolutionsByTag(categories: Category[], tag: string): Solution[] {
  return categories
    .flatMap(category => category.solutions)
    .filter(solution => solution.tags.includes(tag))
    .sort((a, b) => a.flags.priority - b.flags.priority);
}

/**
 * Find category by slug
 */
export function findCategoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find(category => category.slug === slug);
}

/**
 * Find solution by category and solution slugs
 */
export function findSolution(categories: Category[], categorySlug: string, solutionSlug: string): Solution | undefined {
  const category = findCategoryBySlug(categories, categorySlug);
  return category?.solutions.find(solution => solution.slug === solutionSlug);
}

/**
 * Generate breadcrumbs for a solution
 */
export function generateBreadcrumbs(categorySlug: string, solutionSlug?: string): Array<{name: string, href: string}> {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Solutions', href: '/solutions' }
  ];
  
  if (categorySlug) {
    const category = findCategoryBySlug(CATEGORIES, categorySlug);
    if (category) {
      breadcrumbs.push({
        name: category.title,
        href: `/solutions/${categorySlug}`
      });
    }
  }
  
  if (solutionSlug && categorySlug) {
    const solution = findSolution(CATEGORIES, categorySlug, solutionSlug);
    if (solution) {
      breadcrumbs.push({
        name: solution.title,
        href: `/solutions/${categorySlug}/${solutionSlug}`
      });
    }
  }
  
  return breadcrumbs;
}

// ============================================================================
// SOLUTIONS DATA
// ============================================================================

export const CATEGORIES: Category[] = [
  {
    title: "Customer Self-Service",
    slug: "customer-self-service",
    tagline: "Automate high-volume requests across chat, voice, email, SMS & social.",
    description: "Transform customer support with AI-powered self-service solutions that handle routine inquiries, reduce wait times, and improve satisfaction while freeing your team for complex issues.",
    icon: "Bot",
    color: "#10B981", // Emerald
    gradient: { from: "#10B981", to: "#059669" },
    seo: {
      title: "Customer Self-Service AI Solutions | Tier 4 Intelligence",
      description: "Automate customer support with AI chatbots, voicebots, and multichannel virtual agents. Reduce costs while improving customer satisfaction.",
      keywords: ["customer self-service", "AI chatbot", "virtual agent", "automated customer support", "conversational AI"],
      ogTitle: "AI-Powered Customer Self-Service Solutions",
      ogDescription: "Deploy intelligent chatbots and virtual agents that handle customer inquiries 24/7, reducing costs and improving satisfaction."
    },
    analytics: {
      category: "solutions",
      action: "category_view",
      label: "customer-self-service"
    },
    displayConfig: {
      featuredSolutionsCount: 4,
      gridLayout: "2x3",
      showInNav: true,
      sortOrder: 1
    },
    heroContent: {
      headline: "Transform Customer Support with AI Self-Service",
      subheadline: "Deploy intelligent virtual agents that handle 80% of routine inquiries, reduce wait times, and improve customer satisfaction.",
      ctaText: "Book Discovery Call",
      ctaHref: "/contact"
    },
    solutions: [
      {
        title: "Website Chatbot & Handoff",
        slug: "website-chatbot",
        summary: "Conversational web bot with seamless live-agent escalation.",
        description: "Deploy an intelligent website chatbot that handles common inquiries, captures leads, and seamlessly transfers complex issues to human agents with full context.",
        category: "customer-self-service",
        tags: ["Chat", "Web", "Lead Generation"],
        icon: "MessageSquare",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: false,
          priority: 1
        },
        metrics: {
          implementationWeeks: 2,
          roiTimelineMonths: 1,
          complexity: "low",
          industryFit: ["retail", "finance", "healthcare", "technology"]
        },
        seo: {
          title: "AI Website Chatbot with Live Agent Handoff | T4I",
          description: "Deploy intelligent website chatbots that handle customer inquiries 24/7 and seamlessly transfer to human agents when needed.",
          keywords: ["website chatbot", "live chat", "AI customer service", "lead generation bot"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "website-chatbot",
          customDimensions: { "solution_type": "chatbot" }
        },
        features: ["24/7 availability", "Natural language processing", "CRM integration", "Analytics dashboard"],
        benefits: ["Reduce support costs by 40%", "Improve response times", "Capture more leads", "Scale support operations"],
        integrations: ["Salesforce", "HubSpot", "Zendesk", "Intercom"]
      },
      {
        title: "Multichannel Virtual Agent",
        slug: "multichannel-virtual-agent",
        summary: "One bot across SMS, WhatsApp, FB, Slack, and mobile.",
        description: "Unified virtual agent that provides consistent customer service across all communication channels with centralized management and analytics.",
        category: "customer-self-service",
        tags: ["Omnichannel", "SMS", "WhatsApp", "Social"],
        icon: "Smartphone",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: true,
          priority: 1
        },
        metrics: {
          implementationWeeks: 4,
          roiTimelineMonths: 2,
          complexity: "medium",
          industryFit: ["retail", "hospitality", "finance"]
        },
        seo: {
          title: "Multichannel AI Virtual Agent | Omnichannel Customer Service",
          description: "Deploy a single AI virtual agent across SMS, WhatsApp, Facebook, and more. Consistent customer experience everywhere.",
          keywords: ["multichannel bot", "omnichannel customer service", "WhatsApp bot", "SMS automation"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "multichannel-virtual-agent"
        }
      },
      {
        title: "Voicebot & IVR Modernization",
        slug: "voicebot-ivr",
        summary: "Natural speech IVR with intent routing and tasks.",
        description: "Replace outdated phone trees with intelligent voice AI that understands natural speech and routes calls efficiently.",
        category: "customer-self-service",
        tags: ["Voice", "IVR", "Phone", "Natural Language"],
        icon: "Phone",
        flags: {
          featured: true,
          popular: false,
          new: true,
          enterprise: true,
          priority: 2
        },
        metrics: {
          implementationWeeks: 6,
          roiTimelineMonths: 3,
          complexity: "high",
          industryFit: ["finance", "insurance", "healthcare", "logistics"]
        },
        seo: {
          title: "AI Voicebot & IVR Modernization Solutions",
          description: "Replace outdated phone systems with AI voicebots that understand natural speech and route calls intelligently.",
          keywords: ["voicebot", "IVR modernization", "AI phone system", "speech recognition"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "voicebot-ivr"
        }
      },
      {
        title: "Email Triage & Autoresponse",
        slug: "email-triage",
        summary: "Prioritize & draft replies; human in the loop.",
        description: "Automatically categorize, prioritize, and draft responses to customer emails with human approval workflows.",
        category: "customer-self-service",
        tags: ["Email", "Automation", "Triage"],
        icon: "Mail",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: false,
          priority: 2
        },
        metrics: {
          implementationWeeks: 3,
          roiTimelineMonths: 2,
          complexity: "medium",
          industryFit: ["technology", "finance", "legal", "healthcare"]
        },
        seo: {
          title: "AI Email Triage & Automated Response System",
          description: "Automatically prioritize and respond to customer emails with AI-powered triage and draft generation.",
          keywords: ["email automation", "AI email triage", "automated customer service", "email response system"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "email-triage"
        }
      },
      {
        title: "Social DM & Comment Automation",
        slug: "social-automation",
        summary: "Handle DMs/comments, escalate when needed.",
        category: "customer-self-service",
        tags: ["Social", "Automation", "Community Management"],
        icon: "MessageCircle",
        flags: {
          featured: false,
          popular: true,
          new: false,
          enterprise: false,
          priority: 3
        },
        metrics: {
          implementationWeeks: 2,
          roiTimelineMonths: 1,
          complexity: "low",
          industryFit: ["retail", "hospitality", "entertainment"]
        },
        seo: {
          title: "Social Media Automation & AI Comment Management",
          description: "Automatically respond to social media comments and DMs with AI while escalating complex issues to human agents.",
          keywords: ["social media automation", "AI social management", "automated comments", "social customer service"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "social-automation"
        }
      },
      {
        title: "Appointment Scheduling Bot",
        slug: "appointment-bot",
        summary: "Book, reschedule, remind—calendar integrated.",
        category: "customer-self-service",
        tags: ["Scheduling", "Calendar", "Appointments"],
        icon: "Calendar",
        flags: {
          featured: false,
          popular: true,
          new: false,
          enterprise: false,
          priority: 2
        },
        metrics: {
          implementationWeeks: 2,
          roiTimelineMonths: 1,
          complexity: "low",
          industryFit: ["healthcare", "legal", "real-estate", "hospitality"]
        },
        seo: {
          title: "AI Appointment Scheduling Bot | Automated Booking",
          description: "Let customers book, reschedule, and manage appointments automatically with AI-powered scheduling integration.",
          keywords: ["appointment bot", "automated scheduling", "booking system", "calendar integration"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "appointment-bot"
        }
      }
      // Additional solutions would continue here...
    ]
  },
  {
    title: "Agent & Employee Copilots",
    slug: "agent-employee-copilots",
    tagline: "Real-time assistance, summaries and drafting to boost productivity.",
    description: "Empower your team with AI copilots that provide real-time assistance, automated documentation, and intelligent suggestions to boost productivity and improve outcomes.",
    icon: "UserRoundCog",
    color: "#3B82F6", // Blue
    gradient: { from: "#3B82F6", to: "#1D4ED8" },
    seo: {
      title: "AI Agent & Employee Copilots | Productivity Enhancement Tools",
      description: "Boost team productivity with AI copilots that provide real-time assistance, automated summaries, and intelligent suggestions.",
      keywords: ["AI copilot", "employee productivity", "agent assistance", "AI productivity tools", "workplace AI"],
      ogTitle: "AI-Powered Employee Copilots & Agent Assistance",
      ogDescription: "Transform workplace productivity with AI copilots that assist agents and employees in real-time."
    },
    analytics: {
      category: "solutions",
      action: "category_view",
      label: "agent-employee-copilots"
    },
    displayConfig: {
      featuredSolutionsCount: 4,
      gridLayout: "2x3",
      showInNav: true,
      sortOrder: 2
    },
    solutions: [
      {
        title: "Agent Assist (Live)",
        slug: "agent-assist",
        summary: "Next-best-action & reply suggestions during calls/chats.",
        description: "Real-time AI assistance for customer service agents with suggested responses, next-best-actions, and contextual information during live interactions.",
        category: "agent-employee-copilots",
        tags: ["Real-time", "Agent Support", "Live Chat", "Call Center"],
        icon: "Headphones",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: true,
          priority: 1
        },
        metrics: {
          implementationWeeks: 4,
          roiTimelineMonths: 2,
          complexity: "medium",
          industryFit: ["finance", "insurance", "healthcare", "technology"]
        },
        seo: {
          title: "Real-Time AI Agent Assist | Live Customer Service Support",
          description: "Empower customer service agents with real-time AI suggestions, next-best-actions, and contextual information during live interactions.",
          keywords: ["agent assist", "real-time AI", "customer service AI", "live chat assistance", "call center AI"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "agent-assist"
        }
      },
      {
        title: "Auto-Summary & Disposition",
        slug: "auto-summary",
        summary: "Instant summaries & CRM/ticket updates.",
        category: "agent-employee-copilots",
        tags: ["Automation", "CRM", "Documentation", "Summaries"],
        icon: "FileText",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: false,
          priority: 1
        },
        metrics: {
          implementationWeeks: 3,
          roiTimelineMonths: 1,
          complexity: "medium",
          industryFit: ["finance", "healthcare", "legal", "real-estate"]
        },
        seo: {
          title: "AI Auto-Summary & CRM Integration | Automated Documentation",
          description: "Automatically generate interaction summaries and update CRM records with AI-powered documentation tools.",
          keywords: ["auto summary", "CRM automation", "call documentation", "AI summaries", "automated disposition"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "auto-summary"
        }
      }
      // Additional agent copilot solutions...
    ]
  },
  {
    title: "Analytics & Quality Intelligence",
    slug: "analytics-quality-intelligence",
    tagline: "Mine every interaction for QA, compliance, and business insight.",
    description: "Extract actionable insights from customer interactions with AI-powered analytics, quality monitoring, and predictive intelligence systems.",
    icon: "LineChart",
    color: "#8B5CF6", // Purple
    gradient: { from: "#8B5CF6", to: "#7C3AED" },
    seo: {
      title: "AI Analytics & Quality Intelligence Solutions",
      description: "Transform customer interactions into business insights with AI-powered analytics, quality monitoring, and predictive intelligence.",
      keywords: ["conversation analytics", "quality monitoring", "AI insights", "customer intelligence", "predictive analytics"],
      ogTitle: "AI-Powered Analytics & Quality Intelligence",
      ogDescription: "Extract actionable insights from every customer interaction with advanced AI analytics and quality monitoring."
    },
    analytics: {
      category: "solutions",
      action: "category_view",
      label: "analytics-quality-intelligence"
    },
    displayConfig: {
      featuredSolutionsCount: 3,
      gridLayout: "2x3",
      showInNav: true,
      sortOrder: 3
    },
    solutions: [
      {
        title: "Conversation Intelligence",
        slug: "conversation-intelligence",
        summary: "Topics, intents, moments and sentiment at scale.",
        category: "analytics-quality-intelligence",
        tags: ["Analytics", "NLP", "Sentiment", "Topics"],
        icon: "Brain",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: true,
          priority: 1
        },
        metrics: {
          implementationWeeks: 4,
          roiTimelineMonths: 3,
          complexity: "high",
          industryFit: ["finance", "healthcare", "technology", "insurance"]
        },
        seo: {
          title: "AI Conversation Intelligence & Analytics Platform",
          description: "Analyze customer conversations at scale with AI-powered topic detection, sentiment analysis, and intent recognition.",
          keywords: ["conversation intelligence", "AI analytics", "sentiment analysis", "conversation mining", "customer insights"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "conversation-intelligence"
        }
      }
      // Additional analytics solutions...
    ]
  },
  {
    title: "Automation & Orchestration",
    slug: "automation-orchestration",
    tagline: "Zapier/Make, RPA and routing to eliminate manual work.",
    description: "Streamline operations with intelligent automation that connects systems, orchestrates workflows, and eliminates repetitive manual tasks.",
    icon: "Workflow",
    color: "#F59E0B", // Amber
    gradient: { from: "#F59E0B", to: "#D97706" },
    seo: {
      title: "Business Process Automation & Orchestration Solutions",
      description: "Eliminate manual work with intelligent automation, RPA, and workflow orchestration solutions that connect your entire tech stack.",
      keywords: ["business automation", "RPA", "workflow orchestration", "process automation", "system integration"],
      ogTitle: "AI-Powered Business Automation & Orchestration",
      ogDescription: "Connect systems and automate workflows to eliminate manual work and boost operational efficiency."
    },
    analytics: {
      category: "solutions",
      action: "category_view",
      label: "automation-orchestration"
    },
    displayConfig: {
      featuredSolutionsCount: 4,
      gridLayout: "2x3",
      showInNav: true,
      sortOrder: 4
    },
    solutions: [
      {
        title: "Workflow Automation Hub",
        slug: "zapier-make",
        summary: "No-code workflows across your SaaS stack.",
        category: "automation-orchestration",
        tags: ["No-Code", "Integration", "Workflows", "SaaS"],
        icon: "Zap",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: false,
          priority: 1
        },
        metrics: {
          implementationWeeks: 2,
          roiTimelineMonths: 1,
          complexity: "low",
          industryFit: ["technology", "retail", "finance", "marketing"]
        },
        seo: {
          title: "No-Code Workflow Automation Hub | SaaS Integration Platform",
          description: "Connect and automate workflows across your entire SaaS stack with no-code automation solutions.",
          keywords: ["workflow automation", "no-code automation", "SaaS integration", "business process automation"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "workflow-automation"
        }
      }
      // Additional automation solutions...
    ]
  },
  {
    title: "LLM, Platforms & Integration",
    slug: "llm-platforms-integration",
    tagline: "Model strategy, RAG, search, security, and deep integrations.",
    description: "Build robust AI infrastructure with optimized language models, secure integrations, and enterprise-grade platforms that scale with your business.",
    icon: "Boxes",
    color: "#EF4444", // Red
    gradient: { from: "#EF4444", to: "#DC2626" },
    seo: {
      title: "LLM Integration & AI Platform Development Solutions",
      description: "Build enterprise AI infrastructure with optimized language models, secure integrations, and scalable platform solutions.",
      keywords: ["LLM integration", "AI platform development", "enterprise AI", "model optimization", "AI infrastructure"],
      ogTitle: "Enterprise LLM & AI Platform Solutions",
      ogDescription: "Build robust AI infrastructure with optimized language models and secure, scalable integrations."
    },
    analytics: {
      category: "solutions",
      action: "category_view",
      label: "llm-platforms-integration"
    },
    displayConfig: {
      featuredSolutionsCount: 4,
      gridLayout: "2x3",
      showInNav: true,
      sortOrder: 5
    },
    solutions: [
      {
        title: "LLM Strategy & Model Fit",
        slug: "llm-strategy",
        summary: "Choose models based on cost/quality/risk.",
        category: "llm-platforms-integration",
        tags: ["Strategy", "Model Selection", "Optimization", "Cost Management"],
        icon: "Target",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: true,
          priority: 1
        },
        metrics: {
          implementationWeeks: 6,
          roiTimelineMonths: 4,
          complexity: "high",
          industryFit: ["technology", "finance", "healthcare", "manufacturing"]
        },
        seo: {
          title: "LLM Strategy & AI Model Selection Consulting",
          description: "Optimize your AI investment with expert LLM strategy and model selection based on cost, quality, and risk factors.",
          keywords: ["LLM strategy", "AI model selection", "model optimization", "AI consulting", "enterprise AI strategy"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "llm-strategy"
        }
      }
      // Additional platform solutions...
    ]
  },
  {
    title: "Advisory, Training & Managed AI",
    slug: "advisory-training-managed-ai",
    tagline: "Blueprints, POCs, Fractional CAO, and enablement.",
    description: "Accelerate AI adoption with expert guidance, comprehensive training programs, and managed AI services that ensure successful implementation and ongoing optimization.",
    icon: "GraduationCap",
    color: "#06B6D4", // Cyan
    gradient: { from: "#06B6D4", to: "#0891B2" },
    seo: {
      title: "AI Advisory, Training & Managed Services Solutions",
      description: "Accelerate AI adoption with expert advisory services, comprehensive training programs, and managed AI solutions.",
      keywords: ["AI advisory", "AI training", "managed AI services", "AI consulting", "fractional CAO", "AI enablement"],
      ogTitle: "Expert AI Advisory & Managed Services",
      ogDescription: "Fast-track your AI transformation with expert guidance, training, and managed AI services."
    },
    analytics: {
      category: "solutions",
      action: "category_view",
      label: "advisory-training-managed-ai"
    },
    displayConfig: {
      featuredSolutionsCount: 4,
      gridLayout: "2x3",
      showInNav: true,
      sortOrder: 6
    },
    solutions: [
      {
        title: "AI Opportunity Scan & Blueprint",
        slug: "opportunity-scan",
        summary: "Discovery → developer-ready PRDs with ROI targets.",
        category: "advisory-training-managed-ai",
        tags: ["Discovery", "Strategy", "Blueprint", "ROI"],
        icon: "Search",
        flags: {
          featured: true,
          popular: true,
          new: false,
          enterprise: true,
          priority: 1
        },
        metrics: {
          implementationWeeks: 2,
          roiTimelineMonths: 1,
          complexity: "low",
          industryFit: ["all"]
        },
        seo: {
          title: "AI Opportunity Scan & Strategic Blueprint Development",
          description: "Discover AI opportunities and create developer-ready blueprints with clear ROI targets and implementation roadmaps.",
          keywords: ["AI opportunity scan", "AI strategy", "AI blueprint", "AI assessment", "AI roadmap"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "opportunity-scan"
        }
      },
      {
        title: "Fractional CAO",
        slug: "fractional-cao",
        summary: "Lead automation as a service.",
        category: "advisory-training-managed-ai",
        tags: ["Leadership", "Strategy", "Fractional", "Executive"],
        icon: "Crown",
        flags: {
          featured: true,
          popular: true,
          new: true,
          enterprise: true,
          priority: 1
        },
        metrics: {
          implementationWeeks: 1,
          roiTimelineMonths: 3,
          complexity: "medium",
          industryFit: ["technology", "finance", "manufacturing", "healthcare"]
        },
        seo: {
          title: "Fractional Chief Automation Officer Services",
          description: "Get executive-level AI and automation leadership without full-time commitment. Strategic guidance for your AI transformation.",
          keywords: ["fractional CAO", "fractional executive", "AI leadership", "automation strategy", "interim CAO"]
        },
        analytics: {
          category: "solutions",
          action: "solution_view",
          label: "fractional-cao"
        }
      }
      // Additional advisory solutions...
    ]
  }
];

// ============================================================================
// FEATURED PRODUCTS CONFIGURATION
// ============================================================================

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    title: "Business DNA Map™",
    slug: "business-dna-map",
    blurb: "Process & context mapping for AI readiness.",
    icon: "GitBranch",
    href: "/solutions/advisory-training-managed-ai/business-dna-map",
    analytics: {
      category: "featured_products",
      action: "click",
      label: "business-dna-map"
    }
  },
  {
    title: "OrgArchitect",
    slug: "orgarchitect", 
    blurb: "Auto-generated org charts + role prompts.",
    icon: "Users",
    href: "/solutions/advisory-training-managed-ai/orgarchitect",
    analytics: {
      category: "featured_products",
      action: "click",
      label: "orgarchitect"
    }
  },
  {
    title: "PromptMart™",
    slug: "promptmart",
    blurb: "Deploy vetted prompts and agents quickly.",
    icon: "ShoppingBag",
    href: "/solutions/advisory-training-managed-ai/promptmart",
    analytics: {
      category: "featured_products",
      action: "click",
      label: "promptmart"
    }
  }
];

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================

export const SOLUTIONS_CONFIG: SolutionsConfig = {
  megaMenu: {
    columnsCount: 2,
    featuredSolutionsCount: 4,
    showViewAllLink: true
  },
  homePage: {
    sectionTitle: "Our Areas of Expertise",
    sectionSubtitle: "AI-powered solutions designed to transform your business operations and accelerate growth.",
    tilesLayout: "2x3"
  },
  landingPage: {
    hero: {
      title: "AI-Powered Solutions to Transform Your Business",
      subtitle: "We design and implement AI that removes bottlenecks and proves ROI—fast.",
      backgroundImage: "/images/solutions-hero-bg.jpg"
    },
    cardsLayout: "2x3"
  },
  ctas: {
    primary: {
      text: "Book an AI Opportunity Scan",
      href: "/contact",
      analytics: {
        category: "cta",
        action: "click",
        label: "opportunity-scan"
      }
    },
    secondary: {
      text: "View All Solutions",
      href: "/solutions",
      analytics: {
        category: "cta",
        action: "click", 
        label: "view-all-solutions"
      }
    }
  },
  analytics: {
    categoryPrefix: "solutions",
    trackingEvents: {
      menuOpen: "solutions_menu_open",
      categoryClick: "solutions_category_click", 
      solutionClick: "solutions_solution_click",
      ctaClick: "cta_opportunity_scan_click"
    }
  }
};

// ============================================================================
// CONSTANTS & EXPORTS
// ============================================================================

export const SOLUTION_TAGS = [
  "Chat", "Voice", "Email", "SMS", "Social", "Web", "Mobile",
  "Analytics", "Automation", "Integration", "Security", "Compliance",
  "Real-time", "CRM", "Knowledge", "Scheduling", "E-commerce",
  "Omnichannel", "NLP", "Machine Learning", "Enterprise"
] as const;

export const INDUSTRY_TAGS = [
  "healthcare", "finance", "retail", "manufacturing", "logistics",
  "insurance", "real-estate", "education", "legal", "hospitality", 
  "technology", "energy"
] as const;

export const COMPLEXITY_LEVELS = ["low", "medium", "high"] as const;

export const PRIORITY_LEVELS = [1, 2, 3] as const;

// Type exports for external use
export type SolutionTag = typeof SOLUTION_TAGS[number];
export type IndustryTag = typeof INDUSTRY_TAGS[number]; 
export type ComplexityLevel = typeof COMPLEXITY_LEVELS[number];
export type PriorityLevel = typeof PRIORITY_LEVELS[number];
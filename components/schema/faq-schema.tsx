import Script from 'next/script'

export function FAQSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://tier4intelligence.com/#faq",
    "name": "Frequently Asked Questions - AI Consulting Services",
    "description": "Common questions about our 5-day AI POC, opportunity assessments, and executive briefing services.",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What exactly do you deliver in a 5-day AI POC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In 5 days, we deliver a working AI prototype tailored to your specific use case, complete ROI validation with documented 3-4x return metrics, technical architecture documentation, implementation roadmap, and an executive presentation. You get a tangible, functioning demonstration of AI solving your business problem, not just a presentation or proposal."
        }
      },
      {
        "@type": "Question", 
        "name": "How can you guarantee 3-4x ROI validation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our ROI validation is based on measurable business metrics identified during our discovery process. We focus on quantifiable improvements like cost reduction, time savings, error reduction, and productivity gains. Our methodology has been validated across 200+ implementations, and we only proceed with POCs where we can clearly demonstrate measurable value. If we can't validate ROI, we don't build the POC."
        }
      },
      {
        "@type": "Question",
        "name": "What makes your approach 'vendor-neutral'?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "We're not affiliated with any AI platform, cloud provider, or software vendor. Our recommendations are based solely on what's best for your specific use case and business requirements. We evaluate solutions from all major providers (AWS, Google, Microsoft, OpenAI, Anthropic, etc.) and recommend the optimal combination for your needs, not what earns us the highest commission."
        }
      },
      {
        "@type": "Question",
        "name": "Who should attend the 60-minute executive briefing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The executive briefing is designed for C-suite executives, VPs, and senior directors who need to make strategic decisions about AI implementation. It's perfect for leaders who want to cut through AI hype and buzzwords to understand practical opportunities and realistic timelines for their organization."
        }
      },
      {
        "@type": "Question",
        "name": "What industries do you work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We work across all industries including healthcare, finance, manufacturing, retail, logistics, insurance, real estate, education, legal, hospitality, technology, and energy. Our vendor-neutral methodology adapts to industry-specific requirements and regulations, ensuring compliance and optimal results regardless of your sector."
        }
      },
      {
        "@type": "Question",
        "name": "How do you ensure data security and privacy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We maintain enterprise-grade security protocols including SOC 2 Type II compliance, encrypted data transmission and storage, strict access controls, and comprehensive NDAs. All POC development can be done within your existing security infrastructure, and we never store or retain your proprietary data beyond the engagement period."
        }
      },
      {
        "@type": "Question",
        "name": "What happens after the 5-day POC is complete?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You receive complete documentation including source code, technical specifications, deployment instructions, and scaling recommendations. You own everything we build. We can also provide ongoing support for implementation, team training, and scaling, but there's no obligation. Many clients use our POC as the foundation for their internal development or to inform their vendor selection process."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a 5-day AI POC cost?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our 5-day AI POC investment starts at $25,000, which includes the complete working prototype, ROI validation, technical documentation, and implementation roadmap. The AI Opportunity Assessment is $15,000, and the 60-minute Executive Briefing is complimentary. Pricing may vary based on complexity and specific requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide ongoing AI implementation support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer comprehensive implementation support including team training, scaled deployment assistance, ongoing optimization, and fractional Chief AI Officer services. However, our goal is to make you self-sufficient, so ongoing support is optional and tailored to your internal capabilities and preferences."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly can we get started?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We can typically begin a 5-day POC within 2-3 weeks of our initial assessment. The AI Opportunity Assessment can start within 1 week, and Executive Briefings can often be scheduled within 48 hours. Our rapid start capability is one of our key differentiators - we eliminate the lengthy proposal and planning cycles common with traditional consulting."
        }
      }
    ],
    "about": {
      "@type": "Service",
      "name": "AI Consulting Services",
      "provider": {
        "@id": "https://tier4intelligence.com/#organization"
      }
    },
    "inLanguage": "en-US",
    "datePublished": "2024-01-01",
    "dateModified": "2024-01-15",
    "author": {
      "@id": "https://tier4intelligence.com/#organization"
    },
    "publisher": {
      "@id": "https://tier4intelligence.com/#organization"
    }
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema, null, 0)
      }}
    />
  )
}
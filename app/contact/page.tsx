import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react"
import { ContactFormWrapper } from "@/components/contact-form-wrapper"

// Generate optimized SEO metadata
const seoMetadata = {
  title: "Contact Us | Tier 4 Intelligence - AI Consulting San Francisco",
  description: "Get in touch with Tier 4 Intelligence for your AI consulting needs. Book a free consultation to discuss your 5-day POC and AI transformation goals.",
  keywords: ["contact AI consulting", "AI consultation San Francisco", "enterprise AI contact", "AI strategy consultation"],
  canonical: "https://tier4intelligence.com/contact"
};

export const metadata: Metadata = {
  title: seoMetadata.title,
  description: seoMetadata.description,
  keywords: seoMetadata.keywords,
  openGraph: {
    title: seoMetadata.title,
    description: seoMetadata.description,
    url: seoMetadata.canonical,
    siteName: "Tier 4 Intelligence",
    type: "website",
    images: [
      {
        url: "https://tier4intelligence.com/images/optimized/tier4-hero-1024w.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Tier 4 Intelligence - AI Consulting"
      }
    ]
  },
  alternates: {
    canonical: seoMetadata.canonical
  },
  other: {
    'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'author': 'Tier 4 Intelligence',
    'publisher': 'Tier 4 Intelligence'
  }
}

function ContactHero() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-[#00A878]/10 blur-3xl" />
        <div className="absolute right-[-200px] top-32 h-[420px] w-[420px] rounded-full bg-black/5 blur-3xl dark:bg-white/5" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
            Let's Transform Your Business
            <span className="block text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-[#00A878] to-green-400 bg-clip-text text-transparent mt-2">
              With AI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-black/70 dark:text-white/70">
            Ready to see what AI can do for your business? Book a free consultation and discover how our 5-day POC can deliver measurable ROI in weeks, not months.
          </p>
        </div>
      </div>
    </section>
  )
}


function ContactInfo() {
  const contactDetails = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@tier4intelligence.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "(415) 555-0123",
      description: "Mon-Fri 9am-6pm PST"
    },
    {
      icon: MapPin,
      title: "San Francisco Office",
      content: "123 Market Street, Suite 456\nSan Francisco, CA 94102",
      description: "By appointment only"
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "Within 24 hours",
      description: "Usually much faster"
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
        Get In Touch
      </h3>
      
      {contactDetails.map((detail, index) => {
        const Icon = detail.icon
        return (
          <Card key={index} className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#00A878]/10">
                  <Icon className="h-6 w-6 text-[#00A878]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                    {detail.title}
                  </h4>
                  <p className="text-black dark:text-white font-medium whitespace-pre-line">
                    {detail.content}
                  </p>
                  <p className="text-black/60 dark:text-white/60 text-sm mt-1">
                    {detail.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function WhyChooseSection() {
  const benefits = [
    "Free initial consultation and assessment",
    "Rapid 5-day POC development with proven ROI",
    "Vendor-neutral recommendations tailored to your needs",
    "24/7 support throughout implementation",
    "Comprehensive training and documentation",
    "Ongoing optimization and performance monitoring"
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            Why Partner With Tier 4 Intelligence?
          </h2>
          <p className="mt-4 text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto">
            We deliver AI solutions that work. No buzzwords, no vendor lock-in, just results that transform your business operations.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-6 bg-white dark:bg-neutral-800 rounded-lg">
              <CheckCircle className="h-6 w-6 text-[#00A878] flex-shrink-0 mt-0.5" />
              <span className="text-black/80 dark:text-white/80">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-black/70 dark:text-white/70 mb-8">
            Ready to get started? Book your free consultation today.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#00A878] px-8 py-3 text-white hover:bg-[#00936B]"
          >
            <Link href="#contact-form">
              Schedule Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      <ContactHero />
      
      <section id="contact-form" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ContactFormWrapper />
            </div>
            <div>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
      
      <WhyChooseSection />
    </main>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import { SimpleImage } from "@/components/ui/simple-image"
import { InteractiveSolutionsMegaMenu } from "@/components/solutions/InteractiveSolutionsMegaMenu"
import { CATEGORIES, getFeaturedSolutions } from "@/content/solutions"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScheduleDialog } from "./schedule-dialog"
import { ThemeToggle } from "./theme-toggle"

const SECTIONS = ["process", "analysis", "contact"] as const

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [active, setActive] = useState<(typeof SECTIONS)[number] | null>(null)
  const [mounted, setMounted] = useState(false)

  // Prepare solutions data for mega menu
  const solutionCategories = CATEGORIES.map(cat => ({
    id: cat.slug,
    name: cat.title,
    slug: cat.slug,
    tagline: cat.tagline,
    description: cat.description || cat.tagline,
    iconName: cat.icon,
    featured: cat.displayConfig.showInNav,
    sortOrder: cat.displayConfig.sortOrder,
    solutions: cat.solutions?.map(sol => ({
      id: sol.slug,
      title: sol.title,
      summary: sol.summary,
      description: sol.description,
      category: {
        id: cat.slug,
        name: cat.title,
        slug: cat.slug,
        tagline: cat.tagline,
        iconName: cat.icon,
        featured: cat.displayConfig.showInNav,
        sortOrder: cat.displayConfig.sortOrder,
        createdAt: '',
        updatedAt: ''
      },
      tags: sol.tags,
      featured: sol.flags.featured,
      iconName: sol.icon,
      createdAt: '',
      updatedAt: ''
    })) || [],
    createdAt: '',
    updatedAt: ''
  })).filter(cat => cat.featured).sort((a, b) => a.sortOrder - b.sortOrder)

  const featuredSolutions = CATEGORIES.flatMap(cat => 
    getFeaturedSolutions(cat, 2).map(sol => ({
      id: sol.slug,
      title: sol.title,
      summary: sol.summary,
      description: sol.description,
      category: {
        id: cat.slug,
        name: cat.title,
        slug: cat.slug,
        tagline: cat.tagline,
        iconName: cat.icon,
        featured: cat.displayConfig.showInNav,
        sortOrder: cat.displayConfig.sortOrder,
        createdAt: '',
        updatedAt: ''
      },
      tags: sol.tags,
      featured: sol.flags.featured,
      iconName: sol.icon,
      createdAt: '',
      updatedAt: ''
    }))
  ).slice(0, 4)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return // Don't run until after hydration
    
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return // Don't run until after hydration
    
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id)
          })
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 },
      )
      ob.observe(el)
      observers.push(ob)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [mounted])

  const linkCls = (id: string) =>
    cn(
      "text-sm transition-colors underline-offset-4",
      "text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white",
      active === id ? "font-semibold text-black dark:text-white underline" : undefined,
    )
  
  // Always use /#section to avoid hydration mismatch
  // This works from any page and avoids SSR/CSR differences
  const getHref = (section: string) => `/#${section}`


  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/50 dark:supports-[backdrop-filter]:bg-black/40"
          : "bg-transparent",
        scrolled ? "border-black/10 dark:border-white/10" : "border-transparent",
      )}
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Tier 4 Intelligence - Home">
          <SimpleImage
            src="tier4-logo-horizontal"
            alt="Tier 4 Intelligence"
            width={280}
            height={64}
            className="h-12 w-auto md:h-14 block dark:hidden"
            priority
          />
          <SimpleImage
            src="tier4-logo-horizontal-dark"
            alt="Tier 4 Intelligence"
            width={280}
            height={64}
            className="h-12 w-auto md:h-14 hidden dark:block"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <InteractiveSolutionsMegaMenu
            categories={solutionCategories}
            featuredSolutions={featuredSolutions}
          />
          <a href={getHref("process")} className={linkCls("process")} aria-current={active === "process" ? "page" : undefined}>
            Process
          </a>
          <a href={getHref("analysis")} className={linkCls("analysis")} aria-current={active === "analysis" ? "page" : undefined}>
            Analysis Engine
          </a>
          <a href={getHref("contact")} className={linkCls("contact")} aria-current={active === "contact" ? "page" : undefined}>
            Contact
          </a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button
            onClick={() => setShowDialog(true)}
            className="rounded-full bg-[#00A878] px-5 text-white hover:bg-[#00936B]"
            aria-label="Schedule Your Assessment"
          >
            Schedule Your Assessment
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="inline-flex items-center justify-center rounded"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-white dark:border-white/10 dark:bg-neutral-950 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3">
            <Link href="/solutions" className="py-1 text-sm text-black/80 dark:text-white/80 hover:text-[#00A878]">
              Solutions
            </Link>
            <a href={getHref("process")} className="py-1 text-sm text-black/80 dark:text-white/80">
              Process
            </a>
            <a href={getHref("analysis")} className="py-1 text-sm text-black/80 dark:text-white/80">
              Analysis Engine
            </a>
            <a href={getHref("contact")} className="py-1 text-sm text-black/80 dark:text-white/80">
              Contact
            </a>
            <Button
              onClick={() => setShowDialog(true)}
              className="mt-2 w-full rounded-full bg-[#00A878] text-white hover:bg-[#00936B]"
            >
              Schedule Your Assessment
            </Button>
          </div>
        </div>
      )}

      <ScheduleDialog open={showDialog} onOpenChange={setShowDialog} />
    </header>
  )
}

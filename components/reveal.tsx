"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setVisible(true), delay * 1000)
            ob.disconnect()
          }
        })
      },
      { threshold: 0.12 }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [delay, mounted])

  // Prevent hydration mismatch by always starting with hidden state
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        mounted && visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      {children}
    </div>
  )
}

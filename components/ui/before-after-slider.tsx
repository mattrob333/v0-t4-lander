"use client"

import { useState, useRef, useEffect } from "react"
import { SimpleImage } from "./simple-image"
import { cn } from "@/lib/utils"

interface BeforeAfterSliderProps {
  beforeImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  afterImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  beforeTitle?: string
  afterTitle?: string
  className?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeTitle,
  afterTitle,
  className
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  const handleStart = () => {
    setIsDragging(true)
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleEnd)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleEnd)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleEnd)
      }
    }
  }, [isDragging])

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div
        ref={containerRef}
        className="relative cursor-ew-resize select-none"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {/* Before Image (Bottom Layer) */}
        <div className="relative">
          <SimpleImage
            src={beforeImage.src}
            alt={beforeImage.alt}
            width={beforeImage.width}
            height={beforeImage.height}
            className="h-auto w-full rounded border border-white/10"
          />
          {beforeTitle && (
            <div className="absolute top-4 left-4 rounded bg-red-400/90 px-3 py-1 text-sm font-bold text-white">
              {beforeTitle}
            </div>
          )}
        </div>

        {/* After Image (Top Layer) - Reveals from right */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <SimpleImage
            src={afterImage.src}
            alt={afterImage.alt}
            width={afterImage.width}
            height={afterImage.height}
            className="h-auto w-full rounded border border-white/10"
          />
          {afterTitle && (
            <div className="absolute top-4 left-4 rounded bg-[#00A878]/90 px-3 py-1 text-sm font-bold text-white">
              {afterTitle}
            </div>
          )}
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize">
            <div className="w-3 h-3 bg-[#00A878] rounded-full"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white rounded-full opacity-30"></div>
        </div>

        {/* Drag Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full opacity-70">
          Drag to compare
        </div>
      </div>
    </div>
  )
}
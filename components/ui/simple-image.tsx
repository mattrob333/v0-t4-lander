"use client";

import Image from 'next/image';

interface SimpleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

// Map of image names to their actual paths
const imageMap: Record<string, string> = {
  "tier4-hero-dna-circuit": "/images/tier4-hero-dna-circuit.jpeg",
  "ai-noise-hype": "/images/ai-noise-hype.png",
  "ai-noise-buzzwords": "/images/ai-noise-buzzwords.png",
  "without-tier4-chaos": "/images/without-tier4-chaos.png",
  "with-tier4-roadmap": "/images/with-tier4-roadmap.png",
  "ai-blueprint-clarity": "/images/ai-blueprint-clarity.png",
  "ai-validated-blueprint": "/images/ai-validated-blueprint.png",
  "hero-ai-blueprint": "/images/hero-ai-blueprint.png",
  "strategic-roadmap-executive": "/images/strategic-roadmap-executive.png",
  "tier4-hero": "/images/tier4-hero.png",
  "tier4-logo-horizontal": "/images/tier4-logo-horizontal.png",
  "tier4-logo-horizontal-dark": "/images/tier4-logo-horizontal-dark.png",
};

export function SimpleImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false,
}: SimpleImageProps) {
  // Get the actual image path
  const imagePath = imageMap[src] || src;
  
  // If the src starts with /, use it directly, otherwise check the map
  const finalSrc = src.startsWith('/') ? src : imagePath;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
}

export default SimpleImage;
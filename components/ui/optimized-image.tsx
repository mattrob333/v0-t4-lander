"use client";

import { useState } from 'react';
import manifest from '@/public/images/optimized/manifest.json';

interface OptimizedImageProps {
  src: string; // Image name without path or extension (e.g., "hero-ai-blueprint")
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean; // For above-the-fold images
  sizes?: string; // Custom sizes attribute
  style?: React.CSSProperties;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  style,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Get image data from manifest
  const imageData = manifest[src as keyof typeof manifest];
  
  if (!imageData) {
    console.warn(`Image "${src}" not found in manifest. Available images:`, Object.keys(manifest));
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ width, height, ...style }}
      >
        Image not found: {src}
      </div>
    );
  }

  // Generate srcSet for WebP and JPEG
  const generateSrcSet = (format: 'webp' | 'jpg') => {
    const images = imageData[format];
    return Object.entries(images)
      .filter(([key]) => key !== 'full')
      .map(([size, url]) => `${url} ${size}w`)
      .join(', ');
  };

  const webpSrcSet = generateSrcSet('webp');
  const jpegSrcSet = generateSrcSet('jpg');
  
  // Fallback image (use largest available or full size)
  const fallbackSrc = imageData.jpg.full || imageData.jpg['1024'] || imageData.jpg['640'] || imageData.jpg['320'];
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Low-quality placeholder for blur-up effect */}
      {!isLoaded && imageData.placeholder && (
        <img
          src={imageData.placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105 transition-opacity duration-300"
          style={{ opacity: hasError ? 0 : 1 }}
        />
      )}
      
      <picture>
        {/* WebP source with srcset */}
        <source
          type="image/webp"
          srcSet={webpSrcSet}
          sizes={sizes}
        />
        
        {/* JPEG fallback with srcset */}
        <source
          type="image/jpeg"
          srcSet={jpegSrcSet}
          sizes={sizes}
        />
        
        {/* Final fallback img element */}
        <img
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      </picture>
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

// Ultra-lightweight inline SVG data URL blur placeholder (Warm off-white with subtle leaf badge)
const BLUR_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23FFF9C4" opacity="0.6"/%3E%3Cpath d="M150 70 C130 90, 130 120, 150 140 C170 120, 170 90, 150 70 Z" fill="%23C8E6C9" opacity="0.7"/%3E%3C/svg%3E';

export function OptimizedImage({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false
}: OptimizedImageProps) {
  const cleanSrc = src && !src.includes('placeholder.png') ? src : FALLBACK_IMAGE;
  const [imgSrc, setImgSrc] = useState(cleanSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  // If the Grocerz image fails or is a placeholder, fallback gracefully
  const handleError = () => {
    if (imgSrc !== FALLBACK_IMAGE) {
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#FFF9C4]/30 ${className}`}>
      {/* Skeleton / Blur Shimmer while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9C4]/40 via-[#FFFBF0] to-[#FFF9C4]/40 animate-pulse z-10 flex items-center justify-center">
          <span className="text-xl opacity-30">🌱</span>
        </div>
      )}

      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`object-contain transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width || 300}
          height={height || 225}
          sizes={sizes}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

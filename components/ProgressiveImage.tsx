'use client';

import { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  placeholderSrc: string;
  alt: string;
  className?: string;
  loadingAttr?: 'lazy' | 'eager';
}

export default function ProgressiveImage({
  src,
  placeholderSrc,
  alt,
  className,
  loadingAttr = 'lazy'
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);
  const [isBlurry, setIsBlurry] = useState(true);

  useEffect(() => {
    // Reset state when src changes
    setCurrentSrc(placeholderSrc);
    setIsBlurry(true);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsBlurry(false);
    };
  }, [src, placeholderSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loadingAttr}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'inherit',
        filter: isBlurry ? 'blur(8px)' : 'none',
        transition: 'filter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        willChange: 'filter',
      }}
    />
  );
}

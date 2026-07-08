'use client';

import { useState } from 'react';
import ProgressiveImage from '../../../components/ProgressiveImage';
import styles from './product-detail.module.css';

interface OdooProductImage {
  id: number;
  name: string;
  image_url: string;
}

interface ProductGalleryProps {
  mainImage: string | boolean;
  extraImages: OdooProductImage[];
  productName: string;
}

export default function ProductGallery({ mainImage, extraImages, productName }: ProductGalleryProps) {
  // Combine main image and extra images into one array for easier thumbnail management
  const allImages: string[] = [];
  
  if (typeof mainImage === 'string' && mainImage.length > 0) {
    allImages.push(mainImage);
  }
  
  extraImages.forEach(img => {
    if (typeof img.image_url === 'string' && img.image_url.length > 0) {
      allImages.push(img.image_url);
    }
  });

  const [activeIdx, setActiveIdx] = useState(0);

  const hasImages = allImages.length > 0;
  const currentImage = hasImages ? allImages[activeIdx] : null;

  return (
    <div className={styles.galleryWrapper}>
      {/* Main Image Display Box */}
      <div className={styles.imageCard}>
        {currentImage ? (
          <ProgressiveImage
            key={activeIdx} // Using key triggers CSS animation and state reset for smooth transitions
            src={currentImage}
            placeholderSrc={currentImage.replace('/image_1920', '/image_128').replace('/image_512', '/image_128')}
            alt={`${productName} - Rasm ${activeIdx + 1}`}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.noImage}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span style={{ marginTop: "12px" }}>Rasm mavjud emas</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row (if multiple images exist) */}
      {allImages.length > 1 && (
        <div className={styles.thumbnailRow}>
          {allImages.map((imgUrl, idx) => {
            const isActive = idx === activeIdx;
            const thumbUrl = imgUrl.replace('/image_1920', '/image_128').replace('/image_512', '/image_128');
            return (
              <button
                key={idx}
                type="button"
                className={`${styles.thumbnailCard} ${isActive ? styles.activeThumbnail : ''}`}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)} // Hover triggers change too for extra slick feeling!
                aria-label={`Rasm ${idx + 1}`}
              >
                <img
                  src={thumbUrl}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className={styles.thumbnailImage}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

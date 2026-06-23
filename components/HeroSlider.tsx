'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../app/page.module.css';

const slides = [
  {
    badge: "O'zbekistondagi №1 Distribyutor",
    title: "Professional Aloqa Yechimlari",
    text: "Biz sizning biznesingiz va ishonchli xavfsizligingiz uchun eng ilg'or ratsiya va aloqa vositalarini taqdim etamiz. Sifat, kafolat va individual yondashuv.",
    primaryBtn: "Katalogga o'tish",
    primaryLink: "/products",
    secondaryBtn: "Konsultatsiya",
    secondaryLink: "/about"
  },
  {
    badge: "Sifat Va Kafolat",
    title: "Aloqada Chegaralar Yo'q",
    text: "Davlat organlari va yirik korxonalar uchun ishonchli ratsiyalar. Eng murakkab vaziyatlarda ham aloqa uzilmasligiga kafolat beramiz.",
    primaryBtn: "Maxsulotlar",
    primaryLink: "/products",
    secondaryBtn: "Bog'lanish",
    secondaryLink: "/about"
  },
  {
    badge: "Yangi Avlod Tizimlari",
    title: "Xavfsizlik Va Ishonch Ramzi",
    text: "PTToC texnologiyasi va global aloqa tarmog'i bilan har qanday hududda xodimlaringizni boshqaring. Cheksiz radius va GPS kuzatuv.",
    primaryBtn: "Batafsil bilish",
    primaryLink: "/pttoc",
    secondaryBtn: "Katalog",
    secondaryLink: "/products"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {slides.map((slide, index) => (
            <div key={index} className={`${styles.slideContent} ${index === currentSlide ? styles.active : ''}`}>
              <span className={styles.badge}>{slide.badge}</span>
              <h1 className={styles.title}>{slide.title}</h1>
              <p className={styles.text}>{slide.text}</p>
              <div className={styles.actions}>
                <Link href={slide.primaryLink} className={styles.btnPrimary}>{slide.primaryBtn}</Link>
                <Link href={slide.secondaryLink} className={styles.btnSecondary}>{slide.secondaryBtn}</Link>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.imageWrapper}>
          <div className={styles.blob}></div>
          <img src="/hero-image.png" alt="Milliy Gvardiya Xodimi" className={styles.heroImage} />
        </div>
        
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Brands Marquee */}
      <div className={styles.marquee}>
        <div className={styles.marqueeContent}>
          <span className={styles.brandName}>Motorola Solutions</span>
          <span className={styles.brandName}>Kenwood</span>
          <span className={styles.brandName}>Hytera</span>
          <span className={styles.brandName}>Kirisun</span>
          <span className={styles.brandName}>Baofeng</span>
          <span className={styles.brandName}>Motorola Solutions</span>
          <span className={styles.brandName}>Kenwood</span>
          <span className={styles.brandName}>Hytera</span>
          <span className={styles.brandName}>Kirisun</span>
          <span className={styles.brandName}>Baofeng</span>
        </div>
      </div>
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('UZ');
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLangSelect = (lang: string) => {
    setCurrentLang(lang);
    setLangOpen(false);
    // Kelajakda: Tanlangan tilni Odoo RPC zaproslari uchun cookie ga saqlash
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/">
          <img src="/logo-black.svg" alt="Radiocom" className={styles.logoImg} />
        </Link>
        <ul className={styles.navLinks}>
          <li><Link href="/" className={pathname === '/' ? styles.activeLink : ''}>Bosh sahifa</Link></li>
          <li><Link href="/about" className={pathname === '/about' ? styles.activeLink : ''}>Biz haqimizda</Link></li>
          <li><Link href="/products" className={pathname?.startsWith('/products') ? styles.activeLink : ''}>Maxsulotlar</Link></li>
          <li><Link href="/services" className={pathname === '/services' ? styles.activeLink : ''}>Xizmatlar</Link></li>
          <li><Link href="/pttoc" className={pathname === '/pttoc' ? styles.activeLink : ''}>PTToC</Link></li>
        </ul>
      </div>
      
      <div className={styles.pill}>
        <div className={styles.utils}>
          
          <div className={styles.langWrapper} ref={langRef}>
            <button className={styles.langSwitch} onClick={() => setLangOpen(!langOpen)}>
              {currentLang} 
              <svg className={styles.dropdownIcon} data-open={langOpen} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {langOpen && (
              <div className={styles.langPopup}>
                <div className={`${styles.langOption} ${currentLang === 'UZ' ? styles.activeLang : ''}`} onClick={() => handleLangSelect('UZ')}>UZ</div>
                <div className={`${styles.langOption} ${currentLang === 'RU' ? styles.activeLang : ''}`} onClick={() => handleLangSelect('RU')}>RU</div>
                <div className={`${styles.langOption} ${currentLang === 'EN' ? styles.activeLang : ''}`} onClick={() => handleLangSelect('EN')}>EN</div>
              </div>
            )}
          </div>

          <button className={styles.iconBtn} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          
          <button className={styles.iconBtn} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
}

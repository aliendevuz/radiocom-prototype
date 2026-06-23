'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('UZ');
  const langRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerInner}>
          <div className={styles.left}>
            <Link href="/" className={styles.logoLink}>
              <img src="/logo-black.svg" alt="Radiocom" className={styles.logoImg} />
            </Link>
            
            <div className={`${styles.navOverlay} ${mobileMenuOpen ? styles.open : ''}`} onClick={(e) => {
              if (e.target === e.currentTarget) setMobileMenuOpen(false);
            }}>
              <nav className={styles.navContainer}>
                <div className={styles.mobileNavHeader}>
                  <img src="/logo-black.svg" alt="Radiocom" className={styles.logoImg} />
                  <button className={styles.closeMenuBtn} onClick={() => setMobileMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <ul className={styles.navLinks}>
                  <li><Link href="/" className={pathname === '/' ? styles.activeLink : ''} onClick={() => setMobileMenuOpen(false)}>Bosh sahifa</Link></li>
                  <li><Link href="/about" className={pathname === '/about' ? styles.activeLink : ''} onClick={() => setMobileMenuOpen(false)}>Biz haqimizda</Link></li>
                  <li><Link href="/products" className={pathname?.startsWith('/products') ? styles.activeLink : ''} onClick={() => setMobileMenuOpen(false)}>Maxsulotlar</Link></li>
                  <li><Link href="/services" className={pathname === '/services' ? styles.activeLink : ''} onClick={() => setMobileMenuOpen(false)}>Xizmatlar</Link></li>
                  <li><Link href="/pttoc" className={pathname === '/pttoc' ? styles.activeLink : ''} onClick={() => setMobileMenuOpen(false)}>PTToC</Link></li>
                </ul>
              </nav>
            </div>
          </div>
          
          <div className={styles.rightActions}>
            <div className={styles.pill}>
              <div className={styles.utils}>
                
                <div className={styles.langWrapper} ref={langRef}>
                  <button className={styles.langSwitch} onClick={() => setLangOpen(!langOpen)}>
                    {currentLang} 
                    <ChevronDown size={14} className={styles.dropdownIcon} data-open={langOpen} />
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
                  <Search size={18} />
                </button>
              </div>
            </div>

            <button className={styles.hamburger} onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

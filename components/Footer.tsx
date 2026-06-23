'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const socialIcons = (
    <div className={styles.socialRow}>
      <a href="#" className={styles.socialIcon} aria-label="Telegram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </a>
      <a href="#" className={styles.socialIcon} aria-label="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
      <a href="#" className={styles.socialIcon} aria-label="Facebook">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>
    </div>
  );

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Newsletter Section */}
        <div className={styles.top}>
          <div>
            <div className={styles.newsletterTitle}>Yangiliklarga obuna bo'ling</div>
            <div className={styles.text}>Eng so'nggi maxsulotlar va chegirmalardan xabardor bo'ling.</div>
          </div>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email manzilingiz" className={styles.input} />
            <button type="submit" className={styles.btn}>Obuna</button>
          </form>
        </div>

        {/* Main Grid */}
        <div className="grid-12" style={{ marginBottom: '60px' }}>
          {/* Brand Info */}
          <div className="span-6">
            <Link href="/">
              <img src="/logo-black.svg" alt="Radiocom Logo" className={styles.logo} />
            </Link>
            <div className={styles.text} style={{ marginBottom: '24px', maxWidth: '300px' }}>
              O'zbekistondagi eng yirik professional ratsiya va aloqa tizimlari distribyutori. 
              Sifatli, ishonchli va kafolatlangan xizmatlar.
            </div>
            {socialIcons}
          </div>

          {/* Quick Links */}
          <div className="span-3">
            <h4 className={styles.title}>Kompaniya</h4>
            <ul className={styles.linkList}>
              <li><Link href="/about">Biz haqimizda</Link></li>
              <li><Link href="/products">Maxsulotlar</Link></li>
              <li><Link href="/services">Xizmatlar</Link></li>
              <li><Link href="/pttoc">PTToC Tizimi</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="span-3">
            <h4 className={styles.title}>Bog'lanish</h4>
            <ul className={styles.linkList}>
              <li>O'zbekiston, Toshkent</li>
              <li>+998 (78) 113-16-18</li>
              <li>info@radiocom.uz</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div>&copy; {new Date().getFullYear()} Radiocom. Barcha huquqlar himoyalangan.</div>
          <div className={styles.bottomLinks}>
            <Link href="#">Maxfiylik siyosati</Link>
            <Link href="#">Foydalanish shartlari</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

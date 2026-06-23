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
      <div className={styles.top}>
        <div>
          <h3 className={styles.newsletterTitle}>
            Yangiliklardan xabardor bo'ling
          </h3>
          <p className={styles.text}>
            Yangi mahsulotlar va maxsus takliflar haqida birinchilardan
            bo'lib biling.
          </p>
        </div>
        <form className={styles.form}>
          <input
            type="email"
            placeholder="Email manzilingiz"
            className={styles.input}
          />
          <button type="button" className={styles.btn}>
            Obuna bo'lish
          </button>
        </form>
      </div>
      
      <div className={styles.grid}>
        <div>
          <img
            src="/logo-black.svg"
            alt="Radiocom"
            className={styles.logo}
          />
          <p
            className={styles.text}
            style={{ maxWidth: "300px", marginBottom: "24px" }}
          >
            O'zbekistondagi yetakchi ratsiya va professional aloqa
            vositalari distribyutori.
          </p>
          {socialIcons}
        </div>
        <div>
          <h3 className={styles.title}>Menyu</h3>
          <ul className={styles.linkList}>
            <li><Link href="/">Bosh sahifa</Link></li>
            <li><Link href="/about">Biz haqimizda</Link></li>
            <li><Link href="/products">Maxsulotlar</Link></li>
            <li><Link href="/services">Xizmatlar</Link></li>
            <li><Link href="/pttoc">PTToC tizimi</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={styles.title}>Kontaktlar</h3>
          <ul className={styles.linkList}>
            <li><a href="tel:+998781131618">+998 (78) 113-16-18</a></li>
            <li><a href="tel:+998933870710">+998 (93) 387-07-10</a></li>
            <li><a href="mailto:info@radiocom.uz">info@radiocom.uz</a></li>
            <li style={{lineHeight: 1.4}}>Toshkent sh., Mirzo-Ulug'bek tumani,<br/>O'zbekiston Ovozi ko'chasi 2 (Tata mehmonxonasi)</li>
            <li style={{marginTop: "8px", fontSize: "14px"}}><strong>Ish vaqti:</strong> Dush-Jum 09:00-18:00</li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} Radiocom. All rights reserved.
        </span>
        <div className={styles.bottomLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

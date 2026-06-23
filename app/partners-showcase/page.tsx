import styles from './partnersVariants.module.css';

const partners = [
  { name: 'ENT-ENG', url: 'https://radiocom.uz/wp-content/uploads/2021/06/ENT-ENG.png' },
  { name: 'NRG', url: 'https://radiocom.uz/wp-content/uploads/2021/06/NRG.png' },
  { name: 'MURAD-BILD', url: 'https://radiocom.uz/wp-content/uploads/2021/06/MURAD-BILD.png' },
  { name: 'GH-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/GH-1.png' },
  { name: 'CE-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/CE-1.png' },
  { name: 'DC-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/DC-1.png' },
  { name: 'MIMAR', url: 'https://radiocom.uz/wp-content/uploads/2021/06/MIMAR.png' },
  { name: 'DISCOVER-3232', url: 'https://radiocom.uz/wp-content/uploads/2021/06/DISCOVER-3232.png' },
  { name: 'ERIELLLLLL', url: 'https://radiocom.uz/wp-content/uploads/2021/06/ERIELLLLLL.png' },
  { name: 'ozv', url: 'https://radiocom.uz/wp-content/uploads/2021/06/ozv.png' },
  { name: 'uzliti', url: 'https://radiocom.uz/wp-content/uploads/2021/06/uzliti.png' },
  { name: 'uzbekneftegaz', url: 'https://radiocom.uz/wp-content/uploads/2021/06/uzbekneftegaz.png' },
  { name: 'МВД', url: 'https://radiocom.uz/wp-content/uploads/2021/07/МВД.png' },
  { name: 'Прокуратура-2', url: 'https://radiocom.uz/wp-content/uploads/2021/07/Прокуратура-2.png' },
  { name: 'ADOLAT', url: 'https://radiocom.uz/wp-content/uploads/2021/06/ADOLAT.png' },
  { name: 'APPARAT', url: 'https://radiocom.uz/wp-content/uploads/2021/06/APPARAT.png' },
  { name: 'UZAUTO', url: 'https://radiocom.uz/wp-content/uploads/2021/06/UZAUTO.png' },
  { name: 'MAN', url: 'https://radiocom.uz/wp-content/uploads/2021/06/MAN.png' },
  { name: 'GMMMMMMM', url: 'https://radiocom.uz/wp-content/uploads/2021/06/GMMMMMMM.png' },
  { name: 'UZAUTO-TRAILER', url: 'https://radiocom.uz/wp-content/uploads/2021/07/UZAUTO-TRAILER.png' },
  { name: 'UZKIM', url: 'https://radiocom.uz/wp-content/uploads/2021/06/UZKIM.png' },
  { name: 'NGMK', url: 'https://radiocom.uz/wp-content/uploads/2021/06/NGMK.png' },
  { name: 'AGMK-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/AGMK-1.png' },
  { name: 'BC', url: 'https://radiocom.uz/wp-content/uploads/2021/06/BC.png' },
  { name: 'OG-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/OG-1.png' },
  { name: 'AKFA', url: 'https://radiocom.uz/wp-content/uploads/2021/06/AKFA.png' },
  { name: 'artel-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/artel-1.png' },
  { name: 'COCA-COLA', url: 'https://radiocom.uz/wp-content/uploads/2021/07/COCA-COLA.png' },
  { name: 'SC-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/SC-1.png' },
  { name: 'amirsoy', url: 'https://radiocom.uz/wp-content/uploads/2021/06/amirsoy.png' },
  { name: 'SR', url: 'https://radiocom.uz/wp-content/uploads/2021/06/SR.png' },
  { name: 'beldersoy', url: 'https://radiocom.uz/wp-content/uploads/2021/07/beldersoy.png' },
  { name: 'HYATT', url: 'https://radiocom.uz/wp-content/uploads/2021/06/HYATT.png' },
  { name: 'HILTON', url: 'https://radiocom.uz/wp-content/uploads/2021/06/HILTON.png' },
  { name: 'marr', url: 'https://radiocom.uz/wp-content/uploads/2021/06/marr.png' },
  { name: 'inrer', url: 'https://radiocom.uz/wp-content/uploads/2021/06/inrer.png' },
  { name: 'ashxobod', url: 'https://radiocom.uz/wp-content/uploads/2021/06/ashxobod.png' },
  { name: 'ecopark', url: 'https://radiocom.uz/wp-content/uploads/2021/06/ecopark.png' },
  { name: 'CP-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/CP-1.png' },
  { name: 'MC-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/MC-1.png' },
  { name: 'K-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/K-1.png' },
  { name: 'M-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/M-1.png' },
  { name: 'H-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/H-1.png' },
  { name: 'carf', url: 'https://radiocom.uz/wp-content/uploads/2021/07/carf.png' },
  { name: 'MP-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/MP-1.png' },
  { name: 'sam-darv', url: 'https://radiocom.uz/wp-content/uploads/2021/06/sam-darv.png' },
  { name: 'riviera', url: 'https://radiocom.uz/wp-content/uploads/2021/07/riviera.png' },
  { name: 'compass', url: 'https://radiocom.uz/wp-content/uploads/2021/07/compass.png' },
  { name: 'NBU', url: 'https://radiocom.uz/wp-content/uploads/2021/06/NBU.png' },
  { name: 'AB-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/AB-1.png' },
  { name: 'infin-1', url: 'https://radiocom.uz/wp-content/uploads/2021/06/infin-1.png' },
  { name: 'kapital-1', url: 'https://radiocom.uz/wp-content/uploads/2021/07/kapital-1.png' }
];

export default function PartnersShowcase() {
  // Split partners for the marquee to go in two directions
  const row1 = partners.slice(0, 26);
  const row2 = partners.slice(26, 52);

  // For Grid and Hover variants, we might just show top 18-24 to keep it clean, but let's show all
  return (
    <div className={styles.showcasePage}>
      <h1 className={styles.showcaseTitle}>"Bizning Mijozlar" Variantlari</h1>

      {/* Variant 1: Infinite Marquee */}
      <div className={styles.variantContainer}>
        <div className={styles.variantLabel}>
          <span>Variant 1: Infinite Marquee (Cheksiz aylanuvchi lenta)</span>
          <button className={styles.selectBtn}>Tanlash</button>
        </div>
        <div className={styles.wrapper}>
          <h2 className={styles.sectionTitle}>Bizning Mijozlar</h2>
          
          <div className={styles.marqueeContainer}>
            {/* Top Row - Scrolls Left */}
            <div className={styles.marqueeTrack}>
              {/* Double the list to make it infinite */}
              {[...row1, ...row1].map((partner, i) => (
                <img key={i} src={partner.url} alt={partner.name} className={styles.partnerLogo} />
              ))}
            </div>
            
            {/* Bottom Row - Scrolls Right */}
            <div className={styles.marqueeTrackReverse}>
              {[...row2, ...row2].map((partner, i) => (
                <img key={i} src={partner.url} alt={partner.name} className={styles.partnerLogo} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Variant 2: Premium Logo Grid */}
      <div className={styles.variantContainer}>
        <div className={styles.variantLabel}>
          <span>Variant 2: Premium Logo Grid (Klassik To'r)</span>
          <button className={styles.selectBtn}>Tanlash</button>
        </div>
        <div className={styles.wrapper}>
          <h2 className={styles.sectionTitle}>Bizning Mijozlar</h2>
          
          <div className={styles.gridContainer}>
            {/* Show top 24 for the grid variant so it doesn't take up the entire screen */}
            {partners.slice(0, 24).map((partner, i) => (
              <div key={i} className={styles.gridItem}>
                <img src={partner.url} alt={partner.name} className={styles.gridLogo} />
              </div>
            ))}
          </div>
          <button className={styles.showMoreBtn}>Barchasini ko'rish</button>
        </div>
      </div>

      {/* Variant 3: Grayscale Hover */}
      <div className={styles.variantContainer}>
        <div className={styles.variantLabel}>
          <span>Variant 3: Grayscale Hover (Oq-qora interaktiv)</span>
          <button className={styles.selectBtn}>Tanlash</button>
        </div>
        <div className={styles.wrapper}>
          <h2 className={styles.sectionTitle}>Bizning Mijozlar</h2>
          
          <div className={styles.hoverGridContainer}>
            {partners.slice(0, 30).map((partner, i) => (
              <div key={i} className={styles.hoverItem}>
                <img src={partner.url} alt={partner.name} className={styles.hoverLogo} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

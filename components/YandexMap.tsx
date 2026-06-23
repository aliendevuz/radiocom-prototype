import styles from "../app/page.module.css";

export default function YandexMap() {
  return (
    <section className={styles.mapSection}>
      <div className="container">
        <div className={styles.mapContainer}>
          {/* Contact Overlay Card */}
          <div className={styles.mapOverlay}>
            <h3 className={styles.mapOverlayTitle}>Bizning Manzil</h3>
            <p className={styles.mapOverlayText}>
              O'zbekiston, Toshkent shahri
              <br />
              (Sizning aniq manzilingiz)
            </p>
            <div className={styles.mapContact}>
              <p>📞 +998 (78) 113-16-18</p>
              <p>✉️ info@radiocom.uz</p>
            </div>
            <a
              href="https://yandex.uz/maps/?pt=69.286313,41.311039&z=17&l=map"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              Yandex Xaritada Ochish
            </a>
          </div>

          {/* Yandex Map iframe */}
          <iframe
            src="https://yandex.uz/map-widget/v1/?ll=69.286313%2C41.311039&z=16&pt=69.286313,41.311039,pm2rdm&scroll=false"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen={true}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          ></iframe>
        </div>
      </div>
    </section>
  );
}

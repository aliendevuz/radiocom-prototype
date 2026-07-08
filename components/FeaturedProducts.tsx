import Link from 'next/link';
import { getPublishedProducts, OdooProduct } from '../app/utils/odoo';
import styles from '../app/page.module.css';

export default async function FeaturedProducts() {
  // Fetch top 3 products from Odoo
  const products = await getPublishedProducts(1, 3);

  if (!products || products.length < 3) {
    return null; // Don't render if we don't have enough products
  }

  // Helper to get image src
  const getImageSrc = (product: OdooProduct) => {
    if (product.image_url && typeof product.image_url === 'string') {
      return product.image_url;
    }
    return '/logo-black.svg'; // fallback placeholder
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="container" style={{ marginBottom: '80px' }}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Top Ratsiyalar</h2>
        <Link href="/products" className={styles.viewAllBtn}>Barchasi &rarr;</Link>
      </div>

      <div className="grid-12" style={{ height: '600px' }}>
        {/* Main Featured Item */}
        <Link href={`/products/${products[0].id}`} className={`span-8 ${styles.bentoMain}`}>
          <div className={styles.bentoMainContent}>
            <span className={styles.badge} style={{ width: 'fit-content', marginBottom: '16px' }}>Top Savdo</span>
            <h3 className={styles.bentoMainTitle}>{products[0].name}</h3>
            <div className={styles.bentoMainPrice}>{formatPrice(products[0].list_price)}</div>
            <span className={styles.bentoMainBtn}>Hoziroq Ko'rish &rarr;</span>
          </div>
          <div className={styles.bentoMainImage}>
            <img src={getImageSrc(products[0])} alt={products[0].name} />
          </div>
        </Link>

        {/* Two Smaller Items */}
        <div className={`span-4 ${styles.bentoSide}`}>
          <Link href={`/products/${products[1].id}`} className={styles.bentoSmall}>
            <div className={styles.bentoSmallImageWrapper}>
              <img src={getImageSrc(products[1])} alt={products[1].name} className={styles.bentoSmallImage} />
            </div>
            <div className={styles.bentoSmallContent}>
              <h4 className={styles.bentoSmallTitle}>{products[1].name}</h4>
              <div className={styles.bentoSmallPrice}>{formatPrice(products[1].list_price)}</div>
              <span className={styles.bentoSmallArrow}>Batafsil &rarr;</span>
            </div>
          </Link>
          <Link href={`/products/${products[2].id}`} className={styles.bentoSmall}>
            <div className={styles.bentoSmallImageWrapper}>
              <img src={getImageSrc(products[2])} alt={products[2].name} className={styles.bentoSmallImage} />
            </div>
            <div className={styles.bentoSmallContent}>
              <h4 className={styles.bentoSmallTitle}>{products[2].name}</h4>
              <div className={styles.bentoSmallPrice}>{formatPrice(products[2].list_price)}</div>
              <span className={styles.bentoSmallArrow}>Batafsil &rarr;</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

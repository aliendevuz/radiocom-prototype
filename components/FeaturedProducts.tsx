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
    if (product.image_512 && typeof product.image_512 === 'string') {
      return `data:image/png;base64,${product.image_512}`;
    }
    return '/logo-black.svg'; // fallback placeholder
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className={styles.bentoContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Top Ratsiyalar</h2>
        <Link href="/products" className={styles.viewAllBtn}>Barchasi &rarr;</Link>
      </div>

      <div className={styles.v2Bento}>
        {/* Main Featured Item */}
        <div className={styles.bentoMain}>
          <div className={styles.bentoMainContent}>
            <h3 className={styles.bentoMainTitle}>{products[0].name}</h3>
            <div className={styles.bentoMainPrice}>{formatPrice(products[0].list_price)}</div>
            <Link href={`/products/${products[0].id}`} className={styles.bentoMainBtn}>Hoziroq Ko'rish</Link>
          </div>
          <div className={styles.bentoMainImage}>
            <img src={getImageSrc(products[0])} alt={products[0].name} />
          </div>
        </div>

        {/* Two Smaller Items */}
        <div className={styles.bentoSide}>
          <Link href={`/products/${products[1].id}`} className={styles.bentoSmall}>
            <img src={getImageSrc(products[1])} alt={products[1].name} className={styles.bentoSmallImage} />
            <div>
              <h4 className={styles.bentoSmallTitle}>{products[1].name}</h4>
              <div style={{ color: '#E3000F', fontWeight: 'bold' }}>{formatPrice(products[1].list_price)}</div>
            </div>
          </Link>
          <Link href={`/products/${products[2].id}`} className={styles.bentoSmall}>
            <img src={getImageSrc(products[2])} alt={products[2].name} className={styles.bentoSmallImage} />
            <div>
              <h4 className={styles.bentoSmallTitle}>{products[2].name}</h4>
              <div style={{ color: '#E3000F', fontWeight: 'bold' }}>{formatPrice(products[2].list_price)}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

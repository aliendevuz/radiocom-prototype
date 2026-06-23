import Link from 'next/link';
import Image from 'next/image';
import styles from './products.module.css';
import { getPublishedProducts, getPublishedProductsCount } from '../utils/odoo';

export const revalidate = 0; // Disable static caching so we always fetch fresh data from Odoo

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;
  const limit = 6; // 6 products per page is perfect for a 3-column layout

  // Fetch data from Odoo
  const products = await getPublishedProducts(currentPage, limit);
  const totalCount = await getPublishedProductsCount();
  const totalPages = Math.ceil(totalCount / limit);

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/">
          <Image
            src="/logo-black.svg"
            alt="Radiocom Logo"
            width={160}
            height={40}
            priority
            style={{ objectFit: 'contain' }}
          />
        </Link>
        <span className={styles.logoText}>DISTRIBUTOR</span>
      </header>

      {/* Main Title Section */}
      <section className={styles.titleSection}>
        <h1 className={styles.title}>MAHSULOTLARIMIZ</h1>
        <p className={styles.subtitle}>Odoo orqali e'lon qilingan va sotuvdagi barcha ratsiya hamda aloqa vositalari</p>
      </section>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#A2AAB3' }}>
          Hozircha sotuvda mahsulotlar mavjud emas.
        </div>
      ) : (
        <main className={styles.grid}>
          {products.map((product) => {
            const hasImage = typeof product.image_512 === 'string';
            const categoryName = Array.isArray(product.categ_id) ? product.categ_id[1] : 'Ratsiya';

            return (
              <article key={product.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {hasImage ? (
                    <img
                      src={`data:image/png;base64,${product.image_512}`}
                      alt={product.name}
                      className={styles.productImage}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span style={{ marginTop: '8px' }}>Rasm mavjud emas</span>
                    </div>
                  )}
                </div>

                <div className={styles.content}>
                  <span className={styles.categoryTag}>{categoryName}</span>
                  <h2 className={styles.productName}>{product.name}</h2>
                  <p className={styles.description}>
                    {typeof product.description_sale === 'string'
                      ? product.description_sale
                      : "Mahsulot haqida batafsil ma'lumot olish uchun biz bilan bog'laning."}
                  </p>
                  
                  <div className={styles.footerRow}>
                    <span className={styles.price}>{formatPrice(product.list_price)}</span>
                    <button className={styles.ctaButton}>Batafsil</button>
                  </div>
                </div>
              </article>
            );
          })}
        </main>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={`/products?page=${currentPage - 1}`}
              className={styles.pageButton}
            >
              Oldingi
            </Link>
          ) : (
            <span className={`${styles.pageButton} ${styles.disabledButton}`}>Oldingi</span>
          )}

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <Link
                key={pageNum}
                href={`/products?page=${pageNum}`}
                className={`${styles.pageButton} ${isActive ? styles.activePage : ''}`}
              >
                {pageNum}
              </Link>
            );
          })}

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={`/products?page=${currentPage + 1}`}
              className={styles.pageButton}
            >
              Keyingi
            </Link>
          ) : (
            <span className={`${styles.pageButton} ${styles.disabledButton}`}>Keyingi</span>
          )}
        </nav>
      )}
    </div>
  );
}

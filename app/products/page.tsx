import Link from "next/link";
import ProgressiveImage from "../../components/ProgressiveImage";
import styles from "./products.module.css";
import {
  getFilteredProducts,
  getFilteredProductsCount,
  getAllCategories,
} from "../utils/odoo";
import FilterControls from "./FilterControls";
import { Suspense } from "react";

export const revalidate = 300; // Cache the catalog page for 5 minutes (300 seconds)

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function V3ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage =
    typeof params.page === "string"
      ? Math.max(1, parseInt(params.page, 10))
      : 1;
  const currentCategory =
    typeof params.category === "string"
      ? parseInt(params.category, 10)
      : undefined;
  const currentSearch =
    typeof params.search === "string" ? params.search : undefined;
  const currentSort = typeof params.sort === "string" ? params.sort : "id_desc";

  const limit = 9; // 9 items per page (3x3 grid)

  // Fetch data concurrently from Odoo
  const [products, totalCount, categories] = await Promise.all([
    getFilteredProducts({
      page: currentPage,
      limit,
      categoryId: currentCategory,
      search: currentSearch,
      sort: currentSort,
    }),
    getFilteredProductsCount({
      categoryId: currentCategory,
      search: currentSearch,
    }),
    getAllCategories(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  // Build category query link
  const getCategoryLink = (catId?: number) => {
    const queryParams = new URLSearchParams();
    if (catId) queryParams.set("category", catId.toString());
    if (currentSearch) queryParams.set("search", currentSearch);
    if (currentSort) queryParams.set("sort", currentSort);
    return `/products?${queryParams.toString()}`;
  };

  // Build pagination query link
  const getPageLink = (page: number) => {
    const queryParams = new URLSearchParams();
    if (page > 1) queryParams.set("page", page.toString());
    if (currentCategory)
      queryParams.set("category", currentCategory.toString());
    if (currentSearch) queryParams.set("search", currentSearch);
    if (currentSort) queryParams.set("sort", currentSort);
    return `/products?${queryParams.toString()}`;
  };

  // Filter out system categories
  const relevantCategories = categories.filter((cat) =>
    ["PMR", "PROF", "AVTO", "RADIO-VIDEONYANI", "KPK", "GOODS"].includes(
      cat.name.toUpperCase(),
    ),
  );

  return (
    <div className={styles.pageBg}>
      <div className={styles.container}>
        <div className={styles.shopLayout}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <div>
              <h2 className={styles.sidebarTitle}>Kategoriyalar</h2>
              <ul className={styles.categoryList}>
                <li
                  className={`${styles.categoryItem} ${!currentCategory ? styles.activeCategory : ""}`}
                >
                  <Link href={getCategoryLink(undefined)}>
                    Barcha mahsulotlar
                  </Link>
                </li>
                {relevantCategories.map((cat) => {
                  const isActive = currentCategory === cat.id;
                  return (
                    <li
                      key={cat.id}
                      className={`${styles.categoryItem} ${isActive ? styles.activeCategory : ""}`}
                    >
                      <Link href={getCategoryLink(cat.id)}>{cat.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {/* Controls Bar (Search & Sort) */}
            <Suspense fallback={<div>Yuklanmoqda...</div>}>
              <FilterControls
                initialSearch={currentSearch}
                initialSort={currentSort}
              />
            </Suspense>

            {/* Results Count Info */}
            <div className={styles.resultsInfo}>
              {totalCount > 0 ? (
                <span>Jami: {totalCount} ta mahsulot topildi</span>
              ) : (
                <span>Sotuvda mahsulotlar topilmadi</span>
              )}
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "4px",
                  border: "1px solid #eaeaea",
                }}
              >
                <p
                  style={{
                    color: "#718096",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Filtr bo'yicha hech qanday mahsulot topilmadi.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  {products.map((product) => {
                    const hasImage = typeof product.image_url === "string" && product.image_url.length > 0;
                    const categoryName = Array.isArray(product.categ_id)
                      ? product.categ_id[1]
                      : "Ratsiya";

                    return (
                      <article key={product.id} className={styles.card}>
                        <Link href={`/products/${product.id}`} className={styles.imageWrapper}>
                          {hasImage ? (
                            <ProgressiveImage
                              src={product.image_url}
                              placeholderSrc={product.image_url.replace('/image_512', '/image_128')}
                              alt={product.name}
                              className={styles.productImage}
                              loadingAttr="lazy"
                            />
                          ) : (
                            <div className={styles.noImage}>
                              <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                              </svg>
                              <span style={{ marginTop: "8px" }}>
                                Rasm mavjud emas
                              </span>
                            </div>
                          )}
                        </Link>

                        <div className={styles.content}>
                          <span className={styles.categoryTag}>
                            {categoryName}
                          </span>
                          <h3 className={styles.productName} title={product.name}>
                            <Link href={`/products/${product.id}`}>
                              {product.name}
                            </Link>
                          </h3>
                          <p className={styles.description}>
                            {typeof product.description_sale === "string"
                              ? product.description_sale
                              : "Professional darajadagi uzatish quvvatiga va mukammal aloqa radiusiga ega aloqa vositasi."}
                          </p>

                          <div className={styles.footerRow}>
                            <span className={styles.price}>
                              {formatPrice(product.list_price)}
                            </span>
                            <Link href={`/products/${product.id}`} className={styles.ctaButton}>
                              Batafsil
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    className={styles.pagination}
                    aria-label="Catalog Navigation"
                  >
                    {currentPage > 1 ? (
                      <Link
                        href={getPageLink(currentPage - 1)}
                        className={styles.pageButton}
                      >
                        Oldingi
                      </Link>
                    ) : (
                      <span
                        className={`${styles.pageButton} ${styles.disabledButton}`}
                      >
                        Oldingi
                      </span>
                    )}

                    {Array.from({ length: totalPages }, (_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <Link
                          key={pageNum}
                          href={getPageLink(pageNum)}
                          className={`${styles.pageButton} ${isActive ? styles.activePage : ""}`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}

                    {currentPage < totalPages ? (
                      <Link
                        href={getPageLink(currentPage + 1)}
                        className={styles.pageButton}
                      >
                        Keyingi
                      </Link>
                    ) : (
                      <span
                        className={`${styles.pageButton} ${styles.disabledButton}`}
                      >
                        Keyingi
                      </span>
                    )}
                  </nav>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

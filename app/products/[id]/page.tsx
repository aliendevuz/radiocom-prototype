import Link from 'next/link';
import { ArrowLeft, Check, Phone, Send, ShieldCheck, Award, Truck } from 'lucide-react';
import { getProductById, getFilteredProducts } from '../../utils/odoo';
import ProductGallery from './ProductGallery';
import styles from './product-detail.module.css';

export const revalidate = 300; // Cache the product details page for 5 minutes (300 seconds)

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ParsedDetails {
  generalDesc: string[];
  komplektatsiya: string[];
  xarakteristikalar: { label: string; value: string }[];
}

function parseDescription(desc: string | boolean): ParsedDetails {
  const result: ParsedDetails = {
    generalDesc: [],
    komplektatsiya: [],
    xarakteristikalar: []
  };

  if (!desc || typeof desc !== 'string') {
    return result;
  }

  const lines = desc.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  let currentSection: 'general' | 'komplekt' | 'xarakter' = 'general';

  for (const line of lines) {
    const upperLine = line.toUpperCase();
    if (upperLine.startsWith('KOMPLEKTATSIYA') || upperLine.includes('KOMPLEKT')) {
      currentSection = 'komplekt';
      continue;
    } else if (upperLine.startsWith('XARAKTERISTIKALAR') || upperLine.includes('XARAKTER')) {
      currentSection = 'xarakter';
      continue;
    }

    if (currentSection === 'komplekt') {
      const clean = line.replace(/^-\s*/, '');
      result.komplektatsiya.push(clean);
    } else if (currentSection === 'xarakter') {
      const clean = line.replace(/^-\s*/, '');
      let splitIdx = clean.indexOf(':');
      if (splitIdx === -1) {
        splitIdx = clean.indexOf('—');
      }
      if (splitIdx === -1) {
        splitIdx = clean.indexOf(' - ');
      }

      if (splitIdx !== -1) {
        const label = clean.substring(0, splitIdx).trim();
        const value = clean.substring(splitIdx + 1).trim();
        result.xarakteristikalar.push({ label, value });
      } else {
        result.xarakteristikalar.push({ label: clean, value: '' });
      }
    } else {
      result.generalDesc.push(line);
    }
  }

  return result;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    return (
      <div className={styles.detailBg}>
        <div className={styles.container}>
          <div className={styles.notFoundContainer}>
            <h1 className={styles.notFoundTitle}>Xato sahifa</h1>
            <p className={styles.notFoundText}>Noto'g'ri mahsulot kodi taqdim etildi.</p>
            <Link href="/products" className={styles.errorBtn}>
              Katalogga qaytish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const product = await getProductById(productId);

  if (!product) {
    return (
      <div className={styles.detailBg}>
        <div className={styles.container}>
          <div className={styles.notFoundContainer}>
            <h1 className={styles.notFoundTitle}>Mahsulot topilmadi</h1>
            <p className={styles.notFoundText}>Siz qidirayotgan mahsulot tizimda mavjud emas yoki o'chirilgan.</p>
            <Link href="/products" className={styles.errorBtn}>
              Katalogga qaytish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = Array.isArray(product.categ_id) ? product.categ_id[1] : 'Ratsiya';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  const parsed = parseDescription(product.description_sale);

  // Fetch suggested products from Odoo
  const categoryId = Array.isArray(product.categ_id) ? product.categ_id[0] : undefined;
  const suggestions = await getFilteredProducts({
    limit: 6, // Fetch a few more to filter out the current product
    categoryId
  });

  let filteredSuggestions = suggestions.filter(p => p.id !== productId).slice(0, 3);

  // Fallback: If not enough products in this category, pull from general products
  if (filteredSuggestions.length < 3) {
    const generalSuggestions = await getFilteredProducts({ limit: 6 });
    const additional = generalSuggestions.filter(
      p => p.id !== productId && !filteredSuggestions.some(f => f.id === p.id)
    );
    filteredSuggestions = [...filteredSuggestions, ...additional].slice(0, 3);
  }

  // Generate Telegram link for order
  const telegramMessage = `Assalomu alaykum! Men Radiocom saytidan "${product.name}" mahsuloti bo'yicha ma'lumot olmoqchi edim.`;
  const telegramLink = `https://t.me/uz_Radiocom?text=${encodeURIComponent(telegramMessage)}`;

  return (
    <div className={styles.detailBg}>
      <div className={styles.container}>
        {/* Back Link */}
        <Link href="/products" className={styles.backLink}>
          <ArrowLeft size={16} />
          Katalogga qaytish
        </Link>

        {/* Section 1: Main Info */}
        <section className={styles.mainSection} aria-label="Product General Info">
          <div className={styles.galleryCol}>
            <ProductGallery
              mainImage={product.image_url}
              extraImages={product.extra_images || []}
              productName={product.name}
            />
          </div>

          <div className={styles.infoCol}>
            <span className={styles.categoryTag}>{categoryName}</span>
            <h1 className={styles.productName}>{product.name}</h1>
            <div className={styles.priceTag}>{formatPrice(product.list_price)}</div>

            <div className={styles.generalDescription}>
              {parsed.generalDesc.length > 0 ? (
                parsed.generalDesc.map((p, idx) => <p key={idx} style={{ marginBottom: '12px' }}>{p}</p>)
              ) : (
                <p>Professional darajadagi uzatish quvvatiga va mukammal aloqa radiusiga ega aloqa vositasi. Kengaytirilgan xususiyatlari va ishonchli konstruksiyasi bilan ajralib turadi.</p>
              )}
            </div>

            <div className={styles.actionRow}>
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                <Send size={18} />
                Telegramda buyurtma berish
              </a>
              <a href="tel:+998781131618" className={styles.btnSecondary}>
                <Phone size={18} />
                Konsultatsiya olish
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Details */}
        <section className={styles.detailsSection} aria-label="Product Specifications and Details">
          {/* Left: Timeline & Komplektatsiya */}
          <div className={styles.detailsLeftCol}>
            <h3 className={styles.sectionTitle}>Nima uchun Radiocom?</h3>
            
            {/* Timeline Badges */}
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <ShieldCheck size={20} />
                </div>
                <div className={styles.timelineContent}>
                  <h4>1 yil kafolat</h4>
                  <p>Rasmiy servis markazidan</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <Award size={20} />
                </div>
                <div className={styles.timelineContent}>
                  <h4>100% Original</h4>
                  <p>Sertifikatlangan mahsulot</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <Truck size={20} />
                </div>
                <div className={styles.timelineContent}>
                  <h4>Yetkazib berish</h4>
                  <p>Tezkor yetkazib berish xizmati</p>
                </div>
              </div>
            </div>

            {/* Custom Spacing */}
            <div className={styles.spacingBlock} />

            {/* Komplektatsiya (In the box) */}
            {parsed.komplektatsiya.length > 0 && (
              <div className={styles.komplektBox}>
                <h3 className={styles.sectionTitle}>Komplektatsiya (Qutida nimalar bor)</h3>
                <ul className={styles.komplektList}>
                  {parsed.komplektatsiya.map((item, idx) => (
                    <li key={idx} className={styles.komplektItem}>
                      <Check size={16} className={styles.checkIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Technical specifications */}
          <div className={styles.detailsRightCol}>
            <h3 className={styles.sectionTitle}>Texnik Xarakteristikalar</h3>
            {parsed.xarakteristikalar.length > 0 ? (
              <table className={styles.specsTable}>
                <tbody>
                  {parsed.xarakteristikalar.map((spec, idx) => (
                    <tr key={idx} className={styles.specRow}>
                      <td className={styles.specLabel}>{spec.label}</td>
                      <td className={styles.specValue}>{spec.value || "Mavjud"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noSpecsText}>
                Ushbu mahsulot uchun alohida texnik xarakteristikalar mavjud emas.
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Suggested Products */}
        {filteredSuggestions.length > 0 && (
          <section className={styles.suggestionsSection} aria-label="Suggested Products">
            <h2 className={styles.suggestionsTitle}>Tavsiya etiladigan mahsulotlar</h2>
            <div className={styles.suggestionsGrid}>
              {filteredSuggestions.map((sProduct) => {
                const sHasImage = typeof sProduct.image_url === "string" && sProduct.image_url.length > 0;
                const sCategoryName = Array.isArray(sProduct.categ_id) ? sProduct.categ_id[1] : "Ratsiya";
                return (
                  <article key={sProduct.id} className={styles.suggestionCard}>
                    <Link href={`/products/${sProduct.id}`} className={styles.sImageWrapper}>
                      {sHasImage ? (
                        <img
                          src={sProduct.image_url}
                          alt={sProduct.name}
                          className={styles.sProductImage}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.sNoImage}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                          <span style={{ marginTop: "8px", fontSize: "12px" }}>Rasm mavjud emas</span>
                        </div>
                      )}
                    </Link>

                    <div className={styles.sContent}>
                      <span className={styles.sCategoryTag}>{sCategoryName}</span>
                      <h3 className={styles.sProductName} title={sProduct.name}>
                        <Link href={`/products/${sProduct.id}`}>{sProduct.name}</Link>
                      </h3>
                      <div className={styles.sFooterRow}>
                        <span className={styles.sPrice}>{formatPrice(sProduct.list_price)}</span>
                        <Link href={`/products/${sProduct.id}`} className={styles.sCtaButton}>
                          Batafsil
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

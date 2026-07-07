import Link from 'next/link';
import { ArrowLeft, Check, Phone, Send, ShieldCheck, Award, Truck } from 'lucide-react';
import { getProductById } from '../../utils/odoo';
import ProductGallery from './ProductGallery';
import styles from './product-detail.module.css';

export const revalidate = 0; // Disable static caching so we fetch fresh data on every request

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

        {/* Balanced Grid Layout */}
        <div className={styles.productLayout}>
          
          {/* Left Column: Image, Gallery, Badges & In the Box */}
          <div className={styles.leftColumn}>
            
            {/* Interactive Image Gallery */}
            <ProductGallery
              mainImage={product.image_512}
              extraImages={product.extra_images || []}
              productName={product.name}
            />

            {/* Trust Badges Row */}
            <div className={styles.trustBadges}>
              <div className={styles.badgeItem}>
                <ShieldCheck size={20} className={styles.badgeIcon} />
                <div className={styles.badgeText}>
                  <h4>1 yil kafolat</h4>
                  <p>Rasmiy servis markazidan</p>
                </div>
              </div>
              <div className={styles.badgeItem}>
                <Award size={20} className={styles.badgeIcon} />
                <div className={styles.badgeText}>
                  <h4>100% Original</h4>
                  <p>Sertifikatlangan mahsulot</p>
                </div>
              </div>
              <div className={styles.badgeItem}>
                <Truck size={20} className={styles.badgeIcon} />
                <div className={styles.badgeText}>
                  <h4>Yetkazib berish</h4>
                  <p>Tezkor yetkazib berish xizmati</p>
                </div>
              </div>
            </div>

            {/* Komplektatsiya (In the box) placed on the left under image gallery */}
            {parsed.komplektatsiya.length > 0 && (
              <div className={styles.leftSection}>
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

          {/* Right Column: General Info, CTA Actions & Technical Specs */}
          <div className={styles.infoCard}>
            <span className={styles.categoryTag}>{categoryName}</span>
            <h1 className={styles.productName}>{product.name}</h1>
            <div className={styles.priceTag}>{formatPrice(product.list_price)}</div>

            {/* General Description */}
            <div className={styles.generalDescription}>
              {parsed.generalDesc.length > 0 ? (
                parsed.generalDesc.map((p, idx) => <p key={idx} style={{ marginBottom: '12px' }}>{p}</p>)
              ) : (
                <p>Professional darajadagi uzatish quvvatiga va mukammal aloqa radiusiga ega aloqa vositasi. Kengaytirilgan xususiyatlari va ishonchli konstruksiyasi bilan ajralib turadi.</p>
              )}
            </div>

            {/* Action Buttons */}
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

            {/* Technical Specifications (Xarakteristikalar) */}
            {parsed.xarakteristikalar.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Texnik Xarakteristikalar</h2>
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
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

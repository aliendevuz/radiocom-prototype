import styles from './page.module.css';
import HeroSlider from '../components/HeroSlider';
import StatsRow from '../components/StatsRow';
import FeaturedProducts from '../components/FeaturedProducts';
import ClientsMarquee from '../components/ClientsMarquee';
import YandexMap from '../components/YandexMap';

export default function Home() {
  return (
    <div className={styles.page}>
      <main>
        {/* Hero Section */}
        <HeroSlider />

        {/* Stats Section (Variant 2) */}
        <StatsRow />

        {/* Featured Products (Variant 2: Bento Box) */}
        <FeaturedProducts />

        {/* Clients Marquee */}
        <ClientsMarquee />

        {/* Yandex Map Section */}
        <YandexMap />

      </main>
    </div>
  );
}

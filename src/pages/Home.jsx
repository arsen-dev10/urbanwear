import { Link, useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import FeaturedProducts from '../components/FeaturedProducts/FeaturedProducts';
import BrandsSection from '../components/BrandsSection/BrandsSection';
import MapSection from '../components/MapSection/MapSection';
import MiniCart from '../components/MiniCart/MiniCart';

const CATEGORIES = [
  { label: 'Новинки',    query: '' },
  { label: 'Футболки',   query: 'Футболки' },
  { label: 'Худи',       query: 'Худи' },
  { label: 'Джинсы',     query: 'Джинсы' },
  { label: 'Куртки',     query: 'Куртки' },
  { label: 'Аксессуары', query: 'Аксессуары' },
];

export default function Home() {
  return (
    <>
      <HeroBanner />

      {/* Category chips */}
      <nav className="cat-chips" aria-label="Категории">
        {CATEGORIES.map(({ label, query }) => (
          <Link
            key={label}
            to={query ? `/catalog?cat=${encodeURIComponent(query)}` : '/catalog'}
            className="cat-chips__item"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="home-content">
        {/* Two-column layout: mini cart + products */}
        <div className="home-shop-layout">
          <MiniCart />
          <FeaturedProducts />
        </div>

        <BrandsSection />
        <MapSection />
      </div>
    </>
  );
}

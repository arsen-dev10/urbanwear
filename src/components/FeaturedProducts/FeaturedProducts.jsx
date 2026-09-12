import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import { useProducts } from '../../context/ProductsContext';

export default function FeaturedProducts() {
  const { products, loading } = useProducts();
  const featured = products.filter((p) => p.isBestseller).slice(0, 4);

  if (loading) return <div className="featured-grid featured-skeleton" />;

  return (
    <section aria-label="Популярные товары">
      <div className="section-head">
        <h2>Популярное</h2>
        <Link to="/catalog">Все товары →</Link>
      </div>
      <div className="featured-grid">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} imageHeight="170px" />
        ))}
      </div>
    </section>
  );
}

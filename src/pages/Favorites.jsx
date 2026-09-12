import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard/ProductCard';

export default function Favorites() {
  const { favorites } = useFavorites();
  const { products } = useProducts();
  const items = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="favorites-page">
      <h1 className="favorites-page__title">
        Избранное
        {items.length > 0 && (
          <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500, marginLeft: 10 }}>
            {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">♡</div>
          <h3>Здесь пока пусто</h3>
          <p>Нажмите ♡ на любой карточке товара,<br />чтобы сохранить понравившиеся вещи.</p>
          <Link to="/catalog" className="empty-state__btn">Смотреть каталог</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} imageHeight="200px" />
          ))}
        </div>
      )}
    </div>
  );
}

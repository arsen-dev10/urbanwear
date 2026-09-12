import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatRub, discountPercent } from '../../utils/format';
import './ProductCard.css';

export default function ProductCard({ product, imageHeight = 'auto' }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const fav = isFavorite(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to product page so user can choose size/color first
    navigate(`/product/${product.id}`);
  };

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
        <div className="product-card__image" style={imageHeight !== 'auto' ? { height: imageHeight } : {}}>
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
          />
          {product.oldPrice && (
            <span className="product-card__badge badge-sale">
              −{discountPercent(product.price, product.oldPrice)}%
            </span>
          )}
          <button
            className={`product-card__fav${fav ? ' is-fav' : ''}`}
            onClick={handleFav}
            aria-label={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </Link>

      <div className="product-card__body">
        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.title}
        </Link>

        <div className="product-card__pricing">
          <span className="product-card__price">{formatRub(product.price)}</span>
          {product.oldPrice && (
            <span className="product-card__old">{formatRub(product.oldPrice)}</span>
          )}
        </div>

        <div className="product-card__sizes">
          {product.sizes.map((s) => (
            <span key={s} className="product-card__size">{s}</span>
          ))}
        </div>

        <button className="product-card__btn" onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </article>
  );
}

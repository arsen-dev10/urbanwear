import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatRub, discountPercent } from '../utils/format';
import SizeModal from '../components/SizeModal/SizeModal';

const API = 'https://6aa130572703577aa1e36392.mockapi.io/products';

/* normalize arrays/booleans that MockAPI may return as strings */
const normalize = (p) => ({
  ...p,
  id:       p.id,
  price:    Number(p.price),
  oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
  colors:   Array.isArray(p.colors) ? p.colors : (p.colors ? JSON.parse(p.colors) : []),
  sizes:    Array.isArray(p.sizes)  ? p.sizes  : (p.sizes  ? JSON.parse(p.sizes)  : []),
  images:   Array.isArray(p.images) ? p.images : (p.images ? JSON.parse(p.images) : []),
  inStock:      p.inStock      === true || p.inStock      === 'true',
  isNew:        p.isNew        === true || p.isNew        === 'true',
  isBestseller: p.isBestseller === true || p.isBestseller === 'true',
});

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize]           = useState(null);
  const [color, setColor]         = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [added, setAdded]         = useState(false);

  /* ── fetch single product from MockAPI ───────────────────── */
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setActiveImg(0);
    setSize(null);
    setColor(null);

    fetch(`${API}/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (active) setProduct(normalize(data));
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  /* ── states ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="detail">
        <div className="detail-loading">
          <div className="detail-loading__spinner" />
          <span>Загрузка товара…</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail">
        <div className="empty-state" style={{ marginTop: 24 }}>
          <div className="empty-state__icon">😕</div>
          <h3>Товар не найден</h3>
          <p>Возможно, он был удалён или ссылка устарела.</p>
          <Link to="/catalog" className="empty-state__btn">Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const selectedSize  = size  ?? product.sizes[0];
  const selectedColor = color ?? product.colors[0];
  const fav = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="detail">
      <Link to="/catalog" className="detail__back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Вернуться в каталог
      </Link>

      <div className="detail__grid">
        {/* Gallery */}
        <div className="gallery">
          <div className="gallery__main">
            <img
              src={product.images[activeImg]}
              alt={`${product.title} — фото ${activeImg + 1}`}
            />
          </div>
          {product.images.length > 1 && (
            <div className="gallery__thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`gallery__thumb${activeImg === i ? ' active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Фото ${i + 1}`}
                >
                  <img src={img} alt={`${product.title} — ракурс ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          <p className="product-info__eyebrow">{product.category} · {product.brand}</p>
          <h1 className="product-info__title">{product.title}</h1>

          <div className="product-info__pricing">
            <span className="product-info__price">{formatRub(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="product-info__old">{formatRub(product.oldPrice)}</span>
                <span className="badge-sale">−{discountPercent(product.price, product.oldPrice)}%</span>
              </>
            )}
          </div>

          <p className="product-info__fabric">{product.fabric}</p>

          {/* Size */}
          <p className="picker-label">Размер</p>
          <div className="size-picker">
            {product.sizes.map((s) => (
              <button
                key={s}
                className={`size-btn${selectedSize === s ? ' selected' : ''}`}
                onClick={() => setSize(s)}
                aria-pressed={selectedSize === s}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="size-table-link" onClick={() => setShowModal(true)}>
            Таблица размеров ↗
          </button>

          {/* Color */}
          <p className="picker-label">Цвет</p>
          <div className="color-picker">
            {product.colors.map((c) => (
              <button
                key={c}
                className={`color-swatch${selectedColor === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                title={c}
                aria-label={`Цвет ${c}`}
                aria-pressed={selectedColor === c}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="product-info__actions">
            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {!product.inStock
                ? 'Нет в наличии'
                : added
                ? '✓ Добавлено!'
                : `В корзину · ${formatRub(product.price)}`}
            </button>

            <button
              className={`btn-fav${fav ? ' is-fav' : ''}`}
              onClick={() => toggleFavorite(product.id)}
              aria-pressed={fav}
            >
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {fav ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </div>
      </div>

      {showModal && <SizeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

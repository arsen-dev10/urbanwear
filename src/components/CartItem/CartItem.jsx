import { useCart } from '../../context/CartContext';
import { formatRub } from '../../utils/format';

export default function CartItem({ item, index }) {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img
        className="cart-item__img"
        src={item.images[0]}
        alt={item.title}
        loading="lazy"
      />

      <div className="cart-item__info">
        <p className="cart-item__name">{item.title}</p>
        <div className="cart-item__meta">
          <span
            className="cart-item__color-dot"
            style={{ background: item.color }}
            aria-label={`Цвет ${item.color}`}
          />
          <span>Размер {item.size}</span>
        </div>
        <span className="cart-item__price">{formatRub(item.price)}</span>
      </div>

      <div className="cart-item__qty" role="group" aria-label="Количество">
        <button
          onClick={() => updateQty(index, item.qty - 1)}
          aria-label="Уменьшить количество"
        >−</button>
        <span>{item.qty}</span>
        <button
          onClick={() => updateQty(index, item.qty + 1)}
          aria-label="Увеличить количество"
        >+</button>
      </div>

      <button
        className="cart-item__remove"
        onClick={() => removeFromCart(index)}
        aria-label={`Удалить ${item.title}`}
      >
        ×
      </button>
    </div>
  );
}

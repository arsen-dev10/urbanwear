import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatRub } from '../../utils/format';

export default function MiniCart() {
  const { cart, updateQty, cartTotal } = useCart();

  return (
    <aside className="mini-cart" aria-label="Мини-корзина">
      <div className="mini-cart__header">
        <span className="mini-cart__title">Корзина</span>
        <span className="mini-cart__count">{cart.length}</span>
      </div>

      <div className="mini-cart__items">
        {cart.length === 0 ? (
          <div className="mini-cart__empty">
            Добавьте вещи из каталога —<br />они появятся здесь.
          </div>
        ) : (
          cart.slice(0, 4).map((item, i) => (
            <div className="mini-cart__item" key={`${item.id}-${item.size}-${item.color}-${i}`}>
              <img src={item.images[0]} alt={item.title} />
              <div className="mini-cart__info">
                <strong>{item.title}</strong>
                <small>{item.size} · {formatRub(item.price)}</small>
              </div>
              <div className="mini-cart__qty">
                <button
                  onClick={() => updateQty(i, item.qty - 1)}
                  aria-label="Уменьшить количество"
                >−</button>
                <span>{item.qty}</span>
                <button
                  onClick={() => updateQty(i, item.qty + 1)}
                  aria-label="Увеличить количество"
                >+</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mini-cart__total">
        <span>Итого</span>
        <b>{formatRub(cartTotal)}</b>
      </div>

      <Link to="/cart" className="mini-cart__cta">
        Оформить заказ
      </Link>

      <p className="mini-cart__note">⚡ Быстрая доставка по Москве</p>
    </aside>
  );
}

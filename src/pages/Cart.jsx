import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem/CartItem';
import CheckoutForm from '../components/CheckoutForm/CheckoutForm';

export default function Cart() {
  const { cart } = useCart();
  const [ordered, setOrdered] = useState(false);

  if (ordered) {
    return (
      <div className="cart-page">
        <div className="order-success">
          <div className="order-success__icon">🎉</div>
          <h2>Заказ оформлен!</h2>
          <p>
            Мы свяжемся с вами в ближайшее время для подтверждения.<br />
            Ожидайте звонка или письма на вашу почту.
          </p>
          <Link to="/catalog" className="empty-state__btn" style={{ marginTop: 20, display: 'inline-block' }}>
            Продолжить покупки
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="cart-page__title">Корзина</h1>
        <div className="empty-state">
          <div className="empty-state__icon">🛍</div>
          <h3>Корзина пуста</h3>
          <p>Добавьте что-нибудь из каталога —<br />товары появятся здесь.</p>
          <Link to="/catalog" className="empty-state__btn">Перейти в каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">
        Корзина
        <small>{cart.length} {cart.length === 1 ? 'товар' : cart.length < 5 ? 'товара' : 'товаров'}</small>
      </h1>

      <div className="cart-layout">
        <section className="cart-list" aria-label="Товары в корзине">
          {cart.map((item, i) => (
            <CartItem key={`${item.id}-${item.size}-${item.color}-${i}`} item={item} index={i} />
          ))}
        </section>

        <CheckoutForm onSuccess={() => setOrdered(true)} />
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatRub } from '../../utils/format';

const FORMSPREE_ID = 'myeynzeq';

export default function CheckoutForm({ onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [state, handleFormspreeSubmit] = useForm(FORMSPREE_ID);

  const [name, setName]       = useState(currentUser?.displayName || '');
  const [phone, setPhone]     = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('card');
  const [fieldErrors, setFieldErrors] = useState({});

  // When Formspree reports success — clear cart and notify parent
  useEffect(() => {
    if (state.succeeded) {
      clearCart();
      onSuccess();
    }
  }, [state.succeeded]);

  const validate = () => {
    const e = {};
    if (!name.trim())    e.name    = 'Введите ваше имя';
    if (!phone.trim())   e.phone   = 'Введите номер телефона';
    if (!address.trim()) e.address = 'Введите адрес доставки';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    // Build a readable cart summary for the email
    const cartSummary = cart
      .map((item) => `${item.title} (${item.size}, цвет: ${item.color}) × ${item.qty} = ${formatRub(item.price * item.qty)}`)
      .join('\n');

    // Inject hidden fields into the native form element before Formspree submits
    handleFormspreeSubmit({
      name,
      phone,
      address,
      payment: payment === 'card' ? 'Картой онлайн' : 'При получении',
      total: formatRub(cartTotal),
      cart: cartSummary,
      // prefill email from Firebase user if available
      email: currentUser?.email || '',
    });
  };

  return (
    <aside className="checkout-panel">
      <h2>Оформление</h2>

      <div className="checkout-total">
        <span>Итого</span>
        <b>{formatRub(cartTotal)}</b>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit} noValidate>

        {/* Name */}
        <div className="checkout-field">
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: '' })); }}
            className={fieldErrors.name ? 'error' : ''}
            aria-label="Имя"
          />
          {fieldErrors.name && <span className="checkout-field-error">{fieldErrors.name}</span>}
        </div>

        {/* Email (shown only when not logged in, required by Formspree) */}
        {!currentUser && (
          <div className="checkout-field">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email (для подтверждения заказа)"
              aria-label="Email"
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} className="checkout-field-error" />
          </div>
        )}

        {/* Phone */}
        <div className="checkout-field">
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: '' })); }}
            className={fieldErrors.phone ? 'error' : ''}
            aria-label="Телефон"
          />
          {fieldErrors.phone && <span className="checkout-field-error">{fieldErrors.phone}</span>}
        </div>

        {/* Address */}
        <div className="checkout-field">
          <input
            type="text"
            name="address"
            placeholder="Адрес доставки"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setFieldErrors((p) => ({ ...p, address: '' })); }}
            className={fieldErrors.address ? 'error' : ''}
            aria-label="Адрес доставки"
          />
          {fieldErrors.address && <span className="checkout-field-error">{fieldErrors.address}</span>}
        </div>

        {/* Payment method */}
        <div className="payment-methods" role="group" aria-label="Способ оплаты">
          <button
            type="button"
            className={`payment-method${payment === 'card' ? ' selected' : ''}`}
            onClick={() => setPayment('card')}
            aria-pressed={payment === 'card'}
          >
            💳 Картой онлайн
          </button>
          <button
            type="button"
            className={`payment-method${payment === 'cash' ? ' selected' : ''}`}
            onClick={() => setPayment('cash')}
            aria-pressed={payment === 'cash'}
          >
            💵 При получении
          </button>
        </div>

        {/* Formspree general error */}
        {state.errors && state.errors.length > 0 && !state.errors.some((e) => e.field) && (
          <div className="checkout-submit-error">
            Не удалось отправить заказ. Попробуйте ещё раз.
          </div>
        )}

        <button
          type="submit"
          className="btn-order"
          disabled={state.submitting}
        >
          {state.submitting ? 'Отправляем…' : 'Оформить заказ'}
        </button>
      </form>
    </aside>
  );
}

import { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatRub } from '../../utils/format';

const FORMSPREE_ID = 'myeynzeq';
const ORDERS_API   = 'https://6aa130572703577aa1e36392.mockapi.io/orders';

const postOrder = (order) =>
  fetch(ORDERS_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(order),
  }).then((r) => r.json());

export default function CheckoutForm({ onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [state, handleFormspreeSubmit] = useForm(FORMSPREE_ID);

  const [name,    setName]    = useState(currentUser?.displayName || '');
  const [phone,   setPhone]   = useState('');        // полный номер с кодом
  const [country, setCountry] = useState('ru');      // код страны для валидации
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('card');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!state.succeeded) return;
    const order = {
      createdAt:  new Date().toISOString(),
      status:     'new',
      name,
      phone:      '+' + phone,
      address,
      email:      currentUser?.email || '',
      payment:    payment === 'card' ? 'Картой онлайн' : 'При получении',
      total:      cartTotal,
      totalFmt:   formatRub(cartTotal),
      itemsCount: cart.reduce((s, i) => s + i.qty, 0),
      items:      cart.map((i) => ({
        id: i.id, title: i.title, size: i.size,
        color: i.color, qty: i.qty, price: i.price,
      })),
    };
    postOrder(order).catch(() => {});
    clearCart();
    onSuccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Введите ваше имя';
    if (!phone || !isValidPhoneNumber('+' + phone))
      e.phone = 'Введите корректный номер телефона';
    if (!address.trim()) e.address = 'Введите адрес доставки';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});

    const cartSummary = cart
      .map((item) => `${item.title} (${item.size}) × ${item.qty} = ${formatRub(item.price * item.qty)}`)
      .join('\n');

    handleFormspreeSubmit({
      name,
      phone:   '+' + phone,
      address,
      payment: payment === 'card' ? 'Картой онлайн' : 'При получении',
      total:   formatRub(cartTotal),
      cart:    cartSummary,
      email:   currentUser?.email || '',
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

        {/* Имя */}
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

        {/* Email — только если не залогинен */}
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

        {/* Телефон с выбором страны */}
        <div className="checkout-field">
          <div className={`phone-input-wrap${fieldErrors.phone ? ' phone-input-wrap--error' : ''}`}>
            <PhoneInput
              country={country}
              value={phone}
              onChange={(value, data) => {
                setPhone(value);
                setCountry(data.countryCode || country);
                setFieldErrors((p) => ({ ...p, phone: '' }));
              }}
              inputProps={{ name: 'phone', required: true, 'aria-label': 'Телефон' }}
              enableSearch
              searchPlaceholder="Поиск страны…"
              searchNotFound="Страна не найдена"
              specialLabel=""
              preferredCountries={['ru', 'kg', 'kz', 'ua', 'by', 'uz']}
              countryCodeEditable={false}
            />
          </div>
          {fieldErrors.phone && <span className="checkout-field-error">{fieldErrors.phone}</span>}
        </div>

        {/* Адрес */}
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

        {/* Способ оплаты */}
        <div className="payment-methods" role="group" aria-label="Способ оплаты">
          <button type="button" className={`payment-method${payment === 'card' ? ' selected' : ''}`} onClick={() => setPayment('card')} aria-pressed={payment === 'card'}>
            💳 Картой онлайн
          </button>
          <button type="button" className={`payment-method${payment === 'cash' ? ' selected' : ''}`} onClick={() => setPayment('cash')} aria-pressed={payment === 'cash'}>
            💵 При получении
          </button>
        </div>

        {state.errors?.length > 0 && !state.errors.some((e) => e.field) && (
          <div className="checkout-submit-error">Не удалось отправить заказ. Попробуйте ещё раз.</div>
        )}

        <button type="submit" className="btn-order" disabled={state.submitting}>
          {state.submitting ? 'Отправляем…' : 'Оформить заказ'}
        </button>
      </form>
    </aside>
  );
}

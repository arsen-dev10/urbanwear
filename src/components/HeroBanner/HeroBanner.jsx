import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section className="hero" aria-label="Главный баннер">
      <div className="hero__copy">
        <span className="hero__eyebrow">Urban Wear · 2026</span>
        <h1 className="hero__title">
          Новая коллекция<br />
          <em>street style.</em>
        </h1>
        <p className="hero__sub">
          Скидки до 30% на весеннюю коллекцию.<br />
          Доставка по всей России.
        </p>
        <Link to="/catalog" className="hero__btn">
          Смотреть каталог
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      <div className="hero__visual" aria-hidden="true">
        <div className="hero__visual-circle" />
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=850&q=90"
          alt="Street style model"
        />
      </div>
    </section>
  );
}

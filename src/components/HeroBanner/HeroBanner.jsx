import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section className="hero" aria-label="Главный баннер">
      <div className="hero__copy">
        <span className="hero__eyebrow">Urban Wear · Весна 2026</span>
        <h1 className="hero__title">
          Стиль, который<br />
          <em>говорит за тебя.</em>
        </h1>
        <p className="hero__sub">
          Новая коллекция футболок и худи.<br />
          Скидки до 30% — только сейчас.
        </p>
        <Link to="/catalog" className="hero__btn">
          Смотреть коллекцию
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      <div className="hero__visual" aria-hidden="true">
        <div className="hero__visual-circle" />
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=850&q=90"
          alt="Urban Wear модель"
        />
      </div>
    </section>
  );
}

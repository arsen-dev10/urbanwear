import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer__logo">urban<span>wear</span></div>
        <p className="footer__tagline">
          Одежда для твоего города.<br />
          Стиль без компромиссов.
        </p>
        <p className="footer__copy">© Urban Wear, 2026</p>
      </div>

      <div className="footer__col">
        <h4>Магазин</h4>
        <Link to="/catalog">Каталог</Link>
        <Link to="/catalog?cat=Новинки">Новинки</Link>
        <Link to="/catalog?cat=Худи">Худи</Link>
        <Link to="/catalog?cat=Куртки">Куртки</Link>
        <Link to="/favorites">Избранное</Link>
      </div>

      <div className="footer__col">
        <h4>Контакты</h4>
        <p>+7 (495) 055-75-86</p>
        <p>order@world-bike.ru</p>
        <p>г. Москва,<br />ул. Доватора, 7/8 с1</p>
        <p>Без выходных 10:00–20:00</p>
      </div>

      <div className="footer__col">
        <h4>Мы в соцсетях</h4>
        <div className="footer__socials">
          <a href="https://vk.com" className="footer__social-btn" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте">VK</a>
          <a href="https://t.me" className="footer__social-btn" target="_blank" rel="noopener noreferrer" aria-label="Telegram">TG</a>
          <a href="https://instagram.com" className="footer__social-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
        </div>
      </div>
    </footer>
  );
}

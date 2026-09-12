import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header() {
  const { cartCount } = useCart();
  const { favorites } = useFavorites();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const initials = currentUser
    ? (currentUser.displayName || currentUser.email || '?')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        urban<span>wear</span>
      </Link>

      <nav className="header__nav">
        <NavLink to="/" end>Главная</NavLink>
        <NavLink to="/catalog">Каталог</NavLink>
        <a href="/#about">О бренде</a>
        <a href="/#contacts">Контакты</a>
      </nav>

      <form className="header__search" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск одежды…"
          aria-label="Поиск товаров"
        />
        <button type="submit" aria-label="Найти">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </form>

      <div className="header__actions">
        <Link
          to="/favorites"
          className={`header__icon${favorites.length > 0 ? ' header__icon--active' : ''}`}
          aria-label={`Избранное (${favorites.length})`}
        >
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {favorites.length > 0 && (
            <span className="header__badge">{favorites.length}</span>
          )}
        </Link>

        <Link
          to="/cart"
          className="header__icon"
          aria-label={`Корзина (${cartCount} товаров)`}
        >
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span className="header__badge">{cartCount}</span>
          )}
        </Link>

        {/* Auth */}
        {currentUser ? (
          <Link to="/profile" className="header__user" aria-label="Профиль">
            <div className="header__user-avatar">{initials}</div>
            <span>{currentUser.displayName?.split(' ')[0] || 'Профиль'}</span>
          </Link>
        ) : (
          <div className="header__auth-links">
            <Link to="/login" className="header__auth-link header__auth-link--outline">
              Войти
            </Link>
            <Link to="/register" className="header__auth-link header__auth-link--filled">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Profile() {
  const { currentUser, logout, updateDisplayName, updateUserEmail, updateUserPassword } = useAuth();
  const { cart, cartTotal } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  // Name editing
  const [nameEdit, setNameEdit]   = useState(false);
  const [newName, setNewName]     = useState(currentUser?.displayName || '');
  const [nameMsg, setNameMsg]     = useState('');

  // Email editing
  const [emailEdit, setEmailEdit]   = useState(false);
  const [newEmail, setNewEmail]     = useState(currentUser?.email || '');
  const [emailPass, setEmailPass]   = useState('');
  const [emailMsg, setEmailMsg]     = useState('');

  // Password editing
  const [passEdit, setPassEdit]     = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass]       = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg]       = useState('');

  const [logoutLoading, setLogoutLoading] = useState(false);

  /* ── handlers ─────────────────────────────────── */
  const saveName = async () => {
    if (!newName.trim()) return setNameMsg('Имя не может быть пустым.');
    try {
      await updateDisplayName(newName.trim());
      setNameEdit(false);
      setNameMsg('✓ Имя обновлено.');
      setTimeout(() => setNameMsg(''), 3000);
    } catch {
      setNameMsg('Не удалось обновить имя.');
    }
  };

  const saveEmail = async () => {
    if (!newEmail.trim()) return setEmailMsg('Введите email.');
    if (!emailPass)       return setEmailMsg('Введите текущий пароль.');
    try {
      await updateUserEmail(newEmail.trim(), emailPass);
      setEmailEdit(false);
      setEmailPass('');
      setEmailMsg('✓ Email обновлён.');
      setTimeout(() => setEmailMsg(''), 3000);
    } catch (err) {
      setEmailMsg(authMsg(err.code));
    }
  };

  const savePassword = async () => {
    if (newPass.length < 6)   return setPassMsg('Минимум 6 символов.');
    if (newPass !== confirmPass) return setPassMsg('Пароли не совпадают.');
    if (!currentPass)            return setPassMsg('Введите текущий пароль.');
    try {
      await updateUserPassword(newPass, currentPass);
      setPassEdit(false);
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
      setPassMsg('✓ Пароль изменён.');
      setTimeout(() => setPassMsg(''), 3000);
    } catch (err) {
      setPassMsg(authMsg(err.code));
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    navigate('/', { replace: true });
  };

  const initials = (currentUser?.displayName || currentUser?.email || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page">
      {/* ── Avatar + name ── */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div>
          <h1 className="profile-hero__name">
            {currentUser?.displayName || 'Пользователь'}
          </h1>
          <p className="profile-hero__email">{currentUser?.email}</p>
        </div>
        <button className="profile-logout" onClick={handleLogout} disabled={logoutLoading}>
          {logoutLoading ? 'Выходим…' : 'Выйти'}
        </button>
      </div>

      <div className="profile-grid">
        {/* ── Stats ── */}
        <section className="profile-card">
          <h2 className="profile-card__title">Статистика</h2>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat__val">{cart.length}</span>
              <span className="profile-stat__label">Товаров в корзине</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat__val">{favorites.length}</span>
              <span className="profile-stat__label">В избранном</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat__val">
                {new Intl.NumberFormat('ru-RU').format(cartTotal)} сом
              </span>
              <span className="profile-stat__label">Сумма корзины</span>
            </div>
          </div>
          <div className="profile-card__links">
            <Link to="/cart" className="profile-link-btn">Перейти в корзину →</Link>
            <Link to="/favorites" className="profile-link-btn">Избранное →</Link>
          </div>
        </section>

        {/* ── Account settings ── */}
        <section className="profile-card">
          <h2 className="profile-card__title">Настройки аккаунта</h2>

          {/* Name */}
          <div className="profile-field">
            <div className="profile-field__row">
              <div>
                <p className="profile-field__label">Имя</p>
                {nameEdit ? (
                  <input
                    className="profile-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                    placeholder="Ваше имя"
                  />
                ) : (
                  <p className="profile-field__value">
                    {currentUser?.displayName || '—'}
                  </p>
                )}
              </div>
              {nameEdit ? (
                <div className="profile-field__actions">
                  <button className="profile-save-btn" onClick={saveName}>Сохранить</button>
                  <button className="profile-cancel-btn" onClick={() => { setNameEdit(false); setNameMsg(''); }}>Отмена</button>
                </div>
              ) : (
                <button className="profile-edit-btn" onClick={() => setNameEdit(true)}>Изменить</button>
              )}
            </div>
            {nameMsg && <p className={`profile-msg${nameMsg.startsWith('✓') ? ' ok' : ' err'}`}>{nameMsg}</p>}
          </div>

          {/* Email */}
          <div className="profile-field">
            <div className="profile-field__row">
              <div>
                <p className="profile-field__label">Email</p>
                {emailEdit ? (
                  <>
                    <input className="profile-input" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Новый email" />
                    <input className="profile-input" type="password" value={emailPass} onChange={(e) => setEmailPass(e.target.value)} placeholder="Текущий пароль" style={{ marginTop: 6 }} />
                  </>
                ) : (
                  <p className="profile-field__value">{currentUser?.email}</p>
                )}
              </div>
              {emailEdit ? (
                <div className="profile-field__actions">
                  <button className="profile-save-btn" onClick={saveEmail}>Сохранить</button>
                  <button className="profile-cancel-btn" onClick={() => { setEmailEdit(false); setEmailMsg(''); setEmailPass(''); }}>Отмена</button>
                </div>
              ) : (
                <button className="profile-edit-btn" onClick={() => setEmailEdit(true)}>Изменить</button>
              )}
            </div>
            {emailMsg && <p className={`profile-msg${emailMsg.startsWith('✓') ? ' ok' : ' err'}`}>{emailMsg}</p>}
          </div>

          {/* Password */}
          <div className="profile-field">
            <div className="profile-field__row">
              <div style={{ flex: 1 }}>
                <p className="profile-field__label">Пароль</p>
                {passEdit ? (
                  <>
                    <input className="profile-input" type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} placeholder="Текущий пароль" />
                    <input className="profile-input" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Новый пароль" style={{ marginTop: 6 }} />
                    <input className="profile-input" type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Повторите новый пароль" style={{ marginTop: 6 }} />
                  </>
                ) : (
                  <p className="profile-field__value">••••••••</p>
                )}
              </div>
              {passEdit ? (
                <div className="profile-field__actions">
                  <button className="profile-save-btn" onClick={savePassword}>Сохранить</button>
                  <button className="profile-cancel-btn" onClick={() => { setPassEdit(false); setPassMsg(''); setCurrentPass(''); setNewPass(''); setConfirmPass(''); }}>Отмена</button>
                </div>
              ) : (
                <button className="profile-edit-btn" onClick={() => setPassEdit(true)}>Изменить</button>
              )}
            </div>
            {passMsg && <p className={`profile-msg${passMsg.startsWith('✓') ? ' ok' : ' err'}`}>{passMsg}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function authMsg(code) {
  const map = {
    'auth/wrong-password':     'Неверный текущий пароль.',
    'auth/invalid-credential': 'Неверный текущий пароль.',
    'auth/email-already-in-use': 'Этот email уже используется.',
    'auth/requires-recent-login': 'Войдите снова, чтобы изменить данные.',
  };
  return map[code] || 'Ошибка. Попробуйте снова.';
}

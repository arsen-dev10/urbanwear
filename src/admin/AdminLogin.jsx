import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAILS = ['admin@urbanwear.com', 'urbanwear.admin@gmail.com'];

export default function AdminLogin() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Already logged in as admin → redirect
  if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      if (!ADMIN_EMAILS.includes(email)) {
        setError('Этот аккаунт не имеет прав администратора.');
        setLoading(false);
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      const map = {
        'auth/user-not-found':     'Пользователь не найден.',
        'auth/wrong-password':     'Неверный пароль.',
        'auth/invalid-credential': 'Неверный email или пароль.',
        'auth/invalid-email':      'Некорректный email.',
        'auth/too-many-requests':  'Слишком много попыток. Подождите.',
      };
      setError(map[err.code] || 'Ошибка входа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-card__logo">
          urban<span>wear</span>
          <small>Панель администратора</small>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          <div className="admin-login-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@urbanwear.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Пароль</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Входим…' : 'Войти в панель'}
          </button>
        </form>
      </div>
    </div>
  );
}

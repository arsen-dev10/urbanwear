import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      return setError('Введите ваше имя.');
    }
    if (form.password.length < 6) {
      return setError('Пароль должен содержать минимум 6 символов.');
    }
    if (form.password !== form.confirm) {
      return setError('Пароли не совпадают.');
    }

    setLoading(true);
    try {
      await register(form.email, form.password, form.name.trim());
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">urban<span>wear</span></div>
        <h1 className="auth-card__title">Создать аккаунт</h1>
        <p className="auth-card__sub">Присоединяйтесь к Urban Wear</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="reg-name">Имя</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Иван Иванов"
              value={form.name}
              onChange={handleChange('name')}
              required
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password">Пароль</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Минимум 6 символов"
              value={form.password}
              onChange={handleChange('password')}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm">Повторите пароль</label>
            <input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={handleChange('confirm')}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт?{' '}
          <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}

function firebaseError(code) {
  const map = {
    'auth/email-already-in-use': 'Этот email уже зарегистрирован.',
    'auth/invalid-email':        'Некорректный формат email.',
    'auth/weak-password':        'Пароль слишком простой.',
    'auth/operation-not-allowed':'Регистрация временно недоступна.',
  };
  return map[code] || 'Ошибка регистрации. Попробуйте снова.';
}

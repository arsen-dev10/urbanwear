import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin',          label: 'Дашборд',  icon: '▦' },
  { to: '/admin/products', label: 'Товары',    icon: '🛍' },
  { to: '/admin/settings', label: 'Настройки', icon: '⚙' },
];

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <span>urban</span>wear
          <small>ADMIN</small>
        </div>

        <nav className="admin-nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => `admin-nav__link${isActive ? ' active' : ''}`}
            >
              <span className="admin-nav__icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {(currentUser?.displayName || currentUser?.email || 'A')[0].toUpperCase()}
            </div>
            <div className="admin-sidebar__user-info">
              <strong>{currentUser?.displayName || 'Admin'}</strong>
              <small>{currentUser?.email}</small>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

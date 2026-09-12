import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { formatRub } from '../utils/format';

export default function AdminDashboard() {
  const { products, loading } = useProducts();

  const stats = useMemo(() => {
    if (!products.length) return null;
    const inStock    = products.filter((p) => p.inStock).length;
    const outStock   = products.length - inStock;
    const categories = [...new Set(products.map((p) => p.category))].length;
    const brands     = [...new Set(products.map((p) => p.brand))].length;
    const avgPrice   = Math.round(products.reduce((s, p) => s + p.price, 0) / products.length);
    const discounted = products.filter((p) => p.oldPrice).length;
    return { inStock, outStock, categories, brands, avgPrice, discounted };
  }, [products]);

  const recent = [...products].reverse().slice(0, 5);

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <h1>Дашборд</h1>
        <p>Обзор магазина Urban Wear</p>
      </div>

      {loading ? (
        <div className="admin-loading">Загрузка данных…</div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <span className="admin-stat-card__val">{products.length}</span>
              <span className="admin-stat-card__label">Всего товаров</span>
            </div>
            <div className="admin-stat-card admin-stat-card--green">
              <span className="admin-stat-card__val">{stats?.inStock}</span>
              <span className="admin-stat-card__label">В наличии</span>
            </div>
            <div className="admin-stat-card admin-stat-card--red">
              <span className="admin-stat-card__val">{stats?.outStock}</span>
              <span className="admin-stat-card__label">Нет в наличии</span>
            </div>
            <div className="admin-stat-card admin-stat-card--orange">
              <span className="admin-stat-card__val">{stats?.discounted}</span>
              <span className="admin-stat-card__label">Со скидкой</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__val">{stats?.categories}</span>
              <span className="admin-stat-card__label">Категорий</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__val">{formatRub(stats?.avgPrice)}</span>
              <span className="admin-stat-card__label">Средняя цена</span>
            </div>
          </div>

          {/* Recent products */}
          <div className="admin-section">
            <div className="admin-section__head">
              <h2>Последние товары</h2>
              <Link to="/admin/products" className="admin-link-btn">Все товары →</Link>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Фото</th>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Цена</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img className="admin-table__thumb" src={p.images?.[0]} alt={p.title} />
                      </td>
                      <td className="admin-table__title">{p.title}</td>
                      <td>{p.category}</td>
                      <td><strong>{formatRub(p.price)}</strong></td>
                      <td>
                        <span className={`admin-badge ${p.inStock ? 'admin-badge--green' : 'admin-badge--red'}`}>
                          {p.inStock ? 'В наличии' : 'Нет'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

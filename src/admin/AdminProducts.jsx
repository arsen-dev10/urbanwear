import { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductsContext';
import { formatRub } from '../utils/format';
import ProductModal from './ProductModal';

export default function AdminProducts() {
  const { products, loading, addProduct, updateProduct, deleteProduct, toggleStock } = useProducts();

  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modal, setModal]         = useState(null); // null | 'add' | product object
  const [deleting, setDeleting]   = useState(null);

  const categories = useMemo(() => ['', ...new Set(products.map((p) => p.category))], [products]);

  const filtered = useMemo(() =>
    products.filter((p) => {
      const q = search.toLowerCase();
      if (q && !p.title.toLowerCase().includes(q) && !p.brand?.toLowerCase().includes(q)) return false;
      if (catFilter && p.category !== catFilter) return false;
      return true;
    }),
    [products, search, catFilter]
  );

  // MockAPI uses the string `id` field returned by the API
  const handleSave = async (data) => {
    if (modal === 'add') {
      await addProduct(data);
    } else {
      await updateProduct(modal.id, data);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Удалить «${p.title}»? Это действие нельзя отменить.`)) return;
    setDeleting(p.id);
    try {
      await deleteProduct(p.id);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Товары</h1>
          <p>{products.length} позиций в каталоге</p>
        </div>
        <button className="admin-primary-btn" onClick={() => setModal('add')}>
          + Добавить товар
        </button>
      </div>

      {/* Filters */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию или бренду…"
        />
        <select className="admin-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c || 'Все категории'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Загрузка товаров…</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 56 }}>Фото</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Бренд</th>
                <th>Цена</th>
                <th>Наличие</th>
                <th style={{ width: 130 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--a-muted)', padding: 32 }}>
                    Товары не найдены
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img className="admin-table__thumb" src={p.images?.[0]} alt={p.title} />
                  </td>
                  <td className="admin-table__title">
                    <strong>{p.title}</strong>
                    {p.oldPrice && (
                      <span className="admin-badge admin-badge--orange" style={{ marginLeft: 6 }}>
                        −{Math.round((1 - p.price / p.oldPrice) * 100)}%
                      </span>
                    )}
                  </td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td>
                    <strong>{formatRub(p.price)}</strong>
                    {p.oldPrice && (
                      <div style={{ fontSize: 10, color: '#aaa', textDecoration: 'line-through' }}>
                        {formatRub(p.oldPrice)}
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      className={`admin-badge admin-badge--btn ${p.inStock ? 'admin-badge--green' : 'admin-badge--red'}`}
                      onClick={() => toggleStock(p.id, p.inStock)}
                      title="Нажмите для переключения"
                    >
                      {p.inStock ? '✓ В наличии' : '✗ Нет'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-edit-btn"
                        onClick={() => setModal(p)}
                        title="Редактировать"
                      >
                        ✏
                      </button>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
                        title="Удалить"
                      >
                        {deleting === p.id ? '…' : '🗑'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

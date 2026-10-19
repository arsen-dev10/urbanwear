import { useState, useEffect } from 'react';
import { formatRub } from '../utils/format';

const ORDERS_API = 'https://6aa130572703577aa1e36392.mockapi.io/orders';

const STATUS_LABELS = {
  new:       { label: 'Новый',      cls: 'admin-badge--blue'   },
  confirmed: { label: 'Подтверждён', cls: 'admin-badge--orange' },
  shipped:   { label: 'Отправлен',  cls: 'admin-badge--purple' },
  delivered: { label: 'Доставлен',  cls: 'admin-badge--green'  },
  cancelled: { label: 'Отменён',    cls: 'admin-badge--red'    },
};

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, { label }]) => ({ value, label }));

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null); // id раскрытого заказа
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /* ── загрузить заказы ── */
  useEffect(() => {
    fetch(ORDERS_API)
      .then((r) => r.json())
      .then((data) => setOrders([...data].reverse())) // новые сверху
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  /* ── изменить статус ── */
  const changeStatus = async (id, status) => {
    await fetch(`${ORDERS_API}/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  /* ── удалить заказ ── */
  const deleteOrder = async (id) => {
    if (!window.confirm('Удалить заказ? Это действие нельзя отменить.')) return;
    await fetch(`${ORDERS_API}/${id}`, { method: 'DELETE' });
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (expanded === id) setExpanded(null);
  };

  /* ── фильтрация ── */
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    if (q && !o.name?.toLowerCase().includes(q) && !o.phone?.includes(q) && !String(o.id).includes(q)) return false;
    if (statusFilter && o.status !== statusFilter) return false;
    return true;
  });

  /* ── итоговая сумма ── */
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Заказы</h1>
          <p>{orders.length} заказов · выручка {formatRub(totalRevenue)}</p>
        </div>
      </div>

      {/* Статистика */}
      <div className="admin-stats" style={{ marginBottom: 24 }}>
        {STATUS_OPTIONS.map(({ value, label }) => {
          const count = orders.filter((o) => o.status === value).length;
          return (
            <div
              key={value}
              className={`admin-stat-card${value === 'new' ? ' admin-stat-card--orange' : value === 'delivered' ? ' admin-stat-card--green' : value === 'cancelled' ? ' admin-stat-card--red' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setStatusFilter(statusFilter === value ? '' : value)}
            >
              <span className="admin-stat-card__val">{count}</span>
              <span className="admin-stat-card__label">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Тулбар */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени, телефону, номеру…"
        />
        <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Все статусы</option>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Таблица */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Загрузка заказов…</div>
        ) : filtered.length === 0 ? (
          <div className="admin-loading">Заказов не найдено</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Товаров</th>
                <th>Сумма</th>
                <th>Оплата</th>
                <th>Статус</th>
                <th style={{ width: 80 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className={`admin-orders__row${expanded === order.id ? ' admin-orders__row--open' : ''}`}
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ color: 'var(--a-muted)', fontSize: 11 }}>#{order.id}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 11 }}>{formatDate(order.createdAt)}</td>
                    <td><strong>{order.name || '—'}</strong></td>
                    <td style={{ fontSize: 11 }}>{order.phone || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{order.itemsCount ?? order.items?.length ?? '—'}</td>
                    <td><strong>{order.totalFmt || formatRub(Number(order.total) || 0)}</strong></td>
                    <td style={{ fontSize: 11 }}>{order.payment || '—'}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="admin-orders__status-select"
                        value={order.status || 'new'}
                        onChange={(e) => changeStatus(order.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="admin-row-actions">
                        <button
                          className="admin-delete-btn"
                          onClick={() => deleteOrder(order.id)}
                          title="Удалить заказ"
                        >🗑</button>
                      </div>
                    </td>
                  </tr>

                  {/* Раскрытые детали заказа */}
                  {expanded === order.id && (
                    <tr key={`${order.id}-detail`} className="admin-orders__detail-row">
                      <td colSpan={9}>
                        <div className="admin-orders__detail">
                          <div className="admin-orders__detail-cols">
                            <div>
                              <p className="admin-orders__detail-label">Адрес доставки</p>
                              <p>{order.address || '—'}</p>
                            </div>
                            {order.email && (
                              <div>
                                <p className="admin-orders__detail-label">Email</p>
                                <p>{order.email}</p>
                              </div>
                            )}
                          </div>

                          {/* Список товаров */}
                          {order.items?.length > 0 && (
                            <div style={{ marginTop: 14 }}>
                              <p className="admin-orders__detail-label" style={{ marginBottom: 8 }}>Состав заказа</p>
                              <div className="admin-orders__items">
                                {order.items.map((item, i) => (
                                  <div key={i} className="admin-orders__item">
                                    <span className="admin-orders__item-title">{item.title}</span>
                                    <span className="admin-orders__item-meta">
                                      {item.size}
                                      {item.color && (
                                        <span
                                          className="admin-orders__item-color"
                                          style={{ background: item.color }}
                                        />
                                      )}
                                    </span>
                                    <span className="admin-orders__item-qty">× {item.qty}</span>
                                    <span className="admin-orders__item-price">{formatRub(item.price * item.qty)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

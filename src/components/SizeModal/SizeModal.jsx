import { useEffect } from 'react';

const SIZE_DATA = [
  { label: 'Обхват груди (см)', S: 92,  M: 100, L: 108, XL: 116 },
  { label: 'Обхват талии (см)', S: 72,  M: 80,  L: 88,  XL: 96  },
  { label: 'Обхват бёдер (см)', S: 96,  M: 104, L: 112, XL: 120 },
  { label: 'Длина изделия (см)', S: 68, M: 71,  L: 74,  XL: 77  },
];

export default function SizeModal({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Таблица размеров"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Закрыть">×</button>
        <h2>Таблица размеров</h2>
        <table className="size-table">
          <thead>
            <tr>
              <th>Параметр</th>
              <th>S</th>
              <th>M</th>
              <th>L</th>
              <th>XL</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_DATA.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{row.S}</td>
                <td>{row.M}</td>
                <td>{row.L}</td>
                <td>{row.XL}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 14, lineHeight: 1.6 }}>
          Если вы находитесь между двумя размерами — выбирайте больший.<br />
          Замеры указаны в сантиметрах.
        </p>
      </div>
    </div>
  );
}

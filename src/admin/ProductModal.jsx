import { useState, useEffect } from 'react';

const EMPTY = {
  title: '', category: 'Худи', brand: '', price: '', oldPrice: '',
  fabric: '', material: '100% Хлопок',
  images: ['', ''],
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['#1c1c1c'],
  inStock: true, isNew: false, isBestseller: false,
};

const CATEGORIES = ['Футболки', 'Худи', 'Джинсы', 'Куртки', 'Аксессуары'];
const MATERIALS  = ['100% Хлопок', 'Деним', 'Шерсть', 'Полиэстер'];
const ALL_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];

export default function ProductModal({ product, onSave, onClose }) {
  const isEdit = Boolean(product);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        ...EMPTY,
        ...product,
        price:    product.price    ?? '',
        oldPrice: product.oldPrice ?? '',
        images:   product.images?.length ? [...product.images] : ['', ''],
        sizes:    product.sizes   ?? [],
        colors:   product.colors  ?? ['#1c1c1c'],
      });
    }
  }, [product]);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const setBool = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.checked }));

  const toggleSize = (s) =>
    setForm((p) => ({
      ...p,
      sizes: p.sizes.includes(s) ? p.sizes.filter((x) => x !== s) : [...p.sizes, s],
    }));

  const addColor = () => setForm((p) => ({ ...p, colors: [...p.colors, '#888888'] }));
  const setColor = (i, val) =>
    setForm((p) => { const c = [...p.colors]; c[i] = val; return { ...p, colors: c }; });
  const removeColor = (i) =>
    setForm((p) => ({ ...p, colors: p.colors.filter((_, idx) => idx !== i) }));

  const setImage = (i, val) =>
    setForm((p) => { const imgs = [...p.images]; imgs[i] = val; return { ...p, images: imgs }; });
  const addImage = () => setForm((p) => ({ ...p, images: [...p.images, ''] }));
  const removeImage = (i) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Введите название товара.');
    if (!form.price)        return setError('Введите цену.');
    if (!form.brand.trim()) return setError('Введите бренд.');
    if (!form.sizes.length) return setError('Выберите хотя бы один размер.');

    setError('');
    setSaving(true);
    try {
      const data = {
        ...form,
        price:    Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        images:   form.images.filter(Boolean),
      };
      await onSave(data);
      onClose();
    } catch (err) {
      setError('Ошибка сохранения: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Закрыть">×</button>
        <h2>{isEdit ? 'Редактировать товар' : 'Добавить товар'}</h2>

        {error && <div className="admin-error" style={{ marginBottom: 14 }}>{error}</div>}

        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            {/* Title */}
            <div className="admin-form-field admin-form-field--full">
              <label>Название *</label>
              <input type="text" value={form.title} onChange={set('title')} placeholder="Оверсайз худи Streetwear" required />
            </div>

            {/* Category + Brand */}
            <div className="admin-form-field">
              <label>Категория</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-form-field">
              <label>Бренд *</label>
              <input type="text" value={form.brand} onChange={set('brand')} placeholder="Urban Wear" required />
            </div>

            {/* Price + Old price */}
            <div className="admin-form-field">
              <label>Цена (сом) *</label>
              <input type="number" value={form.price} onChange={set('price')} min="0" placeholder="4500" required />
            </div>
            <div className="admin-form-field">
              <label>Старая цена (сом)</label>
              <input type="number" value={form.oldPrice} onChange={set('oldPrice')} min="0" placeholder="5990 (необязательно)" />
            </div>

            {/* Fabric + Material */}
            <div className="admin-form-field admin-form-field--full">
              <label>Состав ткани</label>
              <input type="text" value={form.fabric} onChange={set('fabric')} placeholder="80% хлопок, 20% полиэстер · 320 г/м²" />
            </div>
            <div className="admin-form-field">
              <label>Материал (фильтр)</label>
              <select value={form.material} onChange={set('material')}>
                {MATERIALS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>

            {/* Sizes */}
            <div className="admin-form-field admin-form-field--full">
              <label>Размеры *</label>
              <div className="admin-size-grid">
                {ALL_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`admin-size-btn${form.sizes.includes(s) ? ' selected' : ''}`}
                    onClick={() => toggleSize(s)}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="admin-form-field admin-form-field--full">
              <label>Цвета</label>
              <div className="admin-color-row">
                {form.colors.map((c, i) => (
                  <div key={i} className="admin-color-item">
                    <input type="color" value={c} onChange={(e) => setColor(i, e.target.value)} />
                    <button type="button" className="admin-remove-btn" onClick={() => removeColor(i)}>×</button>
                  </div>
                ))}
                <button type="button" className="admin-add-btn" onClick={addColor}>+ Цвет</button>
              </div>
            </div>

            {/* Images */}
            <div className="admin-form-field admin-form-field--full">
              <label>Фотографии (URL)</label>
              {form.images.map((img, i) => (
                <div key={i} className="admin-image-row">
                  <input type="url" value={img} onChange={(e) => setImage(i, e.target.value)} placeholder="https://…" />
                  {i > 0 && <button type="button" className="admin-remove-btn" onClick={() => removeImage(i)}>×</button>}
                  {img && <img src={img} alt="" className="admin-img-preview" />}
                </div>
              ))}
              {form.images.length < 4 && (
                <button type="button" className="admin-add-btn" onClick={addImage}>+ Добавить фото</button>
              )}
            </div>

            {/* Flags */}
            <div className="admin-form-field admin-form-field--full">
              <label>Флаги</label>
              <div className="admin-flags">
                {[['inStock', 'В наличии'], ['isNew', 'Новинка'], ['isBestseller', 'Бестселлер']].map(([key, label]) => (
                  <label key={key} className="admin-flag">
                    <input type="checkbox" checked={form[key]} onChange={setBool(key)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-cancel-btn" onClick={onClose}>Отмена</button>
            <button type="submit" className="admin-save-btn" disabled={saving}>
              {saving ? 'Сохраняем…' : isEdit ? 'Сохранить' : 'Добавить товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

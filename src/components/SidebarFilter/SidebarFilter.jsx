import { useState, useMemo } from 'react';
import { formatRub } from '../../utils/format';
import { useProducts } from '../../context/ProductsContext';

const CATEGORIES = ['Футболки', 'Худи', 'Джинсы', 'Куртки', 'Аксессуары'];
const MATERIALS  = ['100% Хлопок', 'Деним', 'Шерсть', 'Полиэстер'];
const PRICE_MIN  = 0;
const PRICE_MAX  = 15000;

export default function SidebarFilter({ filters, onChange }) {
  const { products } = useProducts();
  const [showAllBrands, setShowAllBrands] = useState(false);

  const allBrands = useMemo(() => [...new Set(products.map((p) => p.brand))], [products]);
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors))], [products]);
  const visibleBrands = showAllBrands ? allBrands : allBrands.slice(0, 4);

  const toggle = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const handlePriceMin = (e) => {
    const val = Math.min(Number(e.target.value), filters.priceMax - 500);
    onChange({ ...filters, priceMin: val });
  };

  const handlePriceMax = (e) => {
    const val = Math.max(Number(e.target.value), filters.priceMin + 500);
    onChange({ ...filters, priceMax: val });
  };

  const reset = () =>
    onChange({
      categories: [],
      brands: [],
      materials: [],
      colors: [],
      priceMin: PRICE_MIN,
      priceMax: PRICE_MAX,
      inStock: false,
    });

  const brandCount = (brand) =>
    products.filter(
      (p) => p.brand === brand && p.price >= filters.priceMin && p.price <= filters.priceMax
    ).length;

  return (
    <aside className="sidebar" aria-label="Фильтры">
      <div className="sidebar__head">
        <h3>Фильтры</h3>
        <button className="sidebar__reset" onClick={reset}>Сбросить</button>
      </div>

      {/* In stock */}
      <label className="toggle-row">
        <span>Только в наличии</span>
        <span className="toggle-row__switch">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked })}
          />
          <span className="toggle-row__track" />
        </span>
      </label>

      {/* Categories */}
      <details className="filter-accordion" open>
        <summary className="filter-accordion__summary">
          Категории <span className="filter-accordion__arrow">▾</span>
        </summary>
        <div className="filter-accordion__body">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="filter-check">
              <input type="checkbox" checked={filters.categories.includes(cat)} onChange={() => toggle('categories', cat)} />
              {cat}
            </label>
          ))}
        </div>
      </details>

      {/* Price */}
      <details className="filter-accordion" open>
        <summary className="filter-accordion__summary">
          Цена <span className="filter-accordion__arrow">▾</span>
        </summary>
        <div className="filter-accordion__body">
          <div className="price-range">
            <div className="price-range__track">
              <div
                className="price-range__fill"
                style={{
                  left: `${(filters.priceMin / PRICE_MAX) * 100}%`,
                  right: `${100 - (filters.priceMax / PRICE_MAX) * 100}%`,
                }}
              />
              <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={100} value={filters.priceMin} onChange={handlePriceMin} aria-label="Минимальная цена" />
              <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={100} value={filters.priceMax} onChange={handlePriceMax} aria-label="Максимальная цена" />
            </div>
            <div className="price-range__labels">
              <span>{formatRub(filters.priceMin)}</span>
              <span>{formatRub(filters.priceMax)}</span>
            </div>
            <div className="price-range__inputs">
              <input type="number" value={filters.priceMin} min={PRICE_MIN} max={filters.priceMax - 500} step={100} onChange={(e) => onChange({ ...filters, priceMin: Number(e.target.value) })} aria-label="От" />
              <input type="number" value={filters.priceMax} min={filters.priceMin + 500} max={PRICE_MAX} step={100} onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })} aria-label="До" />
            </div>
          </div>
        </div>
      </details>

      {/* Brands */}
      <details className="filter-accordion" open>
        <summary className="filter-accordion__summary">
          Бренд <span className="filter-accordion__arrow">▾</span>
        </summary>
        <div className="filter-accordion__body">
          {visibleBrands.map((brand) => (
            <label key={brand} className="filter-check">
              <input type="checkbox" checked={filters.brands.includes(brand)} onChange={() => toggle('brands', brand)} />
              {brand}
              <span className="filter-check__count">({brandCount(brand)})</span>
            </label>
          ))}
          {allBrands.length > 4 && (
            <button className="show-more" onClick={() => setShowAllBrands((v) => !v)}>
              {showAllBrands ? 'Скрыть' : `Показать ещё ${allBrands.length - 4}`}
            </button>
          )}
        </div>
      </details>

      {/* Material */}
      <details className="filter-accordion">
        <summary className="filter-accordion__summary">
          Материал <span className="filter-accordion__arrow">▾</span>
        </summary>
        <div className="filter-accordion__body">
          {MATERIALS.map((mat) => (
            <label key={mat} className="filter-check">
              <input type="checkbox" checked={filters.materials.includes(mat)} onChange={() => toggle('materials', mat)} />
              {mat}
            </label>
          ))}
        </div>
      </details>

      {/* Colors */}
      <details className="filter-accordion">
        <summary className="filter-accordion__summary">
          Цвет <span className="filter-accordion__arrow">▾</span>
        </summary>
        <div className="filter-accordion__body">
          <div className="color-palette">
            {allColors.map((color) => (
              <button
                key={color}
                className={`color-dot${filters.colors.includes(color) ? ' selected' : ''}`}
                style={{ background: color }}
                onClick={() => toggle('colors', color)}
                title={color}
                aria-label={`Цвет ${color}`}
                aria-pressed={filters.colors.includes(color)}
              />
            ))}
          </div>
        </div>
      </details>
    </aside>
  );
}

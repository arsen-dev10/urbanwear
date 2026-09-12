import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SidebarFilter from '../components/SidebarFilter/SidebarFilter';
import SortBar from '../components/SortBar/SortBar';
import ProductCard from '../components/ProductCard/ProductCard';
import { useProducts } from '../context/ProductsContext';

const DEFAULT_FILTERS = {
  categories: [],
  brands: [],
  materials: [],
  colors: [],
  priceMin: 0,
  priceMax: 15000,
  inStock: false,
};

function activeFilterCount(filters) {
  return (
    filters.categories.length +
    filters.brands.length +
    filters.materials.length +
    filters.colors.length +
    (filters.inStock ? 1 : 0) +
    (filters.priceMin > 0 ? 1 : 0) +
    (filters.priceMax < 15000 ? 1 : 0)
  );
}

export default function Catalog() {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState(() => {
    const cat   = searchParams.get('cat');
    const brand = searchParams.get('brand');
    return {
      ...DEFAULT_FILTERS,
      categories: cat && cat !== 'Новинки' ? [cat] : [],
      brands: brand ? [brand] : [],
    };
  });

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort]   = useState('popular');

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (filters.inStock && !p.inStock) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.materials.length && !filters.materials.includes(p.material)) return false;
      if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c))) return false;
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    if (sort === 'price_asc')  result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, filters, query, sort]);

  const filterCount = activeFilterCount(filters);

  return (
    <div className="catalog-layout">
      {/* Sidebar — desktop always visible, mobile = drawer */}
      <SidebarFilter
        filters={filters}
        onChange={setFilters}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Overlay for mobile drawer */}
      {drawerOpen && (
        <div
          className="catalog-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <section className="catalog-main">
        {/* Mobile filter toggle button ⋮ */}
        <button
          className="catalog-filter-btn"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label={drawerOpen ? 'Закрыть фильтры' : 'Открыть фильтры'}
          aria-expanded={drawerOpen}
        >
          <span className="catalog-filter-btn__dots">⋮</span>
          Фильтры
          {filterCount > 0 && (
            <span className="catalog-filter-btn__badge">{filterCount}</span>
          )}
        </button>

        <SortBar
          count={filtered.length}
          query={query}
          onQuery={setQuery}
          sort={sort}
          onSort={setSort}
        />

        <p className="count-label">
          Найдено: {loading ? '…' : `${filtered.length} товаров`}
        </p>

        {loading ? (
          <div className="catalog-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-card skeleton-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="catalog-empty">
            <p>По вашему запросу ничего не найдено.</p>
            <button
              className="empty-state__btn"
              onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(''); }}
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="catalog-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} imageHeight="230px" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

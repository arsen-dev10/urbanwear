import { createContext, useContext, useEffect, useState } from 'react';
import localProducts from '../data/products.json';

const ProductsContext = createContext(null);

const API = 'https://6aa130572703577aa1e36392.mockapi.io/products';

/* ── tiny fetch helpers ──────────────────────────────────────── */
const api = {
  get:    ()           => fetch(API).then(r => r.json()),
  post:   (body)       => fetch(API,              { method: 'POST',   headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  put:    (id, body)   => fetch(`${API}/${id}`,   { method: 'PUT',    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  delete: (id)         => fetch(`${API}/${id}`,   { method: 'DELETE' }).then(r => r.json()),
};

/* ── normalize MockAPI response (id comes back as string) ────── */
const normalize = (p) => ({
  ...p,
  id:       Number(p.id),
  price:    Number(p.price),
  oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
  colors:   Array.isArray(p.colors)  ? p.colors  : (p.colors  ? JSON.parse(p.colors)  : []),
  sizes:    Array.isArray(p.sizes)   ? p.sizes   : (p.sizes   ? JSON.parse(p.sizes)   : []),
  images:   Array.isArray(p.images)  ? p.images  : (p.images  ? JSON.parse(p.images)  : []),
  inStock:      p.inStock      === true || p.inStock      === 'true',
  isNew:        p.isNew        === true || p.isNew        === 'true',
  isBestseller: p.isBestseller === true || p.isBestseller === 'true',
});

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  /* ── initial load — seed if empty ───────────────────────────── */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.get();

        if (!active) return;

        if (!data || data.length === 0) {
          /* First run: push all local products to MockAPI.
             Strip the local numeric id — MockAPI assigns its own unique string id. */
          const seeded = await Promise.all(
            localProducts.map(({ id: _omit, ...p }) => api.post(p))
          );
          if (active) setProducts(seeded.map(normalize));
        } else {
          setProducts(data.map(normalize));
        }
      } catch (err) {
        console.warn('MockAPI unavailable, using local data:', err.message);
        if (active) setProducts(localProducts);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  /* ── CRUD ────────────────────────────────────────────────────── */
  const addProduct = async (data) => {
    /* Strip any id coming from the form — MockAPI assigns a unique one. */
    const { id: _omit, ...body } = data;
    const created = await api.post(body);
    const product = normalize(created);
    setProducts((prev) => [...prev, product]);
    return product;
  };

  const updateProduct = async (id, data) => {
    const updated = await api.put(id, data);
    const product = normalize(updated);
    setProducts((prev) => prev.map((p) => String(p.id) === String(id) ? product : p));
    return product;
  };

  const deleteProduct = async (id) => {
    await api.delete(id);
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const toggleStock = async (id, current) => {
    const updated = await api.put(id, { inStock: !current });
    const product = normalize(updated);
    setProducts((prev) => prev.map((p) => String(p.id) === String(id) ? product : p));
  };

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, toggleStock }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider');
  return ctx;
}

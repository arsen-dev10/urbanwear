import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('uw_cart') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('uw_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size = product.sizes[0], color = product.colors[0]) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.id === product.id && item.size === size && item.color === color
      );
      if (existing) {
        return prev.map(item =>
          item === existing ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, size, color, qty: 1 }];
    });
  };

  const updateQty = (index, qty) => {
    setCart(prev =>
      qty < 1
        ? prev.filter((_, i) => i !== index)
        : prev.map((item, i) => (i === index ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

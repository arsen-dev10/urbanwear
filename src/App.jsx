import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ProductsProvider } from './context/ProductsContext';
import { myRouter } from './router';

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <FavoritesProvider>
            <RouterProvider router={myRouter} />
          </FavoritesProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

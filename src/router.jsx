import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminSettings from './admin/AdminSettings';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export const myRouter = createBrowserRouter([
  /* ── Shop ─────────────────────────────────────── */
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,         element: <Home /> },
      { path: 'catalog',     element: <Catalog /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'cart',        element: <Cart /> },
      { path: 'favorites',   element: <Favorites /> },
      { path: 'login',       element: <Login /> },
      { path: 'register',    element: <Register /> },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      { path: '*', element: <NotFound /> },
    ],
  },

  /* ── Admin ────────────────────────────────────── */
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true,       element: <AdminDashboard /> },
      { path: 'products',  element: <AdminProducts /> },
      { path: 'orders',    element: <AdminOrders /> },
      { path: 'settings',  element: <AdminSettings /> },
    ],
  },
]);

import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';

export default function Layout() {
  const { pathname } = useLocation();
  const showFooter = pathname === '/';

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

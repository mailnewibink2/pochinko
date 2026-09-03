import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomeView from './views/HomeView';
import ProductDetailView from './views/ProductDetailView';
import SearchView from './views/SearchView';
import WishlistView from './views/WishlistView';
import CartView from './views/CartView';

// Admin Views
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminProducts from './views/admin/AdminProducts';
import AdminProductEditor from './views/admin/AdminProductEditor';
import AdminOrders from './views/admin/AdminOrders';

import { AppProvider } from './context/AppContext';

// Temporary placeholders for admin views
const AdminSettings = () => <div>Settings Placeholder</div>;

const ClientLayout = () => {
  return (
    <div className="app-container">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#5700ff" offset="0%" />
            <stop stopColor="#FFB6C1" offset="100%" />
          </linearGradient>
        </defs>
      </svg>
      <Outlet />
      <Navigation />
    </div>
  );
};

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Terjadi Kesalahan (Runtime Error)</h2>
          <pre style={{ background: '#fff0f0', color: '#ff4d4f', padding: '16px', borderRadius: '12px', textAlign: 'left', overflowX: 'auto', fontSize: '13px', marginBottom: '20px' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', borderRadius: '12px', background: '#5700ff', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            Coba Muat Ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            {/* Client Routes (Mobile App) */}
            <Route path="/" element={<ClientLayout />}>
              <Route index element={<HomeView />} />
              <Route path="product/:id" element={<ProductDetailView />} />
              <Route path="search" element={<SearchView />} />
              <Route path="wishlist" element={<WishlistView />} />
              <Route path="cart" element={<CartView />} />
            </Route>

            {/* Admin Routes (Desktop Dashboard) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductEditor />} />
              <Route path="products/:id" element={<AdminProductEditor />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

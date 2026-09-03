import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomeView from './views/HomeView';
import ProductDetailView from './views/ProductDetailView';
import SearchView from './views/SearchView';
import WishlistView from './views/WishlistView';
import OrdersView from './views/OrdersView';

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
      <Outlet />
      <Navigation />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Client Routes (Mobile App) */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<HomeView />} />
            <Route path="product/:id" element={<ProductDetailView />} />
            <Route path="search" element={<SearchView />} />
            <Route path="wishlist" element={<WishlistView />} />
            <Route path="orders" element={<OrdersView />} />
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
  );
}

export default App;

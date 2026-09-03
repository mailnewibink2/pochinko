import React, { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, Settings } from 'lucide-react';
import '../admin.css'; // Import admin styles

const AdminLayout = () => {
  // Override body styles when entering admin to remove mobile constraints
  useEffect(() => {
    document.body.classList.add('admin-body-reset');
    return () => {
      document.body.classList.remove('admin-body-reset');
    };
  }, []);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">Pochinko</div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            <ImageIcon size={20} />
            Products
          </NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            <ShoppingBag size={20} />
            Orders
          </NavLink>
          <NavLink to="/admin/settings" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            <Settings size={20} />
            Settings
          </NavLink>
        </nav>
      </aside>
      
      <main className="admin-main">
        <Outlet />
      </main>

      {/* Mobile Navigation (Visible only on <768px via CSS) */}
      <nav className="admin-mobile-nav">
        <NavLink to="/admin" end className={({isActive}) => isActive ? "admin-mobile-nav-item active" : "admin-mobile-nav-item"}>
          <LayoutDashboard size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/admin/products" className={({isActive}) => isActive ? "admin-mobile-nav-item active" : "admin-mobile-nav-item"}>
          <ImageIcon size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({isActive}) => isActive ? "admin-mobile-nav-item active" : "admin-mobile-nav-item"}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/settings" className={({isActive}) => isActive ? "admin-mobile-nav-item active" : "admin-mobile-nav-item"}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminLayout;

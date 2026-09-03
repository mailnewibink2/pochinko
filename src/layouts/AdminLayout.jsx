import React, { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AdminLogin from '../views/admin/AdminLogin';
import '../admin.css'; // Import admin styles

const AdminLayout = () => {
  const { isAdminAuthenticated, logoutAdmin } = useAppContext();

  // Override body styles when entering admin to remove mobile constraints
  useEffect(() => {
    if (isAdminAuthenticated) {
      document.body.classList.add('admin-body-reset');
    }
    return () => {
      document.body.classList.remove('admin-body-reset');
    };
  }, [isAdminAuthenticated]);

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">Pochinko</div>
        <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)' }}>
          <div style={{ flex: 1 }}>
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
          </div>
          <button 
            onClick={logoutAdmin}
            className="admin-nav-item" 
            style={{ background: 'none', border: 'none', color: '#ff4d4f', width: '100%', cursor: 'pointer', textAlign: 'left', marginTop: 'auto' }}
          >
            <LogOut size={20} color="#ff4d4f" />
            Keluar Admin
          </button>
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
        <button 
          onClick={logoutAdmin} 
          className="admin-mobile-nav-item" 
          style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', flexDirection: 'column', alignItems: 'center' }}
        >
          <LogOut size={20} color="#ff4d4f" />
          <span>Keluar</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminLayout;

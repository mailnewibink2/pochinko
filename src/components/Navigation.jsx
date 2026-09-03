import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navigation = () => {
  const { cart } = useAppContext();
  const location = useLocation();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (location.pathname.includes('/product/')) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} strokeWidth={2.5} />
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search size={22} strokeWidth={2.5} />
      </NavLink>
      <NavLink to="/wishlist" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Heart size={22} strokeWidth={2.5} />
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
        <ShoppingBag size={22} strokeWidth={2.5} />
        {cartItemCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '20px',
            background: '#ff4d4f',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white'
          }}>
            {cartItemCount}
          </span>
        )}
      </NavLink>
    </nav>
  );
};

export default Navigation;

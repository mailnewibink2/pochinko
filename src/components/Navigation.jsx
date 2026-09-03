import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, Receipt } from 'lucide-react';

const Navigation = () => {
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
      <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Receipt size={22} strokeWidth={2.5} />
      </NavLink>
    </nav>
  );
};

export default Navigation;

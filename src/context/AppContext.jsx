import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products from Supabase:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `PROD-${Date.now()}`
    };
    
    // Optimistic UI update
    setProducts(prev => [productWithId, ...prev]);

    try {
      const { error } = await supabase
        .from('products')
        .insert([productWithId]);
        
      if (error) {
        console.error('Error adding product:', error);
        // Fallback UI could be implemented here
      }
    } catch (err) {
      console.error('Exception adding product:', err);
    }
  };

  const deleteProduct = async (id) => {
    // Optimistic UI update
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) console.error('Error deleting product:', error);
    } catch (err) {
      console.error('Exception deleting product:', err);
    }
  };

  const updateProduct = async (id, updatedData) => {
    // Optimistic UI update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));

    try {
      const { error } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', id);

      if (error) console.error('Error updating product:', error);
    } catch (err) {
      console.error('Exception updating product:', err);
    }
  };

  const togglePin = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newPinStatus = !product.isPinned;
    
    // Optimistic UI update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isPinned: newPinStatus } : p));

    try {
      const { error } = await supabase
        .from('products')
        .update({ isPinned: newPinStatus })
        .eq('id', id);

      if (error) console.error('Error toggling pin:', error);
    } catch (err) {
      console.error('Exception toggling pin:', err);
    }
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('pochinko_admin_auth') === 'true';
  });

  const loginAdmin = (password) => {
    const defaultPass = import.meta.env.VITE_ADMIN_PASSWORD || 'pochinko123';
    if (password === defaultPass) {
      sessionStorage.setItem('pochinko_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Password Admin salah!' };
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('pochinko_admin_auth');
    setIsAdminAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{ 
      products, 
      addProduct, 
      deleteProduct, 
      updateProduct, 
      togglePin, 
      getProductById, 
      loading,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

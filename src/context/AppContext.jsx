import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to sort products array based on sortOrder & creation
  const sortProductsArray = (arr) => {
    return [...arr].sort((a, b) => {
      const orderA = a.preorderInfo?.sortOrder !== undefined ? a.preorderInfo.sortOrder : -1;
      const orderB = b.preorderInfo?.sortOrder !== undefined ? b.preorderInfo.sortOrder : -1;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  };

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        const sorted = sortProductsArray(data || []);
        setProducts(sorted);
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
      id: `PROD-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    // Optimistic UI update
    setProducts(prev => [productWithId, ...prev]);

    try {
      const { error } = await supabase
        .from('products')
        .insert([productWithId]);
        
      if (error) {
        console.error('Error adding product:', error);
        alert('Gagal menambah produk di database: ' + error.message);
      } else {
        alert('Produk berhasil ditambahkan ke database!');
      }
    } catch (err) {
      console.error('Exception adding product:', err);
      alert('Terjadi kesalahan: ' + err.message);
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

      if (error) {
        console.error('Error updating product:', error);
        alert('Gagal mengupdate produk di database: ' + error.message);
      } else {
        alert('Produk berhasil diupdate!');
      }
    } catch (err) {
      console.error('Exception updating product:', err);
      alert('Terjadi kesalahan: ' + err.message);
    }
  };

  const updateProductStatus = async (id, newStatus) => {
    const targetProduct = products.find(p => p.id === id);
    if (!targetProduct) return;

    const newPreorderInfo = {
      ...(targetProduct.preorderInfo || {}),
      status: newStatus
    };

    updateProduct(id, { preorderInfo: newPreorderInfo });
  };

  const reorderProducts = async (reorderedList) => {
    // Re-assign sortOrder index to each item in order
    const updatedList = reorderedList.map((product, idx) => ({
      ...product,
      preorderInfo: {
        ...(product.preorderInfo || {}),
        sortOrder: idx
      }
    }));

    // Optimistic UI update
    setProducts(updatedList);

    // Save sortOrder to Supabase in background
    try {
      await Promise.all(
        updatedList.map(p =>
          supabase
            .from('products')
            .update({ preorderInfo: p.preorderInfo })
            .eq('id', p.id)
        )
      );
    } catch (err) {
      console.error('Error saving reordered products to Supabase:', err);
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

  const getProductById = (id) => {
    return products.find(p => p.id === id);
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

  // Cart Management
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('pochinko_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pochinko_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size = null, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, quantity }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const updateCartQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Management
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('pochinko_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pochinko_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  return (
    <AppContext.Provider value={{ 
      products, 
      addProduct, 
      deleteProduct, 
      updateProduct, 
      updateProductStatus,
      reorderProducts,
      togglePin, 
      getProductById, 
      loading,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      wishlist,
      toggleWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

import React from 'react';
import { products } from '../data/products';
import { useNavigate } from 'react-router-dom';

const WishlistView = () => {
  const navigate = useNavigate();
  // Simulate saved items using a subset of products
  const savedItems = products.slice(0, 4); // Show more items to demonstrate grid

  return (
    <div style={{ paddingBottom: '100px' }}>
      <header className="feed-header">
        <h1>Wishlist</h1>
      </header>

      <div className="animate-fade-up" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px', 
        padding: '0 16px', 
        marginTop: '8px' 
      }}>
        {savedItems.map(product => (
          <div 
            key={product.id} 
            style={{ 
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div style={{ width: '100%', paddingTop: '120%', position: 'relative' }}>
              <img 
                src={product.images[0]} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                alt={product.name} 
              />
            </div>
            
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>{product.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  background: 'var(--bg)', 
                  padding: '4px 8px', 
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--primary)'
                }}>
                  BATCH #{product.preorderInfo.batchNumber}
                </span>
                <span>48H</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistView;

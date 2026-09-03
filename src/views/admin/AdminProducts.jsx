import React from 'react';
import { MoreHorizontal, Pin, EyeOff, Copy, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, addProduct, togglePin } = useAppContext();

  const handleDuplicate = (product) => {
    const newProduct = {
      ...product,
      id: undefined, // Let context generate new id
      name: `${product.name} (Copy)`
    };
    addProduct(newProduct);
  };

  // Sort products: pinned first, then by id/creation
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="admin-products animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Feed Manager</h1>
          <p style={{ color: '#878294', marginTop: '8px' }}>Manage how your products appear in the social feed.</p>
        </div>
        <button 
          className="admin-btn-primary" 
          onClick={() => navigate('/admin/products/new')}
        >
          + Publish Post
        </button>
      </div>

      {/* Masonry-style / Pinterest Board Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: '24px', 
        alignItems: 'start' 
      }}>
        {sortedProducts.map(product => (
          <div key={product.id} className="admin-card" style={{ padding: '0', overflow: 'hidden', border: product.isPinned ? '2px solid #5700ff' : 'none' }}>
            <div style={{ position: 'relative', height: '320px', cursor: 'pointer' }} onClick={() => navigate(`/admin/products/${product.id}`)}>
              <img 
                src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                {product.isPinned && (
                  <span className="badge badge-purple" style={{ background: '#5700ff', color: 'white', border: 'none' }}>
                    <Pin size={12} style={{ marginRight: '4px' }} /> Pinned
                  </span>
                )}
                <span className="badge badge-gray" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                  Batch #{product.preorderInfo?.batchNumber || '1'}
                </span>
              </div>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.3, cursor: 'pointer' }} onClick={() => navigate(`/admin/products/${product.id}`)}>{product.name}</h3>
              </div>
              {(product.sizeCategory || product.dimensions) && (
                <div style={{ fontSize: '13px', color: '#878294', marginBottom: '6px' }}>
                  Size: {product.sizeCategory} {product.dimensions ? `${product.dimensions}cm` : ''}
                </div>
              )}
              <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>
                Rp{(product.price || 0).toLocaleString('id-ID')}
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span className="badge badge-purple">{product.preorderInfo?.joinedCount || 0} Joined</span>
                <span className="badge badge-peach">Active</span>
              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f0eef5', paddingTop: '16px' }}>
                <button 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F5F5F5', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#2d2a36' }}
                  title="Edit"
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F5F5F5', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#2d2a36' }}
                  title="Duplicate"
                  onClick={() => handleDuplicate(product)}
                >
                  <Copy size={16} />
                </button>
                <button 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: product.isPinned ? '#E8E0FF' : '#F5F5F5', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: product.isPinned ? '#5700ff' : '#2d2a36' }}
                  title={product.isPinned ? "Unpin" : "Pin to Top"}
                  onClick={() => togglePin(product.id)}
                >
                  <Pin size={16} />
                </button>
                <button 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#FFEBEB', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#D32F2F' }}
                  title="Delete"
                  onClick={() => deleteProduct(product.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;

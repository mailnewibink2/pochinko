import React, { useState } from 'react';
import { Pin, Copy, Edit2, Trash2, GripHorizontal, ArrowUp, ArrowDown, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { optimizeCloudinaryUrl, isVideo, getVideoThumbnail } from '../../utils/imageOptimization';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, addProduct, togglePin, reorderProducts, updateProductStatus } = useAppContext();
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDuplicate = (product) => {
    const newProduct = {
      ...product,
      id: undefined, // Let context generate new id
      name: `${product.name} (Copy)`
    };
    addProduct(newProduct);
  };

  // Drag & Drop handlers for reordering
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIdx(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    const newProducts = [...products];
    const itemToMove = newProducts[draggedIdx];
    newProducts.splice(draggedIdx, 1);
    newProducts.splice(targetIdx, 0, itemToMove);
    setDraggedIdx(null);
    reorderProducts(newProducts);
  };

  const handleMoveUpDown = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;
    const newProducts = [...products];
    const itemToMove = newProducts[index];
    newProducts.splice(index, 1);
    newProducts.splice(targetIndex, 0, itemToMove);
    reorderProducts(newProducts);
  };

  return (
    <div className="admin-products animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Feed Manager</h1>
          <p style={{ color: '#878294', marginTop: '8px' }}>
            Atur urutan posisi produk dengan <strong>drag & drop (geser card)</strong> atau tombol panah. Status PO juga dapat diubah secara langsung.
          </p>
        </div>
        <button 
          className="admin-btn-primary" 
          onClick={() => navigate('/admin/products/new')}
        >
          + Publish Post
        </button>
      </div>

      {/* Product List Grid with Drag & Drop */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
        gap: '24px', 
        alignItems: 'start' 
      }}>
        {products.map((product, index) => {
          const currentStatus = product.preorderInfo?.status || 'Open';
          const isClosed = currentStatus === 'Closed' || currentStatus === 'closed';
          const isClosingSoon = currentStatus === 'Closing Soon' || currentStatus === 'closing_soon';

          return (
            <div 
              key={product.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="admin-card" 
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                border: product.isPinned ? '2px solid #5700ff' : '1px solid #f0eef5',
                cursor: 'grab',
                transition: 'all 0.2s ease',
                background: 'white'
              }}
            >
              {/* Drag Handle Top Bar */}
              <div style={{ 
                background: '#F9F8FC', 
                borderBottom: '1px solid #f0eef5', 
                padding: '8px 12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                color: '#878294'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                  <GripHorizontal size={16} />
                  <span>Posisi #{index + 1}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    disabled={index === 0}
                    onClick={() => handleMoveUpDown(index, 'up')}
                    style={{ background: 'white', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.4 : 1 }}
                    title="Geser ke Atas"
                  >
                    <ArrowUp size={12} color="#2d2a36" />
                  </button>
                  <button 
                    disabled={index === products.length - 1}
                    onClick={() => handleMoveUpDown(index, 'down')}
                    style={{ background: 'white', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', cursor: index === products.length - 1 ? 'not-allowed' : 'pointer', opacity: index === products.length - 1 ? 0.4 : 1 }}
                    title="Geser ke Bawah"
                  >
                    <ArrowDown size={12} color="#2d2a36" />
                  </button>
                </div>
              </div>

              {/* Product Image & Badges */}
              <div style={{ position: 'relative', height: '300px', cursor: 'pointer' }} onClick={() => navigate(`/admin/products/${product.id}`)}>
                <img 
                  src={getVideoThumbnail(optimizeCloudinaryUrl(product.images?.[0], 400)) || 'https://via.placeholder.com/400'} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                {isVideo(product.images?.[0]) && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <PlayCircle size={48} color="white" />
                  </div>
                )}
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
              
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.3, cursor: 'pointer' }} onClick={() => navigate(`/admin/products/${product.id}`)}>{product.name}</h3>
                </div>
                {(product.sizeCategory || product.dimensions) && (
                  <div style={{ fontSize: '13px', color: '#878294', marginBottom: '6px' }}>
                    Size: {product.sizeCategory} {product.dimensions ? `${product.dimensions}cm` : ''}
                  </div>
                )}
                <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>
                  Rp{(product.price || 0).toLocaleString('id-ID')}
                </div>
                
                {/* Status Badge & Selector */}
                <div style={{ background: '#FAF8FC', border: '1px solid #f0eef5', padding: '10px 12px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#878294', textTransform: 'uppercase' }}>Status PO</span>
                    {isClosed ? (
                      <span className="badge" style={{ background: '#FFEBEB', color: '#D32F2F', fontWeight: 800 }}>PO Closed</span>
                    ) : isClosingSoon ? (
                      <span className="badge badge-peach">Closing Soon</span>
                    ) : (
                      <span className="badge" style={{ background: '#E8F5E9', color: '#2E7D32', fontWeight: 800 }}>Active (Open)</span>
                    )}
                  </div>
                  
                  <select 
                    value={currentStatus}
                    onChange={(e) => updateProductStatus(product.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      fontSize: '12px',
                      fontFamily: 'Inter',
                      background: 'white',
                      fontWeight: 600,
                      color: isClosed ? '#D32F2F' : '#2d2a36'
                    }}
                  >
                    <option value="Open">Open (Aktif)</option>
                    <option value="Closing Soon">Closing Soon</option>
                    <option value="Closed">Closed (PO Ditutup)</option>
                  </select>
                </div>

                {/* Action Toolbar */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f0eef5', paddingTop: '14px' }}>
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
          );
        })}
      </div>
    </div>
  );
};

export default AdminProducts;

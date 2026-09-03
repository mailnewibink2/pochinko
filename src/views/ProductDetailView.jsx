import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ProductDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addToCart, wishlist, toggleWishlist } = useAppContext();
  
  const product = getProductById(id);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, product.sizeCategory || 'All Size', 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!product) return <div>Product not found</div>;

  const isFavorited = wishlist.some(item => item.id === product.id);

  return (
    <div className="pdp-container animate-fade-up">
      <header className="pdp-header">
        <button onClick={() => navigate(-1)} className="header-btn">
          <ChevronLeft size={24} strokeWidth={2.5} color="var(--text-primary)" />
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="header-btn" onClick={() => toggleWishlist(product)}>
            <Heart size={22} strokeWidth={isFavorited ? 0 : 2.5} fill={isFavorited ? 'url(#heartGradient)' : 'none'} color={isFavorited ? 'transparent' : 'var(--text-primary)'} />
          </button>
          <button className="header-btn" onClick={() => {
            const text = `Mau ikutan PO Impor tas lucu ini ${product.name} (Rp${product.price.toLocaleString('id-ID')})?\n\nCek di sini: ${window.location.href}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
          }}>
            <Share size={22} strokeWidth={2.5} color="var(--text-primary)" />
          </button>
        </div>
      </header>

      <div className="pdp-gallery">
        {(product.images || []).map((img, idx) => (
          <img key={idx} src={img} alt={`${product.name} ${idx + 1}`} />
        ))}
      </div>

      <div className="pdp-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
             <h1 className="text-xl" style={{ marginBottom: '8px' }}>{product.name}</h1>
             {(product.sizeCategory || product.dimensions) && (
               <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                 Size: {product.sizeCategory} {product.dimensions ? `${product.dimensions}cm` : ''}
               </div>
             )}
             <div className="text-lg" style={{ color: 'var(--text-primary)', fontWeight: 800 }}>
               Rp{(product.price || 0).toLocaleString('id-ID')}
             </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             <div className="text-label" style={{ 
               background: 'var(--grad-secondary)', 
               color: '#654f3b', 
               padding: '6px 12px', 
               borderRadius: 'var(--radius-pill)' 
             }}>
               BATCH #{product.preorderInfo?.batchNumber || '1'}
             </div>
             <div className="text-sm" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>48H LEFT</div>
           </div>
           
           <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
             <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.preorderInfo?.joinedCount || 0}</span> people have joined this batch.
             Estimated arrival: {product.preorderInfo?.estArrival || 'TBA'}
           </div>
        </div>

        <div className="text-base" style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '32px', whiteSpace: 'pre-wrap' }}>
          {product.description || product.details}
        </div>
      </div>

      <div className="pdp-footer animate-fade-up">
        <button 
          className="btn-primary" 
          onClick={handleAddToCart}
          style={{ background: isAdded ? '#4BB543' : '' }}
        >
          {isAdded ? 'ADDED TO CART!' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailView;

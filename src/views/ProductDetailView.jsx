import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share, Heart, Home, Grid, ArrowRight } from 'lucide-react';
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

  const handleBack = () => {
    if (window.history.length > 2 && document.referrer.includes(window.location.host)) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!product) return (
    <div style={{ padding: '60px 24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Produk tidak ditemukan</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Produk ini mungkin telah dihapus atau tidak tersedia.</p>
      <button 
        onClick={() => navigate('/')} 
        className="btn-primary" 
        style={{ padding: '12px 24px', maxWidth: '260px', margin: '0 auto' }}
      >
        Lihat Koleksi Pochinko
      </button>
    </div>
  );

  const isFavorited = wishlist.some(item => item.id === product.id);
  const currentStatus = product.preorderInfo?.status || 'Open';
  const isClosed = currentStatus === 'Closed' || currentStatus === 'closed';
  const isClosingSoon = currentStatus === 'Closing Soon' || currentStatus === 'closing_soon';

  return (
    <div className="pdp-container animate-fade-up">
      <header className="pdp-header">
        <button onClick={handleBack} className="header-btn" title="Kembali">
          <ChevronLeft size={24} strokeWidth={2.5} color="var(--text-primary)" />
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="header-btn" title="Lihat Koleksi Pochinko" onClick={() => navigate('/')}>
            <Home size={20} strokeWidth={2.5} color="var(--text-primary)" />
          </button>
          <button className="header-btn" title="Favorit" onClick={() => toggleWishlist(product)}>
            <Heart size={22} strokeWidth={isFavorited ? 0 : 2.5} fill={isFavorited ? 'url(#heartGradient)' : 'none'} color={isFavorited ? 'transparent' : 'var(--text-primary)'} />
          </button>
          <button className="header-btn" title="Bagikan ke WhatsApp" onClick={() => {
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
             {isClosed ? (
               <div className="text-sm" style={{ fontWeight: 800, color: '#D32F2F', background: '#FFEBEB', padding: '4px 10px', borderRadius: '8px' }}>PO CLOSED</div>
             ) : isClosingSoon ? (
               <div className="text-sm" style={{ fontWeight: 800, color: '#E65100', background: '#FFF3E0', padding: '4px 10px', borderRadius: '8px' }}>CLOSING SOON</div>
             ) : (
               <div className="text-sm" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>48H LEFT</div>
             )}
           </div>
           
           <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
             <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.preorderInfo?.joinedCount || 0}</span> orang sudah bergabung di batch ini.
             Estimasi tiba: {product.preorderInfo?.estArrival || 'TBA'}
           </div>
        </div>

        <div className="text-base" style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
          {product.description || product.details}
        </div>

        {/* Tombol Banner "Lihat Koleksi Lain Pochinko" untuk pengunjung dari WhatsApp/Link luar */}
        <div 
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EFE6 100%)',
            border: '1.5px solid #EAE0D5',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            transition: 'transform 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(87,0,255,0.2)'
            }}>
              <Grid size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                Lihat Koleksi Lain Pochinko
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Temukan pilihan tas & sepatu impor terpopuler
              </div>
            </div>
          </div>
          <ArrowRight size={20} color="var(--text-primary)" strokeWidth={2.5} />
        </div>

      </div>

      <div className="pdp-footer">
        {isClosed ? (
          <button 
            className="btn-primary" 
            disabled
            style={{ background: '#e0e0e0', color: '#888888', cursor: 'not-allowed', opacity: 0.8 }}
          >
            PO CLOSED
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={handleAddToCart}
            style={{ background: isAdded ? '#4BB543' : '' }}
          >
            {isAdded ? 'ADDED TO CART!' : 'ADD TO CART'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailView;


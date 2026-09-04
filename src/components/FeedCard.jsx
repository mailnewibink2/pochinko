import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const FeedCard = ({ product }) => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const { addToCart, wishlist, toggleWishlist } = useAppContext();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const isFavorited = wishlist.some(item => item.id === product.id);

  const handleShareWA = (e) => {
    e.stopPropagation();
    const text = `Mau ikutan PO Impor tas lucu ini ${product.name} (Rp${product.price.toLocaleString('id-ID')})?\n\nCek di sini: ${window.location.origin}/product/${product.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleLove = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, product.sizeCategory || 'All Size', 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      setCurrentIdx(Math.round(scrollLeft / width));
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/400'];

  const currentStatus = product.preorderInfo?.status || 'Open';
  const isClosed = currentStatus === 'Closed' || currentStatus === 'closed';
  const isClosingSoon = currentStatus === 'Closing Soon' || currentStatus === 'closing_soon';

  return (
    <div className="feed-card animate-fade-up" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="feed-image-container" style={{ position: 'relative' }}>
        
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            scrollSnapType: 'x mandatory', 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            width: '100%',
            height: '100%'
          }}
          className="hide-scrollbar"
        >
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`${product.name} ${idx + 1}`} 
              style={{ 
                flex: '0 0 100%', 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                scrollSnapAlign: 'start' 
              }} 
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (carouselRef.current) {
                  carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: 'smooth' });
                }
              }}
              style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: currentIdx > 0 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: 10 }}
            >
              <ChevronLeft size={16} color="#2d2a36" style={{ pointerEvents: 'none' }} />
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (carouselRef.current) {
                  carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: 'smooth' });
                }
              }}
              style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: currentIdx < images.length - 1 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: 10 }}
            >
              <ChevronRight size={16} color="#2d2a36" style={{ pointerEvents: 'none' }} />
            </button>
          </>
        )}

        {/* Carousel Dots */}
        {images.length > 1 && (
          <div style={{ position: 'absolute', bottom: '16px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '6px', pointerEvents: 'none' }}>
            {images.map((_, idx) => (
              <div 
                key={idx} 
                style={{ 
                  width: currentIdx === idx ? '16px' : '6px', 
                  height: '6px', 
                  borderRadius: '3px', 
                  background: currentIdx === idx ? '#5700ff' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} 
              />
            ))}
          </div>
        )}

        {isClosed ? (
          <div className="countdown-badge" style={{ background: '#333333', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
            PO CLOSED
          </div>
        ) : isClosingSoon ? (
          <div className="countdown-badge" style={{ background: '#ff9800', color: '#ffffff' }}>
            CLOSING SOON
          </div>
        ) : (
          <div className="countdown-badge">
            48H LEFT
          </div>
        )}
      </div>
      
      {/* Social Actions Row */}
      <div className="card-actions">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="icon-btn" onClick={handleLove}>
            <Heart size={24} strokeWidth={isFavorited ? 0 : 1.5} fill={isFavorited ? 'url(#heartGradient)' : 'none'} color={isFavorited ? 'transparent' : 'var(--text-primary)'} />
          </button>
          <button className="icon-btn" onClick={handleShareWA}>
            <Send size={22} strokeWidth={1.5} color="var(--text-primary)" />
          </button>
        </div>
        
        {isClosed ? (
          <button 
            className="btn-join-po" 
            disabled
            onClick={(e) => { e.stopPropagation(); alert('Maaf, Pre-Order untuk produk ini telah ditutup.'); }}
            style={{ background: '#e0e0e0', color: '#888888', cursor: 'not-allowed', opacity: 0.8 }}
          >
            PO CLOSED
          </button>
        ) : (
          <button 
            className="btn-join-po" 
            onClick={handleAddToCart}
            style={{ background: isAdded ? '#4BB543' : '', color: isAdded ? 'white' : '' }}
          >
            {isAdded ? (
              <><Check size={16} strokeWidth={3} style={{ marginRight: '4px' }} /> ADDED</>
            ) : (
              <><ShoppingBag size={16} strokeWidth={2.5} style={{ marginRight: '4px' }} /> ADD TO CART</>
            )}
          </button>
        )}
      </div>
      
      <div className="feed-info">
        <div className="text-label" style={{ 
          background: 'var(--grad-secondary)', 
          color: '#654f3b', 
          display: 'inline-block', 
          padding: '6px 12px', 
          borderRadius: 'var(--radius-pill)', 
          marginBottom: '10px' 
        }}>
          BATCH #{product.preorderInfo?.batchNumber || '1'} • {product.preorderInfo?.joinedCount || 0} JOINED
        </div>
        
        <h2 className="feed-title text-lg">{product.name}</h2>
        
        {(product.sizeCategory || product.dimensions) && (
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Size: {product.sizeCategory} {product.dimensions ? `${product.dimensions}cm` : ''}
          </div>
        )}

        <div className="feed-price">
          Rp{(product.price || 0).toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  );
};

export default FeedCard;

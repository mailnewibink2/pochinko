import React, { useState } from 'react';
import { LayoutGrid, Rows, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
import FeedCard from '../components/FeedCard';
import HamburgerMenu from '../components/HamburgerMenu';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="accordion-content">{content}</div>}
    </div>
  );
};

const HomeView = () => {
  const [viewMode, setViewMode] = useState('feed'); // 'feed' or 'grid'
  const [activeCategory, setActiveCategory] = useState('All Product');
  const navigate = useNavigate();
  const { products } = useAppContext();

  const [showTopBtn, setShowTopBtn] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortedProducts = [...products]
    .filter(p => activeCategory === 'All Product' || p.category === activeCategory)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const highlights = [
    { name: 'All Product', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop' },
    { name: 'Bags', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&h=150&fit=crop' },
    { name: 'Shoes', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&h=150&fit=crop' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop' },
    { name: 'Dresses', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&h=150&fit=crop' },
  ];

  return (
    <div style={{ paddingBottom: '90px' }}>
      <header className="feed-header">
        <h1>Pochinko</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => setViewMode(viewMode === 'feed' ? 'grid' : 'feed')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {viewMode === 'feed' ? <LayoutGrid size={24} strokeWidth={2} color="var(--primary)" /> : <Rows size={24} strokeWidth={2} color="var(--primary)" />}
          </button>
          <HamburgerMenu />
        </div>
      </header>

      {/* Highlights / Categories (Instagram Style) */}
      <div className="highlights-container animate-fade-up">
        {highlights.map((item, idx) => (
          <div 
            key={idx} 
            className="highlight-item" 
            onClick={() => setActiveCategory(item.name)}
            style={{ cursor: 'pointer', opacity: activeCategory === item.name ? 1 : 0.6, transition: 'opacity 0.2s' }}
          >
            <div className="highlight-img-wrapper" style={{ background: activeCategory === item.name ? 'var(--grad-primary)' : '#e0e0e0' }}>
              <img src={item.img} alt={item.name} className="highlight-img" />
            </div>
            <span className="highlight-text" style={{ fontWeight: activeCategory === item.name ? 700 : 500 }}>{item.name}</span>
          </div>
        ))}
      </div>

      {viewMode === 'feed' ? (
        <>
          <div className="feed-container">
            {sortedProducts.map(product => (
              <FeedCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Accordion Menu */}
          <div className="accordion animate-fade-up">
            <AccordionItem 
              title="About Us" 
              content="We curate the finest premium imported fashion. All items are high quality and carefully selected for our preorder batches." 
            />
            <AccordionItem 
              title="How to Order" 
              content="Join an active batch by paying the preorder price. Once the countdown ends, the batch closes and items are shipped within the estimated arrival window." 
            />
            <AccordionItem 
              title="Contact" 
              content="Reach out via WhatsApp at +62 812 3456 7890 or DM us on Instagram @pochinko." 
            />
          </div>
        </>
      ) : (
        <div className="grid-view-container animate-fade-up" style={{ padding: '0 16px 40px 16px' }}>
          
          {/* Profile Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: 'var(--radius-xl)', 
            padding: '24px', 
            textAlign: 'center',
            boxShadow: 'var(--shadow-soft)',
            marginBottom: '24px',
            position: 'relative'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 12px',
              border: '3px solid white',
              boxShadow: 'var(--shadow-sm)',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '24px',
              position: 'relative',
              top: '-10px'
            }}>PO</div>
            
            <h2 className="text-base" style={{ marginBottom: '4px', fontWeight: 700 }}>Pochinko</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', padding: '0 16px', lineHeight: 1.4 }}>
              Platform Pre-Order barang impor pilihan dari China terpercaya
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>12.5K</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Followers</div>
              </div>
              <div style={{ width: '1px', height: '24px', background: '#e0e0e0' }} />
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>45</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Active PO</div>
              </div>
            </div>
          </div>

          {/* 3-Column Tight Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '4px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {sortedProducts.map((product, index) => (
              <div 
                key={product.id} 
                style={{ cursor: 'pointer', aspectRatio: '1/1', position: 'relative' }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            ))}
            {sortedProducts.map((product, index) => (
              <div 
                key={`${product.id}-dup1`} 
                style={{ cursor: 'pointer', aspectRatio: '1/1', position: 'relative' }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img 
                  src={product.images?.[1] || product.images?.[0] || 'https://via.placeholder.com/400'} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            ))}
             {sortedProducts.slice(0, 1).map((product, index) => (
              <div 
                key={`${product.id}-dup2`} 
                style={{ cursor: 'pointer', aspectRatio: '1/1', position: 'relative' }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            ))}
          </div>
          
        </div>
      )}

      {/* Back to top button */}
      {showTopBtn && (
        <button 
          onClick={scrollToTop}
          className="animate-fade-up"
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'white',
            color: 'var(--primary)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 50
          }}
        >
          <ArrowUp size={24} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default HomeView;

import React, { useState } from 'react';
import { Menu, X, Info, HelpCircle, Phone } from 'lucide-react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <Menu size={24} strokeWidth={2} color="var(--primary)" />
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              pointerEvents: 'auto',
              animation: 'fadeIn 0.2s ease-out'
            }}
          />
          
          {/* Drawer */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80%',
              maxWidth: '300px',
              height: '100%',
              background: 'white',
              pointerEvents: 'auto',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Menu</h2>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={24} color="var(--text-secondary)" />
              </button>
            </div>
            
            <div style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
              <div 
                style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f0eef5', cursor: 'pointer' }}
                onClick={() => {
                  alert('About Us: We curate the finest premium imported fashion. All items are high quality and carefully selected for our preorder batches.');
                  setIsOpen(false);
                }}
              >
                <Info size={20} color="var(--primary)" />
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>About Us</span>
              </div>
              
              <div 
                style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f0eef5', cursor: 'pointer' }}
                onClick={() => {
                  alert('How to Order: Join an active batch by paying the preorder price. Once the countdown ends, the batch closes and items are shipped within the estimated arrival window.');
                  setIsOpen(false);
                }}
              >
                <HelpCircle size={20} color="var(--primary)" />
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>How to Order</span>
              </div>
              
              <div 
                style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                onClick={() => {
                  window.open('https://wa.me/6281234567890', '_blank');
                  setIsOpen(false);
                }}
              >
                <Phone size={20} color="var(--primary)" />
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Contact Us</span>
              </div>
            </div>
            
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
              Pochinko &copy; 2026
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default HamburgerMenu;

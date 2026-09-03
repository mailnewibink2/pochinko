import React from 'react';

const OrdersView = () => {
  return (
    <div style={{ padding: '16px', paddingTop: '40px' }}>
      <h1 className="text-lg" style={{ marginBottom: '24px', letterSpacing: '0.1em' }}>MY ORDERS</h1>
      
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p className="text-sm">You haven't joined any preorders yet.</p>
        <button 
          className="btn-primary" 
          style={{ marginTop: '24px', width: 'auto', padding: '12px 32px' }}
          onClick={() => window.location.href = '/'}
        >
          DISCOVER
        </button>
      </div>
    </div>
  );
};

export default OrdersView;

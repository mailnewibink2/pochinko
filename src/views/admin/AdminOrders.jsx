import React from 'react';
import { Search, Filter, MessageCircle } from 'lucide-react';

const AdminOrders = () => {
  const orders = [
    { id: 'ORD-01', customer: 'Amanda Martinez', product: 'Premium Cotton Blouse', batch: 14, status: 'Paid', wa: '+6281234567890' },
    { id: 'ORD-02', customer: 'Chris Allen', product: 'Linen Wide Pants', batch: 14, status: 'DP Paid', wa: '+6281298765432' },
    { id: 'ORD-03', customer: 'Sarah Connor', product: 'Linen Wide Pants', batch: 14, status: 'Unpaid', wa: '+6281211112222' },
    { id: 'ORD-04', customer: 'Jessica Alba', product: 'Premium Cotton Blouse', batch: 15, status: 'Paid', wa: '+6281233334444' },
    { id: 'ORD-05', customer: 'Michael Bowman', product: 'Oversized Blazer', batch: 15, status: 'Paid', wa: '+6281255556666' },
  ];

  return (
    <div className="admin-orders animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p style={{ color: '#878294', marginTop: '8px' }}>Manage customer orders efficiently.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="admin-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} /> Filter
          </button>
          <button className="admin-btn-primary">Export CSV</button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0eef5', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={18} color="#878294" />
          <input 
            type="text" 
            placeholder="Search orders, customers, or products..." 
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'Inter', color: '#2d2a36' }} 
          />
        </div>

        {/* Scrollable Container for Mobile Responsiveness */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          {/* Linear-style Table */}
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#fdfcff', borderBottom: '1px solid #f0eef5' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batch</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id} style={{ borderBottom: idx === orders.length - 1 ? 'none' : '1px solid #f0eef5', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#fafafa'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: '#5700ff' }}>{order.id}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600 }}>{order.customer}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#2d2a36' }}>{order.product}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600 }}>#{order.batch}</td>
                  <td style={{ padding: '16px 24px' }}>
                    {order.status === 'Paid' && <span className="badge badge-green">Paid</span>}
                    {order.status === 'DP Paid' && <span className="badge badge-peach">DP Paid</span>}
                    {order.status === 'Unpaid' && <span className="badge badge-gray">Unpaid</span>}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button style={{ background: '#E8F5E9', border: 'none', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#2E7D32', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                      <MessageCircle size={14} /> WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

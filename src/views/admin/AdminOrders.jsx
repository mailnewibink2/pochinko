import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWA = (phone) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const formatProductSummary = (items) => {
    if (!items || items.length === 0) return 'No items';
    const firstItem = items[0].product.name;
    if (items.length > 1) {
      return `${firstItem} & ${items.length - 1} more`;
    }
    return firstItem;
  };

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
          <button className="admin-btn-primary" onClick={fetchOrders}>Refresh</button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#fdfcff', borderBottom: '1px solid #f0eef5' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase' }}>Items</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase' }}>Total</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#878294' }}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#878294' }}>No orders found.</td></tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={order.id} style={{ borderBottom: idx === orders.length - 1 ? 'none' : '1px solid #f0eef5', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#fafafa'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#878294' }}>
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '12px', color: '#878294' }}>{order.customer_email || order.customer_phone}</div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#2d2a36' }}>
                      {formatProductSummary(order.items)}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: '#2d2a36' }}>
                      Rp{order.total_amount.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge ${order.status === 'pending_payment' ? 'badge-gray' : 'badge-green'}`}>
                        {order.status === 'pending_payment' ? 'Pending' : order.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button onClick={() => handleWA(order.customer_phone)} style={{ background: '#E8F5E9', border: 'none', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#2E7D32', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                        <MessageCircle size={14} /> WhatsApp
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

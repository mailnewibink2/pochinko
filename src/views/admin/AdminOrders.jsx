import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle, ExternalLink, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
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

  const filteredOrders = orders.filter(order => {
    if (startDate && new Date(order.created_at) < new Date(startDate)) return false;
    if (endDate && new Date(order.created_at) > new Date(endDate + 'T23:59:59')) return false;
    return true;
  });

  const exportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('Tidak ada data untuk di-export.');
      return;
    }
    
    // Header
    let csv = 'Order ID,Tanggal,Nama,No WA,Email,Alamat,Total Item,Total Harga,Status\n';
    
    filteredOrders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('id-ID');
      const totalItems = order.items ? order.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
      
      // Escape commas and quotes for CSV
      const name = `"${order.customer_name?.replace(/"/g, '""') || ''}"`;
      const address = `"${order.customer_address?.replace(/"/g, '""') || ''}"`;
      
      csv += `${order.id},${date},${name},${order.customer_phone},${order.customer_email},${address},${totalItems},${order.total_amount},${order.status}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Rekap_Pesanan_${startDate || 'All'}_to_${endDate || 'All'}.csv`);
    a.click();
  };

  return (
    <div className="admin-orders animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p style={{ color: '#878294', marginTop: '8px' }}>Manage customer orders efficiently.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 12px', borderRadius: '8px', border: '1px solid #f0eef5' }}>
            <span style={{ fontSize: '12px', color: '#878294' }}>Dari:</span>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 12px', borderRadius: '8px', border: '1px solid #f0eef5' }}>
            <span style={{ fontSize: '12px', color: '#878294' }}>Sampai:</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '14px' }} />
          </div>
          <button className="admin-btn-secondary" onClick={() => { setStartDate(''); setEndDate(''); }}>Clear</button>
          <button className="admin-btn-primary" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '0', overflow: 'hidden', marginTop: '24px' }}>
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
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#878294' }}>No orders found for this period.</td></tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr key={order.id} style={{ borderBottom: idx === filteredOrders.length - 1 ? 'none' : '1px solid #f0eef5', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#fafafa'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
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

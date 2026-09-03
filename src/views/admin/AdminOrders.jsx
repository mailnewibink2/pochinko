import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle, ExternalLink, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Gagal mengupdate status pesanan.');
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
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #f0eef5',
                          background: order.status === 'paid_in_full' ? '#E8F5E9' : order.status === 'dp_paid' ? '#FFF3E0' : '#f0eef5',
                          color: order.status === 'paid_in_full' ? '#2E7D32' : order.status === 'dp_paid' ? '#E65100' : '#878294',
                          fontWeight: 600,
                          fontSize: '12px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending_payment">Pending</option>
                        <option value="dp_paid">Sudah DP</option>
                        <option value="paid_in_full">Lunas</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setSelectedOrder(order)} style={{ background: '#f0eef5', border: 'none', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', color: '#2d2a36', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                          Detail
                        </button>
                        <button onClick={() => handleWA(order.customer_phone)} style={{ background: '#E8F5E9', border: 'none', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#2E7D32', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                          Chat WA
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setSelectedOrder(null)}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', color: '#878294', marginBottom: '12px', textTransform: 'uppercase' }}>Customer Info</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#fdfcff', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#878294' }}>Name</div>
                  <div style={{ fontWeight: 600 }}>{selectedOrder.customer_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#878294' }}>Phone / WA</div>
                  <div style={{ fontWeight: 600 }}>{selectedOrder.customer_phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#878294' }}>Email</div>
                  <div style={{ fontWeight: 600 }}>{selectedOrder.customer_email || '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#878294' }}>Status</div>
                  <div style={{ fontWeight: 600 }}>
                    {selectedOrder.status === 'pending_payment' ? 'Pending' : selectedOrder.status === 'dp_paid' ? 'Sudah DP' : 'Lunas'}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '12px', color: '#878294' }}>Address</div>
                  <div style={{ fontWeight: 600 }}>{selectedOrder.customer_address}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '14px', color: '#878294', marginBottom: '12px', textTransform: 'uppercase' }}>Items Ordered</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #f0eef5', paddingBottom: '12px' }}>
                    <img src={item.product.images[0]} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{item.product.name}</div>
                      <div style={{ fontSize: '12px', color: '#878294' }}>
                        Size: {item.size || '-'} &bull; Qty: {item.quantity}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#2d2a36', marginTop: '4px' }}>
                        Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '2px dashed #f0eef5' }}>
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Total Amount</span>
              <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--accent)' }}>Rp{selectedOrder.total_amount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;

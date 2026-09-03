import React from 'react';
import { Clock, Users, Package, Archive } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminDashboard = () => {
  const { products } = useAppContext();

  // Dynamic calculations based on products in Context
  const totalProducts = products.length;
  
  // Get unique active batches
  const activeBatchesMap = {};
  let totalJoined = 0;

  products.forEach(p => {
    if (p.preorderInfo) {
      totalJoined += p.preorderInfo.joinedCount || 0;
      const bNum = p.preorderInfo.batchNumber;
      if (bNum && p.preorderInfo.status !== 'Closed') {
        if (!activeBatchesMap[bNum]) {
          activeBatchesMap[bNum] = {
            batchNumber: bNum,
            status: p.preorderInfo.status,
            joined: 0
          };
        }
        activeBatchesMap[bNum].joined += (p.preorderInfo.joinedCount || 0);
      }
    }
  });

  const activeBatches = Object.values(activeBatchesMap);
  const closingSoonCount = activeBatches.filter(b => b.status === 'Closing Soon').length;

  return (
    <div className="admin-dashboard animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p style={{ color: '#878294', marginTop: '8px' }}>Manage your active preorder batches.</p>
        </div>
        <button className="admin-btn-primary">+ New Preorder Batch</button>
      </div>

      <div className="admin-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {/* KPI Cards (Preorder Focused) */}
        <div className="admin-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '12px', color: '#2E7D32' }}>
              <Package size={20} />
            </div>
            <span style={{ fontWeight: 600, color: '#878294' }}>Open Batches</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{activeBatches.length}</div>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#FFF3E0', padding: '10px', borderRadius: '12px', color: '#E65100' }}>
              <Clock size={20} />
            </div>
            <span style={{ fontWeight: 600, color: '#878294' }}>Closing Soon</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{closingSoonCount}</div>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#F7F4FF', padding: '10px', borderRadius: '12px', color: '#5700ff' }}>
              <Users size={20} />
            </div>
            <span style={{ fontWeight: 600, color: '#878294' }}>Total Joined</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{totalJoined}</div>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#F5F5F5', padding: '10px', borderRadius: '12px', color: '#616161' }}>
              <Archive size={20} />
            </div>
            <span style={{ fontWeight: 600, color: '#878294' }}>Products Published</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>{totalProducts}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Active Preorder Batches</h2>
      <div className="admin-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {activeBatches.length === 0 && (
          <div style={{ color: '#878294' }}>No active batches found. Upload a product first!</div>
        )}

        {activeBatches.map(batch => (
          <div key={batch.batchNumber} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Batch #{batch.batchNumber}</h3>
              <span className={`badge ${batch.status === 'Closing Soon' ? 'badge-peach' : 'badge-purple'}`}>
                {batch.status === 'Closing Soon' ? 'Closing Soon' : 'Open'}
              </span>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#878294', fontSize: '14px' }}>Joined</span>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{batch.joined} Orders</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f0eef5', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((batch.joined / 100) * 100, 100)}%`, height: '100%', background: 'linear-gradient(135deg, #F8A5C2 0%, #C8B6FF 100%)' }}></div>
              </div>
            </div>
            <button className="admin-btn-secondary" style={{ width: '100%' }}>Manage Batch</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

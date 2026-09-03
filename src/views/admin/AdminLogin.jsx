import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { loginAdmin } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginAdmin(password);
    if (!res.success) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--grad-bg-bold)', 
      padding: '20px' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        background: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(16px)', 
        borderRadius: 'var(--radius-xl)', 
        padding: '36px 28px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.5)',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: 'var(--grad-primary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <ShieldCheck size={28} color="#5700ff" />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Pochinko Admin
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Masukkan Password Admin untuk mengakses CMS Feed & Manajemen Produk.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password Admin"
              autoFocus
              style={{ 
                width: '100%', 
                padding: '14px 16px 14px 44px', 
                borderRadius: '16px', 
                border: errorMsg ? '2px solid #ff4d4f' : '1px solid #e0e0e0', 
                fontSize: '15px', 
                outline: 'none',
                fontFamily: 'Inter',
                transition: 'border 0.2s'
              }} 
            />
          </div>

          {errorMsg && (
            <div style={{ color: '#ff4d4f', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit"
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '16px', 
              border: 'none', 
              background: 'var(--grad-bold)', 
              color: 'white', 
              fontSize: '15px', 
              fontWeight: 700, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(87, 0, 255, 0.25)',
              transition: 'transform 0.1s'
            }}
          >
            Masuk Admin <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

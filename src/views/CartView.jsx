import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const CartView = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useAppContext();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Keranjang belanja kosong.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        customer_address: formData.address,
        items: cart,
        total_amount: totalAmount,
        status: 'pending_payment'
      };
      
      const { error } = await supabase
        .from('orders')
        .insert([orderData]);
        
      if (error) throw error;
      
      // Generate WA message
      let text = `Halo Admin, saya ingin Checkout PO:\n\n`;
      cart.forEach((item, index) => {
        text += `${index + 1}. ${item.product.name} ${item.size ? `(Size: ${item.size})` : ''}\n   Rp${item.product.price.toLocaleString('id-ID')} x ${item.quantity} = Rp${(item.product.price * item.quantity).toLocaleString('id-ID')}\n`;
      });
      text += `\n*TOTAL: Rp${totalAmount.toLocaleString('id-ID')}*\n`;
      text += `\nData Pengiriman:\n- Nama: ${formData.name}\n- No WA: ${formData.phone}\n- Email: ${formData.email}\n- Alamat: ${formData.address}`;
      
      // Get WA number from env or fallback
      const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890';
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
      
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal memproses pesanan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '16px', paddingTop: '40px', minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
        <h1 className="text-lg" style={{ marginBottom: '24px', letterSpacing: '0.1em' }}>CART</h1>
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p className="text-sm">Keranjang belanja Anda masih kosong.</p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '24px', width: 'auto', padding: '12px 32px' }}
            onClick={() => window.location.href = '/'}
          >
            DISCOVER PRODUCTS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', paddingTop: '40px', minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      <h1 className="text-lg" style={{ marginBottom: '24px', letterSpacing: '0.1em' }}>CART ({cart.length})</h1>
      
      {/* Cart Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {cart.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '16px', background: 'white', padding: '16px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={item.product.images?.[0] || 'https://via.placeholder.com/80'} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.product.name}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {item.size ? `Size: ${item.size}` : 'All Size'} • Rp{item.product.price.toLocaleString('id-ID')}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg)', borderRadius: '8px', padding: '4px 8px' }}>
                  <button onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Minus size={14} /></button>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={14} /></button>
                </div>
                <button onClick={() => removeFromCart(item.product.id, item.size)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Amount</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Rp{totalAmount.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Data Pengiriman</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input required type="text" placeholder="Nama Lengkap" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        <input required type="tel" placeholder="Nomor WhatsApp" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
        <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
        <textarea required placeholder="Alamat Lengkap (Jl, RT/RW, Kec, Kota, Kode Pos)" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
        
        {errorMsg && <div style={{ color: '#ff4d4f', fontSize: '13px', fontWeight: 600 }}>{errorMsg}</div>}
        
        <button type="submit" disabled={isSubmitting} style={{ 
          width: '100%', padding: '16px', borderRadius: '16px', border: 'none', 
          background: 'var(--grad-bold)', color: 'white', fontSize: '16px', fontWeight: 700, 
          cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
          boxShadow: '0 8px 20px rgba(87, 0, 255, 0.25)', marginTop: '8px'
        }}>
          {isSubmitting ? 'Memproses...' : <>Checkout via WhatsApp <ArrowRight size={20} /></>}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e0e0e0', 
  fontSize: '15px', outline: 'none', fontFamily: 'Inter', background: 'white'
};

export default CartView;

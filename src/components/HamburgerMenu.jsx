import React, { useState } from 'react';
import { Menu, X, Info, HelpCircle, Phone, ArrowLeft } from 'lucide-react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const renderHowToOrder = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'white',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <ArrowLeft size={24} color="var(--text-primary)" />
        </button>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Cara Order</h2>
      </div>
      
      <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '24px' }}>
          Ikuti 5 langkah mudah berikut untuk memesan produk impor favorit Anda melalui sistem Pre-Order (PO) yang aman dan transparan.
        </p>

        <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>1. 🛍️ Pilih Produk Favorit</h3>
        <p style={{ marginBottom: '20px' }}>
          Jelajahi katalog kami dan pilih produk yang Anda inginkan, mulai dari tas, sepatu, hingga berbagai aksesoris pilihan. Pastikan Anda memilih variasi yang sesuai seperti warna, ukuran, atau model yang tersedia.
        </p>

        <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>2. 🛒 Tambahkan ke Keranjang</h3>
        <p style={{ marginBottom: '20px' }}>
          Tentukan jumlah produk yang ingin dipesan, lalu klik tombol + Keranjang. Setelah selesai berbelanja, buka halaman Keranjang dan klik Lanjut ke Checkout.
        </p>

        <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>3. 📝 Isi Data Pemesanan</h3>
        <p style={{ marginBottom: '8px' }}>Lengkapi informasi pemesanan berupa:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '8px' }}>
          <li>Nama lengkap</li>
          <li>Email</li>
          <li>Nomor WhatsApp aktif</li>
        </ul>
        <p style={{ marginBottom: '20px' }}>
          Pastikan data yang Anda masukkan benar agar kami dapat menghubungi Anda terkait proses pesanan.
        </p>

        <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>4. 💳 Bayar DP & Kirim Bukti Transfer</h3>
        <p style={{ marginBottom: '8px' }}>
          Lakukan pembayaran Down Payment (DP) sesuai nominal yang tertera saat checkout.
        </p>
        <p style={{ marginBottom: '8px' }}>
          Setelah transfer berhasil, kirimkan foto atau screenshot bukti pembayaran melalui WhatsApp Admin untuk proses verifikasi pesanan.
        </p>
        <p style={{ marginBottom: '20px' }}>
          Setelah pembayaran diverifikasi, pesanan Anda resmi masuk ke batch Pre-Order.
        </p>

        <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>5. 📦 Pelunasan & Pengiriman</h3>
        <p style={{ marginBottom: '8px' }}>
          Setelah barang tiba di gudang Indonesia dan lolos proses Quality Control (QC), kami akan menghubungi Anda untuk melakukan pelunasan.
        </p>
        <p style={{ marginBottom: '32px' }}>
          Setelah pelunasan diterima, pesanan akan segera dikirim ke alamat tujuan dan Anda akan mendapatkan nomor resi pengiriman.
        </p>

        <div style={{ background: '#f5f3ff', padding: '16px', borderRadius: '12px', border: '1px solid #eedeff' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✨ Informasi Penting
          </h3>
          <ul style={{ paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Semua produk menggunakan sistem Pre-Order (PO).</li>
            <li>Estimasi kedatangan barang mengikuti jadwal yang tertera pada masing-masing produk.</li>
            <li>DP yang telah dibayarkan tidak dapat dikembalikan apabila pesanan dibatalkan secara sepihak.</li>
            <li>Pastikan nomor WhatsApp yang digunakan aktif agar proses konfirmasi berjalan lancar.</li>
          </ul>
        </div>
      </div>
    </div>
  );

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
          width: '100%',
          height: '100%',
          zIndex: 1000,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center'
        }}>
          {/* Backdrop (Full Screen) */}
          <div 
            onClick={() => {
              setIsOpen(false);
              setActiveModal(null);
            }}
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
          
          {/* App Constrained Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '390px',
            height: '100%'
          }}>
            {/* Drawer */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '85%',
                maxWidth: '380px',
                height: '100%',
                background: 'white',
                pointerEvents: 'auto',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {activeModal === 'howToOrder' ? renderHowToOrder() : (
              <>
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
                      alert('Tentang Kami akan segera hadir.');
                    }}
                  >
                    <Info size={20} color="var(--primary)" />
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Tentang Kami</span>
                  </div>
                  
                  <div 
                    style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f0eef5', cursor: 'pointer' }}
                    onClick={() => setActiveModal('howToOrder')}
                  >
                    <HelpCircle size={20} color="var(--primary)" />
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Cara Order</span>
                  </div>
                  
                  <div 
                    style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                    onClick={() => {
                      window.open('https://wa.me/6281234567890', '_blank');
                      setIsOpen(false);
                    }}
                  >
                    <Phone size={20} color="var(--primary)" />
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Hubungi Admin</span>
                  </div>
                </div>
                
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  Pochinko &copy; 2026
                </div>
              </>
            )}
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

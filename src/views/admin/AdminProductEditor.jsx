import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Smartphone, Eye, UploadCloud, GripHorizontal, Trash2, CheckCircle2, Image as ImageIcon, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminProductEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addProduct, updateProduct, getProductById } = useAppContext();
  const isEditMode = id && id !== 'new';
  
  const [activeTab, setActiveTab] = useState('settings'); // settings, wa
  
  // State for image carousel URLs
  const [images, setImages] = useState([]);
  
  // Drag and Drop Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Drag and Drop Reorder State
  const [draggedIdx, setDraggedIdx] = useState(null);

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      // Dummy fallback if env vars are missing: use local object URL
      console.warn("Cloudinary credentials missing. Simulating upload with local ObjectURL.");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(file));
        }, 1000);
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      }
      throw new Error(data.error?.message || "Upload failed");
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again.");
      return null;
    }
  };

  const handleFiles = async (files) => {
    setIsUploading(true);
    const uploadedUrls = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      if (url) uploadedUrls.push(url);
    }
    setImages(prev => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  };

  // Reorder Handlers
  const handleDragStart = (e, idx) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    // Slightly delay hiding the dragged element so it can still act as a drag image
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };
  
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIdx(null);
  };

  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    
    const newImages = [...images];
    const draggedItem = newImages[draggedIdx];
    newImages.splice(draggedIdx, 1); // remove from old
    newImages.splice(idx, 0, draggedItem); // insert at new
    setImages(newImages);
  };

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Bags'); // Bags, Shoes, Accessories, Dresses
  const [sizeCategory, setSizeCategory] = useState(''); // Small, Medium, Large
  const [dimensions, setDimensions] = useState(''); // e.g. 30x25x22
  const [description, setDescription] = useState('');
  const [batch, setBatch] = useState('');
  const [status, setStatus] = useState('Open'); // Open, Closing Soon, Closed
  
  // State for live preview & feed appearance
  const [badgeText, setBadgeText] = useState('48H LEFT');
  const [accentColor, setAccentColor] = useState('#F8A5C2');

  useEffect(() => {
    if (isEditMode) {
      const existingProduct = getProductById(id);
      if (existingProduct) {
        setName(existingProduct.name || '');
        setPrice(existingProduct.price ? existingProduct.price.toString() : '');
        setCategory(existingProduct.category || 'Bags');
        setSizeCategory(existingProduct.sizeCategory || '');
        setDimensions(existingProduct.dimensions || '');
        setDescription(existingProduct.description || '');
        setBatch(existingProduct.preorderInfo?.batchNumber || '');
        setStatus(existingProduct.preorderInfo?.status || 'Open');
        setImages(existingProduct.images || []);
      }
    }
  }, [id, isEditMode, getProductById]);

  const handlePublish = () => {
    if (!name || !price) {
      alert("Name and Price are required.");
      return;
    }
    
    // Clean up empty images
    const cleanImages = images.filter(img => img.trim() !== '');
    const existingProduct = isEditMode ? getProductById(id) : null;

    const newProduct = {
      name,
      price: parseInt(price.replace(/\D/g, '') || '0', 10),
      originalPrice: parseInt(price.replace(/\D/g, '') || '0', 10) + 50000,
      category,
      sizeCategory,
      dimensions,
      description,
      images: cleanImages.length ? cleanImages : ['https://via.placeholder.com/400?text=No+Image'],
      preorderInfo: {
        ...(existingProduct?.preorderInfo || {}),
        batchNumber: batch || '1',
        status: status,
        joinedCount: existingProduct?.preorderInfo?.joinedCount || 0,
        endDate: '2026-12-31'
      }
    };
    
    if (isEditMode) {
      updateProduct(id, newProduct);
    } else {
      addProduct(newProduct);
    }
    navigate('/admin/products');
  };

  return (
    <div className="admin-product-editor-container animate-fade-up">
      
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #f0eef5', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="admin-page-title" style={{ fontSize: '24px' }}>{isEditMode ? 'Edit Post' : 'Publish Post'}</h1>
            <p style={{ color: '#878294', fontSize: '13px' }}>{isEditMode ? 'Update Product' : 'New Product'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="admin-btn-primary" onClick={handlePublish}>{isEditMode ? 'Save Changes' : 'Publish to Feed'}</button>
        </div>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="admin-editor-layout">
        
        {/* Column 1: The Composer */}
        <div className="admin-card admin-editor-composer">
          
          <div style={{ display: 'flex', borderBottom: '1px solid #f0eef5', padding: '16px 20px 0' }}>
            <button 
              className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
              style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'settings' ? '2px solid #5700ff' : '2px solid transparent', fontWeight: activeTab === 'settings' ? 700 : 500, color: activeTab === 'settings' ? '#2d2a36' : '#878294', cursor: 'pointer' }}
            >
              Post Details
            </button>
            <button 
              className={`admin-tab ${activeTab === 'wa' ? 'active' : ''}`}
              onClick={() => setActiveTab('wa')}
              style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'wa' ? '2px solid #5700ff' : '2px solid transparent', fontWeight: activeTab === 'wa' ? 700 : 500, color: activeTab === 'wa' ? '#2d2a36' : '#878294', cursor: 'pointer' }}
            >
              WhatsApp
            </button>
          </div>

          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Drag and Drop Image Upload */}
                <section>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>Photos</h3>
                  
                  {/* Dropzone */}
                  <div 
                    style={{
                      border: `2px dashed ${isDragging ? '#5700ff' : '#d9d5e3'}`,
                      background: isDragging ? '#F7F4FF' : '#fcfcfc',
                      borderRadius: '16px',
                      padding: '32px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginBottom: '16px'
                    }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                      if (files.length > 0) handleFiles(files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      multiple 
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) handleFiles(files);
                      }}
                    />
                    <UploadCloud size={32} color={isDragging ? '#5700ff' : '#878294'} style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#2d2a36', marginBottom: '4px' }}>Click or drag images here to upload</p>
                    <p style={{ fontSize: '12px', color: '#878294' }}>Upload directly to Cloudinary (PNG, JPG up to 5MB)</p>
                  </div>

                  {/* Uploading Indicator */}
                  {isUploading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F7F4FF', borderRadius: '12px', marginBottom: '16px' }}>
                      <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #C8B6FF', borderTopColor: '#5700ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#5700ff' }}>Uploading images to Cloudinary...</span>
                    </div>
                  )}

                  {/* Draggable Gallery */}
                  {images.length > 0 && (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <p style={{ fontSize: '12px', color: '#878294', fontWeight: 600, textTransform: 'uppercase' }}>Gallery (Drag to reorder)</p>
                      
                      {images.map((imgUrl, idx) => (
                        <div 
                          key={`${imgUrl}-${idx}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'white',
                            border: '1px solid #f0eef5',
                            padding: '12px',
                            borderRadius: '12px',
                            cursor: 'grab',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                          }}
                        >
                          <GripHorizontal size={18} color="#d9d5e3" style={{ cursor: 'grab' }} />
                          <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                            <img src={imgUrl} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2d2a36' }}>Image {idx + 1}</span>
                            {idx === 0 ? (
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={12} /> Cover Image
                              </span>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#878294' }}>Gallery item</span>
                            )}
                          </div>
                          
                          {idx !== 0 && (
                            <button 
                              onClick={() => {
                                const newImages = [...images];
                                const cover = newImages[idx];
                                newImages.splice(idx, 1);
                                newImages.unshift(cover);
                                setImages(newImages);
                              }}
                              style={{ background: '#F5F5F5', border: 'none', color: '#2d2a36', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                              title="Make Cover"
                            >
                              <Star size={14} /> <span style={{ fontSize: '11px', fontWeight: 700 }}>Cover</span>
                            </button>
                          )}
                          
                          <button 
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            style={{ background: '#FFEBEB', border: 'none', color: '#D32F2F', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid #f0eef5' }} />

                {/* Basic Info */}
                <section>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>Product Information</h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#878294', marginBottom: '8px' }}>Product Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Premium Cotton Blouse" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#878294', marginBottom: '8px' }}>Price (IDR)</label>
                        <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 350000" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#878294', marginBottom: '8px' }}>Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter', background: 'white' }}>
                          <option value="Bags">Bags</option>
                          <option value="Shoes">Shoes</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Dresses">Dresses</option>
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#878294', marginBottom: '8px' }}>Size</label>
                        <select value={sizeCategory} onChange={e => setSizeCategory(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter', background: 'white' }}>
                          <option value="">No Size Option</option>
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#878294', marginBottom: '8px' }}>Dimensions (cm)</label>
                        <input type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="e.g. 30x25x22" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#878294', marginBottom: '8px' }}>Description</label>
                      <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} placeholder="Product description..." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter', resize: 'none' }}></textarea>
                    </div>
                  </div>
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid #f0eef5' }} />

                {/* Preorder Settings */}
                <section>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> Preorder Settings</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#878294', marginBottom: '8px' }}>Batch Number</label>
                      <input type="number" value={batch} onChange={e => setBatch(e.target.value)} placeholder="14" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#878294', marginBottom: '8px' }}>Status PO</label>
                      <select 
                        value={status} 
                        onChange={e => setStatus(e.target.value)} 
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter', background: 'white' }}
                      >
                        <option value="Open">Open</option>
                        <option value="Closing Soon">Closing Soon</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </section>
                
              </div>
            )}

            {activeTab === 'wa' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#E8F5E9', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Smartphone color="#2E7D32" size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontWeight: 700, color: '#2E7D32', fontSize: '14px', marginBottom: '4px' }}>WhatsApp Checkout Template</h4>
                    <p style={{ fontSize: '13px', color: '#388E3C', lineHeight: 1.4 }}>Customize the message customers send you when they checkout.</p>
                  </div>
                </div>
                <div>
                  <textarea rows="10" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'monospace', resize: 'none', background: '#F5F5F5', lineHeight: 1.5 }} defaultValue={`Halo Kak,\n\nSaya ingin join PO.\n\nProduk:\n{{product_name}}\n\nSize:\n{{size}}\n\nQty:\n{{qty}}`}></textarea>
                </div>
                <div style={{ background: '#fcfcfc', border: '1px dashed #ddd', padding: '16px', borderRadius: '12px' }}>
                  <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase', marginBottom: '12px' }}>Preview</h5>
                  <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>Halo Kak,<br/><br/>Saya ingin join PO.<br/><br/>Produk:<br/>{name || 'Premium Cotton Blouse'}<br/><br/>Size:<br/>{sizeCategory || 'Medium'} {dimensions ? `${dimensions}cm` : ''}<br/><br/>Qty:<br/>1</p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Column 2: Live Preview */}
        <div className="admin-card admin-editor-preview">
          <div style={{ padding: '20px', borderBottom: '1px solid #f0eef5' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} /> Live Preview
            </h2>
          </div>
          
          <div style={{ padding: '24px', overflowY: 'auto' }}>
            {/* Feed Settings */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2d2a36', marginBottom: '12px' }}>Badge Text</label>
              <select value={badgeText} onChange={(e) => setBadgeText(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f0eef5', fontSize: '14px', fontFamily: 'Inter', background: 'white' }}>
                <option>48H LEFT</option>
                <option>CLOSING SOON</option>
                <option>NEW DROP</option>
                <option>LIMITED</option>
              </select>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2d2a36', marginBottom: '12px' }}>Accent Color</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div onClick={() => setAccentColor('#F8A5C2')} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8A5C2', cursor: 'pointer', border: '2px solid white', boxShadow: accentColor === '#F8A5C2' ? '0 0 0 2px #5700ff' : 'none' }}></div>
                <div onClick={() => setAccentColor('#C8B6FF')} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#C8B6FF', cursor: 'pointer', border: '2px solid white', boxShadow: accentColor === '#C8B6FF' ? '0 0 0 2px #5700ff' : 'none' }}></div>
                <div onClick={() => setAccentColor('#FFD6A5')} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFD6A5', cursor: 'pointer', border: '2px solid white', boxShadow: accentColor === '#FFD6A5' ? '0 0 0 2px #5700ff' : 'none' }}></div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f0eef5', margin: '0 -24px 24px' }} />

            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#878294', textTransform: 'uppercase', marginBottom: '16px' }}>Feed Card Preview</h3>
            
            {/* Live Card Preview (Responsive scaling) */}
            <div style={{ 
              background: 'white', 
              borderRadius: '24px', 
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(200, 182, 255, 0.15)',
              margin: '0 auto',
              maxWidth: '300px'
            }}>
              <div style={{ position: 'relative', height: '300px' }}>
                {images[0] ? (
                  <img src={images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#F5F5F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#878294' }}>
                    <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>No Cover Image</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: 800 }}>
                  {badgeText}
                </div>
                {/* Carousel Indicator mock */}
                {images.length > 1 && (
                  <div style={{ position: 'absolute', bottom: '12px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                    {images.map((_, i) => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === 0 ? 'white' : 'rgba(255,255,255,0.5)' }}></div>)}
                  </div>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ padding: '4px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, color: 'white', background: `linear-gradient(135deg, ${accentColor} 0%, #C8B6FF 100%)` }}>BATCH #{batch || '1'}</div>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{name || 'Product Name'}</h4>
                {(sizeCategory || dimensions) && (
                  <div style={{ fontSize: '13px', color: '#878294', marginBottom: '6px' }}>
                    Size: {sizeCategory} {dimensions ? `${dimensions}cm` : ''}
                  </div>
                )}
                <div style={{ fontSize: '16px', fontWeight: 800 }}>Rp{price ? parseInt(price.replace(/\D/g, '')||'0', 10).toLocaleString('id-ID') : '0'}</div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProductEditor;

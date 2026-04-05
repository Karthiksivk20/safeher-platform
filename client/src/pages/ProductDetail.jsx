import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://safeher-backend-uyzs.onrender.com';

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image ? `${API}/uploads/${image}` : null;

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [imgLoaded, setImgLoaded] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const headers = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/api/products/${id}`),
      axios.get(`${API}/api/products/${id}/reviews`),
    ]).then(([p, r]) => {
      setProduct(p.data);
      setReviews(r.data);
    }).catch(() => navigate('/')).finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) return showToast('Please sign in first', 'error');
    try {
      await axios.post(`${API}/api/cart/add`,
        { product_id: id, quantity: qty }, headers());
      showToast(`${qty} item${qty > 1 ? 's' : ''} added to cart! 🛒`);
    } catch { showToast('Could not add to cart', 'error'); }
  };

  const orderNow = async () => {
    if (!user) return navigate('/login');
    await addToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16,
      background: 'var(--grad-bg)' }}>
      <div style={{ width: 48, height: 48, border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading product...</p>
    </div>
  );

  if (!product) return null;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--grad-bg)' }}>
      {toast.msg && (
        <div style={{
          position: 'fixed', top: 86, right: 16, left: 16,
          maxWidth: 320, marginLeft: 'auto',
          background: toast.type === 'error'
            ? 'rgba(226,75,74,0.95)' : 'rgba(45,155,111,0.95)',
          color: '#fff', padding: '12px 18px', borderRadius: 12,
          fontSize: 14, fontWeight: 500, zIndex: 999,
          animation: 'slideDown 0.3s ease',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>{toast.msg}</div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(16px,3vw,32px) clamp(12px,3vw,24px) 80px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 24, fontSize: 13, color: 'var(--text-muted)',
          flexWrap: 'wrap' }}>
          <span onClick={() => navigate('/')}
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            Home
          </span>
          <span>›</span>
          <span onClick={() => navigate('/')}
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            {product.category_name}
          </span>
          <span>›</span>
          <span style={{ color: 'var(--text-secondary)',
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', maxWidth: 200 }}>{product.name}</span>
        </div>

        {/* Main product card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 0,
        }}>
          {/* Image */}
          <div style={{ position: 'relative', minHeight: 'clamp(280px,40vw,500px)',
            background: 'var(--surface-2)', overflow: 'hidden' }}>
            {!imgLoaded && (
              <div className="skeleton" style={{ position: 'absolute',
                inset: 0, zIndex: 1 }} />
            )}
            {imgSrc(product.image) ? (
              <img
                src={imgSrc(product.image)} alt={product.name}
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  position: 'absolute', inset: 0,
                  transition: 'transform 0.5s ease',
                  opacity: imgLoaded ? 1 : 0,
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                🛍️
              </div>
            )}
            {/* Category badge */}
            <div style={{ position: 'absolute', top: 16, left: 16,
              background: 'rgba(139,111,191,0.85)', backdropFilter: 'blur(8px)',
              borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700,
              color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              {product.category_name}
            </div>
            {product.stock < 5 && product.stock > 0 && (
              <div style={{ position: 'absolute', top: 16, right: 16,
                background: 'rgba(232,118,58,0.9)',
                borderRadius: 20, padding: '5px 12px', fontSize: 11,
                fontWeight: 700, color: '#fff' }}>
                Only {product.stock} left!
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: 'clamp(20px,4vw,40px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 12, flexWrap: 'wrap' }}>
              {avgRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(212,168,83,0.15)',
                  border: '1px solid rgba(212,168,83,0.3)',
                  borderRadius: 20, padding: '4px 12px' }}>
                  <span style={{ color: '#D4A853', fontSize: 13 }}>★</span>
                  <span style={{ fontSize: 13, fontWeight: 700,
                    color: '#D4A853' }}>{avgRating}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    ({reviews.length})
                  </span>
                </div>
              )}
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                by {product.seller_name}
              </span>
            </div>

            <h1 style={{ fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700,
              color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
              {product.name}
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: 14.5,
              lineHeight: 1.8, marginBottom: 24 }}>
              {product.description || 'A beautiful handcrafted product made with love by our women artisans.'}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700,
                color: '#D4A853', marginBottom: 4 }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%',
                  background: product.stock > 0 ? '#2D9B6F' : '#E24B4A',
                  animation: product.stock > 0 ? 'pulse 2s infinite' : 'none' }} />
                <span style={{ fontSize: 13, fontWeight: 600,
                  color: product.stock > 0 ? '#7DEBB5' : '#FF8A8A' }}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <>
                {/* Quantity */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700,
                    color: 'var(--text-muted)', marginBottom: 10,
                    letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    Quantity
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {[-1, qty, 1].map((v, i) => i === 1 ? (
                      <span key="qty" style={{ minWidth: 36, textAlign: 'center',
                        fontSize: 18, fontWeight: 700, color: '#fff' }}>{qty}</span>
                    ) : (
                      <button key={i} onClick={() => setQty(q => Math.max(1, Math.min(product.stock, q + v)))}
                        style={{ width: 38, height: 38, borderRadius: 10,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid var(--border-strong)',
                          color: '#fff', fontSize: 18, cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,111,191,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                        {v === -1 ? '−' : '+'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button onClick={addToCart} style={{
                    flex: 1, minWidth: 140, padding: '14px 20px',
                    background: 'rgba(139,111,191,0.15)',
                    border: '2px solid rgba(139,111,191,0.5)',
                    color: '#C4A8E8', borderRadius: 13,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,111,191,0.25)'; e.currentTarget.style.borderColor = 'rgba(139,111,191,0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,111,191,0.15)'; e.currentTarget.style.borderColor = 'rgba(139,111,191,0.5)'; }}>
                    🛒 Add to Cart
                  </button>
                  <button onClick={orderNow} style={{
                    flex: 1, minWidth: 140, padding: '14px 20px',
                    background: 'var(--grad-primary)',
                    border: 'none', color: '#fff', borderRadius: 13,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 6px 20px rgba(139,111,191,0.35)',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(139,111,191,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,111,191,0.35)'; }}>
                    ⚡ Buy Now
                  </button>
                </div>
              </>
            )}

            {/* Seller info */}
            <div style={{ marginTop: 24, padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12, border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10,
                background: 'var(--grad-primary)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 16 }}>
                {product.seller_name?.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>
                  {product.seller_name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  ✓ Verified Woman Entrepreneur
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
          overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif',
                fontSize: 22, fontWeight: 700, color: '#fff' }}>
                Customer Reviews
              </h2>
              {avgRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                  marginTop: 4 }}>
                  <span style={{ fontSize: 24, color: '#D4A853' }}>★</span>
                  <span style={{ fontSize: 20, fontWeight: 800,
                    color: '#D4A853' }}>{avgRating}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    from {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {reviews.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12,
                animation: 'float 3s ease-in-out infinite' }}>⭐</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div style={{ padding: 'clamp(12px,2vw,20px)' }}>
              {reviews.map((r, i) => (
                <div key={r.id} style={{
                  padding: '18px 20px', marginBottom: 10,
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 14,
                  border: '1px solid var(--border)',
                  animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center',
                    gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9,
                      background: 'var(--grad-primary)', flexShrink: 0,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#fff',
                      fontWeight: 700, fontSize: 13 }}>
                      {r.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14,
                        color: 'var(--text-primary)' }}>{r.user_name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(r.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ color: s <= r.rating ? '#D4A853' : 'rgba(255,255,255,0.15)', fontSize: 15 }}>★</span>
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)',
                      lineHeight: 1.7, paddingLeft: 44 }}>
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
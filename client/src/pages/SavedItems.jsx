import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://safeher-backend-uyzs.onrender.com';

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image ? `${API}/uploads/${image}` : null;

export default function SavedItems() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const token = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const stored = JSON.parse(localStorage.getItem('savedItems') || '[]');
    if (stored.length === 0) { setLoading(false); return; }
    Promise.all(
      stored.map(id =>
        axios.get(`${API}/api/products/${id}`).then(r => r.data).catch(() => null)
      )
    ).then(products => {
      setSaved(products.filter(Boolean));
    }).finally(() => setLoading(false));
  }, []);

  const removeSaved = (id) => {
    const stored = JSON.parse(localStorage.getItem('savedItems') || '[]');
    const updated = stored.filter(i => i !== id);
    localStorage.setItem('savedItems', JSON.stringify(updated));
    setSaved(prev => prev.filter(p => p.id !== id));
    showToast('Removed from saved items');
  };

  const addToCart = async (product_id) => {
    try {
      await axios.post(`${API}/api/cart/add`,
        { product_id, quantity: 1 }, token());
      showToast('Added to cart! 🛒');
    } catch { showToast('Could not add to cart'); }
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 48, animation: 'float 2s ease-in-out infinite' }}>❤️</div>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading saved items...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto',
      padding: 'clamp(14px,4vw,32px) clamp(12px,3vw,24px) 80px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 86, right: 16,
          background: 'var(--primary)', color: '#fff',
          padding: '12px 18px', borderRadius: 12, fontSize: 14,
          fontWeight: 500, zIndex: 999,
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          animation: 'slideDown 0.3s ease', maxWidth: 280 }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700,
          color: 'var(--text-primary)' }}>
          Saved Items ❤️
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          {saved.length > 0
            ? `${saved.length} item${saved.length !== 1 ? 's' : ''} saved`
            : 'Your wishlist is empty'}
        </p>
      </div>

      {saved.length === 0 ? (
        <div style={{ textAlign: 'center',
          padding: 'clamp(40px,8vw,96px) 24px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 24, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 72, marginBottom: 20,
            animation: 'float 3s ease-in-out infinite' }}>❤️</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24,
            fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
            No saved items yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 28 }}>
            Browse products and tap the heart icon to save them here
          </p>
          <Link to="/" style={{ background: 'var(--grad-primary)',
            color: '#fff', padding: '13px 28px', borderRadius: 14,
            fontWeight: 700, fontSize: 15,
            boxShadow: '0 6px 20px rgba(139,111,191,0.35)',
            display: 'inline-block' }}>
            Explore Products 🛍️
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
          gap: 'clamp(12px,2vw,20px)' }}>
          {saved.map(p => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 18, overflow: 'hidden',
              border: '1px solid var(--border)',
              transition: 'all 0.3s ease',
              animation: 'fadeUp 0.4s ease both' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

              {/* Image */}
              <div style={{ position: 'relative', width: '100%', paddingTop: '75%',
                background: 'var(--surface-2)', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/product/${p.id}`)}>
                {imgSrc(p.image) ? (
                  <img src={imgSrc(p.image)} alt={p.name}
                    style={{ position: 'absolute', inset: 0, width: '100%',
                      height: '100%', objectFit: 'cover', objectPosition: 'center',
                      transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                    🛍️
                  </div>
                )}
                {/* Remove button */}
                <button onClick={(e) => { e.stopPropagation(); removeSaved(p.id); }}
                  style={{ position: 'absolute', top: 10, right: 10,
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'rgba(226,75,74,0.85)',
                    backdropFilter: 'blur(8px)',
                    border: 'none', color: '#fff', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E24B4A'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(226,75,74,0.85)'}>
                  ✕
                </button>
              </div>

              <div style={{ padding: 'clamp(12px,2vw,16px)' }}>
                <h3 style={{ fontSize: 'clamp(12px,1.8vw,14px)', fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', lineHeight: 1.4,
                  cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${p.id}`)}>
                  {p.name}
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                  by {p.seller_name}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif',
                    fontWeight: 700, fontSize: 'clamp(16px,2.5vw,20px)',
                    color: 'var(--gold)' }}>
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </div>
                  <button onClick={() => addToCart(p.id)}
                    disabled={p.stock < 1}
                    style={{ background: p.stock < 1 ? 'rgba(255,255,255,0.1)'
                        : 'var(--grad-primary)',
                      color: p.stock < 1 ? 'var(--text-muted)' : '#fff',
                      border: 'none', padding: 'clamp(7px,1.5vw,9px) clamp(10px,2vw,14px)',
                      borderRadius: 10, fontSize: 12, fontWeight: 700,
                      cursor: p.stock < 1 ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', flexShrink: 0,
                      boxShadow: p.stock > 0 ? '0 4px 12px rgba(139,111,191,0.3)' : 'none',
                      transition: 'all 0.2s' }}>
                    {p.stock < 1 ? 'Sold Out' : '+ Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
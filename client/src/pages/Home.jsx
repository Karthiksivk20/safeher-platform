import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = 'https://safeher-backend-uyzs.onrender.com';

const FEATURED_ENTREPRENEURS = [
  { name: 'Priya Sharma', city: 'Jaipur, Rajasthan', category: 'Handicrafts', story: 'Started with ₹5,000, now runs a 12-member weaving cooperative earning ₹45,000/month.', emoji: '🧵' },
  { name: 'Meena Devi', city: 'Varanasi, UP', category: 'Food & Spices', story: 'Ships across 18 states. Her masala blends are now in 500+ kitchens across India.', emoji: '🌶️' },
  { name: 'Anita Kumari', city: 'Kolkata, WB', category: 'Jewellery', story: 'Online store with 2,000+ happy customers. Featured in local newspapers.', emoji: '💍' },
];

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image ? `${API}/uploads/${image}` : null;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sellers: 0, products: 0, orders: 0, revenue: 0 });
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  // Save functions
  const toggleSave = (e, id) => {
    e.stopPropagation();
    const stored = JSON.parse(localStorage.getItem('savedItems') || '[]');
    const isSaved = stored.includes(id);
    const updated = isSaved ? stored.filter(i => i !== id) : [...stored, id];
    localStorage.setItem('savedItems', JSON.stringify(updated));
    showToast(isSaved ? 'Removed from saved items' : 'Saved! ❤️');
  };

  const isSaved = (id) => {
    const stored = JSON.parse(localStorage.getItem('savedItems') || '[]');
    return stored.includes(id);
  };

  const load = async (s, c, min, max) => {
    setLoading(true);
    try {
      const params = {};
      if (s) params.search = s;
      if (c) params.category = c;
      if (min) params.min_price = min;
      if (max) params.max_price = max;
      const { data } = await axios.get(`${API}/api/products`, { params });
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearch(q);
    axios.get(`${API}/api/products/categories/all`).then(r => setCategories(r.data)).catch(() => {});
    axios.get(`${API}/api/admin/stats`).then(r => setStats(r.data)).catch(() => {});
    load(q, '', '', '');
  }, [searchParams]);

  const addToCart = async (product_id) => {
    if (!user) return showToast('Please login to add items to cart');
    await axios.post(`${API}/api/cart/add`,
      { product_id, quantity: 1 },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    showToast('Added to cart! 🛒');
  };

  const isFiltered = search || category || priceRange.min || priceRange.max;

  const categoryEmojis = ['🧵', '👗', '🌶️', '💍', '🏡', '💄'];
  const categoryGradients = [
    'rgba(139,111,191,0.2)', 'rgba(196,88,122,0.2)',
    'rgba(212,168,83,0.2)', 'rgba(45,155,111,0.2)',
    'rgba(24,95,165,0.2)', 'rgba(133,79,11,0.2)',
  ];
  const categoryColors = ['#C4A8E8', '#F0A0C0', '#D4A853', '#7DEBB5', '#7AB8F5', '#E8A060'];

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '0 clamp(12px, 4vw, 24px) 80px',
      boxSizing: 'border-box'
    }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', 
          top: 80, 
          right: 'max(16px, 5vw)', 
          left: 'auto',
          width: 'min(300px, 85vw)',
          background: 'rgba(45,155,111,0.95)', 
          color: '#fff',
          padding: '12px 20px', 
          borderRadius: 10,
          fontSize: 'clamp(12px, 3vw, 14px)', 
          fontWeight: 500, 
          zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {!isFiltered && (
        <>
          {/* Hero */}
          <div style={{
            background: 'var(--grad-primary)',
            borderRadius: 'clamp(12px, 3vw, 24px)',
            padding: 'clamp(20px, 6vw, 56px) clamp(16px, 5vw, 48px)',
            marginTop: 'clamp(16px, 4vw, 32px)',
            marginBottom: 'clamp(24px, 5vw, 48px)',
            color: '#fff', 
            position: 'relative', 
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60,
              width: 280, height: 280, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', top: 20, right: 48,
              fontSize: 'clamp(40px, 10vw, 80px)', opacity: 0.15 }}>🌸</div>
            <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', fontWeight: 700,
              opacity: 0.8, letterSpacing: 2, textTransform: 'uppercase',
              marginBottom: 14 }}>
              SDG 5 — Gender Equality
            </p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(20px, 6vw, 46px)', fontWeight: 700,
              lineHeight: 1.2, marginBottom: 16, maxWidth: '100%', 
              width: '100%', color: '#fff' }}>
              Empowering Women Entrepreneurs Across India
            </h1>
            <p style={{ opacity: 0.9, fontSize: 'clamp(12px, 2.5vw, 16px)',
              maxWidth: '100%', width: '100%', lineHeight: 1.7, marginBottom: 28 }}>
              Discover handcrafted products, support women-led businesses,
              and be part of a movement that's changing lives.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                style={{ background: '#fff', color: '#8B6FBF',
                  padding: 'clamp(10px, 2.5vw, 13px) clamp(16px, 4vw, 28px)',
                  borderRadius: 12, fontWeight: 700,
                  fontSize: 'clamp(12px, 2vw, 14px)', border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                Shop Now 🛍️
              </button>
              <Link to="/stories" style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                padding: 'clamp(10px, 2.5vw, 13px) clamp(16px, 4vw, 28px)',
                borderRadius: 12, fontWeight: 700,
                fontSize: 'clamp(12px, 2vw, 14px)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                textDecoration: 'none'
              }}>
                Read Stories ⭐
              </Link>
            </div>
          </div>

          {/* Stats — full width, 4 equal columns */}
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'clamp(11px, 2.5vw, 13px)', marginBottom: 16 }}>
            Live platform stats — updated in real time
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 'clamp(6px, 2vw, 16px)',
            marginBottom: 'clamp(24px, 5vw, 56px)',
            width: '100%'
          }}>
            {[
              { icon: '👩‍💼', value: stats.sellers, label: 'Women Sellers' },
              { icon: '🛍️', value: stats.products, label: 'Products Listed' },
              { icon: '📦', value: stats.orders, label: 'Orders Placed' },
              { icon: '💰', value: '₹' + Number(stats.revenue || 0).toLocaleString('en-IN'), label: 'Revenue Generated' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'clamp(10px, 2vw, 16px)', 
                padding: 'clamp(10px, 2vw, 24px)',
                textAlign: 'center', 
                backdropFilter: 'blur(10px)',
                minWidth: 0
              }}>
                <div style={{ fontSize: 'clamp(20px, 5vw, 32px)', marginBottom: 8 }}>{s.icon}</div>
                <div style={{
                  fontSize: 'clamp(16px, 4vw, 28px)', 
                  fontWeight: 800,
                  background: 'var(--grad-primary)',
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 4,
                  wordBreak: 'break-word'
                }}>{s.value}</div>
                <div style={{ fontSize: 'clamp(9px, 2vw, 13px)', color: 'var(--text-muted)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Categories — full width */}
          <div style={{ marginBottom: 'clamp(24px, 5vw, 56px)', width: '100%' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(18px, 4vw, 26px)', 
              fontWeight: 700,
              color: '#F0EAF8', 
              marginBottom: 20,
            }}>Shop by Category</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(categories.length || 6, 6)}, minmax(0, 1fr))`,
              gap: 'clamp(6px, 2vw, 14px)',
              width: '100%'
            }}>
              {categories.map((c, i) => (
                <div key={c.id}
                  onClick={() => { setCategory(String(c.id)); load('', c.id, priceRange.min, priceRange.max); }}
                  style={{
                    background: String(category) === String(c.id)
                      ? categoryGradients[i % categoryGradients.length].replace('0.2', '0.4')
                      : categoryGradients[i % categoryGradients.length],
                    border: `2px solid ${String(category) === String(c.id)
                      ? categoryColors[i % categoryColors.length]
                      : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 'clamp(10px, 2vw, 14px)',
                    padding: 'clamp(8px, 2vw, 22px) clamp(4px, 1vw, 8px)',
                    textAlign: 'center', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, border-color 0.2s',
                    minWidth: 0
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: 'clamp(18px, 4vw, 30px)', marginBottom: 6 }}>
                    {categoryEmojis[i % categoryEmojis.length]}
                  </div>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 13px)', 
                    fontWeight: 700,
                    color: categoryColors[i % categoryColors.length],
                    wordBreak: 'break-word'
                  }}>
                    {c.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Entrepreneurs — full width 3 columns */}
          <div style={{ marginBottom: 'clamp(24px, 5vw, 56px)', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(18px, 4vw, 26px)', 
                fontWeight: 700, 
                color: '#F0EAF8',
              }}>
                Featured Entrepreneurs
              </h2>
              <Link to="/stories" style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                View all →
              </Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(12px, 3vw, 20px)',
              width: '100%'
            }}>
              {FEATURED_ENTREPRENEURS.map((e, i) => (
                <div key={e.name} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'clamp(12px, 2vw, 16px)', 
                  padding: 'clamp(16px, 3vw, 24px)',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                  onMouseEnter={e2 => {
                    e2.currentTarget.style.transform = 'translateY(-3px)';
                    e2.currentTarget.style.borderColor = 'rgba(139,111,191,0.5)';
                  }}
                  onMouseLeave={e2 => {
                    e2.currentTarget.style.transform = 'translateY(0)';
                    e2.currentTarget.style.borderColor = 'var(--border-strong)';
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
                    <div style={{
                      width: 'clamp(44px, 8vw, 52px)', 
                      height: 'clamp(44px, 8vw, 52px)', 
                      borderRadius: '50%',
                      background: categoryGradients[i % categoryGradients.length],
                      border: `2px solid ${categoryColors[i % categoryColors.length]}`,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', 
                      fontSize: 'clamp(20px, 4vw, 24px)', 
                      flexShrink: 0,
                    }}>
                      {e.emoji}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 'clamp(13px, 2.5vw, 15px)', color: '#F0EAF8' }}>{e.name}</p>
                      <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: 'var(--text-muted)' }}>
                        {e.city} · {e.category}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {e.story}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Search / Filter Bar */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'clamp(10px, 2vw, 14px)', 
        padding: 'clamp(10px, 2vw, 16px)',
        marginBottom: 28, 
        display: 'flex', 
        gap: 'clamp(8px, 2vw, 10px)', 
        flexWrap: 'wrap',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <input placeholder="🔍  Search products..."
          style={{ flex: '1 1 150px', minWidth: '120px', padding: '8px 12px' }} 
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(search, category, priceRange.min, priceRange.max)} />
        <select style={{ width: 'clamp(120px, 25vw, 180px)', padding: '8px 12px' }} value={category}
          onChange={e => { setCategory(e.target.value); load(search, e.target.value, priceRange.min, priceRange.max); }}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input placeholder="Min ₹" type="number"
          style={{ width: 'clamp(70px, 15vw, 80px)', padding: '8px 12px' }} 
          value={priceRange.min}
          onChange={e => setPriceRange({ ...priceRange, min: e.target.value })} />
        <input placeholder="Max ₹" type="number"
          style={{ width: 'clamp(70px, 15vw, 80px)', padding: '8px 12px' }} 
          value={priceRange.max}
          onChange={e => setPriceRange({ ...priceRange, max: e.target.value })} />
        <button onClick={() => load(search, category, priceRange.min, priceRange.max)} style={{
          background: 'var(--grad-primary)', 
          color: '#fff', 
          border: 'none',
          padding: '8px clamp(14px, 3vw, 24px)', 
          borderRadius: 10,
          fontWeight: 700, 
          fontSize: 'clamp(12px, 2vw, 14px)', 
          cursor: 'pointer',
        }}>Search</button>
        {isFiltered && (
          <button onClick={() => { setSearch(''); setCategory(''); setPriceRange({ min: '', max: '' }); load('', '', '', ''); }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-muted)', 
              padding: '8px 14px',
              borderRadius: 10, 
              fontSize: 'clamp(11px, 2vw, 13px)', 
              cursor: 'pointer',
            }}>
            Clear ✕
          </button>
        )}
      </div>

      {/* Section Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(16px, 3.5vw, 24px)', 
          fontWeight: 700, 
          color: '#F0EAF8',
        }}>
          {category
            ? `${categories.find(c => String(c.id) === String(category))?.name || 'Category'} (${products.length})`
            : search ? `Results for "${search}" (${products.length})`
            : priceRange.min || priceRange.max ? `Price filtered (${products.length})`
            : `All Products (${products.length})`}
        </h2>
        {isFiltered && (
          <button onClick={() => { setSearch(''); setCategory(''); setPriceRange({ min: '', max: '' }); load('', '', '', ''); }}
            style={{
              background: 'rgba(139,111,191,0.1)',
              border: '1.5px solid var(--border-strong)',
              color: '#C4A8E8', 
              padding: '6px 12px',
              borderRadius: 10, 
              fontSize: 'clamp(11px, 2vw, 13px)', 
              fontWeight: 600, 
              cursor: 'pointer',
            }}>
            ✕ Clear Filter
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ width: '100%' }}>
          <div style={{
            textAlign: 'center', 
            padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
            background: 'rgba(212,168,83,0.1)',
            borderRadius: 12, 
            marginBottom: 20,
            border: '1px solid rgba(212,168,83,0.3)',
          }}>
            <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#D4A853', fontWeight: 600 }}>
              ⏳ Server is waking up... Products will load in 20-30 seconds.
            </p>
            <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: 'var(--text-muted)', marginTop: 4 }}>
              This only happens on the first visit. Subsequent loads are instant.
            </p>
          </div>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', 
            gap: 'clamp(12px, 3vw, 20px)' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton" style={{ borderRadius: 16, height: 'clamp(240px, 40vw, 280px)' }} />
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'clamp(40px, 10vw, 60px) 0', width: '100%' }}>
          <div style={{ fontSize: 'clamp(36px, 8vw, 48px)', marginBottom: 16 }}>🛍️</div>
          <p style={{ fontSize: 'clamp(13px, 2.5vw, 15px)', color: 'var(--text-muted)' }}>No products found.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(12px, 3vw, 20px)',
          width: '100%'
        }}>
          {products.map(p => (
            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 16, 
                overflow: 'hidden',
                cursor: 'pointer', 
                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                backdropFilter: 'blur(10px)', 
                position: 'relative',
                minWidth: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(139,111,191,0.25)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}>
              
              {/* Save button */}
              <button
                onClick={e => toggleSave(e, p.id)}
                style={{
                  position: 'absolute', 
                  top: 'clamp(6px, 2vw, 10px)', 
                  right: 'clamp(6px, 2vw, 10px)', 
                  zIndex: 10,
                  width: 'clamp(28px, 5vw, 32px)', 
                  height: 'clamp(28px, 5vw, 32px)', 
                  borderRadius: '50%',
                  background: isSaved(p.id)
                    ? 'rgba(196,88,122,0.9)' : 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                  border: 'none', 
                  fontSize: 'clamp(12px, 2.5vw, 14px)', 
                  cursor: 'pointer',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                {isSaved(p.id) ? '❤️' : '🤍'}
              </button>

              {/* Product Image */}
              <div style={{
                height: 'clamp(140px, 30vw, 200px)',
                background: 'var(--surface-2)',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center', 
                overflow: 'hidden', 
                position: 'relative',
              }}>
                {imgSrc(p.image)
                  ? <img src={imgSrc(p.image)} alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  : <span style={{ fontSize: 'clamp(32px, 8vw, 48px)' }}>🛍️</span>}
                <span style={{
                  position: 'absolute', 
                  top: 'clamp(6px, 2vw, 10px)', 
                  left: 'clamp(6px, 2vw, 10px)',
                  background: 'rgba(139,111,191,0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff', 
                  fontSize: 'clamp(9px, 2vw, 10px)', 
                  fontWeight: 700,
                  padding: '2px 8px', 
                  borderRadius: 20,
                }}>{p.category_name}</span>
              </div>

              {/* Product Info */}
              <div style={{ padding: 'clamp(10px, 2.5vw, 16px)' }}>
                <h3 style={{
                  fontSize: 'clamp(12px, 2.5vw, 15px)', 
                  fontWeight: 700,
                  marginBottom: 4, 
                  color: '#F0EAF8',
                  wordBreak: 'break-word'
                }}>{p.name}</h3>
                <p style={{ fontSize: 'clamp(9px, 2vw, 11px)', color: 'var(--text-muted)', marginBottom: 10 }}>
                  by {p.seller_name}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{
                      fontWeight: 800, 
                      fontSize: 'clamp(14px, 3vw, 20px)',
                      background: 'var(--grad-primary)',
                      WebkitBackgroundClip: 'text', 
                      WebkitTextFillColor: 'transparent',
                    }}>
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </div>
                    <p style={{
                      fontSize: 'clamp(9px, 2vw, 10px)', 
                      fontWeight: 600, 
                      marginTop: 2,
                      color: p.stock < 1 ? '#FF8A8A' : p.stock < 5 ? '#D4A853' : '#7DEBB5',
                    }}>
                      {p.stock < 1 ? 'Out of stock' : p.stock < 5 ? `Only ${p.stock} left` : 'In stock'}
                    </p>
                  </div>
                  <button disabled={p.stock < 1}
                    onClick={e => { e.stopPropagation(); addToCart(p.id); }}
                    style={{
                      background: p.stock < 1 ? 'rgba(255,255,255,0.06)' : 'var(--grad-primary)',
                      color: p.stock < 1 ? 'var(--text-muted)' : '#fff',
                      border: 'none',
                      padding: 'clamp(6px, 1.5vw, 9px) clamp(8px, 2vw, 14px)',
                      borderRadius: 10, 
                      fontSize: 'clamp(10px, 2vw, 13px)',
                      fontWeight: 600, 
                      cursor: p.stock < 1 ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.2s',
                      whiteSpace: 'nowrap'
                    }}>
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
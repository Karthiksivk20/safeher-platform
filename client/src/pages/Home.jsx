import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams, useNavigate }from 'react-router-dom';
const API = 'https://safeher-backend-uyzs.onrender.com';
import { useAuth } from '../context/AuthContext';

const FEATURED_ENTREPRENEURS = [
  { name: 'Priya Sharma', city: 'Jaipur, Rajasthan', category: 'Handicrafts', story: 'Started with ₹5,000, now runs a 12-member weaving cooperative earning ₹45,000/month.', emoji: '🧵' },
  { name: 'Meena Devi', city: 'Varanasi, UP', category: 'Food & Spices', story: 'Ships across 18 states. Her masala blends are now in 500+ kitchens across India.', emoji: '🌶️' },
  { name: 'Anita Kumari', city: 'Kolkata, WB', category: 'Jewellery', story: 'Online store with 2,000+ happy customers. Featured in local newspapers.', emoji: '💍' },
];

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image
    ? `${API}/uploads/${image}` : null;

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

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const load = async (s, c) => {
    setLoading(true);
    try {
      const params = {};
      if (s) params.search = s;
      if (c) params.category = c;
      const { data } = await axios.get('https://safeher-backend-uyzs.onrender.com/api/products', { params });
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearch(q);
    axios.get('https://safeher-backend-uyzs.onrender.com/api/products/categories/all').then(r => setCategories(r.data));
    axios.get('https://safeher-backend-uyzs.onrender.com/api/admin/stats').then(r => setStats(r.data));
    load(q, '');
  }, []);

  const addToCart = async (product_id) => {
    if (!user) return showToast('Please login to add items to cart');
    await axios.post('https://safeher-backend-uyzs.onrender.com/api/cart/add',
      { product_id, quantity: 1 },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    showToast('Added to cart! 🛒');
  };

  const isFiltered = search || category;

  const categoryEmojis = ['🧵', '👗', '🌶️', '💍', '🏡', '💄'];
  const categoryColors = ['#f0eeff', '#fff0f6', '#fff8e6', '#eafaf3', '#e6f1fb', '#fef3e2'];
  const categoryTextColors = ['#7F77DD', '#D4537E', '#BA7517', '#0F6E56', '#185FA5', '#854F0B'];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto',
      padding: '0 clamp(12px, 3vw, 24px) 60px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 16, left: 16,
          maxWidth: 300, marginLeft: 'auto',
          background: '#1a1a2e', color: '#fff', padding: '12px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 500,
          zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      {!isFiltered && (
        <>
          {/* Hero */}
          <div style={{
            background: 'linear-gradient(135deg, #7F77DD 0%, #D4537E 100%)',
            borderRadius: 'clamp(12px, 2vw, 24px)',
            padding: 'clamp(24px, 4vw, 56px) clamp(20px, 4vw, 48px)',
            marginTop: 'clamp(16px, 3vw, 32px)',
            marginBottom: 'clamp(24px, 4vw, 48px)',
            color: '#fff', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60,
              width: 280, height: 280, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', top: 20, right: 48,
              fontSize: 'clamp(40px, 8vw, 80px)', opacity: 0.15 }}>🌸</div>
            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 600,
              opacity: 0.75, letterSpacing: 2,
              textTransform: 'uppercase', marginBottom: 14 }}>
              SDG 5 — Gender Equality
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(22px, 4vw, 42px)',
              fontWeight: 600, lineHeight: 1.2, marginBottom: 16,
              maxWidth: 560 }}>
              Empowering Women<br />Entrepreneurs Across India
            </h1>
            <p style={{ opacity: 0.85, fontSize: 'clamp(13px, 2vw, 16px)',
              maxWidth: 480, lineHeight: 1.7, marginBottom: 28 }}>
              Discover handcrafted products, support women-led businesses,
              and be part of a movement that's changing lives.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                style={{ background: '#fff', color: '#7F77DD',
                  padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)',
                  borderRadius: 12, fontWeight: 600,
                  fontSize: 'clamp(12px, 1.5vw, 14px)', border: 'none',
                  cursor: 'pointer' }}>
                Shop Now 🛍️
              </button>
              <Link to="/stories" style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)',
                borderRadius: 12, fontWeight: 600,
                fontSize: 'clamp(12px, 1.5vw, 14px)',
                border: '1.5px solid rgba(255,255,255,0.3)' }}>
                Read Stories ⭐
              </Link>
            </div>
          </div>

          {/* Stats */}
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: 13,
            marginBottom: 16 }}>Live platform stats — updated in real time</p>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 'clamp(8px, 2vw, 16px)',
            marginBottom: 'clamp(24px, 4vw, 56px)' }}>
            {[
              { icon: '👩‍💼', value: stats.sellers, label: 'Women Sellers' },
              { icon: '🛍️', value: stats.products, label: 'Products Listed' },
              { icon: '📦', value: stats.orders, label: 'Orders Placed' },
              { icon: '💰', value: '₹' + Number(stats.revenue || 0).toLocaleString('en-IN'), label: 'Revenue Generated' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: 16,
                padding: 'clamp(14px, 2vw, 24px) clamp(12px, 2vw, 20px)',
                textAlign: 'center',
                boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
                border: '0.5px solid #f0eeff' }}>
                <div style={{ fontSize: 'clamp(24px, 4vw, 32px)',
                  marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700,
                  background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 'clamp(11px, 1.5vw, 13px)',
                  color: '#888' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div style={{ marginBottom: 'clamp(24px, 4vw, 56px)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600,
              marginBottom: 20 }}>Shop by Category</h2>
            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 'clamp(8px, 2vw, 12px)' }}>
              {categories.map((c, i) => (
                <div key={c.id}
                  onClick={() => { setCategory(String(c.id)); load('', c.id); }}
                  style={{ background: categoryColors[i % categoryColors.length],
                    borderRadius: 14, padding: 'clamp(12px, 2vw, 20px) 12px',
                    textAlign: 'center', cursor: 'pointer',
                    border: `2px solid ${String(category) === String(c.id)
                      ? categoryTextColors[i % categoryTextColors.length]
                      : 'transparent'}`,
                    transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: 'clamp(20px, 3vw, 28px)',
                    marginBottom: 8 }}>
                    {categoryEmojis[i % categoryEmojis.length]}
                  </div>
                  <div style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 600,
                    color: categoryTextColors[i % categoryTextColors.length] }}>
                    {c.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Entrepreneurs */}
          <div style={{ marginBottom: 'clamp(24px, 4vw, 56px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600 }}>
                Featured Entrepreneurs
              </h2>
              <Link to="/stories" style={{ fontSize: 13, color: '#7F77DD',
                fontWeight: 500 }}>View all →</Link>
            </div>
            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20 }}>
              {FEATURED_ENTREPRENEURS.map(e => (
                <div key={e.name} style={{ background: '#fff', borderRadius: 16,
                  padding: 24, boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
                  border: '0.5px solid #f0eeff' }}>
                  <div style={{ display: 'flex', alignItems: 'center',
                    gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {e.emoji}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 15 }}>{e.name}</p>
                      <p style={{ fontSize: 12, color: '#aaa' }}>
                        {e.city} · {e.category}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>
                    {e.story}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Search Bar */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(10px, 2vw, 16px)',
        boxShadow: '0 2px 12px rgba(127,119,221,0.08)',
        marginBottom: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input placeholder="🔍  Search products..."
          style={{ flex: 1, minWidth: 150 }} value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(search, category)} />
        <select style={{ width: 'clamp(130px, 20vw, 180px)' }} value={category}
          onChange={e => { setCategory(e.target.value); load(search, e.target.value); }}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={() => load(search, category)} style={{
          background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
          color: '#fff', border: 'none', padding: '11px clamp(14px, 2vw, 24px)',
          borderRadius: 10, fontWeight: 600, fontSize: 14,
          cursor: 'pointer' }}>Search</button>
        {isFiltered && (
          <button onClick={() => { setSearch(''); setCategory(''); load('', ''); }}
            style={{ background: '#fff', border: '1.5px solid #ede8ff',
              color: '#888', padding: '10px 14px', borderRadius: 10,
              fontSize: 13, cursor: 'pointer' }}>
            Clear ✕
          </button>
        )}
      </div>

      {/* Section Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 600 }}>
            {category
              ? `${categories.find(c => String(c.id) === String(category))?.name || 'Category'} (${products.length})`
              : search ? `Results for "${search}" (${products.length})`
              : `All Products (${products.length})`}
          </h2>
        </div>
        {isFiltered && (
          <button onClick={() => { setSearch(''); setCategory(''); load('', ''); }}
            style={{ background: '#fff', border: '1.5px solid #ede8ff',
              color: '#7F77DD', padding: '8px 14px', borderRadius: 10,
              fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            ✕ Clear Filter
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ background: '#fff', borderRadius: 16,
              overflow: 'hidden' }}>
              <div style={{ height: 180, background: '#f0eeff' }} />
              <div style={{ padding: 16 }}>
                <div style={{ height: 14, background: '#f0eeff',
                  borderRadius: 6, marginBottom: 8, width: '70%' }} />
                <div style={{ height: 12, background: '#f0eeff',
                  borderRadius: 6, width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
          <p style={{ fontSize: 15 }}>No products found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {products.map(p => (
            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
              style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(127,119,221,0.09)', cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(127,119,221,0.18)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(127,119,221,0.09)';
              }}>
              <div style={{ height: 'clamp(160px, 20vw, 200px)',
                background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', overflow: 'hidden',
                position: 'relative' }}>
                {imgSrc(p.image)
                  ? <img src={imgSrc(p.image)} alt={p.name}
                      style={{ width: '100%', height: '100%',
                        objectFit: 'cover' }} />
                  : <span style={{ fontSize: 48 }}>🛍️</span>}
                <span style={{ position: 'absolute', top: 10, left: 10,
                  background: 'rgba(255,255,255,0.92)', color: '#7F77DD',
                  fontSize: 10, fontWeight: 600, padding: '3px 8px',
                  borderRadius: 20 }}>{p.category_name}</span>
              </div>
              <div style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
                <h3 style={{ fontSize: 'clamp(13px, 1.8vw, 15px)', fontWeight: 600,
                  marginBottom: 4, color: '#1a1a2e' }}>{p.name}</h3>
                <p style={{ fontSize: 11, color: '#bbb', marginBottom: 8 }}>
                  by {p.seller_name}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700,
                      fontSize: 'clamp(15px, 2.5vw, 20px)',
                      background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent' }}>
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 500, marginTop: 2,
                      color: p.stock < 1 ? '#E24B4A'
                        : p.stock < 5 ? '#BA7517' : '#1D9E75' }}>
                      {p.stock < 1 ? 'Out of stock'
                        : p.stock < 5 ? `Only ${p.stock} left`
                        : 'In stock'}
                    </p>
                  </div>
                  <button disabled={p.stock < 1}
                    onClick={e => { e.stopPropagation(); addToCart(p.id); }}
                    style={{ background: p.stock < 1 ? '#eee'
                        : 'linear-gradient(135deg, #7F77DD, #D4537E)',
                      color: p.stock < 1 ? '#aaa' : '#fff',
                      border: 'none', padding: 'clamp(6px, 1vw, 9px) clamp(10px, 1.5vw, 14px)',
                      borderRadius: 10, fontSize: 'clamp(11px, 1.5vw, 13px)',
                      fontWeight: 500, cursor: p.stock < 1 ? 'not-allowed' : 'pointer' }}>
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
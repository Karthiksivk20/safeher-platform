import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import SellerDashboard from './pages/SellerDashboard';
import Forum from './pages/Forum';
import AdminDashboard from './pages/AdminDashboard';
import Stories from './pages/Stories';
import Funding from './pages/Funding';
import Learn from './pages/Learn';
import Support from './pages/Support';
import About from './pages/About';
import SellerOrders from './pages/SellerOrders';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import SellerAnalytics from './pages/SellerAnalytics';

const API = 'https://safeher-backend-uyzs.onrender.com';

// Add global styles for animations
const globalStyles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .hide-mobile {
    display: flex;
  }
  .hide-tablet {
    display: none;
  }
  @media (max-width: 768px) {
    .hide-mobile {
      display: none !important;
    }
    .hide-tablet {
      display: flex !important;
    }
  }
`;

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [city, setCity] = useState('India');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
  if (hideNavbar) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          setCity(data.address?.city || data.address?.town || data.address?.village || 'India');
        } catch { setCity('India'); }
      }, () => setCity('India'));
    }
  }, []);

  useEffect(() => {
    if (user) {
      axios.get(`${API}/api/cart`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(r => setCartCount(r.data.length)).catch(() => {});
    } else setCartCount(0);
  }, [user, location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!user) { setNotifications([]); setUnreadCount(0); return; }
    const fetchNotifs = async () => {
      const h = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const notifs = [];
      try {
        const { data: c } = await axios.get(`${API}/api/cart`, { headers: h });
        if (c.length > 0) notifs.push({ id: 'cart', text: `${c.length} item${c.length > 1 ? 's' : ''} in your cart`, time: 'Now', unread: true, icon: '🛒', link: '/cart' });
      } catch {}
      try {
        const { data: o } = await axios.get(`${API}/api/orders/my`, { headers: h });
        o.slice(0, 2).forEach(order => {
          if (order.status === 'shipped') notifs.push({ id: `s-${order.id}`, text: `Order #${order.id} is on its way! 🚚`, time: new Date(order.created_at).toLocaleDateString(), unread: true, icon: '🚚', link: '/orders' });
          if (order.status === 'delivered') notifs.push({ id: `d-${order.id}`, text: `Order #${order.id} delivered. Leave a review!`, time: new Date(order.created_at).toLocaleDateString(), unread: false, icon: '✅', link: '/orders' });
        });
      } catch {}
      if (notifs.length === 0) notifs.push({ id: 'w', text: 'Welcome to SafeHer! Start exploring.', time: 'Now', unread: false, icon: '🌸', link: '/' });
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => n.unread).length);
    };
    fetchNotifs();
    const t = setInterval(fetchNotifs, 30000);
    return () => clearInterval(t);
  }, [user]);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/marketplace', label: 'Shop' },
    { to: '/forum', label: 'Community' },
    { to: '/stories', label: 'Stories' },
    { to: '/funding', label: 'Funding' },
    { to: '/learn', label: 'Learn' },
    { to: '/about', label: 'About' },
    { to: '/support', label: 'Support' },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: scrolled ? 'rgba(253,250,246,0.92)' : '#FDFAF6',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(107,79,160,0.15)' : 'rgba(107,79,160,0.08)'}`,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(28,20,16,0.06)' : 'none',
      }}>
        {/* Top bar */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(12px,3vw,24px)',
          height: 66, display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10,
            flexShrink: 0, marginRight: 4, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 12,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 4px 12px rgba(107,79,160,0.3)',
              transition: 'transform 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08) rotate(-3deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0)'}>
              🌸
            </div>
            <div>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22,
                fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.3px' }}>
                SafeHer
              </span>
              <div style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 600,
                letterSpacing: 1.5, textTransform: 'uppercase', lineHeight: 1,
                marginTop: -2 }}>Marketplace</div>
            </div>
          </Link>

          {/* Location */}
          <div onClick={() => { const l = prompt('Enter your city:', city); if (l) setCity(l); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--surface-2)', borderRadius: 10,
              padding: '6px 12px', border: '1px solid var(--border)',
              cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}
            className="hide-mobile"
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600,
              maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' }}>{city}</span>
          </div>

          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); if (search.trim()) navigate(`/?search=${encodeURIComponent(search)}`); }}
            style={{ flex: 1, minWidth: 0, display: 'flex', gap: 0,
              background: 'var(--surface-2)', borderRadius: 12,
              border: '1.5px solid var(--border)', overflow: 'hidden',
              transition: 'all 0.2s', boxShadow: 'none' }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <input placeholder="Search handcrafted products, sellers..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent',
                padding: '10px 16px', fontSize: 13.5, outline: 'none',
                color: 'var(--text-primary)' }} />
            <button type="submit" style={{ background: 'var(--gradient-primary)',
              border: 'none', padding: '0 18px', color: '#fff',
              fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>🔍</button>
          </form>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {user && (
              <Link to="/cart" style={{ position: 'relative', width: 42, height: 42,
                borderRadius: 12, background: 'var(--surface-2)',
                border: '1px solid var(--border)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 18,
                textDecoration: 'none', transition: 'all 0.2s',
                color: 'var(--text-primary)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                🛒
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: -5, right: -5,
                    background: 'var(--gradient-accent)', color: '#fff',
                    borderRadius: '50%', width: 19, height: 19, fontSize: 10,
                    fontWeight: 700, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', border: '2px solid var(--surface)' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user && (
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button onClick={() => setShowNotifs(!showNotifs)} style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  fontSize: 18, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', position: 'relative',
                  transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  🔔
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: -5, right: -5,
                      background: '#E24B4A', color: '#fff', borderRadius: '50%',
                      width: 17, height: 17, fontSize: 9, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--surface)' }}>{unreadCount}</span>
                  )}
                </button>
                {showNotifs && (
                  <div style={{ position: 'absolute', top: 52, right: 0, width: 320,
                    background: '#fff', borderRadius: '16px',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border)', overflow: 'hidden',
                    zIndex: 300, animation: 'slideDown 0.2s ease' }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)',
                      background: 'var(--surface-2)', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 14,
                        color: 'var(--text-primary)' }}>Notifications</span>
                      {unreadCount > 0 && <span style={{ fontSize: 11,
                        color: 'var(--primary)', fontWeight: 600 }}>
                        {unreadCount} new</span>}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '28px 18px', textAlign: 'center',
                        color: 'var(--text-muted)', fontSize: 13 }}>
                        Nothing new right now
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id}
                        onClick={() => { navigate(n.link || '/'); setShowNotifs(false); }}
                        style={{ padding: '13px 18px',
                          borderBottom: '1px solid var(--border)',
                          background: n.unread ? 'rgba(107,79,160,0.04)' : '#fff',
                          display: 'flex', gap: 12, alignItems: 'flex-start',
                          cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(107,79,160,0.04)' : '#fff'}>
                        <div style={{ width: 36, height: 36, borderRadius: 10,
                          background: 'var(--surface-2)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, color: 'var(--text-primary)',
                            lineHeight: 1.5, fontWeight: n.unread ? 500 : 400 }}>
                            {n.text}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)',
                            marginTop: 3 }}>{n.time}</p>
                        </div>
                        {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%',
                          background: 'var(--primary)', flexShrink: 0, marginTop: 5 }} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  background: showUserMenu ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: `1.5px solid ${showUserMenu ? 'var(--primary)' : 'var(--border)'}`,
                  padding: '6px 12px 6px 6px', borderRadius: 12,
                  cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9,
                    background: 'var(--gradient-primary)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 13, fontWeight: 700 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600,
                    color: 'var(--text-primary)', maxWidth: 72,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' }} className="hide-mobile">
                    {user.name.split(' ')[0]}
                  </span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
                    style={{ transition: 'transform 0.2s', transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <path d="M1 1l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                {showUserMenu && (
                  <div style={{ position: 'absolute', top: 52, right: 0, width: 240,
                    background: '#fff', borderRadius: '16px',
                    boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)',
                    overflow: 'hidden', zIndex: 300,
                    animation: 'slideDown 0.2s ease' }}>
                    <div style={{ padding: '16px 18px',
                      background: 'linear-gradient(135deg, rgba(107,79,160,0.08), rgba(196,88,122,0.06))',
                      borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12,
                        background: 'var(--gradient-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 18, fontWeight: 700,
                        marginBottom: 10 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <p style={{ fontWeight: 700, fontSize: 15,
                        color: 'var(--text-primary)' }}>{user.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)',
                        marginTop: 2 }}>{user.email}</p>
                      <span style={{ display: 'inline-block', marginTop: 8,
                        background: 'rgba(107,79,160,0.12)', color: 'var(--primary)',
                        fontSize: 11, fontWeight: 700, padding: '3px 10px',
                        borderRadius: 20, textTransform: 'capitalize' }}>
                        {user.role}
                      </span>
                    </div>
                    {[
                      { icon: '👤', label: 'My Profile', to: '/profile' },
                      { icon: '📦', label: 'My Orders', to: '/orders' },
                      { icon: '❤️', label: 'Saved Items', to: '/saved' },
                      { icon: '💬', label: 'Support', to: '/support' },
                      ...(user.role === 'seller' ? [
                        { icon: '🏪', label: 'My Shop', to: '/seller' },
                        { icon: '📊', label: 'Analytics', to: '/seller/analytics' },
                        { icon: '📋', label: 'Orders', to: '/seller/orders' },
                      ] : []),
                      ...(user.role === 'admin' ? [
                        { icon: '⚙️', label: 'Admin Panel', to: '/admin' }
                      ] : []),
                    ].map((item) => (
                      <Link key={item.to} to={item.to}
                        onClick={() => setShowUserMenu(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 11,
                          padding: '11px 18px', fontSize: 13.5,
                          color: 'var(--text-secondary)',
                          borderBottom: '1px solid var(--border)',
                          transition: 'all 0.15s', fontWeight: 500, textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.paddingLeft = '22px'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.paddingLeft = '18px'; }}>
                        <span style={{ fontSize: 16, width: 20,
                          textAlign: 'center' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={() => { setShowUserMenu(false); logout(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 11,
                        padding: '12px 18px', fontSize: 13.5, color: '#E24B4A',
                        width: '100%', background: 'none', border: 'none',
                        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                        transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ fontSize: 16, width: 20 }}>🚪</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" style={{ fontSize: 13.5, fontWeight: 600,
                  color: 'var(--primary)', padding: '9px 18px', borderRadius: 12,
                  border: '1.5px solid var(--border-strong)',
                  background: 'var(--surface-2)', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}>
                  Sign In
                </Link>
                <Link to="/register" style={{
                  background: 'var(--gradient-primary)', color: '#fff',
                  padding: '9px 18px', borderRadius: 12, fontSize: 13.5,
                  fontWeight: 600, boxShadow: '0 4px 12px rgba(107,79,160,0.25)',
                  transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(107,79,160,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(107,79,160,0.25)'}>
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="hide-tablet"
              style={{ display: 'none', width: 42, height: 42, borderRadius: 12,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                fontSize: 20, alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer' }}>
              {showMobileMenu ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Bottom nav links */}
        <div style={{ borderTop: '1px solid var(--border)',
          background: 'rgba(253,250,246,0.95)',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto',
            padding: '0 clamp(12px,3vw,24px)', display: 'flex',
            alignItems: 'center', gap: 2, height: 40,
            width: 'max-content', minWidth: '100%' }}>
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end}
                style={({ isActive }) => ({
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap', padding: '5px 14px',
                  borderRadius: 20, transition: 'all 0.2s',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'var(--gradient-primary)' : 'transparent',
                  boxShadow: isActive ? '0 2px 10px rgba(107,79,160,0.25)' : 'none',
                  textDecoration: 'none'
                })}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/analytics" element={<SellerAnalytics />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/funding" element={<Funding />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<ComingSoon title="Saved Items" icon="❤️" />} />
      </Routes>
    </>
  );
}

function ComingSoon({ title, icon }) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16,
      padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, animation: 'float 3s ease-in-out infinite' }}>
        {icon}
      </div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32,
        fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
        Coming soon — we're crafting something beautiful
      </p>
      <Link to="/" style={{ background: 'var(--gradient-primary)',
        color: '#fff', padding: '12px 28px', borderRadius: 14,
        fontWeight: 600, fontSize: 14, textDecoration: 'none',
        boxShadow: '0 4px 16px rgba(107,79,160,0.25)' }}>
        Back to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthProvider>
  );
}
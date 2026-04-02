import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate }
from 'react-router-dom';
import API from './api';
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
import ProductDetail from './pages/ProductDetail';
import SellerOrders from './pages/SellerOrders';

function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [location, setLocation] = useState('Detecting...');

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town ||
            data.address?.village || data.address?.county || 'Your Location';
          setLocation(city);
        } catch {
          setLocation('India');
        }
      },
      () => setLocation('India')
    );
  } else {
    setLocation('India');
  }
}, []);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios.get(https://safeher-backend-uyzs.onrender.com/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(r => setCartCount(r.data.length)).catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search)}`);
  };

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/forum', label: 'Forum' },
    { to: '/stories', label: '⭐ Stories' },
    { to: '/funding', label: '💰 Funding' },
    { to: '/learn', label: '📚 Learn' },
    { to: '/about', label: 'About Us' },
    { to: '/support', label: '💬 Support' },
  ];

  const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  if (!user) { setNotifications([]); setUnreadCount(0); return; }

  const fetchNotifications = async () => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    const notifs = [];

    try {
      const { data: cartItems } = await axios.get(
        https://safeher-backend-uyzs.onrender.com/api/cart', { headers });
      if (cartItems.length > 0) {
        notifs.push({
          id: 'cart',
          text: `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} waiting in your cart`,
          time: 'Now',
          unread: true,
          icon: '🛒',
          link: '/cart',
        });
      }
    } catch {}

    try {
      const { data: orders } = await axios.get(
        https://safeher-backend-uyzs.onrender.com/api/orders/my', { headers });
      orders.slice(0, 3).forEach(order => {
        if (order.status === 'processing') {
          notifs.push({
            id: `order-${order.id}`,
            text: `Order #${order.id} is being processed`,
            time: new Date(order.created_at).toLocaleDateString(),
            unread: true,
            icon: '⚙️',
            link: '/orders',
          });
        }
        if (order.status === 'shipped') {
          notifs.push({
            id: `order-shipped-${order.id}`,
            text: `Order #${order.id} has been shipped! Track your delivery`,
            time: new Date(order.created_at).toLocaleDateString(),
            unread: true,
            icon: '🚚',
            link: '/orders',
          });
        }
        if (order.status === 'delivered') {
          notifs.push({
            id: `order-delivered-${order.id}`,
            text: `Order #${order.id} delivered! Leave a review`,
            time: new Date(order.created_at).toLocaleDateString(),
            unread: false,
            icon: '✅',
            link: '/orders',
          });
        }
      });
    } catch {}

    try {
      const { data: posts } = await axios.get(
        https://safeher-backend-uyzs.onrender.com/api/forum');
      if (posts.length > 0) {
        notifs.push({
          id: 'forum',
          text: `${posts.length} post${posts.length > 1 ? 's' : ''} in the community forum`,
          time: 'Community',
          unread: false,
          icon: '💬',
          link: '/forum',
        });
      }
    } catch {}

    if (notifs.length === 0) {
      notifs.push({
        id: 'welcome',
        text: 'Welcome to SafeHer! Start exploring products',
        time: 'Now',
        unread: false,
        icon: '🌸',
        link: '/',
      });
    }

    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => n.unread).length);
  };

  fetchNotifications();
  const interval = setInterval(fetchNotifications, 30000);
  return () => clearInterval(interval);
}, [user]);

  const linkStyle = (isActive) => ({
    fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
    color: isActive ? '#7F77DD' : '#555',
    padding: '5px 10px', borderRadius: 8,
    background: isActive ? '#f0eeff' : 'transparent',
    transition: 'all 0.2s',
  });

  return (
    <nav style={{ background: '#fff', boxShadow: '0 1px 0 #ede8ff',
      position: 'sticky', top: 0, zIndex: 200 }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 64,
        padding: '0 24px', gap: 12, maxWidth: 1400, margin: '0 auto' }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center',
          gap: 8, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16 }}>🌸</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18,
            fontWeight: 600, color: '#1a1a2e' }}>SafeHer</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          background: '#f7f5ff', borderRadius: 10, padding: '6px 12px',
          border: '1.5px solid #ede8ff', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => {
            const loc = prompt('Enter your city:', location);
            if (loc) setLocation(loc);
          }}>
          <span style={{ fontSize: 13 }}>📍</span>
          <span style={{ fontSize: 12, color: '#7F77DD',
            fontWeight: 500 }}>{location}</span>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, minWidth: 0,
          background: '#f7f5ff', borderRadius: 10,
          border: '1.5px solid #ede8ff', overflow: 'hidden' }}>
          <input placeholder="Search products, sellers, posts..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent',
              padding: '9px 14px', fontSize: 13, outline: 'none' }} />
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            border: 'none', padding: '0 16px', color: '#fff',
            fontSize: 15, cursor: 'pointer' }}>🔍</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center',
          gap: 8, flexShrink: 0 }}>

          {user && (
            <Link to="/cart" style={{ position: 'relative', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: 10,
              background: '#f7f5ff', border: '1.5px solid #ede8ff',
              fontSize: 18, textDecoration: 'none' }}>
              🛒
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6,
                  background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                  color: '#fff', borderRadius: '50%', width: 18, height: 18,
                  fontSize: 10, fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user && (
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button onClick={() => setShowNotifs(!showNotifs)} style={{
                width: 40, height: 40, borderRadius: 10, background: '#f7f5ff',
                border: '1.5px solid #ede8ff', fontSize: 18, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative' }}>
                🔔
                {unreadCount > 0 && (
  <span style={{ position: 'absolute', top: -4, right: -4,
    background: '#E24B4A', color: '#fff', borderRadius: '50%',
    width: 16, height: 16, fontSize: 9, fontWeight: 700,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center' }}>{unreadCount}</span>
)}
              </button>
              {showNotifs && (
                <div style={{ position: 'absolute', top: 48, right: 0, width: 300,
                  background: '#fff', borderRadius: 14,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '0.5px solid #ede8ff', overflow: 'hidden', zIndex: 300 }}>
                  <div style={{ padding: '14px 16px',
                    borderBottom: '1px solid #f0eeff',
                    fontWeight: 600, fontSize: 14 }}>Notifications</div>
                    
                
                  {notifications.length === 0 ? (
  <div style={{ padding: '24px 16px', textAlign: 'center',
    color: '#bbb', fontSize: 13 }}>
    No notifications yet
  </div>
) : notifications.map(n => (
  <div key={n.id}
    onClick={() => { navigate(n.link || '/'); setShowNotifs(false); }}
    style={{ padding: '12px 16px', borderBottom: '1px solid #f9f7ff',
      background: n.unread ? '#fdfcff' : '#fff',
      display: 'flex', gap: 10, alignItems: 'flex-start',
      cursor: 'pointer', transition: 'background 0.15s' }}
    onMouseEnter={e => e.currentTarget.style.background = '#f7f5ff'}
    onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#fdfcff' : '#fff'}>
    <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 13, color: '#333', lineHeight: 1.5 }}>{n.text}</p>
      <p style={{ fontSize: 11, color: '#bbb', marginTop: 3 }}>{n.time}</p>
    </div>
    {n.unread && (
      <div style={{ width: 8, height: 8, borderRadius: '50%',
        background: '#7F77DD', flexShrink: 0, marginTop: 4 }} />
    )}
  </div>
))}
                </div>
              )}
            </div>
          )}

          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#f7f5ff', border: '1.5px solid #ede8ff',
                padding: '6px 12px 6px 6px', borderRadius: 12, cursor: 'pointer' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 600 }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#444',
                  maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap' }}>{user.name}</span>
                <span style={{ fontSize: 10, color: '#aaa' }}>▼</span>
              </button>

              {showUserMenu && (
                <div style={{ position: 'absolute', top: 48, right: 0, width: 220,
                  background: '#fff', borderRadius: 14,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '0.5px solid #ede8ff', overflow: 'hidden', zIndex: 300 }}>
                  <div style={{ padding: '14px 16px',
                    borderBottom: '1px solid #f0eeff',
                    background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)' }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</p>
                    <span style={{ fontSize: 11, background: '#fff', color: '#7F77DD',
                      padding: '2px 8px', borderRadius: 10, fontWeight: 500,
                      display: 'inline-block', marginTop: 4 }}>{user.role}</span>
                  </div>
                  {[
                    { icon: '📦', label: 'My Orders', to: '/orders' },
                    { icon: '❤️', label: 'Saved Items', to: '/saved' },
                    { icon: '💬', label: 'Support', to: '/support' },
                    ...(user.role === 'seller'
                      ? [{ icon: '🏪', label: 'My Shop', to: '/seller' }] : []),
                    ...(user.role === 'admin'
                      ? [{ icon: '⚙️', label: 'Admin Panel', to: '/admin' }] : []),
                  ].map(item => (
                    <Link key={item.to} to={item.to}
                      onClick={() => setShowUserMenu(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 16px', fontSize: 13, color: '#444',
                        borderBottom: '1px solid #f9f7ff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#faf9ff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span>{item.icon}</span>{item.label}
                    </Link>
                  ))}
                  <button onClick={() => { setShowUserMenu(false); logout(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 16px', fontSize: 13, color: '#E24B4A',
                      width: '100%', background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" style={{ fontSize: 13, fontWeight: 500,
                color: '#555', padding: '8px 16px', borderRadius: 10,
                border: '1.5px solid #ede8ff', background: '#fff' }}>Login</Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', padding: '8px 16px', borderRadius: 10,
                fontSize: 13, fontWeight: 500 }}>Register</Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav Links */}
      <div style={{ borderTop: '1px solid #f0eeff', background: '#fff',
        overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4,
          padding: '0 24px', height: 44, maxWidth: 1400, margin: '0 auto' }}>
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              style={({ isActive }) => linkStyle(isActive)}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

function ComingSoon({ title, icon, desc }) {
  return (
    <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center',
      padding: '0 24px' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>{icon}</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32,
        fontWeight: 600, marginBottom: 12 }}>{title}</h2>
      <p style={{ color: '#888', fontSize: 16, lineHeight: 1.7,
        marginBottom: 28 }}>{desc}</p>
      <div style={{ display: 'inline-block',
        background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
        color: '#fff', padding: '10px 24px', borderRadius: 12,
        fontSize: 14, fontWeight: 500 }}>Coming Soon 🚀</div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/funding" element={<Funding />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/support" element={<Support />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/saved" element={<ComingSoon title="Saved Items"
            icon="❤️" desc="Your wishlist feature is coming soon." />} />
          <Route path="/profile" element={<ComingSoon title="My Profile"
            icon="👤" desc="Your profile page is coming soon." />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
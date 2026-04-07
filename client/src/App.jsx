import {
  BrowserRouter, Routes, Route, Link, NavLink,
  useNavigate, useLocation
} from 'react-router-dom';
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
import SavedItems from './pages/SavedItems';

const API = 'https://safeher-backend-uyzs.onrender.com';

function NavbarInner() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [city, setCity] = useState('India');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          setCity(
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            'India'
          );
        } catch { setCity('India'); }
      }, () => setCity('India'));
    }
  }, []);

  useEffect(() => {
    if (user) {
      axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(r => setCartCount(r.data.length)).catch(() => {});
    } else setCartCount(0);
  }, [user, location.pathname]);

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

  useEffect(() => {
    if (!user) { setNotifications([]); setUnreadCount(0); return; }
    const fetchNotifs = async () => {
      const h = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const notifs = [];
      try {
        const { data: c } = await axios.get(`${API}/api/cart`, { headers: h });
        if (c.length > 0) notifs.push({
          id: 'cart',
          text: `${c.length} item${c.length > 1 ? 's' : ''} in your cart`,
          time: 'Now', unread: true, icon: '🛒', link: '/cart'
        });
      } catch {}
      try {
        const { data: o } = await axios.get(`${API}/api/orders/my`, { headers: h });
        o.slice(0, 2).forEach(order => {
          if (order.status === 'shipped') notifs.push({
            id: `s-${order.id}`,
            text: `Order #${order.id} is on its way! 🚚`,
            time: new Date(order.created_at).toLocaleDateString(),
            unread: true, icon: '🚚', link: '/orders'
          });
          if (order.status === 'delivered') notifs.push({
            id: `d-${order.id}`,
            text: `Order #${order.id} delivered. Leave a review!`,
            time: new Date(order.created_at).toLocaleDateString(),
            unread: false, icon: '✅', link: '/orders'
          });
        });
      } catch {}
      if (notifs.length === 0) notifs.push({
        id: 'w', text: 'Welcome to SafeHer! Start exploring.',
        time: 'Now', unread: false, icon: '🌸', link: '/'
      });
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => n.unread).length);
    };
    fetchNotifs();
    const t = setInterval(fetchNotifs, 30000);
    return () => clearInterval(t);
  }, [user]);

  if (hideNavbar) return null;

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

  const menuItems = [
    { icon: '👤', label: 'My Profile', to: '/profile' },
    { icon: '📦', label: 'My Orders', to: '/orders' },
    { icon: '❤️', label: 'Saved Items', to: '/saved' },
    { icon: '💬', label: 'Support', to: '/support' },
    ...(user?.role === 'seller' ? [
      { icon: '🏪', label: 'My Shop', to: '/seller' },
      { icon: '📊', label: 'Analytics', to: '/seller/analytics' },
      { icon: '📋', label: 'Orders', to: '/seller/orders' },
    ] : []),
    ...(user?.role === 'admin' ? [
      { icon: '⚙️', label: 'Admin Panel', to: '/admin' }
    ] : []),
  ];

  const navBg = scrolled
    ? 'rgba(20,12,30,0.92)'
    : 'rgba(20,12,30,0.85)';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: navBg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      transition: 'background 0.3s ease',
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
    }}>
      {/* Top bar */}
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 clamp(12px,3vw,24px)',
        height: 64, display: 'flex',
        alignItems: 'center', gap: 10,
      }}>

        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 9,
          flexShrink: 0, marginRight: 4, textDecoration: 'none',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16,
            boxShadow: '0 4px 12px rgba(139,111,191,0.4)',
          }}>🌸</div>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 20, fontWeight: 700, color: '#fff',
              letterSpacing: '-0.3px',
            }}>SafeHer</div>
            <div style={{
              fontSize: 9, color: '#D4A853', fontWeight: 700,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}>Marketplace</div>
          </div>
        </Link>

        {/* Location — hide on mobile */}
        <div
          onClick={() => {
            const l = prompt('Enter your city:', city);
            if (l) setCity(l);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '6px 10px',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer', flexShrink: 0,
            transition: 'background 0.2s',
          }}
          className="hide-mobile"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          <span style={{ fontSize: 13 }}>📍</span>
          <span style={{
            fontSize: 11.5, color: '#D4A853', fontWeight: 600,
            maxWidth: 70, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{city}</span>
        </div>

        {/* Search */}
        <form
          onSubmit={e => {
            e.preventDefault();
            if (search.trim())
              navigate(`/?search=${encodeURIComponent(search)}`);
          }}
          style={{
            flex: 1, minWidth: 0, display: 'flex',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)',
            overflow: 'hidden', transition: 'border-color 0.2s',
          }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(139,111,191,0.6)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
        >
          <input
            placeholder="Search handcrafted products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              padding: '10px 14px', fontSize: 13, outline: 'none',
              color: '#fff', fontFamily: 'inherit',
            }}
          />
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
            border: 'none', padding: '0 16px', color: '#fff',
            fontSize: 14, cursor: 'pointer', flexShrink: 0,
          }}>🔍</button>
        </form>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* Cart */}
          {user && (
            <Link to="/cart" style={{
              position: 'relative', width: 40, height: 40,
              borderRadius: 10, background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 17,
              textDecoration: 'none', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -5, right: -5,
                  background: 'linear-gradient(135deg, #E8763A, #D4A853)',
                  color: '#fff', borderRadius: '50%',
                  width: 18, height: 18, fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid rgba(20,12,30,0.9)',
                }}>{cartCount}</span>
              )}
            </Link>
          )}

          {/* Notifications */}
          {user && (
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: 17, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                  position: 'relative', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -5, right: -5,
                    background: '#E24B4A', color: '#fff', borderRadius: '50%',
                    width: 16, height: 16, fontSize: 9, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid rgba(20,12,30,0.9)',
                  }}>{unreadCount}</span>
                )}
              </button>

              {showNotifs && (
                <div style={{
                  position: 'absolute', top: 50, right: 0, width: 300,
                  background: '#1E1230', borderRadius: 16,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  overflow: 'hidden', zIndex: 300,
                  animation: 'slideDown 0.2s ease',
                }}>
                  <div style={{
                    padding: '13px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span style={{ fontSize: 11, color: '#D4A853', fontWeight: 600 }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => { navigate(n.link || '/'); setShowNotifs(false); }}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: n.unread
                          ? 'rgba(139,111,191,0.1)' : 'transparent',
                        display: 'flex', gap: 10, cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(139,111,191,0.1)' : 'transparent'}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: 'rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 15, flexShrink: 0,
                      }}>{n.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12.5, color: '#E8E0F0', lineHeight: 1.5 }}>
                          {n.text}
                        </p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                          {n.time}
                        </p>
                      </div>
                      {n.unread && (
                        <div style={{ width: 7, height: 7, borderRadius: '50%',
                          background: '#8B6FBF', flexShrink: 0, marginTop: 5 }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User menu or auth buttons */}
          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: showUserMenu
                    ? 'rgba(139,111,191,0.3)'
                    : 'rgba(255,255,255,0.08)',
                  border: `1.5px solid ${showUserMenu
                    ? 'rgba(139,111,191,0.6)'
                    : 'rgba(255,255,255,0.12)'}`,
                  padding: '6px 12px 6px 6px', borderRadius: 11,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,111,191,0.2)'}
                onMouseLeave={e => {
                  if (!showUserMenu)
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 12, fontWeight: 700,
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: '#fff',
                  maxWidth: 70, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }} className="hide-mobile">
                  {user.name.split(' ')[0]}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
                  style={{
                    transition: 'transform 0.2s',
                    transform: showUserMenu ? 'rotate(180deg)' : 'none',
                  }}>
                  <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: 50, right: 0, width: 230,
                  background: '#1E1230', borderRadius: 16,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  overflow: 'hidden', zIndex: 300,
                  animation: 'slideDown 0.2s ease',
                }}>
                  {/* User info */}
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, rgba(139,111,191,0.2), rgba(196,88,122,0.15))',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 10,
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>
                      {user.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                      {user.email}
                    </p>
                    <span style={{
                      display: 'inline-block', marginTop: 8,
                      background: 'rgba(139,111,191,0.25)',
                      color: '#C4A8E8', fontSize: 11, fontWeight: 700,
                      padding: '3px 10px', borderRadius: 20,
                      textTransform: 'capitalize', border: '1px solid rgba(139,111,191,0.3)',
                    }}>{user.role}</span>
                  </div>

                  {/* Menu items */}
                  {menuItems.map(item => (
                    <Link
                      key={item.to} to={item.to}
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 16px', fontSize: 13.5,
                        color: 'rgba(255,255,255,0.75)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.15s', fontWeight: 500,
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(139,111,191,0.15)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                        e.currentTarget.style.paddingLeft = '16px';
                      }}
                    >
                      <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 16px', fontSize: 13.5,
                      color: '#FF6B6B', width: '100%',
                      background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" style={{
                fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                padding: '9px 16px', borderRadius: 10,
                border: '1.5px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.06)',
                transition: 'all 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                Sign In
              </Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
                color: '#fff', padding: '9px 16px', borderRadius: 10,
                fontSize: 13, fontWeight: 600,
                boxShadow: '0 4px 14px rgba(139,111,191,0.35)',
                transition: 'all 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,111,191,0.5)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(139,111,191,0.35)'}
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav links */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.2)',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 clamp(12px,3vw,24px)',
          display: 'flex', alignItems: 'center', gap: 2,
          height: 38, width: 'max-content', minWidth: '100%',
        }}>
          {navLinks.map(link => (
            <NavLink
              key={link.to} to={link.to} end={link.end}
              style={({ isActive }) => ({
                fontSize: 12.5, fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap', padding: '4px 14px',
                borderRadius: 20, transition: 'all 0.2s',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                background: isActive
                  ? 'linear-gradient(135deg, #8B6FBF, #C4587A)'
                  : 'transparent',
                boxShadow: isActive
                  ? '0 2px 10px rgba(139,111,191,0.3)' : 'none',
                textDecoration: 'none',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

function ComingSoon({ title, icon }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16,
      padding: '0 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, animation: 'float 3s ease-in-out infinite' }}>
        {icon}
      </div>
      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: 32,
        fontWeight: 700, color: 'var(--text-primary)',
      }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
        Coming soon — we're crafting something beautiful
      </p>
      <Link to="/" style={{
        background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
        color: '#fff', padding: '12px 28px', borderRadius: 14,
        fontWeight: 600, fontSize: 14,
        boxShadow: '0 4px 16px rgba(139,111,191,0.3)',
        textDecoration: 'none',
      }}>
        Back to Home
      </Link>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <NavbarInner />
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
        <Route path="/saved" element={<SavedItems />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
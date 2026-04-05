import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const API = 'https://safeher-backend-uyzs.onrender.com';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--grad-bg)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,111,191,0.2) 0%, transparent 70%)',
        top: '-15%', left: '-10%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,88,122,0.15) 0%, transparent 70%)',
        bottom: '-10%', right: '-5%', pointerEvents: 'none', zIndex: 0 }} />

      {/* Left panel — hide on mobile */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: 'clamp(32px,5vw,64px)',
        position: 'relative', zIndex: 1,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }} className="hide-mobile">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center',
          gap: 10, marginBottom: 48, textDecoration: 'none' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12,
            background: 'var(--grad-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 20,
            boxShadow: '0 6px 20px rgba(139,111,191,0.4)' }}>🌸</div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif',
              fontSize: 22, fontWeight: 700, color: '#fff' }}>SafeHer</div>
            <div style={{ fontSize: 9, color: 'var(--gold)', fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase' }}>Marketplace</div>
          </div>
        </Link>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#fff',
          lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.5px' }}>
          Empowering India's<br />
          <span style={{ background: 'var(--grad-gold)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text' }}>Women Entrepreneurs</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16,
          lineHeight: 1.8, maxWidth: 400, marginBottom: 40 }}>
          Join thousands of women building their businesses, finding support and growing together across India.
        </p>

        {[
          { icon: '🛍️', title: 'Shop Handcrafted Products', desc: 'Directly from women artisans' },
          { icon: '🏪', title: 'Sell Your Creations', desc: 'Reach customers across India' },
          { icon: '💬', title: 'Community & Support', desc: 'Connect with other entrepreneurs' },
        ].map(f => (
          <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14,
            marginBottom: 16, padding: '14px 16px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: 'rgba(139,111,191,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18 }}>{f.icon}</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{f.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right panel — login form */}
      <div style={{
        width: '100%', maxWidth: 480,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(20px,5vw,48px)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <Link to="/" style={{ display: 'none', alignItems: 'center', gap: 9,
            marginBottom: 32, textDecoration: 'none' }}
            className="show-mobile">
            <div style={{ width: 38, height: 38, borderRadius: 10,
              background: 'var(--grad-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌸</div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif',
              fontSize: 22, fontWeight: 700, color: '#fff' }}>SafeHer</span>
          </Link>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 34,
              fontWeight: 700, color: '#fff', marginBottom: 8 }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              New here?{' '}
              <Link to="/register" style={{ color: 'var(--primary)',
                fontWeight: 700, textDecoration: 'none' }}>
                Create a free account →
              </Link>
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(226,75,74,0.12)',
              border: '1px solid rgba(226,75,74,0.35)',
              color: '#FF9090', padding: '12px 16px', borderRadius: 10,
              fontSize: 13.5, marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off"
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700,
                color: 'var(--text-muted)', marginBottom: 7, letterSpacing: 0.8,
                textTransform: 'uppercase' }}>Email Address</label>
              <input placeholder="you@example.com" type="email"
                autoComplete="new-email"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700,
                color: 'var(--text-muted)', marginBottom: 7, letterSpacing: 0.8,
                textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  placeholder="Enter your password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: 48 }}
                  required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', color: 'var(--text-muted)', fontSize: 16,
                    cursor: 'pointer', padding: 0 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? 'rgba(255,255,255,0.1)' : 'var(--grad-primary)',
              color: loading ? 'var(--text-muted)' : '#fff',
              border: 'none', padding: '15px',
              borderRadius: 13, fontSize: 15, fontWeight: 700,
              marginTop: 4, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 24px rgba(139,111,191,0.4)',
              transition: 'all 0.25s', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </>
              ) : 'Sign In to SafeHer →'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '14px 16px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 12, border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🔒</span>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Your data is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
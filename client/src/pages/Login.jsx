import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const API = 'https://safeher-backend-uyzs.onrender.com';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      background: '#f7f5ff',
    }}>

      {/* Left Panel */}
      <div style={{
        background: 'linear-gradient(135deg, #7F77DD 0%, #D4537E 100%)',
        padding: 'clamp(32px, 5vw, 60px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 280,
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240,
          height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 200,
          height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center',
            gap: 10, marginBottom: 40, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20 }}>🌸</div>
            <span style={{ color: '#fff', fontFamily: 'Playfair Display, serif',
              fontSize: 22, fontWeight: 600 }}>SafeHer</span>
          </Link>
          <h1 style={{ color: '#fff', fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700,
            lineHeight: 1.3, marginBottom: 16 }}>
            Empowering Women<br />Entrepreneurs
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15,
            lineHeight: 1.8, maxWidth: 360 }}>
            Join thousands of women building their businesses,
            finding support and growing together.
          </p>
          <div style={{ display: 'flex', gap: 20, marginTop: 32,
            flexWrap: 'wrap' }}>
            {[
              { icon: '🛍️', label: 'Shop Products' },
              { icon: '🏪', label: 'Sell Online' },
              { icon: '💬', label: 'Community' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center',
                gap: 8, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 'clamp(24px, 4vw, 48px)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
              fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>
              Welcome back
            </h2>
            <p style={{ color: '#888', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#7F77DD', fontWeight: 600 }}>
                Sign up free
              </Link>
            </p>
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0',
              color: '#c0392b', padding: '12px 16px', borderRadius: 10,
              fontSize: 13, marginBottom: 20, display: 'flex',
              alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            autoComplete="off">
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
                color: '#444', marginBottom: 6 }}>Email address</label>
              <input placeholder="you@example.com" type="email"
                autoComplete="new-email"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
                color: '#444', marginBottom: 6 }}>Password</label>
              <input placeholder="Enter your password" type="password"
                autoComplete="new-password"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required />
            </div>
            <button type="submit" disabled={loading} style={{
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              color: '#fff', border: 'none', padding: '14px',
              borderRadius: 12, fontSize: 15, fontWeight: 600,
              marginTop: 4, opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s' }}>
              {loading ? 'Logging in...' : 'Login to SafeHer →'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: 16, background: '#f7f5ff',
            borderRadius: 12, border: '1px solid #ede8ff' }}>
            <p style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
              🔒 Your data is safe and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
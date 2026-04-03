import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link }from 'react-router-dom';import API from '../api';

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
      const { data } = await axios.post(
        'https://safeher-backend-uyzs.onrender.com/api/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16,
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24 }}>🌸</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
            fontWeight: 600, marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: '#888', fontSize: 14 }}>
            Login to your SafeHer account
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 32,
          boxShadow: '0 4px 32px rgba(127,119,221,0.12)' }}>
          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0',
              color: '#c0392b', padding: '10px 14px', borderRadius: 10,
              fontSize: 13, marginBottom: 16 }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                display: 'block', marginBottom: 6 }}>Email address</label>
              <input placeholder="you@example.com" type="email"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                display: 'block', marginBottom: 6 }}>Password</label>
              <input placeholder="••••••••" type="password"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required />
            </div>
            <button type="submit" disabled={loading} style={{
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              color: '#fff', border: 'none', padding: '13px',
              borderRadius: 12, fontSize: 15, fontWeight: 600,
              marginTop: 4, opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p style={{ marginTop: 20, textAlign: 'center',
            color: '#888', fontSize: 14 }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#7F77DD', fontWeight: 500 }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
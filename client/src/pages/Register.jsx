import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = 'https://safeher-backend-uyzs.onrender.com';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'buyer'
  });
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter your name');
    if (!form.email.trim()) return setError('Please enter your email');
    if (!form.password || form.password.length < 6)
      return setError('Password must be at least 6 characters');
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const { data } = await axios.post(
        `${API}/api/auth/register/send-otp`,
        { email: form.email.trim() }
      );
      setMsg(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6)
      return setError('Please enter the 6-digit OTP');
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/auth/register`, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        otp: otp.trim(),
      });
      setMsg('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'buyer', label: '🛍️ Buyer', desc: 'Shop from women entrepreneurs' },
    { value: 'seller', label: '🏪 Seller', desc: 'Sell your handmade products' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #140C1E 0%, #2D1040 50%, #1A0A28 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 'clamp(16px, 4vw, 40px)',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(107,79,160,0.25) 0%, transparent 70%)',
        top: '-15%', left: '-10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,88,122,0.2) 0%, transparent 70%)',
        bottom: '-10%', right: '-5%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center',
            gap: 10, textDecoration: 'none', marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13,
              background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 8px 24px rgba(139,111,191,0.4)' }}>🌸</div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif',
              fontSize: 26, fontWeight: 700, color: '#fff' }}>SafeHer</span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
            {step === 1
              ? 'Create your free account'
              : `Enter the OTP sent to ${form.email}`}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: step >= s
                  ? 'linear-gradient(135deg, #8B6FBF, #C4587A)'
                  : 'rgba(255,255,255,0.1)',
                color: step >= s ? '#fff' : 'rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 13, fontWeight: 700,
                border: step >= s
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.3s',
              }}>{s}</div>
              {s < 2 && (
                <div style={{ width: 50, height: 2, borderRadius: 2,
                  background: step > s
                    ? 'linear-gradient(90deg, #8B6FBF, #C4587A)'
                    : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.12)',
          padding: 'clamp(20px, 4vw, 32px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>

          {msg && (
            <div style={{
              background: 'rgba(45,155,111,0.15)',
              border: '1px solid rgba(45,155,111,0.4)',
              color: '#7DEBB5', padding: '11px 14px',
              borderRadius: 10, fontSize: 13, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>✅ {msg}</div>
          )}
          {error && (
            <div style={{
              background: 'rgba(226,75,74,0.15)',
              border: '1px solid rgba(226,75,74,0.4)',
              color: '#FF8A8A', padding: '11px 14px',
              borderRadius: 10, fontSize: 13, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>⚠️ {error}</div>
          )}

          {step === 1 ? (
            <form onSubmit={sendOTP}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600,
                  color: 'rgba(255,255,255,0.6)', marginBottom: 6,
                  letterSpacing: 0.3 }}>FULL NAME</label>
                <input
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.08)',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    color: '#fff', borderRadius: 12, padding: '13px 16px',
                    fontSize: 14, width: '100%', outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,111,191,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600,
                  color: 'rgba(255,255,255,0.6)', marginBottom: 6,
                  letterSpacing: 0.3 }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  autoComplete="new-email"
                  style={{ background: 'rgba(255,255,255,0.08)',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    color: '#fff', borderRadius: 12, padding: '13px 16px',
                    fontSize: 14, width: '100%', outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,111,191,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600,
                  color: 'rgba(255,255,255,0.6)', marginBottom: 6,
                  letterSpacing: 0.3 }}>PASSWORD</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                  style={{ background: 'rgba(255,255,255,0.08)',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    color: '#fff', borderRadius: 12, padding: '13px 16px',
                    fontSize: 14, width: '100%', outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,111,191,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600,
                  color: 'rgba(255,255,255,0.6)', marginBottom: 8,
                  letterSpacing: 0.3 }}>JOIN AS</label>
                <div style={{ display: 'grid',
                  gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {roles.map(r => (
                    <div key={r.value}
                      onClick={() => setForm({ ...form, role: r.value })}
                      style={{
                        border: `2px solid ${form.role === r.value
                          ? 'rgba(139,111,191,0.8)'
                          : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: 12, padding: '12px 14px',
                        cursor: 'pointer',
                        background: form.role === r.value
                          ? 'rgba(139,111,191,0.15)'
                          : 'rgba(255,255,255,0.04)',
                        transition: 'all 0.2s',
                      }}>
                      <div style={{ fontWeight: 700, fontSize: 14,
                        color: form.role === r.value
                          ? '#C4A8E8' : 'rgba(255,255,255,0.8)',
                        marginBottom: 3 }}>{r.label}</div>
                      <div style={{ fontSize: 11,
                        color: 'rgba(255,255,255,0.4)' }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
                color: '#fff', border: 'none', padding: '14px',
                borderRadius: 12, fontSize: 15, fontWeight: 700,
                marginTop: 4, opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 6px 20px rgba(139,111,191,0.35)',
                transition: 'all 0.2s',
              }}>
                {loading ? '⏳ Sending OTP...' : 'Send Verification Code →'}
              </button>
            </form>

          ) : (
            <form onSubmit={verifyAndRegister}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div style={{ background: 'rgba(139,111,191,0.1)',
                border: '1px solid rgba(139,111,191,0.3)',
                borderRadius: 12, padding: '12px 16px',
                color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                📧 OTP sent to <strong style={{ color: '#C4A8E8' }}>{form.email}</strong>
                <br />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)',
                  marginTop: 4, display: 'block' }}>
                  Check inbox and spam folder. May take 1-2 minutes.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600,
                  color: 'rgba(255,255,255,0.6)', marginBottom: 8,
                  letterSpacing: 0.3 }}>ENTER 6-DIGIT OTP</label>
                <input
                  placeholder="_ _ _ _ _ _"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    color: '#fff', borderRadius: 12,
                    padding: '16px', fontSize: 28, letterSpacing: 12,
                    textAlign: 'center', fontWeight: 800, width: '100%',
                    outline: 'none', fontFamily: 'monospace',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,111,191,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  required
                />
              </div>

              <button type="submit" disabled={loading} style={{
                background: 'linear-gradient(135deg, #2D9B6F, #1A7A50)',
                color: '#fff', border: 'none', padding: '14px',
                borderRadius: 12, fontSize: 15, fontWeight: 700,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 6px 20px rgba(45,155,111,0.3)',
              }}>
                {loading ? '⏳ Verifying...' : '✓ Verify & Create Account'}
              </button>

              <button type="button"
                onClick={() => {
                  setStep(1); setError('');
                  setMsg(''); setOtp('');
                }}
                style={{ background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.5)', fontSize: 13,
                  cursor: 'pointer', fontFamily: 'inherit',
                  padding: '8px', textDecoration: 'underline' }}>
                ← Use a different email
              </button>
            </form>
          )}

          <p style={{ marginTop: 20, textAlign: 'center',
            color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#C4A8E8',
              fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = 'https://safeher-backend-uyzs.onrender.com';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ❌ DELETE LINES 13-15 - they don't belong here
  // const response = await axios.post(`${API}/api/auth/register/send-otp`, { email });
  // console.log('Check server console for OTP:', response.data);
  const sendOTP = async (e) => {
  e.preventDefault();
  if (!form.name || !form.email || !form.password)
    return setError('Please fill in all fields');
  setLoading(true);
  setError('');
  try {
    const response = await axios.post(`${API}/api/auth/register/send-otp`, { email: form.email });
    // THIS WILL SHOW THE OTP IN YOUR BROWSER CONSOLE
    console.log('🔐 YOUR OTP IS:', response.data.otp || response.data);
    // Also show an alert with the OTP (temporary)
    if (response.data.otp) {
      alert(`Your OTP is: ${response.data.otp}`);
    }
    setMsg(`OTP sent to ${form.email}. Check console for OTP.`);
    setStep(2);
  } catch (err) {
    setError(err.response?.data?.message || 'Could not send OTP');
  } finally {
    setLoading(false);
  }
};

  const verifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/auth/register`, { ...form, otp });
      setMsg('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'buyer', label: '🛍️ Buyer', desc: 'Shop from women entrepreneurs' },
    { value: 'seller', label: '🏪 Seller', desc: 'Sell your products here' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16,
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24 }}>🌸</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
            fontWeight: 600, marginBottom: 8 }}>
            {step === 1 ? 'Join SafeHer' : 'Verify Your Email'}
          </h2>
          <p style={{ color: '#888', fontSize: 14 }}>
            {step === 1
              ? 'Be part of our women entrepreneurship community'
              : `Enter the 6-digit OTP sent to ${form.email}`}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%',
                background: step >= s
                  ? 'linear-gradient(135deg, #7F77DD, #D4537E)' : '#f0eeff',
                color: step >= s ? '#fff' : '#aaa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700 }}>{s}</div>
              {s < 2 && (
                <div style={{ width: 40, height: 2,
                  background: step > s ? '#7F77DD' : '#f0eeff' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 32,
          boxShadow: '0 4px 32px rgba(127,119,221,0.12)' }}>

          {msg && (
            <div style={{ background: '#f0fff4', border: '1px solid #b2f5d0',
              color: '#276749', padding: '10px 14px', borderRadius: 10,
              fontSize: 13, marginBottom: 16 }}>{msg}</div>
          )}
          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0',
              color: '#c0392b', padding: '10px 14px', borderRadius: 10,
              fontSize: 13, marginBottom: 16 }}>{error}</div>
          )}

          {step === 1 ? (
            <form onSubmit={sendOTP}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 6 }}>Full Name</label>
                <input placeholder="Your full name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 6 }}>Email address</label>
                <input placeholder="you@example.com" type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  autoComplete="new-email" required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 6 }}>Password</label>
                <input placeholder="Min 6 characters" type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password" required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 8 }}>I want to join as</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {roles.map(r => (
                    <div key={r.value}
                      onClick={() => setForm({ ...form, role: r.value })}
                      style={{ border: `2px solid ${form.role === r.value ? '#7F77DD' : '#ede8ff'}`,
                        borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                        background: form.role === r.value ? '#f0eeff' : '#fff',
                        transition: 'all 0.2s' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#999' }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} style={{
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', border: 'none', padding: '13px',
                borderRadius: 12, fontSize: 15, fontWeight: 600,
                marginTop: 4, opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending OTP...' : 'Send Verification Code →'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyAndRegister}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 6 }}>Enter 6-digit OTP</label>
                <input placeholder="123456" type="text" maxLength={6}
                  value={otp} onChange={e => setOtp(e.target.value)}
                  style={{ fontSize: 28, letterSpacing: 10,
                    textAlign: 'center', fontWeight: 700 }}
                  required />
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>
                  Check your inbox and spam folder
                </p>
              </div>
              <button type="submit" disabled={loading} style={{
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', border: 'none', padding: '13px',
                borderRadius: 12, fontSize: 15, fontWeight: 600,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Verifying...' : 'Verify & Create Account ✓'}
              </button>
              <button type="button"
                onClick={() => { setStep(1); setError(''); setMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#7F77DD',
                  fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Back
              </button>
            </form>
          )}

          {step === 1 && (
            <p style={{ marginTop: 20, textAlign: 'center', color: '#888', fontSize: 14 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#7F77DD', fontWeight: 500 }}>
                Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
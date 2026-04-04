import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API = 'https://safeher-backend-uyzs.onrender.com';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '' });
  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: ''
  });
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const token = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const updateName = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API}/api/auth/update-profile`,
        { name: form.name }, token());
      const updatedUser = { ...user, name: form.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(localStorage.getItem('token'), updatedUser);
      showToast('Name updated successfully! ✅');
    } catch {
      setError('Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm)
      return setError('New passwords do not match');
    if (passwords.newPass.length < 6)
      return setError('Password must be at least 6 characters');
    setLoading(true);
    setError('');
    try {
      await axios.put(`${API}/api/auth/update-password`, {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      }, token());
      setPasswords({ current: '', newPass: '', confirm: '' });
      showToast('Password updated successfully! ✅');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'password', label: '🔒 Password' },
    { id: 'danger', label: '⚠️ Account' },
  ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto',
      padding: 'clamp(16px, 3vw, 32px) clamp(12px, 3vw, 24px) 80px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 16,
          background: '#1a1a2e', color: '#fff', padding: '12px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 500,
          zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxWidth: 300 }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ background: '#fff', borderRadius: 20, padding: 28,
        boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
        border: '0.5px solid #f0eeff', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 20,
        flexWrap: 'wrap' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 28, fontWeight: 700, flexShrink: 0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24,
            fontWeight: 600, marginBottom: 4 }}>{user?.name}</h1>
          <p style={{ fontSize: 14, color: '#888' }}>{user?.email}</p>
          <span style={{ display: 'inline-block', marginTop: 6,
            background: '#f0eeff', color: '#7F77DD',
            fontSize: 12, fontWeight: 600, padding: '3px 12px',
            borderRadius: 20 }}>{user?.role}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20,
        flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setError(''); }}
            style={{ padding: '9px 18px', borderRadius: 10, fontSize: 13,
              fontWeight: 500, cursor: 'pointer',
              border: `1.5px solid ${tab === t.id ? '#7F77DD' : '#ede8ff'}`,
              background: tab === t.id ? '#f0eeff' : '#fff',
              color: tab === t.id ? '#7F77DD' : '#888',
              fontFamily: 'inherit' }}>
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0',
          color: '#c0392b', padding: '12px 16px', borderRadius: 10,
          fontSize: 13, marginBottom: 16 }}>{error}</div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
          border: '0.5px solid #f0eeff' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
            Edit Profile
          </h2>
          <form onSubmit={updateName}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13,
                fontWeight: 600, color: '#444', marginBottom: 6 }}>
                Full Name
              </label>
              <input value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13,
                fontWeight: 600, color: '#444', marginBottom: 6 }}>
                Email Address
              </label>
              <input value={user?.email} disabled
                style={{ background: '#f7f5ff', color: '#aaa',
                  cursor: 'not-allowed' }} />
              <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                Email cannot be changed
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13,
                fontWeight: 600, color: '#444', marginBottom: 6 }}>
                Account Type
              </label>
              <input value={user?.role} disabled
                style={{ background: '#f7f5ff', color: '#aaa',
                  cursor: 'not-allowed', textTransform: 'capitalize' }} />
            </div>
            <button type="submit" disabled={loading} style={{
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              color: '#fff', border: 'none', padding: '13px',
              borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
          border: '0.5px solid #f0eeff' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
            Change Password
          </h2>
          <form onSubmit={updatePassword}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13,
                fontWeight: 600, color: '#444', marginBottom: 6 }}>
                Current Password
              </label>
              <input type="password" placeholder="Enter current password"
                value={passwords.current}
                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13,
                fontWeight: 600, color: '#444', marginBottom: 6 }}>
                New Password
              </label>
              <input type="password" placeholder="Min 6 characters"
                value={passwords.newPass}
                onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13,
                fontWeight: 600, color: '#444', marginBottom: 6 }}>
                Confirm New Password
              </label>
              <input type="password" placeholder="Repeat new password"
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                required />
            </div>
            <button type="submit" disabled={loading} style={{
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              color: '#fff', border: 'none', padding: '13px',
              borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* Danger Zone Tab */}
      {tab === 'danger' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
          border: '1px solid #ffd0d0' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8,
            color: '#E24B4A' }}>⚠️ Danger Zone</h2>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>
            These actions are irreversible. Please proceed with caution.
          </p>
          <button onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) logout();
          }} style={{ display: 'block', width: '100%', marginBottom: 12,
            background: '#fff0f0', border: '1.5px solid #ffd0d0',
            color: '#E24B4A', padding: '12px', borderRadius: 10,
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'inherit' }}>
            🚪 Logout from all devices
          </button>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API = 'https://safeher-backend-uyzs.onrender.com';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const token = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    axios.get(`${API}/api/admin/users`, token()).then(r => setUsers(r.data));
    axios.get(`${API}/api/admin/orders`, token()).then(r => setOrders(r.data));
  }, []);

  const updateRole = async (id, role) => {
    await axios.put(`${API}/api/admin/users/${id}/role`, { role }, token());
    showToast('Role updated!');
    axios.get(`${API}/api/admin/users`, token()).then(r => setUsers(r.data));
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Remove ${name} from SafeHer? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/api/admin/users/${id}`, token());
      showToast('User removed successfully');
      axios.get(`${API}/api/admin/users`, token()).then(r => setUsers(r.data));
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not remove user');
    }
  };

  const updateOrderStatus = async (id, status) => {
    await axios.put(`${API}/api/admin/orders/${id}/status`, { status }, token());
    showToast('Order status updated!');
    axios.get(`${API}/api/admin/orders`, token()).then(r => setOrders(r.data));
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: '👥' },
    { label: 'Sellers', value: users.filter(u => u.role === 'seller').length, icon: '🏪' },
    { label: 'Buyers', value: users.filter(u => u.role === 'buyer').length, icon: '🛍️' },
    { label: 'Total Orders', value: orders.length, icon: '📦' },
  ];

  const roleColor = {
    buyer:  { bg: 'rgba(24,95,165,0.2)',  color: '#7AB8F5' },
    seller: { bg: 'rgba(15,110,86,0.2)',  color: '#7DEBB5' },
    admin:  { bg: 'rgba(196,88,122,0.2)', color: '#F0A0C0' },
  };

  const statusColor = {
    pending:    '#D4A853',
    processing: '#8B6FBF',
    shipped:    '#2D9B6F',
    delivered:  '#7AB8F5',
    cancelled:  '#FF8A8A',
  };

  // shared styles
  const tableCard = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--border-strong)',
    borderRadius: 16, overflow: 'hidden',
  };

  const th = {
    padding: '12px 20px', textAlign: 'left',
    fontSize: 11, fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: 0.8,
    background: 'rgba(139,111,191,0.08)',
    borderBottom: '1px solid var(--border)',
  };

  const tdBase = {
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    fontSize: 14,
    color: '#F0EAF8',   // ✅ always bright white-purple
  };

  return (
    <div style={{
      maxWidth: 1100, margin: '32px auto',
      padding: '0 clamp(12px,3vw,24px) 80px',
    }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 24,
          background: 'rgba(45,155,111,0.95)',
          color: '#fff', padding: '12px 20px',
          borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.3s ease',
        }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 32, fontWeight: 700, color: '#F0EAF8',
        }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Manage users, orders and platform activity
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
        gap: 16, marginBottom: 28,
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-strong)',
            borderRadius: 14, padding: '20px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{
              fontSize: 30, fontWeight: 800,
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['users', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '9px 24px', borderRadius: 10,
            fontSize: 14, fontWeight: 600,
            border: `1.5px solid ${tab === t ? 'rgba(139,111,191,0.6)' : 'var(--border)'}`,
            background: tab === t ? 'rgba(139,111,191,0.2)' : 'rgba(255,255,255,0.04)',
            color: tab === t ? '#C4A8E8' : 'var(--text-muted)',
            cursor: 'pointer', textTransform: 'capitalize',
            transition: 'all 0.2s',
          }}>{t}</button>
        ))}
      </div>

      {/* Users Table */}
      {tab === 'users' && (
        <div style={tableCard}>
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F0EAF8' }}>
              All Users ({users.length})
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,111,191,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={tdBase}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'var(--grad-primary)', flexShrink: 0,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff', fontSize: 13, fontWeight: 700,
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: '#F0EAF8' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdBase, color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={tdBase}>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        padding: '4px 12px', borderRadius: 20,
                        background: roleColor[u.role]?.bg,
                        color: roleColor[u.role]?.color,
                      }}>{u.role}</span>
                    </td>
                    <td style={{ ...tdBase, color: 'var(--text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={tdBase}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <select value={u.role}
                          onChange={e => updateRole(u.id, e.target.value)}
                          style={{
                            width: 'auto', padding: '6px 10px',
                            fontSize: 12, borderRadius: 8,
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid var(--border-strong)',
                            color: '#F0EAF8',
                          }}>
                          <option value="buyer">buyer</option>
                          <option value="seller">seller</option>
                          <option value="admin">admin</option>
                        </select>
                        {u.role !== 'admin' && (
                          <button onClick={() => deleteUser(u.id, u.name)} style={{
                            background: 'rgba(226,75,74,0.15)',
                            border: '1px solid rgba(226,75,74,0.3)',
                            color: '#FF8A8A', padding: '6px 12px',
                            borderRadius: 8, fontSize: 12,
                            cursor: 'pointer', fontFamily: 'inherit',
                            fontWeight: 600, whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,75,74,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(226,75,74,0.15)'}>
                            🗑️ Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {tab === 'orders' && (
        <div style={tableCard}>
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F0EAF8' }}>
              All Orders ({orders.length})
            </h3>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Order', 'Buyer', 'Total', 'Status', 'Date', 'Update'].map(h => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,111,191,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={tdBase}>
                        <span style={{
                          fontWeight: 700, color: '#C4A8E8',
                        }}>#{o.id}</span>
                      </td>
                      <td style={{ ...tdBase, fontWeight: 600 }}>{o.buyer}</td>
                      <td style={{ ...tdBase, fontWeight: 700, color: '#D4A853' }}>
                        ₹{Number(o.total).toLocaleString('en-IN')}
                      </td>
                      <td style={tdBase}>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          padding: '4px 12px', borderRadius: 20,
                          background: (statusColor[o.status] || '#888') + '22',
                          color: statusColor[o.status] || '#888',
                        }}>{o.status}</span>
                      </td>
                      <td style={{ ...tdBase, color: 'var(--text-muted)' }}>
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td style={tdBase}>
                        <select value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                          style={{
                            width: 'auto', padding: '6px 10px',
                            fontSize: 12, borderRadius: 8,
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid var(--border-strong)',
                            color: '#F0EAF8',
                          }}>
                          {['pending', 'processing', 'shipped', 'delivered'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

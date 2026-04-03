import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate }from 'react-router-dom';
import API from '../api';

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
    axios.get('https://safeher-backend-uyzs.onrender.com/api/admin/users', token()).then(r => setUsers(r.data));
    axios.get('https://safeher-backend-uyzs.onrender.com/api/admin/orders', token()).then(r => setOrders(r.data));
  }, []);

  const updateRole = async (id, role) => {
    await axios.put(`${API}/api/admin/users/${id}/role`, { role }, token());
    showToast('Role updated!');
    axios.get('https://safeher-backend-uyzs.onrender.com/api/admin/users', token()).then(r => setUsers(r.data));
  };

  const deleteUser = async (id, name) => {
  if (!window.confirm(`Remove ${name} from SafeHer? This cannot be undone.`)) return;
  try {
    await axios.delete(`${API}/api/admin/users/${id}`, token());
    showToast('User removed successfully');
    axios.get('https://safeher-backend-uyzs.onrender.com/api/admin/users', token()).then(r => setUsers(r.data));
  } catch (err) {
    showToast(err.response?.data?.message || 'Could not remove user');
  }
};

  const updateOrderStatus = async (id, status) => {
    await axios.put(`${API}/api/admin/orders/${id}/status`, { status }, token());
    showToast('Order status updated!');
    axios.get('https://safeher-backend-uyzs.onrender.com/api/admin/orders', token()).then(r => setOrders(r.data));
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: '👥' },
    { label: 'Sellers', value: users.filter(u => u.role === 'seller').length, icon: '🏪' },
    { label: 'Buyers', value: users.filter(u => u.role === 'buyer').length, icon: '🛍️' },
    { label: 'Total Orders', value: orders.length, icon: '📦' },
  ];

  const roleColor = { buyer: { bg: '#e6f1fb', color: '#185FA5' },
    seller: { bg: '#eafaf3', color: '#0F6E56' }, admin: { bg: '#fff0f6', color: '#D4537E' } };
  const statusColor = { pending: '#BA7517', processing: '#7F77DD',
    shipped: '#1D9E75', delivered: '#185FA5' };

  const tabs = ['users', 'orders'];

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#1a1a2e',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>{toast}</div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 600 }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
          Manage users, orders and platform activity
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14,
            padding: '18px 20px', boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            border: '1.5px solid ' + (tab === t ? '#7F77DD' : '#ede8ff'),
            background: tab === t ? '#f0eeff' : '#fff',
            color: tab === t ? '#7F77DD' : '#888', cursor: 'pointer',
            textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'users' && (
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0eeff' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>All Users ({users.length})</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf9ff' }}>
                {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left',
                    fontSize: 12, fontWeight: 600, color: '#aaa',
                    textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderTop: '1px solid #f5f3ff',
                  background: i % 2 === 0 ? '#fff' : '#fdfcff' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                      background: roleColor[u.role]?.bg, color: roleColor[u.role]?.color,
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#aaa' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <select value={u.role}
      onChange={e => updateRole(u.id, e.target.value)}
      style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}>
      <option value="buyer">buyer</option>
      <option value="seller">seller</option>
      <option value="admin">admin</option>
    </select>
    {u.role !== 'admin' && (
      <button onClick={() => deleteUser(u.id, u.name)} style={{
        background: '#fff0f0', border: '1.5px solid #ffd0d0',
        color: '#E24B4A', padding: '6px 12px', borderRadius: 8,
        fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
        fontWeight: 500, whiteSpace: 'nowrap' }}>
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
      )}

      {tab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0eeff' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>All Orders ({orders.length})</h3>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center', color: '#bbb' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <p>No orders yet.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#faf9ff' }}>
                  {['Order', 'Buyer', 'Total', 'Status', 'Date', 'Update'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left',
                      fontSize: 12, fontWeight: 600, color: '#aaa',
                      textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} style={{ borderTop: '1px solid #f5f3ff',
                    background: i % 2 === 0 ? '#fff' : '#fdfcff' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#7F77DD' }}>
                      #{o.id}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14 }}>{o.buyer}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                      ₹{Number(o.total).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                        background: statusColor[o.status] + '22',
                        color: statusColor[o.status],
                      }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#aaa' }}>
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <select value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value)}
                        style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}>
                        {['pending', 'processing', 'shipped', 'delivered'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
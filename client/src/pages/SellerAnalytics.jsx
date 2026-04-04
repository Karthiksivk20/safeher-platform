import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API = 'https://safeher-backend-uyzs.onrender.com';

export default function SellerAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/'); return; }
    Promise.all([
      axios.get(`${API}/api/products`, token),
      axios.get(`${API}/api/orders/seller`, token),
    ]).then(([prodRes, orderRes]) => {
      const myProducts = prodRes.data.filter(p => p.seller_id === user.id);
      const myOrders = orderRes.data;
      setProducts(myProducts);
      setOrders(myOrders);
      const totalRevenue = myOrders.reduce((sum, o) => {
        if (o.status !== 'cancelled') return sum + Number(o.total);
        return sum;
      }, 0);
      const totalOrders = myOrders.length;
      const pendingOrders = myOrders.filter(o => o.status === 'pending').length;
      const completedOrders = myOrders.filter(o => o.status === 'delivered').length;
      const lowStock = myProducts.filter(p => p.stock < 5).length;
      const totalStock = myProducts.reduce((s, p) => s + Number(p.stock), 0);
      setStats({ totalRevenue, totalOrders, pendingOrders,
        completedOrders, lowStock, totalStock,
        totalProducts: myProducts.length });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: '60px auto', textAlign: 'center',
      color: '#aaa', padding: '0 24px' }}>
      <div style={{ fontSize: 40 }}>📊</div>
      <p style={{ marginTop: 12 }}>Loading analytics...</p>
    </div>
  );

  const statusColors = {
    pending: { color: '#BA7517', bg: '#fff8e6' },
    processing: { color: '#7F77DD', bg: '#f0eeff' },
    shipped: { color: '#1D9E75', bg: '#eafaf3' },
    delivered: { color: '#185FA5', bg: '#e6f1fb' },
    cancelled: { color: '#E24B4A', bg: '#fff0f0' },
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto',
      padding: 'clamp(16px, 3vw, 32px) clamp(12px, 3vw, 24px) 80px' }}>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 600 }}>
          My Analytics
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
          Your store performance at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 'clamp(10px, 2vw, 16px)', marginBottom: 32 }}>
        {[
          { label: 'Total Revenue', value: '₹' + Number(stats.totalRevenue).toLocaleString('en-IN'), icon: '💰', color: '#7F77DD', bg: '#f0eeff' },
          { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#185FA5', bg: '#e6f1fb' },
          { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: '#BA7517', bg: '#fff8e6' },
          { label: 'Completed', value: stats.completedOrders, icon: '✅', color: '#1D9E75', bg: '#eafaf3' },
          { label: 'Products', value: stats.totalProducts, icon: '🛍️', color: '#D4537E', bg: '#fff0f6' },
          { label: 'Low Stock', value: stats.lowStock, icon: '⚠️', color: '#E24B4A', bg: '#fff0f0' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14,
            padding: 'clamp(14px, 2vw, 20px)',
            boxShadow: '0 2px 12px rgba(127,119,221,0.08)',
            border: '0.5px solid #f0eeff' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10,
              background: s.bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700,
              color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart — simple bar */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
        border: '0.5px solid #f0eeff', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
          Product Performance
        </h2>
        {products.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '24px 0' }}>
            No products yet
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            {products.slice(0, 10).map((p, i) => {
              const maxPrice = Math.max(...products.map(x => Number(x.price)));
              const width = Math.max(5, (Number(p.price) / maxPrice) * 100);
              return (
                <div key={p.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: '#444', fontWeight: 500,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap', maxWidth: '60%' }}>{p.name}</span>
                    <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                      <span style={{ color: '#7F77DD', fontWeight: 600 }}>
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </span>
                      <span style={{ color: p.stock < 5 ? '#E24B4A' : '#1D9E75' }}>
                        {p.stock} in stock
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: '#f0eeff', borderRadius: 4,
                    overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${width}%`,
                      background: `linear-gradient(90deg, #7F77DD, #D4537E)`,
                      transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
        border: '0.5px solid #f0eeff' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0eeff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>
            Recent Orders ({orders.length})
          </h2>
        </div>
        {orders.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#bbb' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <p>No orders yet. Share your products to get your first order!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse',
              minWidth: 500 }}>
              <thead>
                <tr style={{ background: '#faf9ff' }}>
                  {['Order', 'Buyer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left',
                      fontSize: 12, fontWeight: 600, color: '#aaa',
                      textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((o, i) => {
                  const sc = statusColors[o.status] || statusColors.pending;
                  return (
                    <tr key={o.id} style={{ borderTop: '1px solid #f5f3ff',
                      background: i % 2 === 0 ? '#fff' : '#fdfcff' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 600,
                        color: '#7F77DD' }}>#{o.id}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14 }}>
                        {o.buyer_name}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                        ₹{Number(o.total).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: 12, fontWeight: 600,
                          padding: '4px 10px', borderRadius: 20,
                          background: sc.bg, color: sc.color }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13,
                        color: '#aaa' }}>
                        {new Date(o.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image
    ? `http://localhost:5000/uploads/${image}` : null;

export default function SellerOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const token = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/'); return; }
    axios.get('http://localhost:5000/api/orders/seller', token)
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/seller/update/${orderId}`,
        { status },
        token
      );
      showToast(`Order #${orderId} marked as ${status} ✅`);
      axios.get('http://localhost:5000/api/orders/seller', token)
        .then(r => setOrders(r.data));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating status');
    }
  };

  const statusConfig = {
    pending:          { color: '#BA7517', bg: '#fff8e6', label: 'Pending' },
    processing:       { color: '#7F77DD', bg: '#f0eeff', label: 'Processing' },
    shipped:          { color: '#1D9E75', bg: '#eafaf3', label: 'Shipped' },
    delivered:        { color: '#185FA5', bg: '#e6f1fb', label: 'Delivered' },
    cancelled:        { color: '#E24B4A', bg: '#fff0f0', label: 'Cancelled' },
    return_requested: { color: '#D4537E', bg: '#fff0f6', label: 'Return Requested' },
    returned:         { color: '#888', bg: '#f5f5f5', label: 'Returned' },
  };

  const nextStatus = {
    pending: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
  };

  const nextLabel = {
    pending: '⚙️ Mark as Processing',
    processing: '🚚 Mark as Shipped',
    shipped: '✅ Mark as Delivered',
  };

  if (loading) return (
    <div style={{ maxWidth: 900, margin: '60px auto', textAlign: 'center',
      color: '#aaa' }}>
      <div style={{ fontSize: 40 }}>📦</div>
      <p style={{ marginTop: 12 }}>Loading orders...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 24px 60px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#1a1a2e',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif',
          fontSize: 28, fontWeight: 600 }}>Customer Orders</h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
          Manage and update your orders here
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif',
            fontSize: 22, marginBottom: 8 }}>No orders yet</h3>
          <p>Orders from your products will appear here.</p>
        </div>
      ) : orders.map(order => {
        const sc = statusConfig[order.status] || statusConfig.pending;
        const next = nextStatus[order.status];
        return (
          <div key={order.id} style={{ background: '#fff', borderRadius: 16,
            padding: 24, marginBottom: 16,
            boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
            border: '0.5px solid #f0eeff' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: 16,
              flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>
                    Order #{order.id}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600,
                    padding: '4px 12px', borderRadius: 20,
                    background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>
                  Buyer: <strong style={{ color: '#333' }}>{order.buyer_name}</strong>
                  {' · '}{new Date(order.created_at).toLocaleDateString('en-IN',
                    { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                {order.address && (
                  <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                    📍 {order.address}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 700,
                  background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent' }}>
                  ₹{Number(order.total).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0eeff', paddingTop: 14,
              marginBottom: 16 }}>
              {order.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12,
                  alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10,
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)',
                    overflow: 'hidden', display: 'flex',
                    alignItems: 'center', justifyContent: 'center' }}>
                    {imgSrc(item.image)
                      ? <img src={imgSrc(item.image)} alt={item.name}
                          style={{ width: '100%', height: '100%',
                            objectFit: 'cover' }} />
                      : <span style={{ fontSize: 20 }}>🛍️</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: '#aaa' }}>
                      Qty: {item.quantity} ×
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {next && (
              <button onClick={() => updateStatus(order.id, next)} style={{
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', border: 'none', padding: '10px 20px',
                borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit' }}>
                {nextLabel[order.status]}
              </button>
            )}

            {order.status === 'return_requested' && (
              <div style={{ background: '#fff0f6', borderRadius: 10,
                padding: '10px 14px', border: '1px solid #F4C0D1' }}>
                <p style={{ fontSize: 13, color: '#D4537E', fontWeight: 500 }}>
                  ⚠️ Customer has requested a return for this order.
                  Please contact them at {order.buyer_email}.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
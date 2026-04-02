import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate }from 'react-router-dom';import API from '../api';

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image
    ? `${API}/uploads/${image}` : null;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({});
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const token = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const cancelOrder = async (order) => {
  if (!window.confirm('Cancel this order?')) return;
  try {
    await axios.put(
      `${API}/api/orders/cancel/${order.id}`,
      { items: JSON.stringify(order.items?.map(i => ({
        product_id: i.product_id, quantity: i.quantity
      })) || []) },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    showToast('Order cancelled successfully');
    axios.get(`${API}/api/orders/my', token)
      .then(r => setOrders(r.data));
  } catch (err) {
    showToast(err.response?.data?.message || 'Cannot cancel this order');
  }
};

  useEffect(() => {
    axios.get(`${API}/api/orders/my', token)
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  const submitReview = async (productId, rating, comment) => {
    if (!rating) return showToast('Please select a star rating');
    try {
      await axios.post(
        `${API}/api/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showToast('Review submitted! ⭐');
      setReviewForm(prev => ({
        ...prev,
        [productId]: { ...prev[productId], submitted: true, open: false }
      }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting review');
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

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const stepIndex = { pending: 0, processing: 1, shipped: 2, delivered: 3 };

  if (loading) return (
    <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px',
      textAlign: 'center', color: '#aaa' }}>
      <div style={{ fontSize: 40 }}>📦</div>
      <p style={{ marginTop: 12 }}>Loading your orders...</p>
    </div>
  );
  const returnOrder = async (orderId) => {
  if (!window.confirm('Request a return for this order?')) return;
  try {
    await axios.put(
      `${API}/api/orders/return/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    showToast('Return request submitted successfully');
    axios.get(`${API}/api/orders/my', token)
      .then(r => setOrders(r.data));
  } catch (err) {
    showToast(err.response?.data?.message || 'Cannot process return');
  }
};

  return (
    <div style={{ maxWidth: 860, margin: '32px auto', padding: '0 24px 60px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#1a1a2e',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif',
          fontSize: 28, fontWeight: 600 }}>My Orders</h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif',
            fontSize: 22, marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: '#888', marginBottom: 24 }}>
            Start shopping to support women entrepreneurs!
          </p>
          <Link to="/" style={{
            background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            color: '#fff', padding: '12px 28px', borderRadius: 12,
            fontWeight: 600, fontSize: 14 }}>
            Shop Now 🛍️
          </Link>
        </div>
      ) : (
        orders.map(order => {
          const sc = statusConfig[order.status] || statusConfig.pending;
          const si = stepIndex[order.status] || 0;
          return (
            <div key={order.id} style={{ background: '#fff', borderRadius: 16,
              padding: 24, marginBottom: 20,
              boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
              border: '0.5px solid #f0eeff' }}>

              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 20,
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
                    Placed on {new Date(order.created_at).toLocaleDateString(
                      'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 20, fontWeight: 700,
                    background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent' }}>
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </p>
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                    Total amount
                  </p>
                </div>
                {order.status === 'pending' && (
  <button onClick={() => cancelOrder(order)} style={{
    background: '#fff0f0', border: '1.5px solid #ffd0d0',
    color: '#E24B4A', padding: '8px 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
    fontFamily: 'inherit', marginTop: 8 }}>
    ✕ Cancel Order
  </button>
)}

{order.status === 'delivered' && (
  <button onClick={() => returnOrder(order.id)} style={{
    background: '#fff0f6', border: '1.5px solid #F4C0D1',
    color: '#D4537E', padding: '8px 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
    fontFamily: 'inherit', marginTop: 8, marginLeft: 8 }}>
    ↩️ Request Return
  </button>
)}

{order.status === 'return_requested' && (
  <div style={{ background: '#fff0f6', borderRadius: 10,
    padding: '10px 14px', marginTop: 8,
    border: '1px solid #F4C0D1' }}>
    <p style={{ fontSize: 13, color: '#D4537E', fontWeight: 500 }}>
      ↩️ Return requested — our team will contact you within 24 hours.
    </p>
  </div>
)}
              </div>
              

              {/* Progress Bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  position: 'relative', marginBottom: 8 }}>
                  <div style={{ position: 'absolute', top: 10, left: '10%',
                    right: '10%', height: 3, background: '#f0eeff', zIndex: 0 }}>
                    <div style={{ height: '100%', borderRadius: 3,
                      background: 'linear-gradient(90deg, #7F77DD, #D4537E)',
                      width: `${(si / 3) * 100}%`,
                      transition: 'width 0.5s ease' }} />
                  </div>
                  {steps.map((step, i) => (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column',
                      alignItems: 'center', zIndex: 1, flex: 1 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%',
                        background: i <= si
                          ? 'linear-gradient(135deg, #7F77DD, #D4537E)'
                          : '#f0eeff',
                        border: i <= si ? 'none' : '2px solid #ede8ff',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff', fontSize: 10, fontWeight: 700 }}>
                        {i <= si ? '✓' : ''}
                      </div>
                      <span style={{ fontSize: 10, marginTop: 4,
                        color: i <= si ? '#7F77DD' : '#bbb',
                        fontWeight: 500 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div style={{ borderTop: '1px solid #f5f3ff', paddingTop: 16 }}>
                {order.items?.map(item => {
                  const rf = reviewForm[item.product_id] || {};
                  return (
                    <div key={item.id} style={{ marginBottom: 16 }}>

                      {/* Item Row */}
                      <div style={{ display: 'flex', gap: 12,
                        alignItems: 'center', marginBottom: 8 }}>
                        <div onClick={() => navigate(`/product/${item.product_id}`)}
                          style={{ width: 56, height: 56, borderRadius: 10,
                            flexShrink: 0, cursor: 'pointer',
                            background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)',
                            overflow: 'hidden', display: 'flex',
                            alignItems: 'center', justifyContent: 'center' }}>
                          {imgSrc(item.image)
                            ? <img src={imgSrc(item.image)} alt={item.name}
                                style={{ width: '100%', height: '100%',
                                  objectFit: 'cover' }} />
                            : <span style={{ fontSize: 24 }}>🛍️</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p onClick={() => navigate(`/product/${item.product_id}`)}
                            style={{ fontWeight: 500, fontSize: 14,
                              cursor: 'pointer', color: '#7F77DD' }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: 12, color: '#aaa' }}>
                            Qty: {item.quantity} ×{' '}
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>
                          ₹{(Number(item.price) * item.quantity)
                            .toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Review Section — only for delivered orders */}
                      {order.status === 'delivered' && !rf.submitted && (
                        <div style={{ background: '#f7f5ff', borderRadius: 10,
                          padding: '12px 14px', border: '1.5px solid #ede8ff',
                          marginLeft: 68 }}>
                          {!rf.open ? (
                            <button onClick={() => setReviewForm(prev => ({
                              ...prev,
                              [item.product_id]: {
                                open: true, rating: 0, comment: ''
                              }
                            }))} style={{
                              background: 'none', border: 'none',
                              color: '#7F77DD', fontSize: 13, fontWeight: 500,
                              cursor: 'pointer', fontFamily: 'inherit',
                              display: 'flex', alignItems: 'center', gap: 6 }}>
                              ⭐ Write a Review for this product
                            </button>
                          ) : (
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600,
                                color: '#555', marginBottom: 8 }}>
                                Rate this product
                              </p>
                              <div style={{ display: 'flex', gap: 4,
                                marginBottom: 10 }}>
                                {[1,2,3,4,5].map(star => (
                                  <span key={star}
                                    onClick={() => setReviewForm(prev => ({
                                      ...prev,
                                      [item.product_id]: {
                                        ...prev[item.product_id], rating: star
                                      }
                                    }))}
                                    style={{ fontSize: 28, cursor: 'pointer',
                                      color: star <= (rf.rating || 0)
                                        ? '#F0C419' : '#e0e0e0',
                                      transition: 'color 0.15s' }}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <textarea
                                placeholder="Share your experience (optional)..."
                                rows={2} value={rf.comment || ''}
                                onChange={e => setReviewForm(prev => ({
                                  ...prev,
                                  [item.product_id]: {
                                    ...prev[item.product_id],
                                    comment: e.target.value
                                  }
                                }))}
                                style={{ marginBottom: 8, resize: 'none',
                                  fontSize: 13 }} />
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => submitReview(
                                  item.product_id, rf.rating, rf.comment
                                )} style={{
                                  background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                                  color: '#fff', border: 'none',
                                  padding: '8px 18px', borderRadius: 8,
                                  fontSize: 13, fontWeight: 500,
                                  cursor: 'pointer', fontFamily: 'inherit' }}>
                                  Submit ⭐
                                </button>
                                <button onClick={() => setReviewForm(prev => ({
                                  ...prev, [item.product_id]: {}
                                }))} style={{
                                  background: '#fff',
                                  border: '1.5px solid #ede8ff',
                                  color: '#888', padding: '8px 14px',
                                  borderRadius: 8, fontSize: 13,
                                  cursor: 'pointer', fontFamily: 'inherit' }}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Submitted confirmation */}
                      {rf.submitted && (
                        <div style={{ background: '#eafaf3', borderRadius: 10,
                          padding: '10px 14px', marginLeft: 68,
                          border: '1px solid #9FE1CB' }}>
                          <p style={{ fontSize: 13, color: '#0F6E56',
                            fontWeight: 500 }}>
                            ✅ Review submitted. Thank you!
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div style={{ marginTop: 12, padding: '10px 14px',
                  background: '#f7f5ff', borderRadius: 10,
                  fontSize: 13, color: '#666' }}>
                  📍 {order.address}
                </div>
              )}

            </div>
          );
        })
      )}
    </div>
  );
}
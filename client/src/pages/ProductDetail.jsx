import { useEffect, useState } from 'react';
import { useParams, useNavigate }from 'react-router-dom';\nimport API from '../api';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image
    ? `${API}/uploads/${image}` : null;

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: readonly ? 16 : 28,
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (hovered || value) ? '#F0C419' : '#e0e0e0',
            transition: 'color 0.15s',
          }}>★</span>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [address, setAddress] = useState({
  name: '', phone: '', flat: '', city: '', state: '', pincode: ''
});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const token = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const loadProduct = async () => {
    const { data } = await axios.get(`${API}/api/products/${id}`);
    setProduct(data);
  };

  const loadReviews = async () => {
    const { data } = await axios.get(`${API}/api/products/${id}/reviews`);
    setReviews(data.reviews);
    setAvgRating(data.avg);
    setTotalReviews(data.total);
  };

  useEffect(() => {
    Promise.all([loadProduct(), loadReviews()]).finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) return showToast('Please login to add to cart');
    await axios.post('${API}/api/cart/add',
      { product_id: id, quantity }, token());
    showToast('Added to cart! 🛒');
  };

  const orderNow = async () => {
    if (!user) return showToast('Please login to order');
    if (!address.name || !address.phone || !address.flat ||
    !address.city || !address.state || !address.pincode)
  return showToast('Please fill in all delivery details');
    setOrderLoading(true);
    try {
      await axios.post('${API}/api/cart/add',
        { product_id: id, quantity }, token());
      const fullAddress = `${address.name}, ${address.phone} | ${address.flat}, ${address.city}, ${address.state} - ${address.pincode}`;
await axios.post('${API}/api/orders/place',
  { address: fullAddress }, token());
      showToast('Order placed successfully! 🎉');
      setTimeout(() => navigate('/orders'), 1500);
    } catch {
      showToast('Something went wrong');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: '60px auto', padding: '0 24px',
      textAlign: 'center', color: '#aaa' }}>
      <div style={{ fontSize: 40 }}>🛍️</div>
      <p style={{ marginTop: 12 }}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{ maxWidth: 1100, margin: '60px auto', padding: '0 24px',
      textAlign: 'center', color: '#aaa' }}>
      <div style={{ fontSize: 40 }}>😕</div>
      <p style={{ marginTop: 12 }}>Product not found.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px 60px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#1a1a2e',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      <button onClick={() => navigate(-1)} style={{
        background: 'none', border: '1.5px solid #ede8ff', color: '#7F77DD',
        padding: '8px 16px', borderRadius: 10, fontSize: 13,
        fontWeight: 500, marginBottom: 24, cursor: 'pointer' }}>
        ← Back
      </button>

      {/* Product Info */}
      <div style={{ display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 'clamp(20px, 4vw, 40px)', marginBottom: 48 }}>

        {/* Image */}
        <div style={{ borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)',
          height: 'clamp(260px, 40vw, 420px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center' }}>
          {imgSrc(product.image)
            ? <img src={imgSrc(product.image)} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 80 }}>🛍️</span>}
        </div>

        {/* Details */}
        <div>
          <span style={{ fontSize: 12, background: '#f0eeff', color: '#7F77DD',
            padding: '4px 12px', borderRadius: 20, fontWeight: 500 }}>
            {product.category_name}
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32,
            fontWeight: 600, margin: '12px 0 8px', lineHeight: 1.3 }}>
            {product.name}
          </h1>
          <p style={{ fontSize: 14, color: '#aaa', marginBottom: 12 }}>
            Sold by{' '}
            <strong style={{ color: '#7F77DD' }}>{product.seller_name}</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 16 }}>
            <StarRating value={Math.round(avgRating)} readonly />
            <span style={{ fontSize: 14, fontWeight: 600,
              color: '#333' }}>{avgRating}</span>
            <span style={{ fontSize: 13, color: '#aaa' }}>
              ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
            </span>
          </div>

          <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8,
            background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent' }}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </div>

          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 20,
            color: product.stock < 1 ? '#E24B4A'
              : product.stock < 5 ? '#BA7517' : '#1D9E75' }}>
            {product.stock < 1 ? '❌ Out of Stock'
              : product.stock < 5 ? `⚠️ Only ${product.stock} left!`
              : `✅ ${product.stock} in stock`}
          </p>

          {product.description && (
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8,
              marginBottom: 24 }}>{product.description}</p>
          )}

          {/* Quantity */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#555' }}>
                Quantity:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                background: '#f7f5ff', borderRadius: 10, padding: '6px 12px',
                border: '1.5px solid #ede8ff' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ background: 'none', border: 'none', fontSize: 18,
                    cursor: 'pointer', color: '#7F77DD', fontWeight: 700 }}>−</button>
                <span style={{ fontWeight: 600, fontSize: 15,
                  minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{ background: 'none', border: 'none', fontSize: 18,
                    cursor: 'pointer', color: '#7F77DD', fontWeight: 700 }}>+</button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button onClick={addToCart} style={{
                flex: 1, background: '#f0eeff', color: '#7F77DD',
                border: '2px solid #7F77DD', padding: '14px',
                borderRadius: 12, fontSize: 15, fontWeight: 600,
                cursor: 'pointer' }}>
                🛒 Add to Cart
              </button>
              <button onClick={() => setShowOrderForm(!showOrderForm)} style={{
                flex: 1,
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', border: 'none', padding: '14px',
                borderRadius: 12, fontSize: 15, fontWeight: 600,
                cursor: 'pointer' }}>
                ⚡ Order Now
              </button>
            </div>
          )}

          {/* Order Now Form */}
          {showOrderForm && (
            <div style={{ background: '#f7f5ff', borderRadius: 12, padding: 16,
              border: '1.5px solid #ede8ff', marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
  display: 'block', marginBottom: 10 }}>Delivery Details</label>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
  gap: 8, marginBottom: 8 }}>
  <input placeholder="Recipient Name *"
    value={address.name}
    onChange={e => setAddress({ ...address, name: e.target.value })} />
  <input placeholder="Phone Number *" type="tel"
    value={address.phone}
    onChange={e => setAddress({ ...address, phone: e.target.value })} />
</div>
<input placeholder="Flat / House No / Street *"
  value={address.flat}
  onChange={e => setAddress({ ...address, flat: e.target.value })}
  style={{ marginBottom: 8 }} />
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
  gap: 8, marginBottom: 10 }}>
  <input placeholder="City *"
    value={address.city}
    onChange={e => setAddress({ ...address, city: e.target.value })} />
  <input placeholder="State *"
    value={address.state}
    onChange={e => setAddress({ ...address, state: e.target.value })} />
  <input placeholder="Pincode *"
    value={address.pincode}
    onChange={e => setAddress({ ...address, pincode: e.target.value })} />
</div>
              <button onClick={orderNow} disabled={orderLoading} style={{
                width: '100%',
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', border: 'none', padding: '12px',
                borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: orderLoading ? 'not-allowed' : 'pointer',
                opacity: orderLoading ? 0.7 : 1 }}>
                {orderLoading ? 'Placing Order...' : 'Confirm Order 🎉'}
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['🚚 Free Delivery', '↩️ 7-Day Returns', '🔒 Secure Payment'].map(f => (
              <span key={f} style={{ fontSize: 12, background: '#f0eeff',
                color: '#7F77DD', padding: '5px 12px',
                borderRadius: 20, fontWeight: 500 }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section — Read Only */}
      <div style={{ background: '#fff', borderRadius: 20, padding: 32,
        boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
        border: '0.5px solid #f0eeff' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22,
              fontWeight: 600 }}>Customer Reviews</h2>
            {totalReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                marginTop: 8 }}>
                <span style={{ fontSize: 36, fontWeight: 700,
                  color: '#F0C419' }}>{avgRating}</span>
                <div>
                  <StarRating value={Math.round(avgRating)} readonly />
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                    Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div style={{ background: '#f7f5ff', borderRadius: 12,
            padding: '10px 16px', border: '1.5px solid #ede8ff' }}>
            <p style={{ fontSize: 12, color: '#7F77DD', fontWeight: 500 }}>
              💡 Purchased this product?
            </p>
            <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
              Go to <strong>My Orders</strong> to leave a review.
            </p>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#aaa' }}>
              No reviews for this product yet.
            </p>
            <p style={{ fontSize: 13, color: '#bbb', marginTop: 6 }}>
              Order this product and be the first to review it!
            </p>
          </div>
        ) : (
          reviews.map((r, i) => (
            <div key={r.id} style={{ padding: '20px 0',
              borderTop: '1px solid #f0eeff', display: 'flex', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 16, fontWeight: 600 }}>
                {r.reviewer.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap',
                  gap: 8 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                      {r.reviewer}
                    </span>
                    <span style={{ fontSize: 12, color: '#aaa', marginLeft: 10 }}>
                      {new Date(r.created_at).toLocaleDateString('en-IN',
                        { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <StarRating value={r.rating} readonly />
                </div>
                {r.comment && (
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>
                    {r.comment}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = 'https://safeher-backend-uyzs.onrender.com';

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image
    ? `${API}/uploads/${image}` : null;

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    name: '', phone: '', flat: '', city: '', state: '', pincode: ''
  });
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const token = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const load = () => {
    setLoading(true);
    axios.get(`${API}/api/cart`, token())
      .then(r => setCart(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const update = async (id, quantity) => {
    await axios.put(`${API}/api/cart/update/${id}`, { quantity }, token());
    load();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/api/cart/remove/${id}`, token());
    showToast('Item removed');
    load();
  };

  const validateAddress = () => {
    if (!address.name) return 'Please enter recipient name';
    if (!address.phone || address.phone.length < 10) return 'Please enter valid phone number';
    if (!address.flat) return 'Please enter flat/house number';
    if (!address.city) return 'Please enter city';
    if (!address.state) return 'Please enter state';
    if (!address.pincode || address.pincode.length < 6) return 'Please enter valid pincode';
    return null;
  };

  const handlePayment = async () => {
    const err = validateAddress();
    if (err) return showToast(err);
    setPaying(true);
    try {
      const fullAddress = `${address.name}, ${address.phone} | ${address.flat}, ${address.city}, ${address.state} - ${address.pincode}`;
      const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

      const { data } = await axios.post(
        `${API}/api/orders/create-payment`,
        { amount: total },
        token()
      );

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'SafeHer',
        description: 'Women Entrepreneurship Marketplace',
        image: 'https://i.imgur.com/n5tjHFD.png',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const result = await axios.post(
              `${API}/api/orders/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                address: fullAddress,
              },
              token()
            );
            showToast('Payment successful! 🎉');
            setTimeout(() => navigate('/orders'), 1500);
          } catch {
            showToast('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: { color: '#7F77DD' },
        modal: {
          ondismiss: () => {
            setPaying(false);
            showToast('Payment cancelled');
          }
        }
      };
      const handleCOD = async () => {
  const err = validateAddress();
  if (err) return showToast(err);
  setPaying(true);
  try {
    const fullAddress = `${address.name}, ${address.phone} | ${address.flat}, ${address.city}, ${address.state} - ${address.pincode}`;
    await axios.post(
      `${API}/api/orders/place`,
      { address: fullAddress },
      token()
    );
    showToast('COD Order placed successfully! 🎉');
    setTimeout(() => navigate('/orders'), 1500);
  } catch (err) {
    showToast(err.response?.data?.message || 'Order failed');
  } finally {
    setPaying(false);
  }
};

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        showToast('Payment failed. Please try again.');
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      showToast(err.response?.data?.message || 'Payment failed');
      setPaying(false);
    }
  };

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) return (
    <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px',
      textAlign: 'center', color: '#aaa' }}>
      <div style={{ fontSize: 40 }}>🛒</div>
      <p style={{ marginTop: 12 }}>Loading cart...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 24px 60px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 16,
          background: '#1a1a2e', color: '#fff', padding: '12px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 500,
          zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxWidth: 300 }}>{toast}</div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif',
          fontSize: 28, fontWeight: 600 }}>Your Cart</h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
          {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif',
            fontSize: 22, marginBottom: 8 }}>Your cart is empty</h3>
          <p style={{ color: '#888', marginBottom: 24 }}>
            Discover amazing products from women entrepreneurs
          </p>
          <Link to="/" style={{
            background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            color: '#fff', padding: '12px 28px', borderRadius: 12,
            fontWeight: 600, fontSize: 14 }}>
            Start Shopping 🛍️
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24 }}>

          {/* Cart Items */}
          <div>
            {cart.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 14,
                padding: 16, marginBottom: 12,
                boxShadow: '0 2px 12px rgba(127,119,221,0.07)',
                display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 12,
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)',
                  overflow: 'hidden', display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
                  {imgSrc(item.image)
                    ? <img src={imgSrc(item.image)} alt={item.name}
                        style={{ width: '100%', height: '100%',
                          objectFit: 'cover' }} />
                    : <span style={{ fontSize: 32 }}>🛍️</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' }}>{item.name}</h4>
                  <p style={{ fontSize: 16, fontWeight: 700,
                    background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent' }}>
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => update(item.id, item.quantity - 1)}
                    style={{ width: 32, height: 32, borderRadius: 8,
                      border: '1.5px solid #ede8ff', background: '#fff',
                      fontSize: 18, cursor: 'pointer', color: '#7F77DD',
                      fontWeight: 700, display: 'flex', alignItems: 'center',
                      justifyContent: 'center' }}>−</button>
                  <span style={{ fontWeight: 600, fontSize: 15,
                    minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => update(item.id, item.quantity + 1)}
                    style={{ width: 32, height: 32, borderRadius: 8,
                      border: '1.5px solid #ede8ff', background: '#fff',
                      fontSize: 18, cursor: 'pointer', color: '#7F77DD',
                      fontWeight: 700, display: 'flex', alignItems: 'center',
                      justifyContent: 'center' }}>+</button>
                </div>
                <div style={{ textAlign: 'right', minWidth: 90 }}>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>
                    ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <button onClick={() => remove(item.id)}
                    style={{ background: 'none', border: 'none',
                      color: '#E24B4A', fontSize: 12, cursor: 'pointer',
                      marginTop: 4, fontWeight: 500 }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div style={{ background: '#fff', borderRadius: 14, padding: 20,
              boxShadow: '0 2px 12px rgba(127,119,221,0.08)',
              position: 'sticky', top: 120 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif',
                fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                Delivery Details
              </h3>

              <div style={{ display: 'grid',
                gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
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
              <div style={{ display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                <input placeholder="City *" value={address.city}
                  onChange={e => setAddress({ ...address, city: e.target.value })} />
                <input placeholder="State *" value={address.state}
                  onChange={e => setAddress({ ...address, state: e.target.value })} />
                <input placeholder="Pincode *" value={address.pincode}
                  onChange={e => setAddress({ ...address, pincode: e.target.value })} />
              </div>

              <div style={{ borderTop: '1px solid #f0eeff', paddingTop: 12,
                marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  marginBottom: 8, fontSize: 14, color: '#666' }}>
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  marginBottom: 8, fontSize: 14, color: '#666' }}>
                  <span>Delivery</span>
                  <span style={{ color: '#1D9E75', fontWeight: 500 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  fontWeight: 700, fontSize: 16, marginTop: 8 }}>
                  <span>Total</span>
                  <span style={{ background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent' }}>
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

             {/* Payment Method Selection */}
<div style={{ marginBottom: 16 }}>
  <p style={{ fontSize: 13, fontWeight: 500, color: '#555',
    marginBottom: 10 }}>Payment Method</p>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
    <div onClick={() => setPaymentMethod('online')}
      style={{ border: `2px solid ${paymentMethod === 'online' ? '#7F77DD' : '#ede8ff'}`,
        borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
        background: paymentMethod === 'online' ? '#f0eeff' : '#fff',
        textAlign: 'center', transition: 'all 0.2s' }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>💳</div>
      <div style={{ fontSize: 13, fontWeight: 600,
        color: paymentMethod === 'online' ? '#7F77DD' : '#555' }}>
        Pay Online
      </div>
      <div style={{ fontSize: 11, color: '#aaa' }}>UPI · Cards · NetBanking</div>
    </div>
    <div onClick={() => setPaymentMethod('cod')}
      style={{ border: `2px solid ${paymentMethod === 'cod' ? '#1D9E75' : '#ede8ff'}`,
        borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
        background: paymentMethod === 'cod' ? '#eafaf3' : '#fff',
        textAlign: 'center', transition: 'all 0.2s' }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>💵</div>
      <div style={{ fontSize: 13, fontWeight: 600,
        color: paymentMethod === 'cod' ? '#1D9E75' : '#555' }}>
        Cash on Delivery
      </div>
      <div style={{ fontSize: 11, color: '#aaa' }}>Pay when delivered</div>
    </div>
  </div>
</div>

<button onClick={paymentMethod === 'online' ? handlePayment : handleCOD}
  disabled={paying}
  style={{ width: '100%',
    background: paymentMethod === 'cod'
      ? 'linear-gradient(135deg, #1D9E75, #0F6E56)'
      : 'linear-gradient(135deg, #7F77DD, #D4537E)',
    color: '#fff', border: 'none', padding: '14px',
    borderRadius: 12, fontSize: 15, fontWeight: 600,
    cursor: paying ? 'not-allowed' : 'pointer',
    opacity: paying ? 0.7 : 1 }}>
  {paying ? 'Placing Order...'
    : paymentMethod === 'cod'
    ? '🚚 Place COD Order — ₹' + total.toLocaleString('en-IN')
    : '💳 Pay ₹' + total.toLocaleString('en-IN')}
</button>

<p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 10 }}>
  {paymentMethod === 'online'
    ? '🔒 Secured by Razorpay · UPI · Cards · NetBanking · Wallets'
    : '🚚 Pay cash when your order is delivered'}
</p>

              <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center',
                marginTop: 10 }}>
                🔒 Secured by Razorpay · UPI · Cards · NetBanking · Wallets
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
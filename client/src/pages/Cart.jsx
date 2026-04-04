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
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  };

  const token = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const load = () => {
    setLoading(true);
    axios.get(`${API}/api/cart`, token())
      .then(r => setCart(r.data))
      .catch(() => setCart([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const update = async (id, quantity) => {
    await axios.put(`${API}/api/cart/update/${id}`, { quantity }, token());
    load();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/api/cart/remove/${id}`, token());
    showToast('Item removed from cart');
    load();
  };

  const validateAddress = () => {
    if (!address.name.trim()) return 'Please enter recipient name';
    if (!address.phone.trim() || address.phone.length < 10)
      return 'Please enter a valid 10-digit phone number';
    if (!address.flat.trim()) return 'Please enter flat/house number';
    if (!address.city.trim()) return 'Please enter city';
    if (!address.state.trim()) return 'Please enter state';
    if (!address.pincode.trim() || address.pincode.length < 6)
      return 'Please enter a valid 6-digit pincode';
    return null;
  };

  const getFullAddress = () =>
    `${address.name}, ${address.phone} | ${address.flat}, ${address.city}, ${address.state} - ${address.pincode}`;

  const handleOnlinePayment = async () => {
    const err = validateAddress();
    if (err) return showToast(err, 'error');
    setPaying(true);
    try {
      const { data } = await axios.post(
        `${API}/api/orders/create-payment`,
        { amount: total }, token()
      );
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'SafeHer',
        description: 'Women Entrepreneurship Marketplace',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await axios.post(`${API}/api/orders/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: getFullAddress(),
            }, token());
            showToast('Payment successful! Order placed 🎉');
            setCart([]);
            setTimeout(() => navigate('/orders'), 2000);
          } catch {
            showToast('Payment verification failed', 'error');
            setPaying(false);
          }
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: '#8B6FBF' },
        modal: {
          ondismiss: () => {
            setPaying(false);
            showToast('Payment cancelled', 'error');
          }
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        showToast('Payment failed. Please try again.', 'error');
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not initiate payment', 'error');
      setPaying(false);
    }
  };

  const handleCOD = async () => {
    const err = validateAddress();
    if (err) return showToast(err, 'error');
    setPaying(true);
    try {
      await axios.post(
        `${API}/api/orders/place`,
        { address: getFullAddress() },
        token()
      );
      setCart([]);
      showToast('Order placed successfully! 🎉');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Order failed. Please try again.', 'error');
      setPaying(false);
    }
  };

  const total = cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const inputStyle = {
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    color: '#fff', borderRadius: 10, padding: '11px 14px',
    fontSize: 13.5, width: '100%', outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 14,
      background: 'linear-gradient(135deg, #140C1E, #1A0A28)' }}>
      <div style={{ fontSize: 48, animation: 'float 2s ease-in-out infinite' }}>🛒</div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>Loading your cart...</p>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #140C1E 0%, #1F0E32 50%, #180A26 100%)',
    }}>

      {/* Toast */}
      {toast.msg && (
        <div style={{
          position: 'fixed', top: 86, right: 16, left: 16,
          maxWidth: 320, marginLeft: 'auto',
          background: toast.type === 'error'
            ? 'rgba(226,75,74,0.95)' : 'rgba(45,155,111,0.95)',
          color: '#fff', padding: '13px 18px', borderRadius: 12,
          fontSize: 14, fontWeight: 500, zIndex: 999,
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          animation: 'slideDown 0.3s ease',
          backdropFilter: 'blur(10px)',
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: 'clamp(20px,4vw,40px) clamp(12px,3vw,24px) 80px',
      }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700,
            color: '#fff', marginBottom: 4,
          }}>Your Cart</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
            {itemCount > 0
              ? `${itemCount} item${itemCount !== 1 ? 's' : ''} — ₹${total.toLocaleString('en-IN')} total`
              : 'Your cart is empty'}
          </p>
        </div>

        {cart.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 'clamp(48px,8vw,96px) 24px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: 72, marginBottom: 20,
              animation: 'float 3s ease-in-out infinite' }}>🛒</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26,
              fontWeight: 700, marginBottom: 10, color: '#fff' }}>
              Your cart is empty
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 28 }}>
              Discover amazing handcrafted products from women entrepreneurs
            </p>
            <Link to="/" style={{
              background: 'linear-gradient(135deg, #8B6FBF, #C4587A)',
              color: '#fff', padding: '13px 28px', borderRadius: 14,
              fontWeight: 700, fontSize: 15,
              boxShadow: '0 6px 20px rgba(139,111,191,0.35)',
              textDecoration: 'none', display: 'inline-block',
            }}>
              Start Shopping 🛍️
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(16px,3vw,28px)',
          }}>

            {/* Cart Items */}
            <div>
              {cart.map((item, idx) => (
                <div key={item.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 16, padding: 'clamp(12px,2vw,18px)',
                  marginBottom: 12,
                  border: '1px solid rgba(255,255,255,0.09)',
                  display: 'flex', gap: 14, alignItems: 'center',
                  transition: 'background 0.2s',
                  animation: `fadeUp 0.4s ease ${idx * 0.07}s both`,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  {/* Image */}
                  <div style={{
                    width: 'clamp(64px,10vw,80px)',
                    height: 'clamp(64px,10vw,80px)',
                    borderRadius: 12, flexShrink: 0, overflow: 'hidden',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {imgSrc(item.image)
                      ? <img src={imgSrc(item.image)} alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 28 }}>🛍️</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff',
                      marginBottom: 3, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#D4A853',
                      fontFamily: 'Cormorant Garamond, serif' }}>
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => update(item.id, item.quantity - 1)}
                      style={{ width: 30, height: 30, borderRadius: 8,
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff', fontSize: 16, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                      −
                    </button>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 15,
                      minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => update(item.id, item.quantity + 1)}
                      style={{ width: 30, height: 30, borderRadius: 8,
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff', fontSize: 16, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                      +
                    </button>
                  </div>

                  {/* Total + remove */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>
                      ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <button onClick={() => remove(item.id)}
                      style={{ background: 'none', border: 'none',
                        color: 'rgba(255,107,107,0.7)', fontSize: 12,
                        cursor: 'pointer', marginTop: 4, fontFamily: 'inherit',
                        transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#FF6B6B'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,107,107,0.7)'}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: 20, padding: 'clamp(16px,3vw,24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'sticky', top: 120,
              }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 20, fontWeight: 700, color: '#fff',
                  marginBottom: 18 }}>Delivery Details</h3>

                {/* Address fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600,
                      color: 'rgba(255,255,255,0.4)', marginBottom: 5,
                      letterSpacing: 0.5 }}>NAME *</label>
                    <input placeholder="Recipient name" value={address.name}
                      onChange={e => setAddress({ ...address, name: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(139,111,191,0.7)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600,
                      color: 'rgba(255,255,255,0.4)', marginBottom: 5,
                      letterSpacing: 0.5 }}>PHONE *</label>
                    <input placeholder="10-digit number" type="tel"
                      value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(139,111,191,0.7)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600,
                    color: 'rgba(255,255,255,0.4)', marginBottom: 5,
                    letterSpacing: 0.5 }}>ADDRESS *</label>
                  <input placeholder="Flat / House No / Street"
                    value={address.flat}
                    onChange={e => setAddress({ ...address, flat: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,111,191,0.7)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8, marginBottom: 20 }}>
                  {[
                    { key: 'city', label: 'CITY', ph: 'City' },
                    { key: 'state', label: 'STATE', ph: 'State' },
                    { key: 'pincode', label: 'PINCODE', ph: '6 digits' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 600,
                        color: 'rgba(255,255,255,0.4)', marginBottom: 5,
                        letterSpacing: 0.5 }}>{f.label} *</label>
                      <input placeholder={f.ph} value={address[f.key]}
                        onChange={e => setAddress({ ...address, [f.key]: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'rgba(139,111,191,0.7)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                    </div>
                  ))}
                </div>

                {/* Order summary */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: 14, marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    marginBottom: 8, fontSize: 13.5,
                    color: 'rgba(255,255,255,0.55)' }}>
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    marginBottom: 8, fontSize: 13.5,
                    color: 'rgba(255,255,255,0.55)' }}>
                    <span>Delivery</span>
                    <span style={{ color: '#7DEBB5', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontWeight: 700, fontSize: 18, marginTop: 10 }}>
                    <span style={{ color: '#fff' }}>Total</span>
                    <span style={{ color: '#D4A853',
                      fontFamily: 'Cormorant Garamond, serif', fontSize: 22 }}>
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payment method */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)', marginBottom: 10,
                    letterSpacing: 0.5 }}>PAYMENT METHOD</p>
                  <div style={{ display: 'grid',
                    gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { id: 'online', icon: '💳', label: 'Pay Online',
                        sub: 'UPI · Cards · Net Banking' },
                      { id: 'cod', icon: '💵', label: 'Cash on Delivery',
                        sub: 'Pay when delivered' },
                    ].map(pm => (
                      <div key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                        style={{
                          border: `2px solid ${paymentMethod === pm.id
                            ? (pm.id === 'cod'
                              ? 'rgba(45,155,111,0.7)'
                              : 'rgba(139,111,191,0.7)')
                            : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 12, padding: '12px 10px',
                          cursor: 'pointer', textAlign: 'center',
                          background: paymentMethod === pm.id
                            ? (pm.id === 'cod'
                              ? 'rgba(45,155,111,0.1)'
                              : 'rgba(139,111,191,0.1)')
                            : 'rgba(255,255,255,0.03)',
                          transition: 'all 0.2s',
                        }}>
                        <div style={{ fontSize: 20, marginBottom: 5 }}>{pm.icon}</div>
                        <div style={{ fontSize: 12, fontWeight: 700,
                          color: paymentMethod === pm.id
                            ? '#fff' : 'rgba(255,255,255,0.6)',
                          marginBottom: 3 }}>{pm.label}</div>
                        <div style={{ fontSize: 10,
                          color: 'rgba(255,255,255,0.35)' }}>{pm.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={paymentMethod === 'online' ? handleOnlinePayment : handleCOD}
                  disabled={paying}
                  style={{
                    width: '100%',
                    background: paying ? 'rgba(255,255,255,0.1)' :
                      paymentMethod === 'cod'
                        ? 'linear-gradient(135deg, #2D9B6F, #1A6B4A)'
                        : 'linear-gradient(135deg, #8B6FBF, #C4587A)',
                    color: paying ? 'rgba(255,255,255,0.4)' : '#fff',
                    border: 'none', padding: '15px',
                    borderRadius: 14, fontSize: 15, fontWeight: 700,
                    cursor: paying ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: paying ? 'none' :
                      paymentMethod === 'cod'
                        ? '0 6px 20px rgba(45,155,111,0.35)'
                        : '0 6px 20px rgba(139,111,191,0.35)',
                    transition: 'all 0.2s',
                  }}>
                  {paying ? '⏳ Processing...' :
                    paymentMethod === 'cod'
                      ? `🚚 Place COD Order — ₹${total.toLocaleString('en-IN')}`
                      : `💳 Pay ₹${total.toLocaleString('en-IN')}`}
                </button>

                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)',
                  textAlign: 'center', marginTop: 12 }}>
                  {paymentMethod === 'online'
                    ? '🔒 Secured by Razorpay'
                    : '🚚 Pay cash when your order arrives'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
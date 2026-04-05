import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://safeher-backend-uyzs.onrender.com';

const imgSrc = (image) =>
  image?.startsWith('http') ? image : image ? `${API}/uploads/${image}` : null;

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
            color: star <= (hovered || value) ? '#D4A853' : 'rgba(255,255,255,0.15)',
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
  const [imgLoaded, setImgLoaded] = useState(false);
  const [address, setAddress] = useState({
    name: '', phone: '', flat: '', city: '', state: '', pincode: ''
  });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const token = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const loadProduct = async () => {
    const { data } = await axios.get(`${API}/api/products/${id}`);
    setProduct(data);
  };

  const loadReviews = async () => {
    const { data } = await axios.get(`${API}/api/products/${id}/reviews`);
    // ✅ FIXED: backend returns a plain array, not {reviews, avg, total}
    const list = Array.isArray(data) ? data : (data.reviews || []);
    setReviews(list);
    setTotalReviews(list.length);
    if (list.length > 0) {
      const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
      setAvgRating(avg.toFixed(1));
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadProduct(), loadReviews()])
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) return showToast('Please login to add to cart');
    try {
      await axios.post(`${API}/api/cart/add`,
        { product_id: id, quantity }, token());
      showToast('Added to cart! 🛒');
    } catch {
      showToast('Could not add to cart');
    }
  };

 

  if (loading) return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16,
      background: 'var(--grad-bg)',
    }}>
      <div style={{
        width: 48, height: 48,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>😕</div>
      <p style={{ color: 'var(--text-muted)' }}>Product not found.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--grad-bg)' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 86, right: 16, left: 16,
          maxWidth: 320, marginLeft: 'auto',
          background: 'rgba(45,155,111,0.95)',
          color: '#fff', padding: '12px 18px', borderRadius: 12,
          fontSize: 14, fontWeight: 500, zIndex: 999,
          animation: 'slideDown 0.3s ease',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>{toast}</div>
      )}

      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: 'clamp(16px,3vw,32px) clamp(12px,3vw,24px) 80px',
      }}>

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          background: 'rgba(139,111,191,0.1)',
          border: '1.5px solid var(--border-strong)',
          color: 'var(--primary)', padding: '8px 18px',
          borderRadius: 10, fontSize: 13, fontWeight: 600,
          marginBottom: 24, cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,111,191,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,111,191,0.1)'}>
          ← Back
        </button>

        {/* Product Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(20px, 4vw, 40px)',
          marginBottom: 48,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}>

          {/* Image */}
          <div style={{
            position: 'relative',
            minHeight: 'clamp(260px,40vw,420px)',
            background: 'var(--surface-2)', overflow: 'hidden',
          }}>
            {!imgLoaded && (
              <div className="skeleton" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
            )}
            {imgSrc(product.image) ? (
              <img src={imgSrc(product.image)} alt={product.name}
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  position: 'absolute', inset: 0,
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'transform 0.5s ease, opacity 0.3s ease',
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 80,
              }}>🛍️</div>
            )}
            {/* Category badge */}
            <div style={{
              position: 'absolute', top: 16, left: 16,
              background: 'rgba(139,111,191,0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: 20, padding: '5px 14px',
              fontSize: 12, fontWeight: 700, color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              {product.category_name}
            </div>
            {product.stock < 5 && product.stock > 0 && (
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(232,118,58,0.9)',
                borderRadius: 20, padding: '5px 12px',
                fontSize: 11, fontWeight: 700, color: '#fff',
              }}>
                Only {product.stock} left!
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{
            padding: 'clamp(20px,4vw,40px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>

            {/* Rating */}
            {totalReviews > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 14,
              }}>
                <StarRating value={Math.round(avgRating)} readonly />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#D4A853' }}>
                  {avgRating}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Name */}
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700,
              color: '#fff', lineHeight: 1.2, marginBottom: 8,
            }}>
              {product.name}
            </h1>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Sold by{' '}
              <strong style={{ color: 'var(--primary)' }}>{product.seller_name}</strong>
            </p>

            {/* Price */}
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700,
              color: '#D4A853', marginBottom: 8,
            }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </div>

            {/* Stock */}
            <p style={{
              fontSize: 13, fontWeight: 600, marginBottom: 16,
              color: product.stock < 1 ? '#FF8A8A'
                : product.stock < 5 ? '#F0C419' : '#7DEBB5',
            }}>
              {product.stock < 1 ? '❌ Out of Stock'
                : product.stock < 5 ? `⚠️ Only ${product.stock} left!`
                : `✅ ${product.stock} in stock`}
            </p>

            {/* Description */}
            {product.description && (
              <p style={{
                fontSize: 14.5, color: 'var(--text-secondary)',
                lineHeight: 1.8, marginBottom: 24,
              }}>{product.description}</p>
            )}

            {product.stock > 0 && (
              <>
                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                    Quantity:
                  </span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '6px 12px',
                    border: '1.5px solid var(--border-strong)',
                  }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{
                        background: 'none', border: 'none', fontSize: 18,
                        cursor: 'pointer', color: 'var(--primary)', fontWeight: 700,
                      }}>−</button>
                    <span style={{
                      fontWeight: 700, fontSize: 15,
                      minWidth: 20, textAlign: 'center', color: '#fff',
                    }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      style={{
                        background: 'none', border: 'none', fontSize: 18,
                        cursor: 'pointer', color: 'var(--primary)', fontWeight: 700,
                      }}>+</button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                  <button onClick={addToCart} style={{
                    flex: 1, minWidth: 130,
                    background: 'rgba(139,111,191,0.15)',
                    border: '2px solid rgba(139,111,191,0.5)',
                    color: '#C4A8E8', padding: '14px',
                    borderRadius: 12, fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(139,111,191,0.25)';
                      e.currentTarget.style.borderColor = 'rgba(139,111,191,0.8)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(139,111,191,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(139,111,191,0.5)';
                    }}>
                    🛒 Add to Cart
                  </button>
                
                </div>
              </>
            )}

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {['🚚 Free Delivery', '↩️ 7-Day Returns', '🔒 Secure Payment'].map(f => (
                <span key={f} style={{
                  fontSize: 12,
                  background: 'rgba(139,111,191,0.12)',
                  color: '#C4A8E8', padding: '5px 12px',
                  borderRadius: 20, fontWeight: 500,
                  border: '1px solid var(--border)',
                }}>{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 22, fontWeight: 700, color: '#fff',
              }}>Customer Reviews</h2>
              {totalReviews > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: '#D4A853' }}>
                    {avgRating}
                  </span>
                  <div>
                    <StarRating value={Math.round(avgRating)} readonly />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div style={{
              background: 'rgba(139,111,191,0.1)',
              borderRadius: 12, padding: '10px 16px',
              border: '1px solid var(--border-strong)',
            }}>
              <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
                💡 Purchased this product?
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Go to <strong style={{ color: 'var(--text-secondary)' }}>My Orders</strong> to leave a review.
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>⭐</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)' }}>
                No reviews for this product yet.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, opacity: 0.7 }}>
                Order this product and be the first to review it!
              </p>
            </div>
          ) : (
            <div style={{ padding: 'clamp(12px,2vw,24px)' }}>
              {reviews.map((r, i) => (
                <div key={r.id} style={{
                  padding: '18px 20px', marginBottom: 10,
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 14,
                  border: '1px solid var(--border)',
                  animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 10, marginBottom: 8, flexWrap: 'wrap',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'var(--grad-primary)', flexShrink: 0,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#fff',
                      fontWeight: 700, fontSize: 15,
                    }}>
                      {(r.reviewer || r.user_name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                        {r.reviewer || r.user_name}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(r.created_at).toLocaleDateString('en-IN',
                          { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <StarRating value={r.rating} readonly />
                    </div>
                  </div>
                  {r.comment && (
                    <p style={{
                      fontSize: 14, color: 'var(--text-secondary)',
                      lineHeight: 1.7, paddingLeft: 50,
                    }}>
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

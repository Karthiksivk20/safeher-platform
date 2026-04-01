import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const imgSrc = (image) =>
  image?.startsWith('http') ? image : image ? `http://localhost:5000/uploads/${image}` : null;

export default function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '',
    stock: '', category_id: '' });
  const [image, setImage] = useState(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  const token = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const load = async () => {
    const { data } = await axios.get('http://localhost:5000/api/products', token());
    setProducts(data.filter(p => p.seller_id === user?.id));
  };

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/'); return; }
    axios.get('http://localhost:5000/api/products/categories/all')
      .then(r => setCategories(r.data));
    load();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', category_id: '' });
    setImage(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '',
      price: p.price, stock: p.stock, category_id: p.category_id });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };
      if (editing) {
        if (!image) fd.append('existing_image', editing.image || '');
        await axios.put(`http://localhost:5000/api/products/${editing.id}`,
          fd, { headers });
        showToast('Product updated! ✅');
      } else {
        await axios.post('http://localhost:5000/api/products', fd, { headers });
        showToast('Product added! ✅');
      }
      resetForm();
      load();
    } catch {
      showToast('Something went wrong ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`http://localhost:5000/api/products/${id}`, token());
    showToast('Product deleted');
    load();
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: '📦' },
    { label: 'Total Stock', value: products.reduce((s, p) => s + Number(p.stock), 0), icon: '🏪' },
    { label: 'Avg Price', value: products.length
        ? '₹' + Math.round(products.reduce((s, p) => s + Number(p.price), 0) / products.length)
        : '₹0', icon: '💰' },
    { label: 'Low Stock', value: products.filter(p => p.stock < 5).length, icon: '⚠️' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#1a1a2e',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif',
            fontSize: 28, fontWeight: 600 }}>My Shop</h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
            Manage your products and listings
          </p>
          <Link to="/seller/orders" style={{ display: 'inline-block', marginTop: 10,
  background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
  color: '#fff', padding: '8px 18px', borderRadius: 10,
  fontSize: 13, fontWeight: 500 }}>
  📦 View Customer Orders
</Link>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={{
          background: showForm
            ? '#fff' : 'linear-gradient(135deg, #7F77DD, #D4537E)',
          color: showForm ? '#888' : '#fff',
          border: showForm ? '1.5px solid #ede8ff' : 'none',
          padding: '11px 22px', borderRadius: 12,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14,
            padding: '18px 20px',
            boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 28,
          boxShadow: '0 4px 24px rgba(127,119,221,0.12)', marginBottom: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
            {editing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid',
              gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 6 }}>Product Name</label>
                <input placeholder="e.g. Handwoven Silk Scarf"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 6 }}>Category</label>
                <select value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 6 }}>Price (₹)</label>
                <input placeholder="e.g. 499" type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                  display: 'block', marginBottom: 6 }}>Stock Quantity</label>
                <input placeholder="e.g. 50" type="number"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })} required />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                display: 'block', marginBottom: 6 }}>Description</label>
              <textarea placeholder="Describe your product..."
                rows={3} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#555',
                display: 'block', marginBottom: 6 }}>Product Image</label>
              <input type="file" accept="image/*"
                style={{ padding: '8px 14px' }}
                onChange={e => setImage(e.target.files[0])} />
              {editing?.image && !image && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={imgSrc(editing.image)} alt="current"
                    style={{ width: 60, height: 60, borderRadius: 8,
                      objectFit: 'cover' }} />
                  <p style={{ fontSize: 12, color: '#aaa' }}>
                    Current image. Upload new to replace.
                  </p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={loading} style={{
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', border: 'none', padding: '12px 28px',
                borderRadius: 10, fontSize: 14, fontWeight: 600,
                opacity: loading ? 0.7 : 1, cursor: 'pointer',
              }}>
                {loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={resetForm} style={{
                background: '#fff', border: '1.5px solid #ede8ff',
                color: '#888', padding: '12px 20px', borderRadius: 10,
                fontSize: 14, cursor: 'pointer',
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0eeff' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>
            Your Products ({products.length})
          </h3>
        </div>
        {products.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#aaa' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <p>No products yet. Add your first product above!</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf9ff' }}>
                {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left',
                    fontSize: 12, fontWeight: 600, color: '#aaa',
                    textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{ borderTop: '1px solid #f5f3ff',
                  background: i % 2 === 0 ? '#fff' : '#fdfcff' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)',
                        overflow: 'hidden', display: 'flex',
                        alignItems: 'center', justifyContent: 'center' }}>
                        {imgSrc(p.image)
                          ? <img src={imgSrc(p.image)} alt={p.name}
                              style={{ width: '100%', height: '100%',
                                objectFit: 'cover' }} />
                          : <span>🛍️</span>}
                      </div>
                      <div>
                        <p onClick={() => navigate(`/product/${p.id}`)}
  style={{ fontWeight: 500, fontSize: 14, cursor: 'pointer',
    color: '#7F77DD', textDecoration: 'underline' }}>
  {p.name}
</p>
                        <p style={{ fontSize: 12, color: '#bbb' }}>ID #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: '#f0eeff', color: '#7F77DD',
                      fontSize: 12, fontWeight: 500,
                      padding: '4px 10px', borderRadius: 20 }}>
                      {p.category_name}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600,
                    color: '#7F77DD', fontSize: 15 }}>
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontWeight: 600, fontSize: 14,
                      color: p.stock < 1 ? '#E24B4A'
                        : p.stock < 5 ? '#BA7517' : '#1D9E75' }}>
                      {p.stock} {p.stock < 5 && p.stock > 0 ? '⚠️' : ''}
                      {p.stock < 1 ? '❌' : ''}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(p)} style={{
                        background: '#f0eeff', color: '#7F77DD', border: 'none',
                        padding: '7px 14px', borderRadius: 8,
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{
                        background: '#fff0f0', color: '#E24B4A', border: 'none',
                        padding: '7px 14px', borderRadius: 8,
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

const CATEGORIES = ['harassment', 'stalking', 'unsafe_area', 'domestic_violence', 'other'];

export default function IncidentMap() {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'harassment', lat: null, lng: null });
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');
  const { user } = useAuth();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const token = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const load = () => axios.get(https://safeher-backend-uyzs.onrender.com/api/incidents')
    .then(r => setIncidents(r.data));

  const deleteIncident = async (id) => {
  if (!window.confirm('Delete this incident report?')) return;
  await axios.delete(`${API}/api/incidents/${id}`, token());
  showToast('Incident deleted');
  load();
};

  useEffect(() => { load(); }, []);

  const handleMapClick = ({ lat, lng }) => {
    if (!user) return showToast('Please login to report an incident');
    setForm(f => ({ ...f, lat, lng }));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(https://safeher-backend-uyzs.onrender.com/api/incidents', {
      title: form.title, description: form.description,
      category: form.category, latitude: form.lat, longitude: form.lng,
    }, token());
    setShowForm(false);
    setForm({ title: '', description: '', category: 'harassment', lat: null, lng: null });
    showToast('Incident reported!');
    load();
  };

  const categoryColor = {
    harassment: '#E24B4A', stalking: '#BA7517',
    unsafe_area: '#7F77DD', domestic_violence: '#D4537E', other: '#888',
  };

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#1a1a2e',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>{toast}</div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 600 }}>
          Safety Incident Map
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
          {user ? 'Click anywhere on the map to report an incident in that area.'
            : 'Login to report incidents. All reports are anonymous and help keep communities safe.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20,
        alignItems: 'flex-start' }}>

        <div style={{ borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(127,119,221,0.12)' }}>
          <MapContainer center={[20.5937, 78.9629]} zoom={5}
            style={{ height: 520, width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickHandler onMapClick={handleMapClick} />
            {incidents.map(inc => (
             <Marker key={inc.id} position={[inc.latitude, inc.longitude]}>
  <Popup>
    <div style={{ minWidth: 180 }}>
      <strong style={{ fontSize: 14 }}>{inc.title}</strong>
      <p style={{ fontSize: 12, color: '#666', margin: '4px 0' }}>
        {inc.description}
      </p>
      <span style={{ fontSize: 11,
        background: categoryColor[inc.category] + '22',
        color: categoryColor[inc.category],
        padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
        {inc.category}
      </span>
      {user && user.id === inc.user_id && (
        <button onClick={() => deleteIncident(inc.id)}
          style={{ display: 'block', marginTop: 10, width: '100%',
            background: '#fff0f0', border: '1px solid #ffd0d0',
            color: '#E24B4A', padding: '6px', borderRadius: 8,
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
          🗑️ Delete Report
        </button>
      )}
    </div>
  </Popup>
</Marker>
            ))}
          </MapContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 20,
            boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
              Legend
            </h3>
            {CATEGORIES.map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center',
                gap: 10, marginBottom: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%',
                  background: categoryColor[c], flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#555', textTransform: 'capitalize' }}>
                  {c.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 14, padding: 20,
            boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
              Total Reports
            </h3>
            <div style={{ fontSize: 36, fontWeight: 700,
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {incidents.length}
            </div>
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
              incidents reported in this area
            </p>
          </div>

          {showForm && (
            <div style={{ background: '#fff', borderRadius: 14, padding: 20,
              boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                Report Incident
              </h3>
              <p style={{ fontSize: 12, color: '#aaa', marginBottom: 14 }}>
                At {form.lat?.toFixed(4)}, {form.lng?.toFixed(4)}
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input placeholder="Short title" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required />
                <select value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace('_', ' ')}</option>
                  ))}
                </select>
                <textarea placeholder="Describe what happened..." rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
                <button type="submit" style={{
                  background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                  color: '#fff', border: 'none', padding: '11px',
                  borderRadius: 10, fontSize: 14, fontWeight: 600,
                }}>Submit Report</button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  background: '#fff', border: '1.5px solid #ede8ff',
                  color: '#888', padding: '9px', borderRadius: 10, fontSize: 13,
                }}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
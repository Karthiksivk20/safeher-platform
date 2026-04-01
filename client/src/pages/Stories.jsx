import { useState } from 'react';
import { Link }from 'react-router-dom';\nimport API from '../api';

const STORIES = [
  {
    name: 'Priya Sharma', city: 'Jaipur, Rajasthan', category: 'Handicrafts',
    emoji: '🧵', tag: 'Verified Seller',
    before: 'Was working as a daily wage worker earning ₹150/day with 3 children to feed.',
    after: 'Now runs a 12-member weaving cooperative earning ₹45,000/month.',
    quote: 'SafeHer gave me not just a platform but a community that believed in me.',
    revenue: '₹5.4L/year', products: 24, orders: 312, years: 2,
    color: '#f0eeff', textColor: '#7F77DD',
  },
  {
    name: 'Meena Devi', city: 'Varanasi, UP', category: 'Food & Spices',
    emoji: '🌶️', tag: 'Top Seller',
    before: 'Inherited traditional spice recipes but had no way to reach buyers beyond her village.',
    after: 'Ships across 18 states. Her masala blends are now in 500+ kitchens across India.',
    quote: 'My grandmother\'s recipes are now loved by families I have never met. That is magic.',
    revenue: '₹3.2L/year', products: 12, orders: 890, years: 3,
    color: '#fff8e6', textColor: '#BA7517',
  },
  {
    name: 'Anita Kumari', city: 'Kolkata, WB', category: 'Jewellery',
    emoji: '💍', tag: 'Rising Star',
    before: 'Sold jewellery on footpath, often harassed and earning barely ₹200/day.',
    after: 'Online store with 2,000+ happy customers. Featured in local newspapers.',
    quote: 'I no longer fear losing my income. I have a business now, not just a job.',
    revenue: '₹2.8L/year', products: 38, orders: 1240, years: 1,
    color: '#fff0f6', textColor: '#D4537E',
  },
  {
    name: 'Sunita Rao', city: 'Hyderabad, TS', category: 'Home Decor',
    emoji: '🏡', tag: 'Community Leader',
    before: 'Single mother who lost her job during pandemic with no income source.',
    after: 'Started with macrame during lockdown. Now teaches 20 women in her locality.',
    quote: 'The pandemic took my job but gave me my purpose. I am an entrepreneur now.',
    revenue: '₹1.9L/year', products: 18, orders: 456, years: 2,
    color: '#eafaf3', textColor: '#0F6E56',
  },
  {
    name: 'Lakshmi Nair', city: 'Kochi, Kerala', category: 'Beauty & Wellness',
    emoji: '💄', tag: 'Verified Seller',
    before: 'Ayurveda graduate with knowledge but no platform to monetize it.',
    after: 'Launched herbal beauty line. Ships internationally to UK, UAE and Canada.',
    quote: 'Ancient Indian wisdom is now reaching the world because of this platform.',
    revenue: '₹7.1L/year', products: 15, orders: 2100, years: 2,
    color: '#e6f1fb', textColor: '#185FA5',
  },
  {
    name: 'Kavya Patel', city: 'Ahmedabad, GJ', category: 'Clothing',
    emoji: '👗', tag: 'Top Seller',
    before: 'Skilled tailor working for others earning ₹8,000/month with no credit.',
    after: 'Her own clothing label with 50+ designs. Employs 5 women from her neighbourhood.',
    quote: 'I used to stitch dreams for others. Now I am living my own.',
    revenue: '₹4.3L/year', products: 52, orders: 780, years: 1,
    color: '#fef3e2', textColor: '#854F0B',
  },
];

export default function Stories() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const s = selected;
    return (
      <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 24px 60px' }}>
        <button onClick={() => setSelected(null)} style={{
          background: 'none', border: '1.5px solid #ede8ff', color: '#7F77DD',
          padding: '8px 16px', borderRadius: 10, fontSize: 13,
          fontWeight: 500, marginBottom: 24, cursor: 'pointer',
        }}>← Back to Stories</button>

        <div style={{ background: '#fff', borderRadius: 20,
          overflow: 'hidden', boxShadow: '0 4px 32px rgba(127,119,221,0.12)' }}>
          <div style={{ background: `linear-gradient(135deg, ${s.color}, #fff)`,
            padding: '40px 40px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%',
                background: s.color, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 40,
                border: `3px solid ${s.textColor}22` }}>{s.emoji}</div>
              <div>
                <h1 style={{ fontFamily: 'Playfair Display, serif',
                  fontSize: 28, fontWeight: 600 }}>{s.name}</h1>
                <p style={{ color: '#888', marginTop: 4 }}>
                  {s.city} · {s.category}
                </p>
                <span style={{ fontSize: 12, background: s.color,
                  color: s.textColor, padding: '3px 10px',
                  borderRadius: 20, fontWeight: 600,
                  display: 'inline-block', marginTop: 6 }}>{s.tag}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap: 12, marginTop: 24 }}>
              {[
                { label: 'Annual Revenue', value: s.revenue },
                { label: 'Products', value: s.products },
                { label: 'Orders', value: s.orders },
                { label: 'Years on Platform', value: s.years },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.8)',
                  borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700,
                    color: s.textColor }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: '#888',
                    marginTop: 3 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '32px 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 20, marginBottom: 28 }}>
              <div style={{ background: '#fff5f5', borderRadius: 14, padding: 20,
                borderLeft: '4px solid #E24B4A' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#E24B4A',
                  marginBottom: 8, textTransform: 'uppercase',
                  letterSpacing: 0.5 }}>Before SafeHer</p>
                <p style={{ fontSize: 14, color: '#555',
                  lineHeight: 1.7 }}>{s.before}</p>
              </div>
              <div style={{ background: '#f0fff4', borderRadius: 14, padding: 20,
                borderLeft: '4px solid #1D9E75' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75',
                  marginBottom: 8, textTransform: 'uppercase',
                  letterSpacing: 0.5 }}>After SafeHer</p>
                <p style={{ fontSize: 14, color: '#555',
                  lineHeight: 1.7 }}>{s.after}</p>
              </div>
            </div>

            <div style={{ background: s.color, borderRadius: 14, padding: 24,
              borderLeft: `4px solid ${s.textColor}` }}>
              <p style={{ fontSize: 18, fontStyle: 'italic', color: '#333',
                lineHeight: 1.8, marginBottom: 12 }}>"{s.quote}"</p>
              <p style={{ fontSize: 13, fontWeight: 600,
                color: s.textColor }}>— {s.name}</p>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Link to="/" style={{ background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', padding: '12px 28px', borderRadius: 12,
                fontWeight: 600, fontSize: 14 }}>
                Shop {s.name}'s Products 🛍️
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>

      <div style={{ background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
        borderRadius: 20, padding: '48px 40px', marginBottom: 48,
        color: '#fff', textAlign: 'center', position: 'relative',
        overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200,
          height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -20, width: 240,
          height: 240, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)' }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75,
          letterSpacing: 2, textTransform: 'uppercase',
          marginBottom: 12 }}>Real Women · Real Impact</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40,
          fontWeight: 600, marginBottom: 12 }}>Success Stories</h1>
        <p style={{ opacity: 0.85, fontSize: 16, maxWidth: 520,
          margin: '0 auto', lineHeight: 1.7 }}>
          Every product you buy changes a life. Meet the women whose lives
          SafeHer has helped transform.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 24 }}>
        {STORIES.map(s => (
          <div key={s.name} onClick={() => setSelected(s)}
            style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
              cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
              border: '0.5px solid #f0eeff' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(127,119,221,0.16)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 16px rgba(127,119,221,0.08)';
            }}>
            <div style={{ background: `linear-gradient(135deg, ${s.color}, #fff)`,
              padding: '28px 24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%',
                  background: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 28,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>{s.emoji}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{s.name}</h3>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {s.city}
                  </p>
                  <span style={{ fontSize: 11, background: s.color,
                    color: s.textColor, padding: '2px 8px', borderRadius: 20,
                    fontWeight: 600, display: 'inline-block',
                    marginTop: 4 }}>{s.tag}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px 24px' }}>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7,
                marginBottom: 16 }}>{s.after}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Revenue', value: s.revenue },
                  { label: 'Orders', value: s.orders },
                ].map(stat => (
                  <div key={stat.label} style={{ background: s.color,
                    borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700,
                      color: s.textColor }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: '#888',
                      marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, fontStyle: 'italic', color: '#888',
                lineHeight: 1.6, borderLeft: `3px solid ${s.textColor}`,
                paddingLeft: 12 }}>"{s.quote}"</p>
              <button style={{ marginTop: 16, width: '100%',
                background: `linear-gradient(135deg, ${s.textColor}, #D4537E)`,
                color: '#fff', border: 'none', padding: '10px',
                borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer' }}>
                Read Full Story →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
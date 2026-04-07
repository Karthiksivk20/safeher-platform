import { useState } from 'react';
import { Link } from 'react-router-dom';

const STORIES = [
  { name: 'Priya Sharma', city: 'Jaipur, Rajasthan', category: 'Handicrafts', emoji: '🧵', tag: 'Verified Seller', before: 'Was working as a daily wage worker earning ₹150/day with 3 children to feed.', after: 'Now runs a 12-member weaving cooperative earning ₹45,000/month.', quote: 'SafeHer gave me not just a platform but a community that believed in me.', revenue: '₹5.4L/year', products: 24, orders: 312, years: 2, color: '#f0eeff', textColor: '#7F77DD' },
  { name: 'Meena Devi', city: 'Varanasi, UP', category: 'Food & Spices', emoji: '🌶️', tag: 'Top Seller', before: 'Inherited traditional spice recipes but had no way to reach buyers beyond her village.', after: 'Ships across 18 states. Her masala blends are now in 500+ kitchens across India.', quote: "My grandmother's recipes are now loved by families I have never met. That is magic.", revenue: '₹3.2L/year', products: 12, orders: 890, years: 3, color: '#fff8e6', textColor: '#BA7517' },
  { name: 'Anita Kumari', city: 'Kolkata, WB', category: 'Jewellery', emoji: '💍', tag: 'Rising Star', before: 'Sold jewellery on footpath, often harassed and earning barely ₹200/day.', after: 'Online store with 2,000+ happy customers. Featured in local newspapers.', quote: 'I no longer fear losing my income. I have a business now, not just a job.', revenue: '₹2.8L/year', products: 38, orders: 1240, years: 1, color: '#fff0f6', textColor: '#D4537E' },
  { name: 'Sunita Rao', city: 'Hyderabad, TS', category: 'Home Decor', emoji: '🏡', tag: 'Community Leader', before: 'Single mother who lost her job during pandemic with no income source.', after: 'Started with macrame during lockdown. Now teaches 20 women in her locality.', quote: 'The pandemic took my job but gave me my purpose. I am an entrepreneur now.', revenue: '₹1.9L/year', products: 18, orders: 456, years: 2, color: '#eafaf3', textColor: '#0F6E56' },
  { name: 'Lakshmi Nair', city: 'Kochi, Kerala', category: 'Beauty & Wellness', emoji: '💄', tag: 'Verified Seller', before: 'Ayurveda graduate with knowledge but no platform to monetize it.', after: 'Launched herbal beauty line. Ships internationally to UK, UAE and Canada.', quote: 'Ancient Indian wisdom is now reaching the world because of this platform.', revenue: '₹7.1L/year', products: 15, orders: 2100, years: 2, color: '#e6f1fb', textColor: '#185FA5' },
  { name: 'Kavya Patel', city: 'Ahmedabad, GJ', category: 'Clothing', emoji: '👗', tag: 'Top Seller', before: 'Skilled tailor working for others earning ₹8,000/month with no credit.', after: 'Her own clothing label with 50+ designs. Employs 5 women from her neighbourhood.', quote: 'I used to stitch dreams for others. Now I am living my own.', revenue: '₹4.3L/year', products: 52, orders: 780, years: 1, color: '#fef3e2', textColor: '#854F0B' },
];

export default function Stories() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const s = selected;
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(14px,4vw,32px) clamp(12px,3vw,24px) 60px' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: '1.5px solid #ede8ff', color: '#7F77DD', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, marginBottom: 20, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back to Stories
        </button>
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 32px rgba(127,119,221,0.12)' }}>
          <div style={{ background: `linear-gradient(135deg, ${s.color}, #fff)`, padding: 'clamp(18px,4vw,40px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 'clamp(56px,10vw,80px)', height: 'clamp(56px,10vw,80px)', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(26px,6vw,40px)', flexShrink: 0, border: `3px solid ${s.textColor}22` }}>{s.emoji}</div>
              <div>
                <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 700 }}>{s.name}</h1>
                <p style={{ color: '#888', marginTop: 4, fontSize: 13 }}>{s.city} · {s.category}</p>
                <span style={{ fontSize: 11, background: s.color, color: s.textColor, padding: '3px 10px', borderRadius: 20, fontWeight: 600, display: 'inline-block', marginTop: 6 }}>{s.tag}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
              {[{ label: 'Annual Revenue', value: s.revenue }, { label: 'Products', value: s.products }, { label: 'Orders', value: s.orders }, { label: 'Years', value: s.years }].map(stat => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(14px,3vw,20px)', fontWeight: 700, color: s.textColor }}>{stat.value}</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 3 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 'clamp(14px,3vw,32px) clamp(14px,3vw,40px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div style={{ background: '#fff5f5', borderRadius: 14, padding: 'clamp(12px,2vw,20px)', borderLeft: '4px solid #E24B4A' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#E24B4A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Before SafeHer</p>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{s.before}</p>
              </div>
              <div style={{ background: '#f0fff4', borderRadius: 14, padding: 'clamp(12px,2vw,20px)', borderLeft: '4px solid #1D9E75' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#1D9E75', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>After SafeHer</p>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{s.after}</p>
              </div>
            </div>
            <div style={{ background: s.color, borderRadius: 14, padding: 'clamp(14px,3vw,24px)', borderLeft: `4px solid ${s.textColor}`, marginBottom: 20 }}>
              <p style={{ fontSize: 'clamp(14px,3vw,18px)', fontStyle: 'italic', color: '#333', lineHeight: 1.8, marginBottom: 10 }}>"{s.quote}"</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: s.textColor }}>— {s.name}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link to="/" style={{ background: 'linear-gradient(135deg, #7F77DD, #D4537E)', color: '#fff', padding: '12px 28px', borderRadius: 12, fontWeight: 600, fontSize: 14, display: 'inline-block' }}>
                Shop {s.name}'s Products 🛍️
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(14px,4vw,32px) clamp(12px,3vw,24px) 60px' }}>
      <div style={{ background: 'linear-gradient(135deg, #7F77DD, #D4537E)', borderRadius: 20, padding: 'clamp(24px,5vw,48px) clamp(18px,4vw,40px)', marginBottom: 32, color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -20, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Real Women · Real Impact</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(26px,6vw,40px)', fontWeight: 700, marginBottom: 12 }}>Success Stories</h1>
        <p style={{ opacity: 0.85, fontSize: 'clamp(13px,2vw,16px)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>Every product you buy changes a life. Meet the women whose lives SafeHer has helped transform.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 'clamp(12px,2vw,24px)' }}>
        {STORIES.map(s => (
          <div key={s.name} onClick={() => setSelected(s)}
            style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(127,119,221,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: '0.5px solid #f0eeff' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(127,119,221,0.16)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(127,119,221,0.08)'; }}>
            <div style={{ background: `linear-gradient(135deg, ${s.color}, #fff)`, padding: 'clamp(16px,3vw,28px) clamp(14px,3vw,24px) clamp(12px,2vw,20px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>{s.emoji}</div>
                <div>
                  <h3 style={{ fontSize: 'clamp(13px,2vw,16px)', fontWeight: 600 }}>{s.name}</h3>
                  <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{s.city}</p>
                  <span style={{ fontSize: 10, background: s.color, color: s.textColor, padding: '2px 8px', borderRadius: 20, fontWeight: 600, display: 'inline-block', marginTop: 4 }}>{s.tag}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: 'clamp(12px,2vw,16px) clamp(14px,3vw,24px) clamp(14px,3vw,24px)' }}>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 12 }}>{s.after}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[{ label: 'Revenue', value: s.revenue }, { label: 'Orders', value: s.orders }].map(stat => (
                  <div key={stat.label} style={{ background: s.color, borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(12px,2vw,15px)', fontWeight: 700, color: s.textColor }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, fontStyle: 'italic', color: '#888', lineHeight: 1.6, borderLeft: `3px solid ${s.textColor}`, paddingLeft: 10, marginBottom: 12 }}>"{s.quote}"</p>
              <button style={{ width: '100%', background: `linear-gradient(135deg, ${s.textColor}, #D4537E)`, color: '#fff', border: 'none', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Read Full Story →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
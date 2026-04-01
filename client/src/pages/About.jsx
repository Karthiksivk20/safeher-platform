import { useEffect, useState } from 'react';
import axios from 'axios';

function StatsGrid() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats')
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
      Loading stats...
    </div>
  );

  const items = [
    { icon: '👩‍💼', value: stats.sellers, label: 'Women Sellers' },
    { icon: '🛍️', value: stats.products, label: 'Products Listed' },
    { icon: '📦', value: stats.orders, label: 'Orders Placed' },
    { icon: '💰', value: '₹' + Number(stats.revenue).toLocaleString('en-IN'), label: 'Revenue Generated' },
    { icon: '💬', value: stats.forum_posts, label: 'Forum Posts' },
    { icon: '🗺️', value: stats.incidents, label: 'Safety Reports' },
  ];

  return (
    <div style={{ display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 16 }}>
      {items.map(s => (
        <div key={s.label} style={{ background: '#fff', borderRadius: 16,
          padding: '24px 20px', textAlign: 'center',
          boxShadow: '0 2px 12px rgba(127,119,221,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
          <div style={{ fontSize: 26, fontWeight: 700,
            background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 13, color: '#888' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

const VALUES = [
  { icon: '💜', title: 'Empowerment', desc: 'We believe every woman has the potential to be an entrepreneur. Our platform removes barriers and creates opportunities for women across India.' },
  { icon: '🛡️', title: 'Safety', desc: 'Women\'s safety is at the heart of everything we do. Our incident map and community features keep our users protected at all times.' },
  { icon: '🌱', title: 'Sustainability', desc: 'We promote eco-friendly, handmade and traditional products that preserve India\'s rich cultural heritage for future generations.' },
  { icon: '🤝', title: 'Community', desc: 'We are more than a marketplace. We are a community of women who support, inspire and uplift each other every single day.' },
  { icon: '📚', title: 'Education', desc: 'Through our Learning Hub and Funding Guide, we equip women with the knowledge to grow their businesses confidently and independently.' },
  { icon: '⚖️', title: 'Equality', desc: 'Aligned with the United Nations SDG 5, we are committed to achieving gender equality and empowering all women and girls everywhere.' },
];

const MILESTONES = [
  { year: '2025', event: 'SafeHer idea born — Karthik Sivakumar identifies the gap in the market for a women-focused entrepreneurship platform in India.' },
  { year: '2025', event: 'Development begins — Full stack platform built from scratch using React, Node.js and MySQL.' },
  { year: '2025', event: 'Core features completed — Marketplace, Safety Map, Community Forum, Learning Hub and Funding Guide all launched.' },
  { year: '2025', event: 'First sellers onboarded — Women entrepreneurs from across India join the platform and list their products.' },
  { year: '2025', event: 'Platform goes live — SafeHer officially launches and begins its mission to empower women entrepreneurs.' },
  { year: '2026', event: 'Growth phase — Expanding user base, adding more features and working towards our first major revenue milestone.' },
];

export default function About() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #7F77DD 0%, #D4537E 100%)',
        borderRadius: 24, padding: '64px 48px', marginTop: 32, marginBottom: 56,
        color: '#fff', position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 280,
          height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 300,
          height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ fontSize: 56, marginBottom: 16 }}>🌸</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 44,
          fontWeight: 600, marginBottom: 20, lineHeight: 1.2 }}>
          About SafeHer
        </h1>
        <p style={{ fontSize: 17, lineHeight: 2, maxWidth: 820,
          margin: '0 auto', opacity: 0.92 }}>
          SafeHer is India's first Women Entrepreneurship and Safety Marketplace —
          a platform built with one mission: to empower women by giving them a safe,
          supportive and thriving space to build their businesses, share their stories,
          and grow together. We are an early-stage startup with a bold vision — currently
          in our growth phase, onboarding women sellers, building our community and
          proving that technology can be a powerful force for gender equality. We are
          just getting started, and every seller, buyer and supporter who joins us today
          is part of writing this story from the very beginning.
        </p>
      </div>

      {/* Mission & Vision */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 24, marginBottom: 56 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 36,
          boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
          border: '0.5px solid #f0eeff' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24,
            fontWeight: 600, marginBottom: 14 }}>Our Mission</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.9 }}>
            To create an inclusive digital ecosystem where every woman in India can
            discover, launch and grow her business — regardless of her background,
            location or education. We provide the tools, the community and the safety
            net that women entrepreneurs need to thrive in today's economy. Through our
            marketplace, safety features, community forum, learning hub and funding
            guidance, we address every dimension of women's economic empowerment —
            aligned with the United Nations Sustainable Development Goal 5: Gender Equality.
          </p>
        </div>
        <div style={{ background: '#fff', borderRadius: 20, padding: 36,
          boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
          border: '0.5px solid #f0eeff' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👁️</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24,
            fontWeight: 600, marginBottom: 14 }}>Our Vision</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.9 }}>
            A future where gender is never a barrier to economic participation. Where
            a woman in a small town has the same access to markets, funding and
            opportunities as anyone else. We envision SafeHer as the platform that
            powers one million women entrepreneurs across India by 2030 — creating
            ripple effects across families, communities and the national economy.
            Because when women succeed, everyone succeeds. Every rupee earned by a
            woman on SafeHer goes back into her family and her community.
          </p>
        </div>
      </div>

      {/* Real Impact Stats */}
      <div style={{ background: 'linear-gradient(135deg, #f0eeff, #ffe4f0)',
        borderRadius: 20, padding: 40, marginBottom: 56 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
          fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>
          Where We Stand Today
        </h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 14,
          marginBottom: 32 }}>
          Real numbers from our growing platform — no exaggeration, just honest progress.
        </p>
        <StatsGrid />
      </div>

      {/* Core Values */}
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
        fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
        Our Core Values
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 20, marginBottom: 56 }}>
        {VALUES.map(v => (
          <div key={v.title} style={{ background: '#fff', borderRadius: 16,
            padding: 24, boxShadow: '0 2px 12px rgba(127,119,221,0.07)',
            border: '0.5px solid #f0eeff' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              {v.title}
            </h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Journey Timeline */}
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
        fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
        Our Journey
      </h2>
      <div style={{ background: '#fff', borderRadius: 20, padding: 36,
        boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
        marginBottom: 56, border: '0.5px solid #f0eeff' }}>
        {MILESTONES.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column',
              alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 11, fontWeight: 700 }}>{m.year}</div>
              {i < MILESTONES.length - 1 && (
                <div style={{ width: 2, height: 32, background: '#f0eeff',
                  marginTop: 4 }} />
              )}
            </div>
            <div style={{ paddingTop: 12,
              paddingBottom: i < MILESTONES.length - 1 ? 20 : 0 }}>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7 }}>
                {m.event}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* What Makes Us Different */}
      <div style={{ background: '#fff', borderRadius: 20, padding: 40,
        boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
        border: '0.5px solid #f0eeff', marginBottom: 56 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
          fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
          What Makes SafeHer Different
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: 20 }}>
          {[
            { icon: '🗺️', title: 'Safety First', desc: 'The only marketplace in India with a built-in women\'s safety incident map and emergency support system.' },
            { icon: '💸', title: 'Zero Listing Fee', desc: 'Completely free for women sellers to list products. We only earn when you earn — a small commission on sales.' },
            { icon: '🎓', title: 'Built-in Learning', desc: 'Free business courses, funding guides and resources — all inside the same platform.' },
            { icon: '🌐', title: 'Pan-India Reach', desc: 'Connect with buyers from across India. Built to scale from day one.' },
            { icon: '💬', title: 'Community Support', desc: 'A growing forum where women share advice, legal help, business tips and emotional support.' },
            { icon: '🏛️', title: 'SDG 5 Aligned', desc: 'Built specifically to advance the United Nations Sustainable Development Goal 5: Gender Equality.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#f7f5ff', borderRadius: 14,
              padding: 20, border: '0.5px solid #ede8ff' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6,
                color: '#7F77DD' }}>{f.title}</h4>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Section */}
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
        fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
        The Person Behind SafeHer
      </h2>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40,
        boxShadow: '0 4px 32px rgba(127,119,221,0.12)',
        border: '2px solid #7F77DD', marginBottom: 56 }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start',
          flexWrap: 'wrap' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%',
            flexShrink: 0, background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 56, boxShadow: '0 8px 32px rgba(127,119,221,0.3)' }}>
            👨‍💻
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
                fontWeight: 600 }}>Karthik Sivakumar</h3>
              <span style={{ background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', fontSize: 12, fontWeight: 600,
                padding: '4px 14px', borderRadius: 20 }}>
                Founder & CEO
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#7F77DD', fontWeight: 500,
              marginBottom: 20 }}>
              🎓 Computer Science Student · Sathyabama University, Chennai
            </p>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.9,
              marginBottom: 16 }}>
              Karthik Sivakumar is the sole founder, designer, developer and visionary
              behind SafeHer. As a Computer Science student at Sathyabama University
              in Chennai, Karthik built this entire platform from scratch — the backend,
              the frontend, the database, the UI and every single feature — driven by a
              deep belief that technology can be a powerful force for gender equality
              and social change.
            </p>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.9,
              marginBottom: 16 }}>
              Inspired by real stories of women entrepreneurs struggling to find markets,
              facing unsafe environments and lacking business knowledge, Karthik set out
              to build more than just a marketplace. SafeHer is his answer to a gap he
              saw in society — a platform that combines commerce, community, safety and
              education under one roof, built specifically for the women of India.
            </p>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.9,
              marginBottom: 20 }}>
              SafeHer is Karthik's contribution to the United Nations SDG 5 — Gender
              Equality. He manages the platform entirely on his own, continuously adding
              new features, supporting sellers and ensuring every woman who joins SafeHer
              has the best possible experience. His mission is simple: to use code as a
              tool to change lives, one woman entrepreneur at a time.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: '💻 Full Stack Developer', bg: '#f0eeff', color: '#7F77DD' },
                { label: '🎓 Sathyabama University', bg: '#fff0f6', color: '#D4537E' },
                { label: '🌍 SDG 5 Advocate', bg: '#eafaf3', color: '#0F6E56' },
                { label: '🚀 Solo Builder', bg: '#fff8e6', color: '#BA7517' },
              ].map(tag => (
                <span key={tag.label} style={{ background: tag.bg, color: tag.color,
                  fontSize: 12, fontWeight: 500, padding: '6px 14px',
                  borderRadius: 20 }}>{tag.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SDG Section */}
      <div style={{ background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
        borderRadius: 20, padding: 40, color: '#fff', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28,
          fontWeight: 600, marginBottom: 14 }}>
          United Nations SDG 5 — Gender Equality
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.9, maxWidth: 700,
          margin: '0 auto', opacity: 0.92 }}>
          SafeHer is proudly aligned with the United Nations Sustainable Development
          Goal 5 which calls for achieving gender equality and empowering all women
          and girls. Every feature of our platform — from the marketplace to the safety
          map to the community forum — is designed to advance this goal and create a
          world where every woman has equal economic opportunity, safety and dignity.
          We are just starting this journey — and we invite you to be part of it.
        </p>
      </div>

    </div>
  );
}
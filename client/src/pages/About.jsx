import { useEffect, useState } from 'react';
import axios from 'axios';

function StatsGrid() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('https://safeher-backend-uyzs.onrender.com/api/admin/stats')
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))',
      gap: 16,
    }}>
      {items.map(s => (
        <div key={s.label} style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--border-strong)',
          borderRadius: 16, padding: '24px 20px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
          <div style={{
            fontSize: 26, fontWeight: 700,
            background: 'var(--grad-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 4,
          }}>{s.value}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</div>
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

const sectionHeading = {
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: 28, fontWeight: 700,
  color: '#F0EAF8',  // ✅ bright white-purple, always visible
  marginBottom: 24, textAlign: 'center',
};

const card = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid var(--border-strong)',
  borderRadius: 20,
  padding: 36,
};

export default function About() {
  return (
    <div style={{
      maxWidth: 1100, margin: '0 auto',
      padding: '0 clamp(12px,3vw,24px) 80px',
    }}>

      {/* Hero */}
      <div style={{
        background: 'var(--grad-primary)',
        borderRadius: 24, padding: 'clamp(36px,6vw,64px) clamp(20px,5vw,48px)',
        marginTop: 32, marginBottom: 56,
        color: '#fff', position: 'relative',
        overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 280,
          height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 300,
          height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ fontSize: 56, marginBottom: 16 }}>🌸</div>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700,
          marginBottom: 20, lineHeight: 1.2, color: '#fff',
        }}>
          About SafeHer
        </h1>
        <p style={{
          fontSize: 'clamp(14px,2vw,17px)', lineHeight: 2,
          maxWidth: 820, margin: '0 auto', opacity: 0.92,
        }}>
          SafeHer is India's first Women Entrepreneurship and Safety Marketplace —
          a platform built with one mission: to empower women by giving them a safe,
          supportive and thriving space to build their businesses, share their stories,
          and grow together. We are an early-stage startup with a bold vision — currently
          in our growth phase, onboarding women sellers, building our community and
          proving that technology can be a powerful force for gender equality.
        </p>
      </div>

      {/* Mission & Vision */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))',
        gap: 24, marginBottom: 56,
      }}>
        {[
          { icon: '🎯', title: 'Our Mission', text: 'To create an inclusive digital ecosystem where every woman in India can discover, launch and grow her business — regardless of her background, location or education. We provide the tools, the community and the safety net that women entrepreneurs need to thrive in today\'s economy. Through our marketplace, safety features, community forum, learning hub and funding guidance, we address every dimension of women\'s economic empowerment — aligned with the United Nations Sustainable Development Goal 5: Gender Equality.' },
          { icon: '👁️', title: 'Our Vision', text: 'A future where gender is never a barrier to economic participation. Where a woman in a small town has the same access to markets, funding and opportunities as anyone else. We envision SafeHer as the platform that powers one million women entrepreneurs across India by 2030 — creating ripple effects across families, communities and the national economy. Because when women succeed, everyone succeeds. Every rupee earned by a woman on SafeHer goes back into her family and her community.' },
        ].map(card2 => (
          <div key={card2.title} style={{ ...card }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>{card2.icon}</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 24, fontWeight: 700,
              color: '#F0EAF8',   // ✅ bright heading
              marginBottom: 14,
            }}>{card2.title}</h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
              {card2.text}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        background: 'rgba(139,111,191,0.1)',
        border: '1px solid var(--border-strong)',
        borderRadius: 20, padding: 40, marginBottom: 56,
      }}>
        <h2 style={sectionHeading}>Where We Stand Today</h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-muted)',
          fontSize: 14, marginBottom: 32,
        }}>
          Real numbers from our growing platform — no exaggeration, just honest progress.
        </p>
        <StatsGrid />
      </div>

      {/* Core Values */}
      <h2 style={sectionHeading}>Our Core Values</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
        gap: 20, marginBottom: 56,
      }}>
        {VALUES.map(v => (
          <div key={v.title} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            borderRadius: 16, padding: 24,
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
            <h3 style={{
              fontSize: 16, fontWeight: 700,
              color: '#F0EAF8',   // ✅ bright
              marginBottom: 8,
            }}>{v.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {v.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Journey Timeline */}
      <h2 style={sectionHeading}>Our Journey</h2>
      <div style={{ ...card, marginBottom: 56 }}>
        {MILESTONES.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--grad-primary)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff',
                fontSize: 11, fontWeight: 700,
              }}>{m.year}</div>
              {i < MILESTONES.length - 1 && (
                <div style={{
                  width: 2, height: 32,
                  background: 'var(--border-strong)',
                  marginTop: 4,
                }} />
              )}
            </div>
            <div style={{
              paddingTop: 12,
              paddingBottom: i < MILESTONES.length - 1 ? 20 : 0,
            }}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {m.event}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* What Makes Us Different */}
      <div style={{ ...card, marginBottom: 56 }}>
        <h2 style={sectionHeading}>What Makes SafeHer Different</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
          gap: 20,
        }}>
          {[
            { icon: '🗺️', title: 'Safety First', desc: 'The only marketplace in India with a built-in women\'s safety incident map and emergency support system.' },
            { icon: '💸', title: 'Zero Listing Fee', desc: 'Completely free for women sellers to list products. We only earn when you earn — a small commission on sales.' },
            { icon: '🎓', title: 'Built-in Learning', desc: 'Free business courses, funding guides and resources — all inside the same platform.' },
            { icon: '🌐', title: 'Pan-India Reach', desc: 'Connect with buyers from across India. Built to scale from day one.' },
            { icon: '💬', title: 'Community Support', desc: 'A growing forum where women share advice, legal help, business tips and emotional support.' },
            { icon: '🏛️', title: 'SDG 5 Aligned', desc: 'Built specifically to advance the United Nations Sustainable Development Goal 5: Gender Equality.' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'rgba(139,111,191,0.08)',
              borderRadius: 14, padding: 20,
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h4 style={{
                fontSize: 15, fontWeight: 700,
                marginBottom: 6, color: '#C4A8E8',  // ✅ light purple, visible
              }}>{f.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Founder */}
      <h2 style={sectionHeading}>The Person Behind SafeHer</h2>
      <div style={{
        ...card,
        border: '2px solid rgba(139,111,191,0.5)',
        marginBottom: 56,
      }}>
        <div style={{
          display: 'flex', gap: 32,
          alignItems: 'flex-start', flexWrap: 'wrap',
        }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            flexShrink: 0, background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 56,
            boxShadow: '0 8px 32px rgba(139,111,191,0.4)',
          }}>
            👨‍💻
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 12, marginBottom: 8, flexWrap: 'wrap',
            }}>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 28, fontWeight: 700,
                color: '#F0EAF8',   // ✅ bright
              }}>Karthik Sivakumar</h3>
              <span style={{
                background: 'var(--grad-primary)',
                color: '#fff', fontSize: 12, fontWeight: 600,
                padding: '4px 14px', borderRadius: 20,
              }}>Founder & CEO</span>
            </div>
            <p style={{
              fontSize: 14, color: 'var(--primary)',
              fontWeight: 500, marginBottom: 20,
            }}>
              🎓 Computer Science Student · Sathyabama University, Chennai
            </p>
            {[
              'Karthik Sivakumar is the sole founder, designer, developer and visionary behind SafeHer. As a Computer Science student at Sathyabama University in Chennai, Karthik built this entire platform from scratch — the backend, the frontend, the database, the UI and every single feature — driven by a deep belief that technology can be a powerful force for gender equality and social change.',
              'Inspired by real stories of women entrepreneurs struggling to find markets, facing unsafe environments and lacking business knowledge, Karthik set out to build more than just a marketplace. SafeHer is his answer to a gap he saw in society — a platform that combines commerce, community, safety and education under one roof, built specifically for the women of India.',
              'SafeHer is Karthik\'s contribution to the United Nations SDG 5 — Gender Equality. He manages the platform entirely on his own, continuously adding new features, supporting sellers and ensuring every woman who joins SafeHer has the best possible experience.',
            ].map((para, i) => (
              <p key={i} style={{
                fontSize: 15, color: 'var(--text-secondary)',
                lineHeight: 1.9, marginBottom: 16,
              }}>{para}</p>
            ))}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              {[
                { label: '💻 Full Stack Developer', color: '#C4A8E8', bg: 'rgba(139,111,191,0.15)' },
                { label: '🎓 Sathyabama University', color: '#F0A0C0', bg: 'rgba(196,88,122,0.15)' },
                { label: '🌍 SDG 5 Advocate', color: '#7DEBB5', bg: 'rgba(45,155,111,0.15)' },
                { label: '🚀 Solo Builder', color: '#D4A853', bg: 'rgba(212,168,83,0.15)' },
              ].map(tag => (
                <span key={tag.label} style={{
                  background: tag.bg, color: tag.color,
                  fontSize: 12, fontWeight: 600,
                  padding: '6px 14px', borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>{tag.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SDG Section */}
      <div style={{
        background: 'var(--grad-primary)',
        borderRadius: 20, padding: 40,
        color: '#fff', textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 28, fontWeight: 700,
          marginBottom: 14, color: '#fff',
        }}>
          United Nations SDG 5 — Gender Equality
        </h2>
        <p style={{
          fontSize: 16, lineHeight: 1.9,
          maxWidth: 700, margin: '0 auto', opacity: 0.92,
        }}>
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

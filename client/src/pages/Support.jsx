import { useState, useRef, useEffect } from 'react';

const QUICK_QUESTIONS = [
  'How do I place an order?',
  'How to become a seller?',
  'What is the return policy?',
  'How do I track my order?',
  'How to apply for funding?',
  'Is my payment secure?',
];

const FAQ = {
  'how do i place an order': 'To place an order: 1) Browse products on the Marketplace, 2) Click "+ Cart" on any product, 3) Go to Cart, 4) Enter your delivery address, 5) Click "Place Order". You\'ll receive a confirmation and can track your order in "My Orders".',
  'how to become a seller': 'To become a seller: 1) Click Register on the homepage, 2) Select "I want to sell (Seller)", 3) Fill in your details, 4) Login to your account, 5) Click "My Shop" in the navbar, 6) Add your first product. It\'s completely free!',
  'what is the return policy': 'We have a 7-day return policy. If you receive a damaged or incorrect product, contact us within 7 days of delivery. Refunds are processed within 5-7 business days to your original payment method.',
  'how do i track my order': 'To track your order: 1) Login to your account, 2) Click your name in the navbar, 3) Select "My Orders", 4) You\'ll see the status of each order — Pending, Processing, Shipped, or Delivered.',
  'how to apply for funding': 'Visit our Funding & Grants page from the navbar. We list government schemes like PMMY, Stree Shakti Package and NGO support. You can apply directly through the official links provided.',
  'is my payment secure': 'Yes! All transactions on SafeHer are secured with 256-bit SSL encryption. We do not store your card details. We support UPI, Net Banking, Credit/Debit cards and Cash on Delivery.',
  'how do i contact support': 'You can reach our support team at smkarthik1910@gmail.com or call 8870666590 (Mon-Sat, 9AM-6PM). You can also use this chat for instant answers.',
  'how to report an incident': 'Go to the Safety Map from the navbar. Click on any location on the map to report an incident. Fill in the details — title, category and description. Your report helps keep the community safe.',
  'how do i cancel my order': 'Orders can be cancelled within 24 hours of placing them. Go to My Orders, find the order you want to cancel and click "Cancel Order". After 24 hours, please contact our support team.',
  'what categories are available': 'We have 6 product categories: Handicrafts, Clothing, Food & Spices, Jewellery, Home Decor, and Beauty & Wellness. All products are made or sold by women entrepreneurs.',
};

const getResponse = (message) => {
  const lower = message.toLowerCase();
  for (const [key, value] of Object.entries(FAQ)) {
    if (lower.includes(key) || key.split(' ').some(word => word.length > 4 && lower.includes(word))) {
      return value;
    }
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! 👋 Welcome to SafeHer support. I\'m here to help you with orders, selling, funding, safety and anything else. What can I help you with today?';
  }
  if (lower.includes('thank')) {
    return 'You\'re welcome! 😊 Is there anything else I can help you with?';
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('fee')) {
    return 'SafeHer is completely FREE for buyers to use. For sellers, listing products is also free. We only charge a small 5% commission on successful sales to keep the platform running.';
  }
  if (lower.includes('delivery') || lower.includes('shipping')) {
    return 'Delivery times vary by seller location. Most orders are delivered within 3-7 business days. We offer FREE delivery on all orders. You can track your order status in "My Orders".';
  }
  return 'I\'m not sure about that specific question. Here\'s how you can get more help:\n\n1. Email us at smkarthik1910@gmail.com\n2. Call 8870666590 (Mon-Sat 9AM-6PM)\n3. Try asking one of the quick questions below\n\nIs there anything else I can help you with?';
};

export default function Support() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! 👋 I\'m SafeHer\'s support assistant. I can help you with orders, selling, funding, safety and more. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time }]);
    setTyping(true);
    setTimeout(() => {
      const response = getResponse(userMsg);
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: response, time }]);
    }, 1000 + Math.random() * 500);
  };

  return (
    <div style={{
      maxWidth: 1000, margin: '32px auto',
      padding: '0 clamp(12px,3vw,24px) 80px',
    }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 32, fontWeight: 700,
          color: '#F0EAF8',
        }}>Customer Support</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Get instant answers from our AI assistant
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
        alignItems: 'start',
      }}>

        {/* Chat Window */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid var(--border-strong)',
          display: 'flex',
          flexDirection: 'column',
          height: 600,
        }}>

          {/* Chat Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20,
            }}>🌸</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, color: '#F0EAF8' }}>
                SafeHer Assistant
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#2D9B6F',
                  animation: 'pulse 2s infinite',
                }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Online · Usually replies instantly
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 16,
              }}>
                {msg.role === 'bot' && (
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 14,
                    marginRight: 8, flexShrink: 0, alignSelf: 'flex-end',
                  }}>🌸</div>
                )}
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    background: msg.role === 'user'
                      ? 'var(--grad-primary)'
                      : 'rgba(255,255,255,0.08)',
                    color: '#F0EAF8',
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user'
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    fontSize: 14, lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    border: msg.role === 'bot'
                      ? '1px solid var(--border)' : 'none',
                  }}>{msg.text}</div>
                  <p style={{
                    fontSize: 11, color: 'var(--text-muted)',
                    marginTop: 4,
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                  }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14,
                }}>🌸</div>
                <div style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border)',
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  display: 'flex', gap: 4,
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--primary)',
                      animation: `bounce 1s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* ✅ FIXED INPUT — explicit dark background + white text */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: 10,
          }}>
            <input
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              style={{
                flex: 1,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.1)',   // ✅ slightly visible bg
                border: '1.5px solid var(--border-strong)',
                color: '#FFFFFF',                        // ✅ white text when typing
                padding: '11px 15px',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button onClick={() => sendMessage()} style={{
              background: 'var(--grad-primary)',
              color: '#fff', border: 'none',
              width: 44, height: 44,
              borderRadius: 12, fontSize: 18,
              cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              →
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quick Questions */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-strong)',
            borderRadius: 16, padding: 20,
          }}>
            <h3 style={{
              fontSize: 15, fontWeight: 700,
              color: '#F0EAF8', marginBottom: 14,
            }}>
              Quick Questions
            </h3>
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'rgba(139,111,191,0.08)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                padding: '10px 14px', borderRadius: 10,
                fontSize: 13, cursor: 'pointer', marginBottom: 8,
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(139,111,191,0.2)';
                  e.currentTarget.style.color = '#C4A8E8';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(139,111,191,0.08)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}>
                {q}
              </button>
            ))}
          </div>

          {/* Contact Info */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-strong)',
            borderRadius: 16, padding: 20,
          }}>
            <h3 style={{
              fontSize: 15, fontWeight: 700,
              color: '#F0EAF8', marginBottom: 14,
            }}>
              Contact Us
            </h3>
            {[
              { icon: '📧', label: 'Email', value: 'smkarthik1910@gmail.com' },
              { icon: '📞', label: 'Phone', value: '8870666590' },
              { icon: '🕒', label: 'Hours', value: 'Mon-Sat, 9AM-6PM' },
            ].map(c => (
              <div key={c.label} style={{
                display: 'flex', gap: 10,
                alignItems: 'center', marginBottom: 14,
              }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.label}</p>
                  <p style={{
                    fontSize: 13, fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

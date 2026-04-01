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
  'how do i contact support': 'You can reach our support team at support@safeher.com or call 1800-XXX-XXXX (Mon-Sat, 9AM-6PM). You can also use this chat for instant answers.',
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
  return 'I\'m not sure about that specific question. Here\'s how you can get more help:\n\n1. Email us at support@safeher.com\n2. Call 1800-XXX-XXXX (Mon-Sat 9AM-6PM)\n3. Try asking one of the quick questions below\n\nIs there anything else I can help you with?';
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
    <div style={{ maxWidth: 1000, margin: '32px auto', padding: '0 24px 60px' }}>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif',
          fontSize: 28, fontWeight: 600 }}>Customer Support</h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
          Get instant answers from our AI assistant
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

        {/* Chat Window */}
        <div style={{ background: '#fff', borderRadius: 20,
          boxShadow: '0 4px 32px rgba(127,119,221,0.1)',
          border: '0.5px solid #f0eeff', display: 'flex',
          flexDirection: 'column', height: 600 }}>

          {/* Chat Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0eeff',
            display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20 }}>🌸</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15 }}>SafeHer Assistant</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%',
                  background: '#1D9E75' }} />
                <span style={{ fontSize: 12, color: '#888' }}>Online · Usually replies instantly</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 16 }}>
                {msg.role === 'bot' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 14,
                    marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' }}>🌸</div>
                )}
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #7F77DD, #D4537E)' : '#f7f5ff',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    padding: '12px 16px', borderRadius: msg.role === 'user'
                      ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line',
                  }}>{msg.text}</div>
                  <p style={{ fontSize: 11, color: '#bbb', marginTop: 4,
                    textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14 }}>🌸</div>
                <div style={{ background: '#f7f5ff', padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%',
                      background: '#7F77DD', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f0eeff',
            display: 'flex', gap: 10 }}>
            <input placeholder="Type your question..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              style={{ flex: 1, borderRadius: 12 }} />
            <button onClick={() => sendMessage()} style={{
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              color: '#fff', border: 'none', width: 44, height: 44,
              borderRadius: 12, fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>→</button>
          </div>
        </div>

        {/* Quick Questions + Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20,
            boxShadow: '0 2px 12px rgba(127,119,221,0.08)',
            border: '0.5px solid #f0eeff' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
              Quick Questions
            </h3>
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: '#f7f5ff', border: '1.5px solid #ede8ff',
                color: '#555', padding: '10px 14px', borderRadius: 10,
                fontSize: 13, cursor: 'pointer', marginBottom: 8,
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
                onMouseEnter={e => {
                  e.target.style.background = '#f0eeff';
                  e.target.style.color = '#7F77DD';
                }}
                onMouseLeave={e => {
                  e.target.style.background = '#f7f5ff';
                  e.target.style.color = '#555';
                }}>
                {q}
              </button>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 20,
            boxShadow: '0 2px 12px rgba(127,119,221,0.08)',
            border: '0.5px solid #f0eeff' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
              Contact Us
            </h3>
            {[
              { icon: '📧', label: 'Email', value: 'smkarthik1910@gmail.com.com' },
              { icon: '📞', label: 'Phone', value: '8870666590' },
              { icon: '🕒', label: 'Hours', value: 'Mon-Sat, 9AM-6PM' },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', gap: 10,
                alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div>
                  <p style={{ fontSize: 11, color: '#aaa' }}>{c.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500,
                    color: '#333' }}>{c.value}</p>
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
const SCHEMES = [
  {
    title: 'Pradhan Mantri Mudra Yojana (PMMY)',
    type: 'Government Loan', amount: 'Up to ₹10 Lakhs',
    color: '#f0eeff', textColor: '#7F77DD', icon: '🏛️',
    desc: 'Collateral-free loans for small and micro enterprises. Women entrepreneurs get priority processing and lower interest rates.',
    eligibility: 'Any woman starting or expanding a small business',
    link: 'https://www.mudra.org.in',
    tags: ['No Collateral', 'Low Interest', 'Government'],
  },
  {
    title: 'Stree Shakti Package',
    type: 'Bank Scheme', amount: 'Up to ₹50 Lakhs',
    color: '#fff0f6', textColor: '#D4537E', icon: '💪',
    desc: 'Special loan scheme by State Bank of India for women entrepreneurs with concession in interest rates of 0.5%.',
    eligibility: 'Women with 50%+ ownership in the business',
    link: 'https://sbi.co.in',
    tags: ['SBI', '0.5% Concession', 'Easy Process'],
  },
  {
    title: 'Annapurna Scheme',
    type: 'Food Business Loan', amount: 'Up to ₹50,000',
    color: '#fff8e6', textColor: '#BA7517', icon: '🍱',
    desc: 'Designed specifically for women in the food catering business. Covers equipment, raw material and working capital.',
    eligibility: 'Women in food/catering business aged 18-60',
    link: 'https://www.sbi.co.in',
    tags: ['Food Business', 'Quick Approval', 'Equipment Loan'],
  },
  {
    title: 'Mahila Udyam Nidhi',
    type: 'SIDBI Scheme', amount: 'Up to ₹10 Lakhs',
    color: '#eafaf3', textColor: '#0F6E56', icon: '🌱',
    desc: 'Small Industries Development Bank of India scheme for small scale women entrepreneurs with soft loans at subsidised rates.',
    eligibility: 'Women SSI units with project cost under ₹10 Lakhs',
    link: 'https://www.sidbi.in',
    tags: ['SIDBI', 'Soft Loan', 'Small Scale'],
  },
  {
    title: 'Dena Shakti Scheme',
    type: 'Bank of Baroda', amount: 'Up to ₹20 Lakhs',
    color: '#e6f1fb', textColor: '#185FA5', icon: '🏦',
    desc: 'Bank of Baroda offers special loans for women in agriculture, manufacturing, retail and micro credit sectors.',
    eligibility: 'Women entrepreneurs in key sectors',
    link: 'https://www.bankofbaroda.in',
    tags: ['Bank of Baroda', 'Multiple Sectors', 'Flexible'],
  },
  {
    title: 'Stand Up India',
    type: 'Government Scheme', amount: '₹10L to ₹1 Crore',
    color: '#fef3e2', textColor: '#854F0B', icon: '🚀',
    desc: 'Facilitates bank loans for SC/ST and women entrepreneurs for setting up greenfield enterprises in manufacturing, services or trading.',
    eligibility: 'Women above 18 years, first-time entrepreneurs',
    link: 'https://www.standupmitra.in',
    tags: ['High Amount', 'First Time', 'All Sectors'],
  },
];

const NGOS = [
  { name: 'SEWA (Self Employed Women\'s Association)', city: 'Ahmedabad', focus: 'Micro finance & legal support', icon: '👩‍⚖️' },
  { name: 'Grameen Bank India', city: 'Pan India', focus: 'Micro loans for rural women', icon: '🌾' },
  { name: 'Mann Deshi Foundation', city: 'Satara, Maharashtra', focus: 'Business training & loans', icon: '📚' },
  { name: 'Rang De', city: 'Bangalore', focus: 'Peer-to-peer micro lending', icon: '🤝' },
];

export default function Funding() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>

      <div style={{ background: 'linear-gradient(135deg, #BA7517, #D4537E)',
        borderRadius: 20, padding: '48px 40px', marginBottom: 48,
        color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220,
          height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)' }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75,
          letterSpacing: 2, textTransform: 'uppercase',
          marginBottom: 12 }}>Financial Empowerment</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40,
          fontWeight: 600, marginBottom: 12 }}>Funding & Grants</h1>
        <p style={{ opacity: 0.85, fontSize: 16, maxWidth: 520, lineHeight: 1.7 }}>
          Government schemes, bank loans and NGO support specifically designed
          to help women entrepreneurs grow their businesses.
        </p>
      </div>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24,
        fontWeight: 600, marginBottom: 20 }}>Government & Bank Schemes</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 20, marginBottom: 48 }}>
        {SCHEMES.map(s => (
          <div key={s.title} style={{ background: '#fff', borderRadius: 16,
            overflow: 'hidden', boxShadow: '0 2px 16px rgba(127,119,221,0.08)',
            border: '0.5px solid #f0eeff', display: 'flex',
            flexDirection: 'column' }}>
            <div style={{ background: s.color, padding: '20px 20px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32 }}>{s.icon}</span>
                <span style={{ fontSize: 11, background: '#fff',
                  color: s.textColor, padding: '3px 10px', borderRadius: 20,
                  fontWeight: 600 }}>{s.type}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 12,
                color: '#1a1a2e', lineHeight: 1.4 }}>{s.title}</h3>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.textColor,
                marginTop: 6 }}>{s.amount}</div>
            </div>
            <div style={{ padding: '16px 20px 20px', flex: 1,
              display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7,
                marginBottom: 12 }}>{s.desc}</p>
              <div style={{ background: '#f7f5ff', borderRadius: 10,
                padding: '10px 12px', marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#7F77DD',
                  marginBottom: 4 }}>ELIGIBILITY</p>
                <p style={{ fontSize: 12, color: '#555' }}>{s.eligibility}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6,
                marginBottom: 16 }}>
                {s.tags.map(t => (
                  <span key={t} style={{ fontSize: 11, background: s.color,
                    color: s.textColor, padding: '3px 8px',
                    borderRadius: 20, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
              <a href={s.link} target="_blank" rel="noreferrer"
                style={{ marginTop: 'auto', display: 'block', textAlign: 'center',
                  background: `linear-gradient(135deg, ${s.textColor}, #D4537E)`,
                  color: '#fff', padding: '10px', borderRadius: 10,
                  fontSize: 13, fontWeight: 600 }}>
                Apply Now →
              </a>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24,
        fontWeight: 600, marginBottom: 20 }}>NGO & Community Support</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 16 }}>
        {NGOS.map(n => (
          <div key={n.name} style={{ background: '#fff', borderRadius: 14,
            padding: 20, boxShadow: '0 2px 12px rgba(127,119,221,0.08)',
            border: '0.5px solid #f0eeff' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{n.icon}</div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6,
              lineHeight: 1.4 }}>{n.name}</h4>
            <p style={{ fontSize: 12, color: '#7F77DD', fontWeight: 500,
              marginBottom: 4 }}>📍 {n.city}</p>
            <p style={{ fontSize: 12, color: '#888' }}>{n.focus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
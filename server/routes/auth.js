const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const otpStore = {};

// Improved email transporter with better configuration
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_USER && process.env.EMAIL_USER.includes('gmail')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
    });
  }
  
  // For other SMTP providers
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
  });
};

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection before sending
    await transporter.verify();
    
    const info = await transporter.sendMail({
      from: `"SafeHer 🌸" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SafeHer Verification Code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#1a0d2e;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#6B4FA0,#C4587A);padding:28px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;">🌸 SafeHer</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px;">Women Entrepreneurship Platform</p>
          </div>
          <div style="padding:32px;text-align:center;">
            <p style="color:#E8E0F0;font-size:15px;margin-bottom:8px;">Your verification code is:</p>
            <div style="background:rgba(107,79,160,0.2);border:2px solid rgba(107,79,160,0.4);border-radius:14px;padding:20px;margin:16px 0;">
              <span style="font-size:44px;font-weight:800;color:#D4A853;letter-spacing:12px;">${otp}</span>
            </div>
            <p style="color:rgba(255,255,255,0.4);font-size:13px;">Expires in 10 minutes · Do not share this code</p>
          </div>
        </div>
      `,
    });
    
    console.log(`Email sent to ${email}: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

// Test email endpoint
router.get('/test-email', async (req, res) => {
  try {
    const result = await sendOTPEmail(process.env.EMAIL_USER, '123456');
    if (result) {
      res.json({ message: 'Test email sent successfully to ' + process.env.EMAIL_USER });
    } else {
      res.status(500).json({ error: 'Failed to send test email. Check email configuration.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: 'Email is required' });

  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );
    if (existing.length)
      return res.status(400).json({ message: 'Email already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email.toLowerCase()] = {
      otp, expires: Date.now() + 10 * 60 * 1000
    };

    console.log(`📧 OTP for ${email}: ${otp}`);
    
    // Send email and wait for result
    const emailSent = await sendOTPEmail(email, otp);
    
    if (emailSent) {
      res.json({ message: `OTP sent to ${email}. Check your inbox (and spam folder).` });
    } else {
      // Still return success but warn the user
      res.json({ 
        message: `OTP generated. If you don't receive it in 2 minutes, check spam folder or try again.`,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }
  } catch (err) {
    console.error('OTP error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Rest of your routes remain the same...
router.post('/register', async (req, res) => {
  const { name, email, password, role, otp } = req.body;
  if (!name || !email || !password || !otp)
    return res.status(400).json({ message: 'All fields required' });

  try {
    const key = email.toLowerCase();
    const stored = otpStore[key];
    if (!stored)
      return res.status(400).json({ message: 'OTP expired or not found. Request a new one.' });
    if (Date.now() > stored.expires) {
      delete otpStore[key];
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }
    if (stored.otp !== String(otp).trim())
      return res.status(400).json({ message: 'Incorrect OTP. Try again.' });

    delete otpStore[key];
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
      [name, key, hashed, role || 'buyer']
    );
    res.status(201).json({ message: 'Account created! Please login.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Email already registered' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });
  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );
    if (!rows.length)
      return res.status(400).json({ message: 'No account found with this email' });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid)
      return res.status(400).json({ message: 'Incorrect password' });
    const token = jwt.sign(
      { id: rows[0].id, name: rows[0].name, role: rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: rows[0].id, name: rows[0].name,
        email: rows[0].email, role: rows[0].role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Try again.' });
  }
});

router.put('/update-profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await db.query('UPDATE users SET name = ? WHERE id = ?',
      [req.body.name, decoded.id]);
    res.json({ message: 'Profile updated' });
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
});

router.put('/update-password', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    const valid = await bcrypt.compare(req.body.currentPassword, rows[0].password);
    if (!valid)
      return res.status(400).json({ message: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(req.body.newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?',
      [hashed, decoded.id]);
    res.json({ message: 'Password updated' });
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
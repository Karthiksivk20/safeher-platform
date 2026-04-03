const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const otpStore = {};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

const sendOTP = async (email, otp) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"SafeHer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'SafeHer — Verify Your Email',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;
        border: 1px solid #ede8ff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7F77DD, #D4537E);
          padding: 24px; text-align: center;">
          <h2 style="color: #fff; margin: 0;">🌸 SafeHer</h2>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">
            Women Entrepreneurship Platform
          </p>
        </div>
        <div style="padding: 32px; text-align: center;">
          <p style="color: #555; font-size: 15px; margin-bottom: 8px;">
            Welcome to SafeHer! Please verify your email address.
          </p>
          <p style="color: #888; font-size: 13px; margin-bottom: 24px;">
            Your one-time verification code is:
          </p>
          <div style="background: #f0eeff; border-radius: 12px;
            padding: 20px 32px; display: inline-block; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: 700;
              color: #7F77DD; letter-spacing: 10px;">${otp}</span>
          </div>
          <p style="color: #aaa; font-size: 13px; line-height: 1.6;">
            This code expires in 10 minutes.<br/>
            If you did not create a SafeHer account, ignore this email.
          </p>
        </div>
        <div style="background: #f7f5ff; padding: 16px; text-align: center;
          border-top: 1px solid #ede8ff;">
          <p style="color: #aaa; font-size: 12px; margin: 0;">
            SafeHer — Empowering Women Entrepreneurs Across India
          </p>
        </div>
      </div>
    `,
  });
};

// Test email route
router.get('/test-email', async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'SafeHer Test Email',
      text: 'Email is working correctly from Render!',
    });
    res.json({ message: 'Test email sent successfully to ' + process.env.EMAIL_USER });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Step 1 — Send OTP
router.post('/register/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: 'Email is required' });
  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing.length)
      return res.status(400).json({ message: 'Email already in use' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
    console.log(`OTP for ${email}: ${otp}`);

    try {
      await sendOTP(email, otp);
      res.json({ message: 'OTP sent to your email' });
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
      res.json({
        message: 'OTP generated. Check server logs if email not received.',
        devOTP: process.env.NODE_ENV !== 'production' ? otp : undefined,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Step 2 — Verify OTP and register
router.post('/register', async (req, res) => {
  const { name, email, password, role, otp } = req.body;
  if (!name || !email || !password || !otp)
    return res.status(400).json({ message: 'All fields including OTP are required' });
  try {
    const stored = otpStore[email];
    if (!stored)
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
    if (Date.now() > stored.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please try again.' });
    }
    if (stored.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    delete otpStore[email];
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
      [name, email.trim().toLowerCase(), hashed, role || 'buyer']
    );
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Email already in use' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });
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
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        role: rows[0].role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
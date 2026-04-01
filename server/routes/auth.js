const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const otpStore = {};

let transporter = null;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
} catch (err) {
  console.log('Email not configured:', err.message);
}

const sendOTP = async (email, otp) => {
  if (!transporter) {
    console.log(`OTP for ${email}: ${otp}`);
    return;
  }
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
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;
            font-size: 14px;">Women Entrepreneurship Platform</p>
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
            If you did not create a SafeHer account, please ignore this email.
          </p>
        </div>
      </div>
    `,
  });
};

// Step 1 — Send OTP during registration
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
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
        email: rows[0].email, role: rows[0].role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});
// Step 2 — Verify OTP and complete registration
router.post('/register', async (req, res) => {
  const { name, email, password, role, otp } = req.body;
  try {
    const stored = otpStore[email];
    if (!stored)
      return res.status(400).json({ message: 'Please request an OTP first' });
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
      [name, email, hashed, role || 'buyer']
    );
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Email already in use' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Normal login — no OTP
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length)
      return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: rows[0].id, name: rows[0].name, role: rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: rows[0].id, name: rows[0].name,
        email: rows[0].email, role: rows[0].role
      }
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
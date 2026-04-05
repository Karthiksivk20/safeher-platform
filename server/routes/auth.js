const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const otpStore = {};

// ================= EMAIL SETUP =================
const createTransporter = () => {
  const nodemailer = require('nodemailer');
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"SafeHer 🌸" <${process.env.EMAIL_USER}>`, // ✅ FIXED
      to: email,
      subject: `${otp} is your SafeHer verification code`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#6B4FA0,#C4587A);padding:28px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:22px;">🌸 SafeHer</h1>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Women Entrepreneurship Platform</p>
          </div>
          <div style="background:#fff;padding:32px;text-align:center;border:1px solid #eee;border-radius:0 0 12px 12px;">
            <p style="color:#333;font-size:16px;margin-bottom:8px;">Your verification code is:</p>
            <div style="background:#f0eeff;border:2px solid #8B6FBF;border-radius:12px;padding:20px;margin:16px auto;display:inline-block;">
              <span style="font-size:42px;font-weight:800;color:#6B4FA0;letter-spacing:10px;">${otp}</span>
            </div>
            <p style="color:#888;font-size:13px;margin-top:16px;">This code expires in <strong>10 minutes</strong>.</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Email sent:', info.messageId);
    return info;

  } catch (err) {
    console.error('❌ EMAIL ERROR:', err);
    throw err;
  }
};

// ================= TEST ROUTE =================
router.get('/test-email', async (req, res) => {
  try {
    await sendOTPEmail(process.env.EMAIL_USER, '123456');
    res.json({ message: 'Test email sent successfully' });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      EMAIL_USER: process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS
    });
  }
});

// ================= SEND OTP =================
router.post('/register/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const emailLower = email.trim().toLowerCase();

  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [emailLower]
    );

    if (existing.length)
      return res.status(400).json({ message: 'Email already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[emailLower] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000
    };

    console.log(`OTP for ${emailLower}: ${otp}`);

    // ✅ FIX: WAIT for email
    await sendOTPEmail(emailLower, otp);

    res.json({ message: `OTP sent to ${email}` });

  } catch (err) {
    console.error('OTP Error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  const { name, email, password, role, otp } = req.body;

  if (!name || !email || !password || !otp)
    return res.status(400).json({ message: 'All fields required' });

  const emailLower = email.trim().toLowerCase();

  try {
    const stored = otpStore[emailLower];

    if (!stored)
      return res.status(400).json({ message: 'OTP not found' });

    if (Date.now() > stored.expires)
      return res.status(400).json({ message: 'OTP expired' });

    if (stored.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });

    delete otpStore[emailLower];

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
      [name, emailLower, hashed, role || 'buyer']
    );

    res.status(201).json({ message: 'Account created successfully' });

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email=?',
      [email.toLowerCase()]
    );

    if (!rows.length)
      return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, rows[0].password);

    if (!valid)
      return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
      {
        id: rows[0].id,
        name: rows[0].name,
        role: rows[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: rows[0] });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
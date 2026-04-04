const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const otpStore = {};

const createTransporter = () => {
  const nodemailer = require('nodemailer');
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15000,
    socketTimeout: 15000,
  });
};

const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"SafeHer 🌸" <${process.env.EMAIL_USER}>`,
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
          <p style="color:#aaa;font-size:12px;margin-top:8px;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  });
  console.log('Email sent:', info.messageId);
  return info;
};

router.get('/test-email', async (req, res) => {
  console.log('Test email requested');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
  try {
    await sendOTPEmail(process.env.EMAIL_USER, '123456');
    res.json({ message: 'Test email sent successfully to ' + process.env.EMAIL_USER });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({
      error: err.message,
      emailUser: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASS,
    });
  }
});

router.post('/register/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const emailLower = email.trim().toLowerCase();

  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [emailLower]);
    if (existing.length)
      return res.status(400).json({ message: 'This email is already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[emailLower] = { otp, expires: Date.now() + 10 * 60 * 1000 };
    console.log(`[OTP] ${emailLower}: ${otp}`);

    // Wait for email to actually send before responding
    await sendOTPEmail(email, otp);
    
    res.json({ message: `OTP sent to ${email}. Check inbox and spam folder.` });

  } catch (err) {
    console.error('[OTP] Email error:', err.message);
    // Clean up the stored OTP since email failed
    delete otpStore[emailLower];
    res.status(500).json({ 
      message: 'Failed to send OTP email. Please check your email address and try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password, role, otp } = req.body;
  if (!name || !email || !password || !otp)
    return res.status(400).json({ message: 'All fields are required' });

  const emailLower = email.trim().toLowerCase();

  try {
    const stored = otpStore[emailLower];
    if (!stored)
      return res.status(400).json({ message: 'OTP not found. Please request a new OTP.' });
    if (Date.now() > stored.expires) {
      delete otpStore[emailLower];
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }
    if (stored.otp !== String(otp).trim())
      return res.status(400).json({ message: 'Wrong OTP. Please check and try again.' });

    delete otpStore[emailLower];
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
      [name, emailLower, hashed, role || 'buyer']
    );
    res.status(201).json({ message: 'Account created successfully! Please login.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Email already registered' });
    console.error('[Register] Error:', err);
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
    console.error('[Login] Error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
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
    res.json({ message: 'Password updated successfully' });
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
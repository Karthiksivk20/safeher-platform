const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/categories/all', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY id');
  res.json(rows);
});

router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let query = `SELECT p.*, u.name as seller_name, c.name as category_name
               FROM products p
               JOIN users u ON p.seller_id = u.id
               LEFT JOIN categories c ON p.category_id = c.id
               WHERE 1=1`;
  const params = [];
  if (category) { query += ' AND p.category_id = ?'; params.push(category); }
  if (search) { query += ' AND p.name LIKE ?'; params.push(`%${search}%`); }
  if (req.query.min_price) { query += ' AND p.price >= ?'; params.push(req.query.min_price); }
if (req.query.max_price) { query += ' AND p.price <= ?'; params.push(req.query.max_price); }
  query += ' ORDER BY p.created_at DESC';
  const [rows] = await db.query(query, params);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, u.name as seller_name, c.name as category_name
     FROM products p
     JOIN users u ON p.seller_id = u.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ message: 'Product not found' });
  res.json(rows[0]);
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const image = req.file ? req.file.filename : null;
  await db.query(
    'INSERT INTO products (seller_id, category_id, name, description, price, stock, image) VALUES (?,?,?,?,?,?,?)',
    [req.user.id, category_id, name, description, price, stock, image]
  );
  res.status(201).json({ message: 'Product added' });
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const image = req.file ? req.file.filename : req.body.existing_image;
  await db.query(
    'UPDATE products SET name=?, description=?, price=?, stock=?, category_id=?, image=? WHERE id=? AND seller_id=?',
    [name, description, price, stock, category_id, image, req.params.id, req.user.id]
  );
  res.json({ message: 'Product updated' });
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM products WHERE id=? AND seller_id=?',
    [req.params.id, req.user.id]);
  res.json({ message: 'Product deleted' });
});

router.get('/:id/reviews', async (req, res) => {
  const [rows] = await db.query(
    `SELECT r.*, u.name as reviewer FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC`,
    [req.params.id]
  );
  const [[avg]] = await db.query(
    'SELECT COALESCE(AVG(rating), 0) as avg, COUNT(*) as total FROM reviews WHERE product_id = ?',
    [req.params.id]
  );
  res.json({ reviews: rows, avg: Number(avg.avg).toFixed(1), total: avg.total });
});

router.post('/:id/reviews', auth, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const [ordered] = await db.query(
      `SELECT oi.id FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = ? AND oi.product_id = ?`,
      [req.user.id, req.params.id]
    );
    if (!ordered.length)
      return res.status(403).json({ message: 'You can only review products you have ordered' });
    await db.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?,?,?,?)',
      [req.params.id, req.user.id, rating, comment]
    );
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'You have already reviewed this product' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/reviews', auth, async (req, res) => {
  await db.query(
    'DELETE FROM reviews WHERE product_id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  res.json({ message: 'Review deleted' });
});

module.exports = router;
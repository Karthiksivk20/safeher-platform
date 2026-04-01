const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.id, c.quantity, p.name, p.price, p.image, p.stock
     FROM cart c JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [req.user.id]
  );
  res.json(rows);
});

router.post('/add', auth, async (req, res) => {
  const { product_id, quantity } = req.body;
  const [existing] = await db.query(
    'SELECT * FROM cart WHERE user_id=? AND product_id=?',
    [req.user.id, product_id]
  );
  if (existing.length) {
    await db.query(
      'UPDATE cart SET quantity = quantity + ? WHERE user_id=? AND product_id=?',
      [quantity || 1, req.user.id, product_id]
    );
  } else {
    await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?)',
      [req.user.id, product_id, quantity || 1]
    );
  }
  res.json({ message: 'Added to cart' });
});

router.put('/update/:id', auth, async (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    await db.query('DELETE FROM cart WHERE id=? AND user_id=?',
      [req.params.id, req.user.id]);
  } else {
    await db.query('UPDATE cart SET quantity=? WHERE id=? AND user_id=?',
      [quantity, req.params.id, req.user.id]);
  }
  res.json({ message: 'Cart updated' });
});

router.delete('/remove/:id', auth, async (req, res) => {
  await db.query('DELETE FROM cart WHERE id=? AND user_id=?',
    [req.params.id, req.user.id]);
  res.json({ message: 'Removed from cart' });
});

module.exports = router;
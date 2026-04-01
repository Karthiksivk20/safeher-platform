const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admin only' });
  next();
};

router.get('/users', auth, isAdmin, async (req, res) => {
  const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users');
  res.json(rows);
});

router.put('/users/:id/role', auth, isAdmin, async (req, res) => {
  await db.query('UPDATE users SET role=? WHERE id=?',
    [req.body.role, req.params.id]);
  res.json({ message: 'Role updated' });
});

router.get('/orders', auth, isAdmin, async (req, res) => {
  const [rows] = await db.query(
    `SELECT o.*, u.name as buyer FROM orders o
     JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC`
  );
  res.json(rows);
});

router.put('/orders/:id/status', auth, isAdmin, async (req, res) => {
  await db.query('UPDATE orders SET status=? WHERE id=?',
    [req.body.status, req.params.id]);
  res.json({ message: 'Order status updated' });
});

router.delete('/products/:id', auth, isAdmin, async (req, res) => {
  await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
  res.json({ message: 'Product deleted' });
});

router.get('/stats', async (req, res) => {
  const [[userCount]] = await db.query('SELECT COUNT(*) as total FROM users WHERE role != "admin"');
  const [[sellerCount]] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "seller"');
  const [[productCount]] = await db.query('SELECT COUNT(*) as total FROM products');
  const [[orderCount]] = await db.query('SELECT COUNT(*) as total FROM orders');
  const [[revenue]] = await db.query('SELECT COALESCE(SUM(total), 0) as total FROM orders');
  const [[categoryCount]] = await db.query('SELECT COUNT(*) as total FROM categories');
  const [[forumCount]] = await db.query('SELECT COUNT(*) as total FROM forum_posts');
  const [[incidentCount]] = await db.query('SELECT COUNT(*) as total FROM incidents');

  res.json({
    users: userCount.total,
    sellers: sellerCount.total,
    products: productCount.total,
    orders: orderCount.total,
    revenue: Number(revenue.total).toFixed(2),
    categories: categoryCount.total,
    forum_posts: forumCount.total,
    incidents: incidentCount.total,
  });
});


router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user.length)
      return res.status(404).json({ message: 'User not found' });
    if (user[0].role === 'admin')
      return res.status(400).json({ message: 'Cannot delete an admin account' });

    const uid = req.params.id;

    await db.query('DELETE FROM reviews WHERE user_id = ?', [uid]);
    await db.query('DELETE FROM forum_replies WHERE user_id = ?', [uid]);
    await db.query('DELETE FROM forum_posts WHERE user_id = ?', [uid]);
    await db.query('DELETE FROM cart WHERE user_id = ?', [uid]);
    await db.query('DELETE FROM incidents WHERE user_id = ?', [uid]);

    const [orders] = await db.query(
      'SELECT id FROM orders WHERE user_id = ?', [uid]);
    for (const order of orders) {
      await db.query(
        'DELETE FROM order_items WHERE order_id = ?', [order.id]);
    }
    await db.query('DELETE FROM orders WHERE user_id = ?', [uid]);

    const [products] = await db.query(
      'SELECT id FROM products WHERE seller_id = ?', [uid]);
    for (const product of products) {
      await db.query(
        'DELETE FROM reviews WHERE product_id = ?', [product.id]);
      await db.query(
        'DELETE FROM cart WHERE product_id = ?', [product.id]);
      await db.query(
        'DELETE FROM order_items WHERE product_id = ?', [product.id]);
    }
    await db.query('DELETE FROM products WHERE seller_id = ?', [uid]);

    await db.query('DELETE FROM users WHERE id = ?', [uid]);

    res.json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Could not remove user: ' + err.message });
  }
});


module.exports = router;
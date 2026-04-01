const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

router.post('/place', auth, async (req, res) => {
  const { address } = req.body;
  const [cartItems] = await db.query(
    `SELECT c.quantity, p.price, p.id as product_id, p.stock
     FROM cart c JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [req.user.id]
  );
  if (!cartItems.length)
    return res.status(400).json({ message: 'Cart is empty' });

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const [order] = await db.query(
    'INSERT INTO orders (user_id, total, address) VALUES (?,?,?)',
    [req.user.id, total, address]
  );
  for (const item of cartItems) {
    await db.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
      [order.insertId, item.product_id, item.quantity, item.price]
    );
    await db.query('UPDATE products SET stock = stock - ? WHERE id=?',
      [item.quantity, item.product_id]);
  }
  await db.query('DELETE FROM cart WHERE user_id=?', [req.user.id]);
  res.status(201).json({ message: 'Order placed', order_id: order.insertId });
});

router.get('/my', auth, async (req, res) => {
  const [orders] = await db.query(
    'SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC',
    [req.user.id]
  );
  for (const order of orders) {
    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;
  }
  res.json(orders);
});

router.put('/cancel/:id', auth, async (req, res) => {
  const [order] = await db.query(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (!order.length)
    return res.status(404).json({ message: 'Order not found' });
  if (order[0].status === 'shipped' || order[0].status === 'delivered')
    return res.status(400).json({ message: 'Sorry, this order cannot be cancelled as it has already been shipped.' });
  if (order[0].status === 'cancelled')
    return res.status(400).json({ message: 'This order is already cancelled.' });

  await db.query(
    'UPDATE orders SET status = "cancelled" WHERE id = ?',
    [req.params.id]
  );

  const [items] = await db.query(
    'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
    [req.params.id]
  );
  for (const item of items) {
    await db.query(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [item.quantity, item.product_id]
    );
  }

  res.json({ message: 'Order cancelled successfully. Stock has been restored.' });
});


router.put('/return/:id', auth, async (req, res) => {
  const [order] = await db.query(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (!order.length)
    return res.status(404).json({ message: 'Order not found' });
  if (order[0].status !== 'delivered')
    return res.status(400).json({ message: 'Only delivered orders can be returned' });
  await db.query(
    'UPDATE orders SET status = "return_requested" WHERE id = ?',
    [req.params.id]
  );
  res.json({ message: 'Return request submitted successfully' });
});

router.get('/seller', auth, async (req, res) => {
  const [orders] = await db.query(
    `SELECT DISTINCT o.*, u.name as buyer_name,
     u.email as buyer_email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON p.id = oi.product_id
     WHERE p.seller_id = ?
     ORDER BY o.created_at DESC`,
    [req.user.id]
  );
  for (const order of orders) {
    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ? AND p.seller_id = ?`,
      [order.id, req.user.id]
    );
    order.items = items;
  }
  res.json(orders);
});

router.put('/seller/update/:id', auth, async (req, res) => {
  const { status } = req.body;
  const allowed = ['processing', 'shipped', 'delivered'];
  if (!allowed.includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  const [items] = await db.query(
    `SELECT oi.order_id FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ? AND p.seller_id = ?`,
    [req.params.id, req.user.id]
  );
  if (!items.length)
    return res.status(403).json({ message: 'Not your order' });
  await db.query('UPDATE orders SET status = ? WHERE id = ?',
    [status, req.params.id]);
  res.json({ message: 'Order status updated' });
});

module.exports = router;
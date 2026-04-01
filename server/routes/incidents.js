const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const [rows] = await db.query(
    `SELECT i.*, u.name as reporter FROM incidents i
     JOIN users u ON i.user_id = u.id
     ORDER BY i.created_at DESC`
  );
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { title, description, category, latitude, longitude } = req.body;
  await db.query(
    'INSERT INTO incidents (user_id, title, description, category, latitude, longitude) VALUES (?,?,?,?,?,?)',
    [req.user.id, title, description, category, latitude, longitude]
  );
  res.status(201).json({ message: 'Incident reported' });
});

module.exports = router;
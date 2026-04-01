const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, u.name as author,
     (SELECT COUNT(*) FROM forum_replies r WHERE r.post_id = p.id) as reply_count
     FROM forum_posts p JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [[post]] = await db.query(
    `SELECT p.*, u.name as author FROM forum_posts p
     JOIN users u ON p.user_id = u.id WHERE p.id = ?`,
    [req.params.id]
  );
  const [replies] = await db.query(
    `SELECT r.*, u.name as author FROM forum_replies r
     JOIN users u ON r.user_id = u.id
     WHERE r.post_id = ? ORDER BY r.created_at ASC`,
    [req.params.id]
  );
  res.json({ post, replies });
});

router.post('/', auth, async (req, res) => {
  const { title, content, category } = req.body;
  await db.query(
    'INSERT INTO forum_posts (user_id, title, content, category) VALUES (?,?,?,?)',
    [req.user.id, title, content, category || 'general']
  );
  res.status(201).json({ message: 'Post created' });
});

router.post('/:id/reply', auth, async (req, res) => {
  await db.query(
    'INSERT INTO forum_replies (post_id, user_id, content) VALUES (?,?,?)',
    [req.params.id, req.user.id, req.body.content]
  );
  res.status(201).json({ message: 'Reply added' });
});
router.delete('/:id', auth, async (req, res) => {
  await db.query(
    'DELETE FROM forum_replies WHERE post_id = ?', [req.params.id]
  );
  await db.query(
    'DELETE FROM forum_posts WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  res.json({ message: 'Post deleted' });
});

router.delete('/:postId/reply/:replyId', auth, async (req, res) => {
  await db.query(
    'DELETE FROM forum_replies WHERE id = ? AND user_id = ?',
    [req.params.replyId, req.user.id]
  );
  res.json({ message: 'Reply deleted' });
});

module.exports = router;
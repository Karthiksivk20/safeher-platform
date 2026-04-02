import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['general', 'support', 'legal', 'resources', 'success-stories'];

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [replyText, setReplyText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [toast, setToast] = useState('');
  const { user } = useAuth();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const token = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const load = () => axios.get(`${API}/api/forum')
    .then(r => setPosts(r.data));

  useEffect(() => { load(); }, []);

  const openPost = async (id) => {
    const { data } = await axios.get(`${API}/api/forum/${id}`);
    setSelected(data.post);
    setReplies(data.replies);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitPost = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/api/forum', newPost, token());
    setNewPost({ title: '', content: '', category: 'general' });
    setShowForm(false);
    showToast('Post created!');
    load();
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post and all its replies?')) return;
    await axios.delete(`${API}/api/forum/${id}`, token());
    showToast('Post deleted');
    setSelected(null);
    load();
  };

  const deleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    await axios.delete(
      `${API}/api/forum/${selected.id}/reply/${replyId}`,
      token()
    );
    showToast('Reply deleted');
    openPost(selected.id);
  };

  const submitReply = async (e) => {
    e.preventDefault();
    await axios.post(
      `${API}/api/forum/${selected.id}/reply`,
      { content: replyText }, token()
    );
    setReplyText('');
    showToast('Reply added!');
    openPost(selected.id);
  };

  const categoryColor = {
    general: { bg: '#f0eeff', color: '#7F77DD' },
    support: { bg: '#fff0f6', color: '#D4537E' },
    legal: { bg: '#fff8e6', color: '#BA7517' },
    resources: { bg: '#eafaf3', color: '#0F6E56' },
    'success-stories': { bg: '#e6f1fb', color: '#185FA5' },
  };

  const filtered = filter ? posts.filter(p => p.category === filter) : posts;

  if (selected) return (
    <div style={{ maxWidth: 760, margin: '32px auto', padding: '0 24px 60px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#1a1a2e',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => setSelected(null)} style={{
          background: 'none', border: '1.5px solid #ede8ff', color: '#7F77DD',
          padding: '8px 16px', borderRadius: 10, fontSize: 13,
          fontWeight: 500, cursor: 'pointer' }}>← Back to Forum</button>
        {user && user.id === selected.user_id && (
          <button onClick={() => deletePost(selected.id)} style={{
            background: '#fff0f0', border: '1.5px solid #ffd0d0',
            color: '#E24B4A', padding: '8px 16px', borderRadius: 10,
            fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            🗑️ Delete Post
          </button>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 28,
        boxShadow: '0 2px 16px rgba(127,119,221,0.1)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px',
            borderRadius: 20,
            background: categoryColor[selected.category]?.bg || '#f0eeff',
            color: categoryColor[selected.category]?.color || '#7F77DD',
            textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {selected.category}
          </span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24,
          fontWeight: 600, marginBottom: 8 }}>{selected.title}</h2>
        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>
          Posted by <strong style={{ color: '#7F77DD' }}>{selected.author}</strong> ·{' '}
          {new Date(selected.created_at).toLocaleDateString()}
        </p>
        <p style={{ lineHeight: 1.8, color: '#444', fontSize: 15 }}>
          {selected.content}
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 28,
        boxShadow: '0 2px 16px rgba(127,119,221,0.1)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
          Replies ({replies.length})
        </h3>

        {replies.length === 0 && (
          <p style={{ color: '#bbb', fontSize: 14, marginBottom: 20 }}>
            No replies yet. Be the first to respond!
          </p>
        )}

        {replies.map((r, i) => (
          <div key={r.id} style={{ padding: '16px 0',
            borderTop: i > 0 ? '1px solid #f5f3ff' : 'none',
            display: 'flex', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 600 }}>
              {r.author.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{r.author}</span>
                  <span style={{ fontSize: 12, color: '#bbb' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                {user && user.id === r.user_id && (
                  <button onClick={() => deleteReply(r.id)} style={{
                    background: 'none', border: 'none', color: '#E24B4A',
                    fontSize: 12, cursor: 'pointer', fontWeight: 500,
                    padding: '2px 8px', borderRadius: 6,
                    fontFamily: 'inherit' }}>
                    🗑️ Delete
                  </button>
                )}
              </div>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7 }}>
                {r.content}
              </p>
            </div>
          </div>
        ))}

        {user ? (
          <form onSubmit={submitReply}
            style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 600 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, display: 'flex', gap: 10 }}>
              <input placeholder="Write a reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)} required />
              <button type="submit" style={{
                background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
                color: '#fff', border: 'none', padding: '10px 20px',
                borderRadius: 10, fontWeight: 500, whiteSpace: 'nowrap',
                cursor: 'pointer' }}>Reply</button>
            </div>
          </form>
        ) : (
          <p style={{ marginTop: 20, color: '#aaa', fontSize: 13 }}>
            Please login to reply.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '32px auto', padding: '0 24px 60px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#1a1a2e',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif',
            fontSize: 28, fontWeight: 600 }}>Community Forum</h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
            Share stories, seek support, find resources
          </p>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} style={{
            background: showForm
              ? '#fff' : 'linear-gradient(135deg, #7F77DD, #D4537E)',
            color: showForm ? '#888' : '#fff',
            border: showForm ? '1.5px solid #ede8ff' : 'none',
            padding: '11px 22px', borderRadius: 12,
            fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ New Post'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 4px 24px rgba(127,119,221,0.12)', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            Create a post
          </h3>
          <form onSubmit={submitPost}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input placeholder="Post title" value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              required />
            <select value={newPost.category}
              onChange={e => setNewPost({ ...newPost, category: e.target.value })}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <textarea rows={4}
              placeholder="Share your story, question or resource..."
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              required />
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #7F77DD, #D4537E)',
              color: '#fff', border: 'none', padding: '12px',
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              alignSelf: 'flex-start', paddingLeft: 28, paddingRight: 28,
              cursor: 'pointer' }}>Post</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('')} style={{
          padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
          border: '1.5px solid ' + (!filter ? '#7F77DD' : '#ede8ff'),
          background: !filter ? '#f0eeff' : '#fff',
          color: !filter ? '#7F77DD' : '#888', cursor: 'pointer' }}>All</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
            border: '1.5px solid ' + (filter === c ? '#7F77DD' : '#ede8ff'),
            background: filter === c ? '#f0eeff' : '#fff',
            color: filter === c ? '#7F77DD' : '#888', cursor: 'pointer' }}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <p>No posts yet. Start the conversation!</p>
        </div>
      ) : filtered.map(p => (
        <div key={p.id} style={{ background: '#fff', borderRadius: 14,
          padding: '20px 24px', marginBottom: 12,
          boxShadow: '0 2px 12px rgba(127,119,221,0.07)',
          borderLeft: `4px solid ${categoryColor[p.category]?.color || '#7F77DD'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => openPost(p.id)}>
              <div style={{ display: 'flex', alignItems: 'center',
                gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600,
                  padding: '3px 10px', borderRadius: 20,
                  background: categoryColor[p.category]?.bg || '#f0eeff',
                  color: categoryColor[p.category]?.color || '#7F77DD' }}>
                  {p.category}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4,
                color: '#1a1a2e' }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: '#aaa' }}>
                by <strong style={{ color: '#7F77DD' }}>{p.author}</strong> ·{' '}
                {new Date(p.created_at).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'center', background: '#f7f5ff',
                borderRadius: 10, padding: '8px 14px', flexShrink: 0,
                cursor: 'pointer' }} onClick={() => openPost(p.id)}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#7F77DD' }}>
                  {p.reply_count}
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>replies</div>
              </div>
              {user && user.id === p.user_id && (
                <button onClick={() => deletePost(p.id)} style={{
                  background: '#fff0f0', border: '1.5px solid #ffd0d0',
                  color: '#E24B4A', padding: '8px 12px', borderRadius: 10,
                  fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
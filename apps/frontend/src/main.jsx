import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, RefreshCw, Send } from 'lucide-react';
import './styles.css';

const emptyPost = {
  title: '',
  author: '',
  content: ''
};

async function request(path, options) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
}

export function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyPost);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  );

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      setPosts(await request('/api/posts'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const submitPost = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const created = await request('/api/posts', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setPosts((current) => [created, ...current]);
      setForm(emptyPost);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">AKS CI/CD test application</p>
            <h1>Pipeline Blog</h1>
          </div>
          <button className="icon-button" type="button" onClick={loadPosts} aria-label="Refresh posts">
            <RefreshCw size={18} />
          </button>
        </header>

        {error ? <div className="alert">Error: {error}</div> : null}

        <div className="content-grid">
          <form className="editor" onSubmit={submitPost}>
            <h2>New post</h2>
            <label>
              Title
              <input
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Deploying a service to AKS"
              />
            </label>
            <label>
              Author
              <input
                required
                value={form.author}
                onChange={(event) => setForm({ ...form, author: event.target.value })}
                placeholder="Platform Team"
              />
            </label>
            <label>
              Content
              <textarea
                required
                rows="8"
                value={form.content}
                onChange={(event) => setForm({ ...form, content: event.target.value })}
                placeholder="Write a short update..."
              />
            </label>
            <button className="primary-button" type="submit">
              <Send size={18} />
              Publish
            </button>
          </form>

          <section className="feed" aria-live="polite">
            <div className="feed-header">
              <h2>Posts</h2>
              <span>{sortedPosts.length}</span>
            </div>

            {loading ? <p className="muted">Loading posts...</p> : null}
            {!loading && sortedPosts.length === 0 ? <p className="muted">No posts yet.</p> : null}

            {sortedPosts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-meta">
                  <span>{post.author}</span>
                  <span>
                    <CalendarDays size={14} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<App />);
}

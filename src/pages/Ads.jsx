import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Ads() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', budget: '', targetUrl: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
  const res = await api.get('/api/advertiser/ads');
      setAds(res.data.ads || res.data);
    } catch (err) {
      console.error('Failed to load ads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
    await api.post('/api/advertiser/createAd', form);
      setForm({ title: '', description: '', budget: '', targetUrl: '' });
      setShowForm(false);
      fetchAds();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ad.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ad?')) return;
    try {
      await api.delete(`/api/ads/${id}`);
      setAds(ads.filter(ad => ad.id !== id));
    } catch (err) {
      console.error('Failed to delete ad', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Smart Ad+</h2>
        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.navItem}>📊 Dashboard</Link>
          <Link to="/ads" style={styles.navItemActive}>📢 Ads</Link>
          <Link to="/analytics" style={styles.navItem}>📈 Analytics</Link>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.heading}>Ads</h1>
            <p style={styles.subheading}>Manage your ad campaigns</p>
          </div>
          <button style={styles.createBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '➕ Create Ad'}
          </button>
        </div>

        {/* Create Ad Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>New Ad</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Title</label>
                  <input style={styles.input} name="title" placeholder="Ad title" value={form.title} onChange={handleChange} required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Budget ($)</label>
                  <input style={styles.input} name="budget" type="number" placeholder="500" value={form.budget} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Target URL</label>
                <input style={styles.input} name="targetUrl" placeholder="https://yoursite.com" value={form.targetUrl} onChange={handleChange} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }} name="description" placeholder="Ad description..." value={form.description} onChange={handleChange} />
              </div>
              <button style={styles.createBtn} type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Ad'}
              </button>
            </form>
          </div>
        )}

        {/* Ads List */}
        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading ads...</p>
        ) : ads.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontSize: '3rem' }}>📢</p>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>No ads yet. Create your first one!</p>
          </div>
        ) : (
          <div style={styles.adsList}>
            {ads.map(ad => (
              <div key={ad.id} style={styles.adCard}>
                <div style={styles.adInfo}>
                  <h3 style={styles.adTitle}>{ad.title}</h3>
                  <p style={styles.adDesc}>{ad.description}</p>
                  <div style={styles.adMeta}>
                    <span style={styles.badge}>💰 ${ad.budget}</span>
                    <span style={{ ...styles.badge, background: ad.status === 'active' ? '#22c55e22' : '#94a3b822', color: ad.status === 'active' ? '#22c55e' : '#94a3b8' }}>
                      {ad.status === 'active' ? '✅ Active' : '⏸ Inactive'}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(ad.id)} style={styles.deleteBtn}>🗑 Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0f172a' },
  sidebar: { width: '220px', background: '#1e293b', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  logo: { color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  navItem: { color: '#94a3b8', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.95rem' },
  navItemActive: { color: '#fff', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '8px', background: '#6366f1', fontSize: '0.95rem' },
  logoutBtn: { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  main: { flex: 1, padding: '2rem' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  heading: { color: '#fff', fontSize: '1.8rem', fontWeight: 'bold' },
  subheading: { color: '#94a3b8', marginTop: '0.25rem' },
  createBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' },
  formCard: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' },
  formTitle: { color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' },
  error: { background: '#dc2626', color: '#fff', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  emptyState: { textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '12px' },
  adsList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  adCard: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  adInfo: { flex: 1 },
  adTitle: { color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' },
  adDesc: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.75rem' },
  adMeta: { display: 'flex', gap: '0.5rem' },
  badge: { background: '#6366f122', color: '#6366f1', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' },
  deleteBtn: { background: '#dc262622', color: '#dc2626', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
};
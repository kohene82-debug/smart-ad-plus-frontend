import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalAds: 0, activeAds: 0, totalImpressions: 0, totalClicks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
          <Link to="/dashboard" style={styles.navItemActive}>📊 Dashboard</Link>
          <Link to="/ads" style={styles.navItem}>📢 Ads</Link>
          <Link to="/analytics" style={styles.navItem}>📈 Analytics</Link>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Dashboard</h1>
          <p style={styles.subheading}>Welcome back! Here's your overview.</p>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading stats...</p>
        ) : (
          <div style={styles.grid}>
            <StatCard title="Total Ads" value={stats.totalAds} icon="📢" color="#6366f1" />
            <StatCard title="Active Ads" value={stats.activeAds} icon="✅" color="#22c55e" />
            <StatCard title="Impressions" value={stats.totalImpressions.toLocaleString()} icon="👁️" color="#f59e0b" />
            <StatCard title="Total Clicks" value={stats.totalClicks.toLocaleString()} icon="🖱️" color="#ec4899" />
          </div>
        )}

        <div style={styles.quickActions}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionRow}>
            <Link to="/ads" style={styles.actionBtn}>➕ Create New Ad</Link>
            <Link to="/analytics" style={styles.actionBtn}>📈 View Analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardIcon, background: color }}>{icon}</div>
      <div>
        <p style={styles.cardTitle}>{title}</p>
        <p style={styles.cardValue}>{value}</p>
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
  header: { marginBottom: '2rem' },
  heading: { color: '#fff', fontSize: '1.8rem', fontWeight: 'bold' },
  subheading: { color: '#94a3b8', marginTop: '0.25rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  cardIcon: { width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' },
  cardTitle: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.25rem' },
  cardValue: { color: '#fff', fontSize: '1.6rem', fontWeight: 'bold' },
  quickActions: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem' },
  sectionTitle: { color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' },
  actionRow: { display: 'flex', gap: '1rem' },
  actionBtn: { background: '#6366f1', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' },
};
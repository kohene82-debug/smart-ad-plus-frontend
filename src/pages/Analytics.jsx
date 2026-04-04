import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const ctr = data?.totalClicks && data?.totalImpressions
    ? ((data.totalClicks / data.totalImpressions) * 100).toFixed(2)
    : '0.00';

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Smart Ad+</h2>
        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.navItem}>📊 Dashboard</Link>
          <Link to="/ads" style={styles.navItem}>📢 Ads</Link>
          <Link to="/analytics" style={styles.navItemActive}>📈 Analytics</Link>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Analytics</h1>
          <p style={styles.subheading}>Track your ad performance</p>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading analytics...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div style={styles.grid}>
              <MetricCard title="Total Impressions" value={data?.totalImpressions?.toLocaleString() || '0'} icon="👁️" color="#6366f1" change="+12%" />
              <MetricCard title="Total Clicks" value={data?.totalClicks?.toLocaleString() || '0'} icon="🖱️" color="#22c55e" change="+8%" />
              <MetricCard title="Click-Through Rate" value={`${ctr}%`} icon="📊" color="#f59e0b" change="+2%" />
              <MetricCard title="Total Spend" value={`$${data?.totalSpend?.toLocaleString() || '0'}`} icon="💰" color="#ec4899" change="-3%" />
            </div>

            {/* Performance Table */}
            <div style={styles.tableCard}>
              <h2 style={styles.sectionTitle}>Ad Performance Breakdown</h2>
              {data?.ads?.length === 0 || !data?.ads ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No ad data available yet.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['Ad Title', 'Impressions', 'Clicks', 'CTR', 'Spend', 'Status'].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.ads.map((ad, i) => {
                      const adCtr = ad.clicks && ad.impressions
                        ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
                        : '0.00';
                      return (
                        <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                          <td style={styles.td}>{ad.title}</td>
                          <td style={styles.td}>{ad.impressions?.toLocaleString()}</td>
                          <td style={styles.td}>{ad.clicks?.toLocaleString()}</td>
                          <td style={styles.td}>{adCtr}%</td>
                          <td style={styles.td}>${ad.spend?.toLocaleString()}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, background: ad.status === 'active' ? '#22c55e22' : '#94a3b822', color: ad.status === 'active' ? '#22c55e' : '#94a3b8' }}>
                              {ad.status === 'active' ? '✅ Active' : '⏸ Inactive'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, change }) {
  const isPositive = change?.startsWith('+');
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardIcon, background: color }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={styles.cardTitle}>{title}</p>
        <p style={styles.cardValue}>{value}</p>
      </div>
      <span style={{ color: isPositive ? '#22c55e' : '#ef4444', fontSize: '0.85rem', fontWeight: 'bold' }}>
        {change}
      </span>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  cardIcon: { width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 },
  cardTitle: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.25rem' },
  cardValue: { color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' },
  tableCard: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem' },
  sectionTitle: { color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.25rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { color: '#94a3b8', textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid #334155' },
  td: { color: '#fff', padding: '0.75rem 1rem', fontSize: '0.9rem' },
  rowEven: { background: 'transparent' },
  rowOdd: { background: '#ffffff08' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' },
};
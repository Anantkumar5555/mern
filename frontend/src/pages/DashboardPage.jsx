import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    averageExperience: 0,
    topSkills: [],
    recentCandidates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading analytics...</div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <h1>Dashboard Analytics</h1>
        <p>Overview of your talent database.</p>
      </header>

      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <h3>Total Candidates</h3>
          <div className="metric-value">{stats.totalCandidates}</div>
        </div>
        <div className="metric-card glass-panel">
          <h3>Average Experience</h3>
          <div className="metric-value">{stats.averageExperience} yrs</div>
        </div>
        <div className="metric-card glass-panel">
          <h3>Top Tracked Skills</h3>
          <div className="metric-value">{stats.topSkills.length}</div>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="glass-panel chart-container">
          <h3 style={{ marginBottom: '20px' }}>Most Common Skills</h3>
          <div style={{ height: '300px' }}>
            {stats.topSkills.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topSkills}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                  />
                  <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No skills data available.</p>
            )}
          </div>
        </div>

        <div className="glass-panel recent-container">
          <h3 style={{ marginBottom: '20px' }}>Recent Onboards</h3>
          {stats.recentCandidates.length > 0 ? (
            <ul className="recent-list">
              {stats.recentCandidates.map(c => (
                <li key={c._id} className="recent-item">
                  <div className="recent-info">
                    <strong>{c.name}</strong>
                    <span className="recent-email">{c.email}</span>
                  </div>
                  <span className="recent-exp">{c.experience} yrs</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No recent candidates.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

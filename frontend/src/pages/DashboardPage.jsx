import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';
import { Shield, AlertCircle, Clock, CheckCircle2, ShieldAlert, FileText, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints');
        setComplaints(res.data);
      } catch (error) {
        console.error('Failed to fetch complaints for dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div className="loading-dots" style={{ fontSize: '2rem' }}>
          <span>•</span><span>•</span><span>•</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Loading real-time analytics...</p>
      </div>
    );
  }

  // Calculate statistics
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const highUrgency = complaints.filter(c => c.urgency === 'High').length;
  const medUrgency = complaints.filter(c => c.urgency === 'Medium').length;
  const lowUrgency = complaints.filter(c => c.urgency === 'Low').length;

  // Group by category for charts
  const categoryCounts = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const chartData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    count: categoryCounts[cat]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ 
        padding: '30px', 
        backgroundImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.7) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', background: 'linear-gradient(to right, #10b981, #f8fafc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={32} style={{ color: '#10b981' }} />
            CivicSmart AI Command Centre
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px' }}>
            Automated complaint prioritization, intelligent department assignment, and instant responses to improve municipal efficiency.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/add" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Register Complaint
          </Link>
          <Link to="/complaints" className="btn btn-success" style={{ textDecoration: 'none', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }}>
            Manage Tickets
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        
        {/* Total Registered */}
        <div className="metric-card glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05, color: '#f8fafc' }}>
            <FileText size={100} />
          </div>
          <h3>Total Registered</h3>
          <div className="metric-value" style={{ color: '#f8fafc' }}>{total}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All-time submissions</span>
        </div>

        {/* Pending Card */}
        <div className="metric-card glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <AlertCircle size={16} style={{ color: '#ef4444' }} />
            Pending Action
          </h3>
          <div className="metric-value" style={{ color: '#ef4444' }}>{pending}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Awaiting initial review</span>
        </div>

        {/* In Progress Card */}
        <div className="metric-card glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Clock size={16} style={{ color: '#f59e0b' }} />
            In Progress
          </h3>
          <div className="metric-value" style={{ color: '#f59e0b' }}>{inProgress}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Assigned and being resolved</span>
        </div>

        {/* Resolved Card */}
        <div className="metric-card glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            Resolved
          </h3>
          <div className="metric-value" style={{ color: '#10b981' }}>{resolved}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Satisfactorily closed issues</span>
        </div>
      </div>

      {/* Main dashboard content layout */}
      <div className="dashboard-layout">
        
        {/* Category breakdown chart */}
        <div className="glass-panel chart-container">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} style={{ color: 'var(--accent-primary)' }} />
            Complaints by Civic Category
          </h3>
          <div style={{ height: '300px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                  <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No category data available. Submit a complaint first.
              </div>
            )}
          </div>
        </div>

        {/* Recent High-Priority Complaints */}
        <div className="glass-panel recent-container">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: '#f59e0b' }} />
            Recent Action Items
          </h3>
          {complaints.length > 0 ? (
            <ul className="recent-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {complaints.slice(0, 5).map(c => (
                <li key={c._id} className="recent-item" style={{ borderBottom: '1px solid var(--border-color)', padding: '14px 0' }}>
                  <div className="recent-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: getUrgencyColor(c.urgency),
                        boxShadow: `0 0 6px ${getUrgencyColor(c.urgency)}`
                      }} />
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{c.title}</strong>
                    </div>
                    <span className="recent-email" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                      <MapPin size={12} /> {c.location} | {c.category}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontWeight: '600', 
                    background: c.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : c.status === 'In Progress' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: c.status === 'Resolved' ? '#10b981' : c.status === 'In Progress' ? '#f59e0b' : '#ef4444'
                  }}>
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
              No complaints registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

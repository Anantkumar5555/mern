import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/candidates', label: 'All Candidates' },
    { path: '/add', label: 'Add Candidate' },
    { path: '/match', label: 'AI Shortlist' }
  ];

  return (
    <nav className="navbar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="navbar-brand">
        <span className="brand-icon">✨</span>
        <span className="brand-text">TalentAI</span>
      </div>
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{user.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user.email}</span>
          </div>
          <button 
            onClick={logout} 
            className="btn" 
            style={{ 
              padding: '6px 14px', 
              fontSize: '0.8rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#f87171', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#f87171';
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

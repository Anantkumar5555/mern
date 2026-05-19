import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Filter, Search, MapPin, AlertCircle, Clock, CheckCircle2, 
  Trash2, ChevronDown, ChevronUp, Sparkles, Tag, Mail, RefreshCw 
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Water Supply',
  'Electricity',
  'Sanitation & Waste',
  'Roads & Traffic',
  'Public Safety',
  'Other'
];

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/complaints';
      const params = [];
      
      if (selectedCategory && selectedCategory !== 'All Categories') {
        params.push(`category=${encodeURIComponent(selectedCategory)}`);
      }
      
      if (searchLocation) {
        params.push(`location=${encodeURIComponent(searchLocation)}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await api.get(url);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  // Dedicated location search function hitting Q2 requirement `/api/complaints/search?location=...`
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) {
      fetchComplaints();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/complaints/search?location=${encodeURIComponent(searchLocation.trim())}`);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error in location search:', err);
      setError('Search failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory]);

  const handleStatusChange = async (id, newStatus) => {
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.put(`/complaints/${id}`, { status: newStatus });
      setSuccessMsg(`Status updated to: ${newStatus}`);
      
      // Update local state
      setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
      
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to remove this complaint?')) return;
    
    setError(null);
    setSuccessMsg(null);
    try {
      await api.delete(`/complaints/${id}`);
      setSuccessMsg('Complaint removed successfully');
      setComplaints(complaints.filter(c => c._id !== id));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error deleting complaint:', err);
      setError('Failed to remove complaint. Delete endpoint failed.');
    }
  };

  const getUrgencyBadgeClass = (urgency) => {
    switch (urgency) {
      case 'High': return 'score-low';
      case 'Medium': return 'score-medium';
      case 'Low': return 'score-high';
      default: return 'score-medium';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <AlertCircle size={16} style={{ color: '#ef4444' }} />;
      case 'In Progress': return <Clock size={16} style={{ color: '#f59e0b' }} />;
      case 'Resolved': return <CheckCircle2 size={16} style={{ color: '#10b981' }} />;
      default: return null;
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search and Filters panel */}
      <div className="glass-panel" style={{ padding: '18px 24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px' 
        }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
              style={{ margin: 0, padding: '8px 16px', minWidth: '180px', background: 'rgba(15, 23, 42, 0.8)' }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c} style={{ background: '#1e293b' }}>{c}</option>
              ))}
            </select>
          </div>

          {/* Location Search Form */}
          <form onSubmit={handleLocationSearch} style={{ display: 'flex', gap: '10px', flex: 1, justifySelf: 'flex-end', maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-secondary)' 
                }} 
              />
              <input
                type="text"
                placeholder="Search by location (e.g. Ghaziabad)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="input-field"
                style={{ margin: 0, paddingLeft: '36px', height: '40px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', height: '40px' }}>
              Search
            </button>
            <button 
              type="button" 
              onClick={() => { setSearchLocation(''); setSelectedCategory('All Categories'); fetchComplaints(); }}
              className="btn btn-success" 
              style={{ padding: '0 12px', height: '40px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }}
              title="Reset Filters"
            >
              <RefreshCw size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid rgba(16, 185, 129, 0.3)', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          color: '#34d399',
          fontSize: '0.9rem'
        }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.15)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          color: '#f87171',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {/* Complaints List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-dots" style={{ fontSize: '2rem' }}>
            <span>•</span><span>•</span><span>•</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <AlertCircle size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p style={{ fontWeight: '500' }}>No complaints found</p>
          <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Try adjusting your search criteria or register a new civic complaint.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {complaints.map(complaint => (
            <div 
              key={complaint._id} 
              className="glass-panel candidate-card" 
              style={{ padding: '20px', cursor: 'default' }}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  cursor: 'pointer' 
                }}
                onClick={() => toggleExpand(complaint._id)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span className={`score-badge ${getUrgencyBadgeClass(complaint.urgency)}`} style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                      {complaint.urgency} Urgency
                    </span>
                    <span className="pill" style={{ margin: 0 }}>{complaint.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={12} />
                      {complaint.location}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: '4px' }}>{complaint.title}</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Submitted by: <strong>{complaint.name}</strong> ({complaint.email})
                  </span>
                </div>

                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                  onClick={(e) => e.stopPropagation()} // Prevent expansion when clicking inputs/buttons
                >
                  {/* Status Dropdown selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getStatusIcon(complaint.status)}
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                      className="input-field"
                      style={{ 
                        margin: 0, 
                        padding: '6px 12px', 
                        fontSize: '0.85rem', 
                        height: 'auto',
                        background: 'rgba(15, 23, 42, 0.8)',
                        width: '130px'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteComplaint(complaint._id)}
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      border: 'none', 
                      color: '#ef4444', 
                      padding: '8px', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete Complaint"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Expansion indicator */}
                  <div 
                    onClick={() => toggleExpand(complaint._id)}
                    style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    {expandedId === complaint._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Expansion Drawer showing AI Insights */}
              {expandedId === complaint._id && (
                <div 
                  className="animate-fade-in" 
                  style={{ 
                    marginTop: '20px', 
                    paddingTop: '20px', 
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Complaint Description</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                      {complaint.description}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    
                    {/* Suggested Department Block */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tag size={12} style={{ color: '#10b981' }} />
                        AI RECOMMENDED DEPARTMENT
                      </span>
                      <div style={{ 
                        background: 'rgba(16, 185, 129, 0.05)', 
                        border: '1px solid rgba(16, 185, 129, 0.2)', 
                        padding: '10px 14px', 
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}>
                        {complaint.suggestedDepartment}
                      </div>
                    </div>

                    {/* AI Summarized Block */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} style={{ color: '#10b981' }} />
                        AI COMPLAINT SUMMARY
                      </span>
                      <div style={{ 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        border: '1px solid var(--border-color)', 
                        padding: '10px 14px', 
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {complaint.summary || 'No AI summary generated.'}
                      </div>
                    </div>
                  </div>

                  {/* AI Auto Response Message */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} style={{ color: '#10b981' }} />
                      AI AUTO-GENERATED RESPONSE MESSAGE
                    </span>
                    <div style={{ 
                      background: 'rgba(16, 185, 129, 0.02)', 
                      border: '1px dashed rgba(16, 185, 129, 0.3)', 
                      padding: '14px', 
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#e2e8f0',
                      lineHeight: '1.5'
                    }}>
                      {complaint.autoResponse || 'No auto-response available.'}
                    </div>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintList;

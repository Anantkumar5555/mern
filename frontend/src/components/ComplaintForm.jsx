import React, { useState } from 'react';
import api from '../api';
import { AlertTriangle, ShieldCheck, Mail, MapPin, Tag, FileText, Send, Sparkles, CheckCircle, Clock } from 'lucide-react';

const CATEGORIES = [
  'Water Supply',
  'Electricity',
  'Sanitation & Waste',
  'Roads & Traffic',
  'Public Safety',
  'Other'
];

function ComplaintForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    category: 'Water Supply',
    location: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAiResult(null);

    // Simple client-side check
    if (!formData.name || !formData.email || !formData.title || !formData.location || !formData.description) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/complaints', formData);
      setSuccess(true);
      setAiResult(response.data.complaint);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        title: '',
        category: 'Water Supply',
        location: '',
        description: ''
      });
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError(err.response?.data?.error || 'Failed to submit complaint. Please check validation rules.');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'High': return 'score-low'; // Red styling in index.css
      case 'Medium': return 'score-medium'; // Orange
      case 'Low': return 'score-high'; // Green
      default: return '';
    }
  };

  return (
    <div className="layout-grid animate-fade-in">
      {/* Registration Form */}
      <div className="glass-panel" style={{ height: 'fit-content' }}>
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText style={{ color: 'var(--accent-primary)' }} />
          Register Civic Complaint
        </h2>
        
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            color: '#f87171', 
            marginBottom: '20px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && !aiResult && (
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.15)', 
            border: '1px solid rgba(16, 185, 129, 0.3)', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            color: '#34d399', 
            marginBottom: '20px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={18} />
            <span>Complaint registered successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Kumar"
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@gmail.com"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Complaint Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Water Leakage near Central Park"
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                style={{ appearance: 'none', background: 'rgba(15, 23, 42, 0.8)' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} style={{ background: '#1e293b' }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location / City</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Ghaziabad"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail so that our AI can analyze urgency and assign it to the proper department..."
              className="input-field"
              rows="4"
              style={{ resize: 'vertical' }}
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-dots">
                Submitting <span>•</span><span>•</span><span>•</span>
              </span>
            ) : (
              <>
                <Send size={18} />
                Submit & Analyze Complaint
              </>
            )}
          </button>
        </form>
      </div>

      {/* AI Analysis View */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}>
          <Sparkles style={{ color: '#10b981' }} />
          AI Analysis Engine
        </h2>

        {aiResult ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>COMPLAINT STATUS</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Clock size={16} style={{ color: '#f59e0b' }} />
                  {aiResult.status}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>AI DETECTED URGENCY</span>
                <span className={`score-badge ${getUrgencyClass(aiResult.urgency)}`}>
                  {aiResult.urgency}
                </span>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} />
                RECOMMENDED CONCERNED DEPARTMENT
              </h4>
              <p style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontWeight: '600',
                color: 'var(--text-primary)',
                borderLeft: '4px solid var(--accent-primary)'
              }}>
                {aiResult.suggestedDepartment}
              </p>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} />
                AI COMPLAINT SUMMARY
              </h4>
              <p style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '14px', 
                borderRadius: '8px', 
                lineHeight: '1.5',
                fontSize: '0.95rem',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              }}>
                {aiResult.summary}
              </p>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} />
                AUTO-GENERATED RESPONDER MESSAGE
              </h4>
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.03)', 
                padding: '16px', 
                borderRadius: '8px', 
                lineHeight: '1.5',
                fontSize: '0.92rem',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#e2e8f0',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '0.7rem',
                  background: 'rgba(16,185,129,0.15)',
                  color: '#10b981',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>
                  READY TO SEND
                </div>
                {aiResult.autoResponse}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: '1px dashed var(--border-color)'
          }}>
            <Sparkles size={48} style={{ color: 'var(--text-secondary)', opacity: '0.3', marginBottom: '16px' }} />
            <p style={{ fontWeight: '500', marginBottom: '8px' }}>Waiting for complaint registration...</p>
            <p style={{ fontSize: '0.85rem', maxWidth: '300px' }}>
              Once you submit a civic complaint, our real-time AI engine will instantly classify priority, assign the correct department, and draft an automatic email response.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplaintForm;

import React, { useState } from 'react';
import api from '../api';

const CandidateForm = ({ onCandidateAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      };
      
      const res = await api.post('/candidates', payload);
      setMessage('Candidate added successfully!');
      setFormData({ name: '', email: '', skills: '', experience: '', bio: '' });
      if (onCandidateAdded) onCandidateAdded();
    } catch (error) {
      console.error(error);
      setMessage('Error adding candidate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ marginBottom: '32px' }}>
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Add New Candidate
      </h2>
      <form onSubmit={handleSubmit}>
        <input 
          className="input-field" 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        <input 
          className="input-field" 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          className="input-field" 
          type="text" 
          name="skills" 
          placeholder="Skills (comma separated, e.g. React, Node.js)" 
          value={formData.skills} 
          onChange={handleChange} 
          required 
        />
        <input 
          className="input-field" 
          type="number" 
          name="experience" 
          placeholder="Years of Experience" 
          value={formData.experience} 
          onChange={handleChange} 
          min="0"
          required 
        />
        <textarea 
          className="input-field" 
          name="bio" 
          placeholder="Brief Bio / Projects" 
          value={formData.bio} 
          onChange={handleChange}
          rows="3"
        ></textarea>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Adding...' : 'Add Candidate'}
        </button>
        {message && (
          <p style={{ marginTop: '12px', textAlign: 'center', color: message.includes('Error') ? '#ef4444' : '#10b981' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CandidateForm;

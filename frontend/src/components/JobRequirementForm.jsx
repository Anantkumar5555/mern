import React, { useState } from 'react';
import api from '../api';

const JobRequirementForm = ({ onShortlist, candidates, setCandidates }) => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    minExperience: ''
  });
  const [loadingAi, setLoadingAi] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
        minExperience: formData.minExperience ? Number(formData.minExperience) : 0
      };
      
      const res = await api.post('/match', payload);
      onShortlist(res.data, payload);
    } catch (error) {
      console.error(error);
      alert('Error fetching matches');
    }
  };

  const handleAiShortlist = async () => {
    if (candidates.length === 0) {
      alert("Please generate a basic match first or ensure there are candidates.");
      return;
    }

    setLoadingAi(true);
    try {
      const payload = {
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
        minExperience: formData.minExperience ? Number(formData.minExperience) : 0,
        candidates: candidates // Send current matched candidates to AI
      };
      
      const res = await api.post('/ai/shortlist', payload);
      
      // The AI response might be a chunk of text. We'll attach it to the parent state to display.
      onShortlist(candidates, payload, res.data.recommendation);
    } catch (error) {
      console.error(error);
      alert('Error from AI shortlisting. Make sure API key is set in backend.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 style={{ marginBottom: '24px' }}>Job Requirements</h2>
      <form onSubmit={handleMatch}>
        <input 
          className="input-field" 
          type="text" 
          name="requiredSkills" 
          placeholder="Required Skills (e.g. React, Node.js)" 
          value={formData.requiredSkills} 
          onChange={handleChange} 
          required 
        />
        <input 
          className="input-field" 
          type="number" 
          name="minExperience" 
          placeholder="Minimum Experience (Years)" 
          value={formData.minExperience} 
          onChange={handleChange} 
          min="0"
        />
        
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Match Candidates
          </button>
          <button 
            type="button" 
            className="btn btn-success" 
            style={{ flex: 1 }}
            onClick={handleAiShortlist}
            disabled={loadingAi}
          >
            {loadingAi ? 'Analyzing...' : 'AI Recommend ✨'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobRequirementForm;

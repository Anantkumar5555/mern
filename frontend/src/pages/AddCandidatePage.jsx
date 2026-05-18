import React from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateForm from '../components/CandidateForm';

const AddCandidatePage = () => {
  const navigate = useNavigate();

  const handleCandidateAdded = () => {
    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <header className="page-header">
        <h1>Onboard Candidate</h1>
        <p>Add a new candidate profile to the database.</p>
      </header>
      <CandidateForm onCandidateAdded={handleCandidateAdded} />
    </div>
  );
};

export default AddCandidatePage;

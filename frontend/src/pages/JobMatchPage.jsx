import React, { useState, useEffect } from 'react';
import JobRequirementForm from '../components/JobRequirementForm';
import CandidateList from '../components/CandidateList';
import api from '../api';

const JobMatchPage = () => {
  const [allCandidates, setAllCandidates] = useState([]);
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [jobReq, setJobReq] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/candidates');
        setAllCandidates(res.data);
      } catch (error) {
        console.error('Failed to fetch candidates', error);
      }
    };
    fetchCandidates();
  }, []);

  const handleShortlist = (matched, reqPayload, aiText = '') => {
    setMatchedCandidates(matched);
    setJobReq(reqPayload);
    setAiRecommendation(aiText);
  };

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <h1>AI Intelligent Shortlisting</h1>
        <p>Enter job requirements to instantly find and rank the best candidates.</p>
      </header>
      
      <div className="layout-grid">
        <div>
          <JobRequirementForm 
            onShortlist={handleShortlist} 
            candidates={allCandidates}
            setCandidates={setAllCandidates}
          />
        </div>
        <div>
          {matchedCandidates.length > 0 || aiRecommendation ? (
            <CandidateList 
              candidates={matchedCandidates} 
              aiRecommendation={aiRecommendation}
              jobReq={jobReq}
            />
          ) : (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Enter requirements and click Match Candidates to see results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMatchPage;

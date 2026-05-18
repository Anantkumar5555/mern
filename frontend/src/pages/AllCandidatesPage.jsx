import React, { useState, useEffect } from 'react';
import CandidateList from '../components/CandidateList';
import api from '../api';

const AllCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/candidates');
        setCandidates(res.data);
      } catch (error) {
        console.error('Failed to fetch candidates', error);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <h1>Candidate Database</h1>
        <p>View all candidates currently in the system.</p>
      </header>
      <CandidateList candidates={candidates} />
    </div>
  );
};

export default AllCandidatesPage;

import React from 'react';
import ReactMarkdown from 'react-markdown';

const CandidateList = ({ candidates, aiRecommendation, jobReq }) => {

  const getScoreClass = (score) => {
    if (score === undefined || score === null) return '';
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s', marginTop: '32px' }}>
      <h2 style={{ marginBottom: '24px' }}>Candidates {jobReq ? '(Matched)' : '(All)'}</h2>
      
      {aiRecommendation && (
        <div className="ai-reasoning" style={{ marginBottom: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            ✨ AI Recommendation
          </h3>
          <div className="markdown-body">
            <ReactMarkdown>{aiRecommendation}</ReactMarkdown>
          </div>
        </div>
      )}

      {candidates.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No candidates found.</p>
      ) : (
        <div>
          {candidates.map((cand, idx) => (
            <div key={cand._id || idx} className="glass-panel candidate-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{cand.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>
                    {cand.email} • {cand.experience} yrs exp
                  </p>
                  <div>
                    {cand.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="pill" 
                        style={{ 
                          background: jobReq && jobReq.requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase()) 
                            ? 'rgba(16, 185, 129, 0.2)' 
                            : 'rgba(255, 255, 255, 0.1)',
                          color: jobReq && jobReq.requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                            ? '#34d399'
                            : '#e2e8f0'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {cand.bio && <p style={{ marginTop: '12px', fontSize: '0.95rem', color: '#e2e8f0' }}>{cand.bio}</p>}
                </div>
                
                {cand.matchScore !== undefined && (
                  <div className={`score-badge ${getScoreClass(cand.matchScore)}`}>
                    {cand.matchScore}% Match
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;

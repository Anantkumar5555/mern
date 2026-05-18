import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllCandidatesPage from './pages/AllCandidatesPage';
import AddCandidatePage from './pages/AddCandidatePage';
import JobMatchPage from './pages/JobMatchPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Chatbot from './components/Chatbot';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '15px' }}>
        <div className="loading-dots" style={{ fontSize: '2rem' }}>
          <span>•</span><span>•</span><span>•</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading secure session...</p>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <div className="container" style={{ paddingTop: user ? '120px' : '40px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/candidates" element={user ? <AllCandidatesPage /> : <Navigate to="/login" />} />
          <Route path="/add" element={user ? <AddCandidatePage /> : <Navigate to="/login" />} />
          <Route path="/match" element={user ? <JobMatchPage /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
      {user && <Chatbot />}
    </>
  );
}

export default App;

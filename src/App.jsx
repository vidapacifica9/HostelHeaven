import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/guest/Login';
import Checkin from './components/guest/Checkin';
import Dashboard from './components/guest/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import './index.css';

function App() {
  const [hostelInfo, setHostelInfo] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Guest Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/login" 
          element={<Login setHostelInfo={setHostelInfo} />} 
        />
        <Route 
          path="/guest/checkin" 
          element={
            hostelInfo ? (
              <Checkin hostelInfo={hostelInfo} setHasCheckedIn={setHasCheckedIn} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/guest/dashboard" 
          element={
            hostelInfo && hasCheckedIn ? (
              <Dashboard hostelInfo={hostelInfo} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

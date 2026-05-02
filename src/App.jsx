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
  
  // In-App Purchases State
  const [orders, setOrders] = useState([]);
  const [allowRoomDelivery, setAllowRoomDelivery] = useState(true);

  // Community State
  const [communityOptIn, setCommunityOptIn] = useState(false);
  const [userStatus, setUserStatus] = useState('');
  const [lobbyMessages, setLobbyMessages] = useState([
    { id: 1, sender: 'Sarah', text: 'Hey everyone! Anyone heading to the beach today?', time: '10:30 AM', isMine: false },
    { id: 2, sender: 'Mike', text: 'I am! Leaving in about 20 mins if you want to join.', time: '10:32 AM', isMine: false },
    { id: 3, sender: 'Emma', text: 'Count me in too! 🌊', time: '10:35 AM', isMine: false }
  ]);

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
              <Dashboard 
                hostelInfo={hostelInfo} 
                orders={orders} 
                setOrders={setOrders} 
                allowRoomDelivery={allowRoomDelivery} 
                communityOptIn={communityOptIn}
                setCommunityOptIn={setCommunityOptIn}
                userStatus={userStatus}
                setUserStatus={setUserStatus}
                lobbyMessages={lobbyMessages}
                setLobbyMessages={setLobbyMessages}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminDashboard 
              orders={orders} 
              setOrders={setOrders} 
              allowRoomDelivery={allowRoomDelivery} 
              setAllowRoomDelivery={setAllowRoomDelivery} 
            />
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

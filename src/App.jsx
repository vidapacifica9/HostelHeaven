import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/guest/Login';
import Checkin from './components/guest/Checkin';
import Dashboard from './components/guest/Dashboard';
import Events from './components/guest/Events';
import AdminDashboard from './components/admin/AdminDashboard';
import './index.css';

function App() {
  // Auth State
  const [hostelInfo, setHostelInfo] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // In-App Purchases State
  const [orders, setOrders] = useState([]);
  const [allowRoomDelivery, setAllowRoomDelivery] = useState(true);

  // Community State
  const [communityOptIn, setCommunityOptIn] = useState(false);
  const [userStatus, setUserStatus] = useState('');
  const [lobbyMessages, setLobbyMessages] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Guest Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={<Login setHostelInfo={setHostelInfo} setBookingInfo={setBookingInfo} setHasCheckedIn={setHasCheckedIn} />}
        />

        <Route
          path="/guest/checkin"
          element={
            hostelInfo ? (
              <Checkin hostelInfo={hostelInfo} bookingInfo={bookingInfo} setHasCheckedIn={setHasCheckedIn} />
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
                bookingInfo={bookingInfo}
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

        <Route
          path="/guest/events"
          element={
            bookingInfo ? (
              <Events bookingInfo={bookingInfo} hostelInfo={hostelInfo} />
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

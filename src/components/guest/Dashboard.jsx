import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Wifi, LogOut, Info, Map, MessageSquare, ShoppingBag, Users, Compass } from 'lucide-react';
import Events from './Events';
import Chatbot from './Chatbot';
import Store from './Store';
import Community from './Community';
import LocalRecommendations from './LocalRecommendations';
import ThemeToggle from '../ThemeToggle';
import { supabase } from '../../lib/supabaseClient';

const Dashboard = ({ hostelInfo, bookingInfo, orders, setOrders, allowRoomDelivery, communityOptIn, setCommunityOptIn, userStatus, setUserStatus, lobbyMessages, setLobbyMessages }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportDetails, setReportDetails] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('staff_tasks')
      .insert([{
        hostel_id: hostelInfo.id,
        booking_id: bookingInfo.id,
        title: reportDetails.title,
        description: `${bookingInfo.guest_name} (Room ${bookingInfo.room_number}-${bookingInfo.bed_number}): ${reportDetails.description}`,
        category: 'Guest Request',
        status: 'Pending'
      }]);

    if (!error) {
      alert('Issue reported to staff. They will handle it soon!');
      setShowReportForm(false);
      setReportDetails({ title: '', description: '' });
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <div>
          <h1 className="heading-1" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Welcome, Alex!</h1>
          <p className="text-muted">{hostelInfo?.name || 'HostelHeaven'}, {hostelInfo?.city || 'Barcelona'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <ThemeToggle />
          <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem', backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
            <LogOut size={24} />
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'overview' ? 'var(--surface)' : '', color: activeTab !== 'overview' ? 'var(--text-main)' : '' }}
        >
          <Info size={18} /> Overview
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`btn ${activeTab === 'events' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'events' ? 'var(--surface)' : '', color: activeTab !== 'events' ? 'var(--text-main)' : '' }}
        >
          <Map size={18} /> Events
        </button>
        <button 
          onClick={() => setActiveTab('community')}
          className={`btn ${activeTab === 'community' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'community' ? 'var(--surface)' : '', color: activeTab !== 'community' ? 'var(--text-main)' : '' }}
        >
          <Users size={18} /> Community
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`btn ${activeTab === 'chat' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'chat' ? 'var(--surface)' : '', color: activeTab !== 'chat' ? 'var(--text-main)' : '' }}
        >
          <MessageSquare size={18} /> Concierge
        </button>
        <button 
          onClick={() => setActiveTab('store')}
          className={`btn ${activeTab === 'store' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'store' ? 'var(--surface)' : '', color: activeTab !== 'store' ? 'var(--text-main)' : '' }}
        >
          <ShoppingBag size={18} /> Order
        </button>
        <button 
          onClick={() => setActiveTab('explore')}
          className={`btn ${activeTab === 'explore' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'explore' ? 'var(--surface)' : '', color: activeTab !== 'explore' ? 'var(--text-main)' : '' }}
        >
          <Compass size={18} /> Explore
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          {/* Digital Key Card */}
          <div className="glass-panel" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <p style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Room</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>4B</h2>
              </div>
              <Key size={32} color="rgba(255,255,255,0.8)" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Bed</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Bottom</h3>
              </div>
              <div>
                <p style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Locker Code</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px' }}>7412</h3>
              </div>
            </div>
          </div>

          {/* Wi-Fi Card */}
          <div className="glass-panel">
            <h3 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <Wifi size={20} color="var(--primary)" /> Wi-Fi Access
            </h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                <span className="text-muted">Network</span>
                <span style={{ fontWeight: 600 }}>HostelHeaven_Guest</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Password</span>
                <span style={{ fontWeight: 600, letterSpacing: '1px' }}>hostelheaven24</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel">
            <h3 className="heading-2" style={{ fontSize: '1.25rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn" style={{ width: '100%', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)' }}>Extend Stay</button>
              <button 
                onClick={() => setShowReportForm(!showReportForm)} 
                className="btn" 
                style={{ width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid #EF4444', color: '#EF4444' }}
              >
                Report Issue
              </button>
            </div>
          </div>

          {/* Report Issue Form */}
          {showReportForm && (
            <div className="glass-panel" style={{ gridColumn: 'span 2', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid #EF4444' }}>
              <h2 className="heading-2" style={{ color: '#EF4444', fontSize: '1.1rem' }}>Report a Maintenance Issue</h2>
              <form onSubmit={handleReportIssue} style={{ marginTop: '1rem' }}>
                <div className="input-group">
                  <label>What's the issue?</label>
                  <input 
                    className="input-field" 
                    placeholder="e.g. Broken AC, Missing towels" 
                    value={reportDetails.title}
                    onChange={e => setReportDetails({...reportDetails, title: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group" style={{ marginTop: '0.5rem' }}>
                  <label>Details</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Brief description of the problem..." 
                    rows="2"
                    value={reportDetails.description}
                    onChange={e => setReportDetails({...reportDetails, description: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#EF4444', border: 'none', flex: 1 }}>Submit Report</button>
                  <button type="button" onClick={() => setShowReportForm(false)} className="btn" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && <Events bookingInfo={bookingInfo} hostelInfo={hostelInfo} />}
      {activeTab === 'community' && <Community hostelInfo={hostelInfo} bookingInfo={bookingInfo} communityOptIn={communityOptIn} setCommunityOptIn={setCommunityOptIn} userStatus={userStatus} setUserStatus={setUserStatus} lobbyMessages={lobbyMessages} setLobbyMessages={setLobbyMessages} />}
      {activeTab === 'chat' && <Chatbot />}
      {activeTab === 'store' && <Store orders={orders} setOrders={setOrders} allowRoomDelivery={allowRoomDelivery} />}
      {activeTab === 'explore' && <LocalRecommendations hostelInfo={hostelInfo} />}

    </div>
  );
};

export default Dashboard;

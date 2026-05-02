import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Wifi, LogOut, Info, Map, MessageSquare, ShoppingBag } from 'lucide-react';
import Events from './Events';
import Chatbot from './Chatbot';
import Store from './Store';

const Dashboard = ({ hostelInfo, orders, setOrders, allowRoomDelivery }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <div>
          <h1 className="heading-1" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Welcome, Alex!</h1>
          <p className="text-muted">{hostelInfo?.name || 'HostelHeaven'}, {hostelInfo?.city || 'Barcelona'}</p>
        </div>
        <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem', backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
          <LogOut size={24} />
        </button>
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
          <ShoppingBag size={18} /> Store
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
              <button className="btn" style={{ width: '100%', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)' }}>Report Issue</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && <Events />}
      {activeTab === 'chat' && <Chatbot />}
      {activeTab === 'store' && <Store orders={orders} setOrders={setOrders} allowRoomDelivery={allowRoomDelivery} />}

    </div>
  );
};

export default Dashboard;

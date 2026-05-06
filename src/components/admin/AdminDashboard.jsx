import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Bed, CalendarPlus, LogOut, ShoppingBag, Shield, Compass } from 'lucide-react';
import BedAllocation from './BedAllocation';
import EventManagement from './EventManagement';
import OrdersDashboard from './OrdersDashboard';
import AdminChatMod from './AdminChatMod';
import RecommendationManager from './RecommendationManager';

const checkInsToday = [
  { name: 'Sarah Connor', ref: 'HH-8821', time: '14:00', status: 'Pending' },
  { name: 'John Doe', ref: 'HH-98234', time: '15:30', status: 'Checked In' },
  { name: 'Mike Ross', ref: 'HH-1122', time: '16:00', status: 'Pending' },
];

const AdminDashboard = ({ orders, setOrders, allowRoomDelivery, setAllowRoomDelivery }) => {
  const [activeTab, setActiveTab] = useState('checkins');
  const navigate = useNavigate();

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <div>
          <h1 className="heading-1" style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>Staff Portal</h1>
          <p className="text-muted">HostelHeaven, Barcelona</p>
        </div>
        <button onClick={() => navigate('/login')} className="btn" style={{ padding: '0.5rem', backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
          <LogOut size={24} />
        </button>
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('checkins')}
          className={`btn ${activeTab === 'checkins' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'checkins' ? 'var(--surface)' : '', color: activeTab !== 'checkins' ? 'var(--text-main)' : '' }}
        >
          <Users size={18} /> Check-ins
        </button>
        <button 
          onClick={() => setActiveTab('beds')}
          className={`btn ${activeTab === 'beds' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'beds' ? 'var(--surface)' : '', color: activeTab !== 'beds' ? 'var(--text-main)' : '' }}
        >
          <Bed size={18} /> Beds
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`btn ${activeTab === 'events' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'events' ? 'var(--surface)' : '', color: activeTab !== 'events' ? 'var(--text-main)' : '' }}
        >
          <CalendarPlus size={18} /> Events
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'orders' ? 'var(--surface)' : '', color: activeTab !== 'orders' ? 'var(--text-main)' : '' }}
        >
          <ShoppingBag size={18} /> Orders
        </button>
        <button 
          onClick={() => setActiveTab('mod')}
          className={`btn ${activeTab === 'mod' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'mod' ? 'var(--surface)' : '', color: activeTab !== 'mod' ? 'var(--text-main)' : '' }}
        >
          <Shield size={18} /> Moderation
        </button>
        <button 
          onClick={() => setActiveTab('tips')}
          className={`btn ${activeTab === 'tips' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'tips' ? 'var(--surface)' : '', color: activeTab !== 'tips' ? 'var(--text-main)' : '' }}
        >
          <Compass size={18} /> Local Tips
        </button>
      </div>

      {/* Check-ins View */}
      {activeTab === 'checkins' && (
        <div className="glass-panel" style={{ marginTop: '1rem' }}>
          <h2 className="heading-2">Today's Arrivals</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>3 guests arriving today.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {checkInsToday.map((guest, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface)'
              }}>
                <div>
                  <h3 style={{ fontWeight: 600 }}>{guest.name}</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>Ref: {guest.ref} • ETA: {guest.time}</p>
                </div>
                <div>
                  <span style={{ 
                    backgroundColor: guest.status === 'Checked In' ? 'var(--secondary)' : 'var(--surface-hover)', 
                    color: guest.status === 'Checked In' ? 'white' : 'var(--text-muted)',
                    border: guest.status === 'Checked In' ? 'none' : '1px solid var(--border)',
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {guest.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'beds' && <BedAllocation />}
      {activeTab === 'events' && <EventManagement />}
      {activeTab === 'orders' && <OrdersDashboard orders={orders} setOrders={setOrders} allowRoomDelivery={allowRoomDelivery} setAllowRoomDelivery={setAllowRoomDelivery} />}
      {activeTab === 'mod' && <AdminChatMod />}
      {activeTab === 'tips' && <RecommendationManager />}

    </div>
  );
};

export default AdminDashboard;

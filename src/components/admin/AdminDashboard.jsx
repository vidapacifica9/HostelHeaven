import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Bed, CalendarPlus, LogOut, ShoppingBag, Shield, Compass, ClipboardList, LogIn, Home, Crown, Star, Info } from 'lucide-react';
import BedAllocation from './BedAllocation';
import EventManagement from './EventManagement';
import OrdersDashboard from './OrdersDashboard';
import AdminChatMod from './AdminChatMod';
import RecommendationManager from './RecommendationManager';
import StaffHub from './StaffHub';
import AdminOverview from './AdminOverview';
import GuestProfileModal from './GuestProfileModal';
import ThemeToggle from '../ThemeToggle';
import { supabase } from '../../lib/supabaseClient';

const AdminDashboard = ({ orders, setOrders, allowRoomDelivery, setAllowRoomDelivery }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
        setBookings(data);
        setAllBookings(data);
    }
    setLoading(false);
  };

  const getGuestLoyalty = (email) => {
    if (!email) return { label: 'New', color: 'var(--secondary)', icon: null };
    const count = allBookings.filter(b => b.guest_email === email).length;
    if (count >= 5) return { label: 'VIP', color: '#F59E0B', icon: <Crown size={14} /> };
    if (count >= 2) return { label: 'Returning', color: '#3B82F6', icon: <Star size={14} /> };
    return { label: 'New', color: 'var(--secondary)', icon: null };
  };

  const handleUpdateStatus = async (booking, newStatus) => {
    const loyalty = getGuestLoyalty(booking.guest_email);
    
    if (newStatus === 'Checked-in' && (loyalty.label === 'Returning' || loyalty.label === 'VIP')) {
      alert(`🌟 LOYALTY ALERT: ${booking.guest_name} is a ${loyalty.label} guest! \n\nAction: Offer a free welcome drink or room upgrade if available.`);
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', booking.id);

    if (!error) {
      // Automate cleaning task if checking out
      if (newStatus === 'Checked-out') {
        const { data: hostel } = await supabase.from('hostels').select('id').eq('prefix', 'HH').single();
        await supabase.from('staff_tasks').insert([{
          hostel_id: hostel?.id,
          title: `Clean Bed ${booking.room_number}-${booking.bed_number}`,
          description: `Guest ${booking.guest_name} just checked out.`,
          category: 'Cleaning',
          status: 'Pending'
        }]);
      }
      fetchBookings();
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <div>
          <h1 className="heading-1" style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>Staff Portal</h1>
          <p className="text-muted">HostelHeaven, Barcelona</p>
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
          <Home size={18} /> Overview
        </button>
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
        <button 
          onClick={() => setActiveTab('staff')}
          className={`btn ${activeTab === 'staff' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab !== 'staff' ? 'var(--surface)' : '', color: activeTab !== 'staff' ? 'var(--text-main)' : '' }}
        >
          <ClipboardList size={18} /> Staff Hub
        </button>
      </div>

      {/* Check-ins View */}
      {activeTab === 'checkins' && (
        <div className="glass-panel" style={{ marginTop: '1rem' }}>
          <h2 className="heading-2">Arrivals & Departures</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Manage guest status.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? <p>Loading bookings...</p> : bookings.map((booking) => (
              <div key={booking.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontWeight: 600 }}>{booking.guest_name}</h3>
                    {(() => {
                      const loyalty = getGuestLoyalty(booking.guest_email);
                      return (
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 800, 
                          color: 'white', 
                          backgroundColor: loyalty.color, 
                          padding: '0.1rem 0.4rem', 
                          borderRadius: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          textTransform: 'uppercase'
                        }}>
                          {loyalty.icon} {loyalty.label}
                        </span>
                      );
                    })()}
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.1rem 0.5rem', 
                      borderRadius: '1rem', 
                      backgroundColor: booking.status === 'Checked-in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                      color: booking.status === 'Checked-in' ? 'var(--secondary)' : 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>Ref: {booking.booking_ref} | Room: {booking.room_number}-{booking.bed_number}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setSelectedGuest(booking)} className="btn" style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>
                    <Info size={18} />
                  </button>
                  {booking.status === 'Pending' && (
                    <button onClick={() => handleUpdateStatus(booking, 'Checked-in')} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                      Check In
                    </button>
                  )}
                  {booking.status === 'Checked-in' && (
                    <button onClick={() => handleUpdateStatus(booking, 'Checked-out')} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', border: '1px solid #EF4444', color: '#EF4444' }}>
                      Check Out
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedGuest && (
        <GuestProfileModal 
          guest={selectedGuest} 
          allBookings={allBookings} 
          onClose={() => setSelectedGuest(null)} 
        />
      )}

      {activeTab === 'overview' && <AdminOverview />}
      {activeTab === 'beds' && <BedAllocation />}
      {activeTab === 'events' && <EventManagement />}
      {activeTab === 'orders' && <OrdersDashboard orders={orders} setOrders={setOrders} allowRoomDelivery={allowRoomDelivery} setAllowRoomDelivery={setAllowRoomDelivery} />}
      {activeTab === 'mod' && <AdminChatMod />}
      {activeTab === 'tips' && <RecommendationManager />}
      {activeTab === 'staff' && <StaffHub />}

    </div>
  );
};

export default AdminDashboard;

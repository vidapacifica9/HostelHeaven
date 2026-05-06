import React from 'react';
import { X, Calendar, MapPin, Coffee, ShoppingBag, Crown, Star } from 'lucide-react';

const GuestProfileModal = ({ guest, allBookings, onClose }) => {
  const guestHistory = allBookings.filter(b => b.guest_email === guest.guest_email);
  const stayCount = guestHistory.length;

  const getLoyaltyBadge = () => {
    if (stayCount >= 5) return { label: 'VIP Guest', color: '#F59E0B', icon: <Crown size={20} /> };
    if (stayCount >= 2) return { label: 'Returning Guest', color: '#3B82F6', icon: <Star size={20} /> };
    return { label: 'New Guest', color: 'var(--secondary)', icon: null };
  };

  const badge = getLoyaltyBadge();

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.7)', 
      zIndex: 2000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        backgroundColor: 'var(--background)', 
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--surface-hover)', 
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--primary)',
            border: `2px solid ${badge.color}`
          }}>
            {guest.guest_name.charAt(0)}
          </div>
          <h2 className="heading-1" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{guest.guest_name}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: badge.color, fontWeight: 700 }}>
            {badge.icon} {badge.label}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.75rem' }}>Stay History</h4>
            <div style={{ backgroundColor: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="text-muted">Total Stays</span>
                <span style={{ fontWeight: 600 }}>{stayCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">First Visit</span>
                <span style={{ fontWeight: 600 }}>{new Date(guestHistory[guestHistory.length - 1]?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {guest.loyalty_notes && (
            <div>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.75rem' }}>Staff Notes</h4>
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#F59E0B', fontSize: '0.875rem' }}>
                {guest.loyalty_notes}
              </div>
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.75rem' }}>Active Stay</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Room</p>
                <p style={{ fontWeight: 700 }}>{guest.room_number}</p>
              </div>
              <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bed</p>
                <p style={{ fontWeight: 700 }}>{guest.bed_number}</p>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>Close Profile</button>
        </div>
      </div>
    </div>
  );
};

export default GuestProfileModal;

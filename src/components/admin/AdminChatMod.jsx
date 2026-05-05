import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Ban } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const AdminChatMod = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    // Setup real-time listener for admin
    const channel = supabase
      .channel('admin_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lobby_messages' }, payload => {
        fetchMessages(); // Simple refetch on any change for admin dashboard
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    // In a real app we'd filter by hostel_id based on the admin's assigned hostel.
    // For MVP, we just fetch all non-deleted messages.
    const { data, error } = await supabase
      .from('lobby_messages')
      .select(`
        *,
        bookings ( is_banned, booking_ref )
      `)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    
    await supabase
      .from('lobby_messages')
      .update({ is_deleted: true })
      .eq('id', id);
      
    setMessages(messages.filter(m => m.id !== id));
  };

  const handleBanUser = async (bookingId, guestName) => {
    if (!bookingId) {
      alert("Cannot ban this user because the booking ID is missing.");
      return;
    }
    if (!window.confirm(`Are you sure you want to ban ${guestName}? They will no longer be able to send messages.`)) return;

    await supabase
      .from('bookings')
      .update({ is_banned: true })
      .eq('id', bookingId);
      
    alert(`${guestName} has been banned.`);
    fetchMessages(); // Refresh to show banned status
  };

  // Format time helper
  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={24} color="#EF4444" /> Chat Moderation
          </h2>
          <p className="text-muted">Monitor the global lobby chat, delete messages, and ban abusive users.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No active messages in the lobby.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ 
              backgroundColor: 'var(--surface)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600 }}>{msg.sender_name}</span>
                  {msg.bookings?.is_banned && (
                    <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '1rem', fontWeight: 600 }}>BANNED</span>
                  )}
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{formatTime(msg.created_at)}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>• Ref: {msg.bookings?.booking_ref || 'Unknown'}</span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{msg.text}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="btn" 
                  style={{ padding: '0.5rem', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  title="Delete Message"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => handleBanUser(msg.booking_id, msg.sender_name)}
                  disabled={msg.bookings?.is_banned}
                  className="btn" 
                  style={{ 
                    padding: '0.5rem', 
                    color: msg.bookings?.is_banned ? 'var(--text-muted)' : 'white', 
                    backgroundColor: msg.bookings?.is_banned ? 'var(--surface-hover)' : '#1F2937' 
                  }}
                  title={msg.bookings?.is_banned ? "User already banned" : "Ban User"}
                >
                  <Ban size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminChatMod;

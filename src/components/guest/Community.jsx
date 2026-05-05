import React, { useState, useRef, useEffect } from 'react';
import { Users, Eye, Coffee, MapPin, Beer, Utensils, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const mockCommunity = [
  { id: 1, name: 'Sarah', status: 'Up for drinks', icon: <Beer size={16} /> },
  { id: 2, name: 'Mike', status: 'Going exploring', icon: <MapPin size={16} /> },
  { id: 3, name: 'Emma', status: 'Looking for dinner', icon: <Utensils size={16} /> },
  { id: 4, name: 'David', status: 'Just chilling', icon: <Coffee size={16} /> },
];

const statusOptions = [
  { label: 'Up for drinks', icon: <Beer size={16} /> },
  { label: 'Looking for dinner', icon: <Utensils size={16} /> },
  { label: 'Going exploring', icon: <MapPin size={16} /> },
  { label: 'Just chilling', icon: <Coffee size={16} /> }
];

const Community = ({ hostelInfo, bookingInfo, communityOptIn, setCommunityOptIn, userStatus, setUserStatus, lobbyMessages, setLobbyMessages }) => {
  const [activeTab, setActiveTab] = useState('board');
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Fetch initial messages and set up real-time subscription
  useEffect(() => {
    if (!hostelInfo?.id) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('lobby_messages')
        .select('*')
        .eq('hostel_id', hostelInfo.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (data) {
        setLobbyMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:lobby_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'lobby_messages',
        filter: `hostel_id=eq.${hostelInfo.id}`
      }, payload => {
        setLobbyMessages(current => {
          // Prevent duplicates
          if (current.find(m => m.id === payload.new.id)) return current;
          return [...current, payload.new];
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'lobby_messages',
        filter: `hostel_id=eq.${hostelInfo.id}`
      }, payload => {
        // Handle message deletion (moderation)
        if (payload.new.is_deleted) {
          setLobbyMessages(current => current.filter(m => m.id !== payload.new.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hostelInfo, setLobbyMessages]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lobbyMessages, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !bookingInfo) return;
    
    if (bookingInfo.is_banned) {
      alert("You have been blocked from sending messages by the admin.");
      setNewMessage('');
      return;
    }

    const textToSend = newMessage;
    setNewMessage('');

    const { error } = await supabase
      .from('lobby_messages')
      .insert([
        { 
          hostel_id: hostelInfo.id,
          booking_id: bookingInfo.id,
          sender_name: bookingInfo.guest_name,
          text: textToSend
        }
      ]);

    if (error) {
      console.error('Error sending message:', error);
      // Revert optimism if failed
      alert("Failed to send message.");
    }
  };
  
  // Format time helper
  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!communityOptIn) {
    return (
      <div className="glass-panel" style={{ marginTop: '1rem', textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ backgroundColor: 'var(--surface-hover)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
          <Users size={32} />
        </div>
        <h2 className="heading-2">Who's Here?</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          Hostels are better together. Opt-in to the community to see who else is staying here and jump into the Lobby Chat!
        </p>
        <div style={{ backgroundColor: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', textAlign: 'left' }}>
            <Eye size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
            <span>For your privacy, only your <strong>First Name</strong> and <strong>Current Status</strong> will be visible. Your room number is hidden.</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCommunityOptIn(true)} style={{ width: '100%', padding: '1rem' }}>
          Opt-in to Community
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <div style={{ flexShrink: 0 }}>
        <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} color="var(--primary)" /> The Community
        </h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Find travel buddies and join the conversation.</p>

        {/* Sub-navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('board')}
            className="btn"
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: activeTab === 'board' ? 'var(--primary)' : 'transparent', 
              color: activeTab === 'board' ? 'white' : 'var(--text-main)',
              border: activeTab === 'board' ? 'none' : '1px solid var(--border)'
            }}
          >
            <Users size={16} /> Status Board
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className="btn"
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: activeTab === 'chat' ? 'var(--primary)' : 'transparent', 
              color: activeTab === 'chat' ? 'white' : 'var(--text-main)',
              border: activeTab === 'chat' ? 'none' : '1px solid var(--border)'
            }}
          >
            <MessageCircle size={16} /> Lobby Chat
          </button>
        </div>
      </div>

      {activeTab === 'board' ? (
        <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '0.5rem' }}>
          {/* Status Setter */}
          <div style={{ backgroundColor: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Your Current Vibe
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {statusOptions.map((opt, idx) => (
                <button 
                  key={idx}
                  onClick={() => setUserStatus(opt.label)}
                  className="btn"
                  style={{ 
                    padding: '0.5rem 0.75rem', 
                    fontSize: '0.875rem',
                    backgroundColor: userStatus === opt.label ? 'var(--primary)' : 'var(--surface)',
                    color: userStatus === opt.label ? 'white' : 'var(--text-main)',
                    border: userStatus === opt.label ? 'none' : '1px solid var(--border)'
                  }}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Community Grid */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Other Guests Here</h3>
          <div className="grid-2">
            {/* Render Current User First if they have a status */}
            {userStatus && bookingInfo && (
               <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                   <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>{bookingInfo.guest_name.charAt(0)}</div>
                     {bookingInfo.guest_name.split(' ')[0]} (You)
                   </span>
                 </div>
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
                   {statusOptions.find(o => o.label === userStatus)?.icon} {userStatus}
                 </div>
               </div>
            )}

            {/* Mock Members */}
            {mockCommunity.map(member => (
              <div key={member.id} style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>{member.name.charAt(0)}</div>
                    {member.name}
                  </span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--surface-hover)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem' }}>
                  {member.icon} {member.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Lobby Chat View */
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
          
          {/* Chat Messages */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border)' }}>
            {lobbyMessages.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', marginTop: '2rem' }}>Be the first to say hi! 👋</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {lobbyMessages.map(msg => {
                  const isMine = bookingInfo && msg.booking_id === bookingInfo.id;
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', padding: '0 0.25rem' }}>
                        {msg.sender_name} • {formatTime(msg.created_at)}
                      </span>
                      <div style={{ 
                        backgroundColor: isMine ? 'var(--primary)' : 'var(--surface)',
                        color: isMine ? 'white' : 'var(--text-main)',
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem',
                        borderBottomRightRadius: isMine ? '0' : '1rem',
                        borderBottomLeftRadius: isMine ? '1rem' : '0',
                        maxWidth: '85%',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        border: isMine ? 'none' : '1px solid var(--border)'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <input 
              type="text" 
              placeholder={bookingInfo?.is_banned ? "You are banned from chat." : "Message the lobby..."} 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="input-field"
              disabled={bookingInfo?.is_banned}
              style={{ flexGrow: 1, marginBottom: 0 }}
            />
            <button type="submit" className="btn btn-primary" disabled={!newMessage.trim() || bookingInfo?.is_banned} style={{ padding: '0 1.25rem' }}>
              <Send size={18} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default Community;

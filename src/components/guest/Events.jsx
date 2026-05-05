import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Events = ({ bookingInfo, hostelInfo }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rsvpedIds, setRsvpedIds] = useState(new Set());
  const [rsvping, setRsvping] = useState(null); // id of event being rsvp'd

  useEffect(() => {
    if (hostelInfo?.id) {
      fetchEvents();
    }
  }, [hostelInfo]);

  useEffect(() => {
    if (bookingInfo?.id) {
      fetchMyRsvps();
    }
  }, [bookingInfo]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*, rsvps(id)')
      .eq('hostel_id', hostelInfo.id)
      .order('created_at', { ascending: false });

    if (data) setEvents(data);
    setLoading(false);
  };

  const fetchMyRsvps = async () => {
    const { data } = await supabase
      .from('rsvps')
      .select('event_id')
      .eq('booking_id', bookingInfo.id);

    if (data) {
      setRsvpedIds(new Set(data.map(r => r.event_id)));
    }
  };

  const handleRsvp = async (event) => {
    if (!bookingInfo) return;
    if (rsvpedIds.has(event.id)) return; // already RSVP'd

    setRsvping(event.id);

    const { error } = await supabase.from('rsvps').insert([{
      event_id: event.id,
      booking_id: bookingInfo.id,
      guest_name: bookingInfo.guest_name,
    }]);

    if (!error) {
      setRsvpedIds(prev => new Set([...prev, event.id]));
      // Optimistically bump the rsvp count
      setEvents(prev => prev.map(e =>
        e.id === event.id
          ? { ...e, rsvps: [...(e.rsvps || []), { id: 'temp' }] }
          : e
      ));
    } else {
      alert('Could not RSVP: ' + error.message);
    }

    setRsvping(null);
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ marginTop: '1rem', textAlign: 'center', padding: '3rem' }}>
        <p className="text-muted">Loading events…</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={24} color="var(--primary)" /> Upcoming Events
      </h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
        Join the fun at {hostelInfo?.name || 'HostelHeaven'} or nearby locations.
      </p>

      {events.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
          No events scheduled yet. Check back soon!
        </p>
      ) : (
        <div className="grid-2">
          {events.map(event => {
            const hasRsvpd = rsvpedIds.has(event.id);
            const rsvpCount = event.rsvps?.length ?? 0;

            return (
              <div
                key={event.id}
                style={{
                  padding: '1.25rem',
                  border: `1px solid ${hasRsvpd ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: hasRsvpd ? 'rgba(79,70,229,0.04)' : 'var(--surface-hover)',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{event.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>{event.event_time}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--primary)' }}>
                  <MapPin size={14} /> {event.location}
                </div>

                {event.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {event.description}
                  </p>
                )}

                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', backgroundColor: 'var(--border)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
                    <Users size={13} /> {rsvpCount} going
                  </span>

                  {hasRsvpd ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontWeight: 600, fontSize: '0.875rem' }}>
                      <CheckCircle size={16} /> You're in!
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 1rem', fontSize: '0.875rem' }}
                      disabled={rsvping === event.id}
                      onClick={() => handleRsvp(event)}
                    >
                      {rsvping === event.id ? 'Joining…' : 'RSVP'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;

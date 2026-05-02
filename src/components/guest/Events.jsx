import React, { useState } from 'react';
import { Calendar, MessageSquare, Key, Wifi, LogOut, MapPin } from 'lucide-react';

const mockEvents = [
  { id: 1, title: 'Pub Crawl', time: 'Tonight, 9:00 PM', location: 'Hostel Bar', attendees: 12 },
  { id: 2, title: 'Free Walking Tour', time: 'Tomorrow, 10:00 AM', location: 'Lobby', attendees: 8 },
  { id: 3, title: 'Yoga Session', time: 'Tomorrow, 4:00 PM', location: 'Rooftop', attendees: 5 },
  { id: 4, title: 'Paella Night', time: 'Friday, 8:00 PM', location: 'Nearby Sister Hostel', attendees: 20 },
];

const Events = () => {
  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={24} color="var(--primary)" /> Upcoming Events
      </h2>
      <p className="text-muted" style={{ marginBottom: '1rem' }}>Join the fun at HostelHeaven or nearby locations.</p>
      
      <div className="grid-2">
        {mockEvents.map(event => (
          <div key={event.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-hover)' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{event.title}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{event.time}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--primary)' }}>
              <MapPin size={16} /> {event.location}
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--border)', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>
                {event.attendees} going
              </span>
              <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>RSVP</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;

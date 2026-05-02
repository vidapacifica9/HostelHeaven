import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const EventManagement = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [created, setCreated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      setTitle('');
      setDate('');
      setLocation('');
    }, 3000);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <h2 className="heading-2">Event Management</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Create and broadcast events to all guests.</p>
      
      {created && (
        <div style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
          Event successfully created and broadcasted to guests!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="input-group">
            <label style={{ fontWeight: 600 }}>Event Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Free Walking Tour" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label style={{ fontWeight: 600 }}>Date & Time</label>
            <input 
              type="datetime-local" 
              className="input-field" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label style={{ fontWeight: 600 }}>Location</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. Lobby"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          <PlusCircle size={20} /> Create Event
        </button>
      </form>
    </div>
  );
};

export default EventManagement;

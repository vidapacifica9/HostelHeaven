import React, { useState, useEffect } from 'react';
import { CalendarPlus, Trash2, Edit2, Check, X, Users } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', event_time: '', location: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*, rsvps(id, guest_name)')
      .order('created_at', { ascending: false });

    if (data) setEvents(data);
    setLoading(false);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.event_time || !newEvent.location) return;

    const { data: hostelData } = await supabase
      .from('hostels')
      .select('id')
      .eq('prefix', 'HH')
      .single();

    const { error } = await supabase.from('events').insert([{
      hostel_id: hostelData?.id,
      title: newEvent.title,
      event_time: newEvent.event_time,
      location: newEvent.location,
      description: newEvent.description,
    }]);

    if (!error) {
      setShowAddForm(false);
      setNewEvent({ title: '', event_time: '', location: '', description: '' });
      fetchEvents();
    } else {
      alert('Error creating event: ' + error.message);
    }
  };

  const startEditing = (event) => {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      event_time: event.event_time,
      location: event.location,
      description: event.description || '',
    });
  };

  const handleSaveEdit = async (id) => {
    if (!editForm.title || !editForm.event_time || !editForm.location) return;

    const { error } = await supabase
      .from('events')
      .update({
        title: editForm.title,
        event_time: editForm.event_time,
        location: editForm.location,
        description: editForm.description,
      })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchEvents();
    } else {
      alert('Error saving event: ' + error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event and all its RSVPs?')) return;
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };

  const inputStyle = {
    padding: '0.4rem 0.6rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--primary)',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    width: '100%',
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-2">Event Management</h2>
          <p className="text-muted">Create, edit, and delete hostel events. Track RSVPs.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <CalendarPlus size={18} /> {showAddForm ? 'Cancel' : 'New Event'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddEvent} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Create New Event</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Title *</label>
              <input type="text" className="input-field" placeholder="e.g. Pub Crawl" value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Time *</label>
              <input type="text" className="input-field" placeholder="e.g. Tonight 8:00 PM" value={newEvent.event_time}
                onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Location *</label>
              <input type="text" className="input-field" placeholder="e.g. Reception" value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Description</label>
              <input type="text" className="input-field" placeholder="Brief description..." value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Event</button>
        </form>
      )}

      {/* Events List */}
      {loading ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No events yet. Create one above!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map(event => (
            <div key={event.id} style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              {editingId === event.id ? (
                /* Edit Mode */
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <input style={inputStyle} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                    <input style={inputStyle} value={editForm.event_time} onChange={e => setEditForm({ ...editForm, event_time: e.target.value })} placeholder="Time" />
                    <input style={inputStyle} value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location" />
                    <input style={inputStyle} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={() => handleSaveEdit(event.id)}>
                      <Check size={16} /> Save
                    </button>
                    <button className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', backgroundColor: 'var(--surface-hover)', color: 'var(--text-muted)' }} onClick={() => setEditingId(null)}>
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: '1.05rem' }}>{event.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem', margin: '0.15rem 0' }}>
                      {event.event_time} &bull; {event.location}
                    </p>
                    {event.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{event.description}</p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(79,70,229,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                        <Users size={13} /> {event.rsvps?.length ?? 0} RSVPs
                      </div>
                      {event.rsvps?.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          • {event.rsvps.map(r => r.guest_name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEditing(event)} className="btn" style={{ padding: '0.5rem', color: 'var(--primary)', backgroundColor: 'rgba(79,70,229,0.08)' }} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="btn" style={{ padding: '0.5rem', color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventManagement;

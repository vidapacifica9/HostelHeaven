import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, Link as LinkIcon, Compass } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const RecommendationManager = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRec, setNewRec] = useState({
    title: '',
    category: 'Food',
    description: '',
    address: '',
    map_url: '',
    external_link: '',
    price_range: '$'
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const categories = ['Food', 'Bar', 'Sight', 'Tour', 'Excursion', 'Transport', 'Hidden Gem'];

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setRecommendations(data);
    setLoading(false);
  };

  const handleAddRec = async (e) => {
    e.preventDefault();
    
    // In a real app, we'd get the hostel_id from the admin's session
    const { data: hostels } = await supabase.from('hostels').select('id').eq('prefix', 'HH').single();

    const { error } = await supabase
      .from('recommendations')
      .insert([{
        hostel_id: hostels?.id,
        ...newRec
      }]);

    if (!error) {
      setShowAddForm(false);
      setNewRec({ title: '', category: 'Food', description: '', address: '', map_url: '', external_link: '', price_range: '$' });
      fetchRecommendations();
    }
  };

  const startEditing = (rec) => {
    setEditingId(rec.id);
    setEditForm({ ...rec });
  };

  const handleSaveEdit = async (id) => {
    const { error } = await supabase
      .from('recommendations')
      .update(editForm)
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchRecommendations();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recommendation?')) return;
    await supabase.from('recommendations').delete().eq('id', id);
    fetchRecommendations();
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={24} color="var(--primary)" /> Local Recommendations
          </h2>
          <p className="text-muted">Manage the spots you recommend to guests.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Spot'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddRec} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div className="input-group">
              <label>Title</label>
              <input 
                className="input-field" 
                value={newRec.title} 
                onChange={e => setNewRec({...newRec, title: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select 
                className="input-field" 
                value={newRec.category} 
                onChange={e => setNewRec({...newRec, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea 
              className="input-field" 
              rows="3" 
              value={newRec.description} 
              onChange={e => setNewRec({...newRec, description: e.target.value})} 
            />
          </div>

          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div className="input-group">
              <label>Google Maps URL</label>
              <input 
                className="input-field" 
                value={newRec.map_url} 
                onChange={e => setNewRec({...newRec, map_url: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label>External Link (Booking/Info)</label>
              <input 
                className="input-field" 
                value={newRec.external_link} 
                onChange={e => setNewRec({...newRec, external_link: e.target.value})} 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Recommendation</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recommendations.map(rec => (
            <div key={rec.id} style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--surface-hover)', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)'
            }}>
              {editingId === rec.id ? (
                /* Edit Mode */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="grid-2">
                    <input className="input-field" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                    <select className="input-field" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <textarea className="input-field" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} rows="2" />
                  <div className="grid-2">
                    <input className="input-field" placeholder="Map URL" value={editForm.map_url} onChange={e => setEditForm({...editForm, map_url: e.target.value})} />
                    <input className="input-field" placeholder="External Link" value={editForm.external_link} onChange={e => setEditForm({...editForm, external_link: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleSaveEdit(rec.id)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Save</button>
                    <button onClick={() => setEditingId(null)} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>{rec.category}</span>
                    <h3 style={{ fontWeight: 600 }}>{rec.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>{rec.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEditing(rec)} className="btn" style={{ padding: '0.5rem', color: 'var(--primary)' }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(rec.id)} className="btn" style={{ padding: '0.5rem', color: '#EF4444' }}><Trash2 size={18} /></button>
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

export default RecommendationManager;

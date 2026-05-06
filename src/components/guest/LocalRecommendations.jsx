import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Utensils, Beer, Camera, Ship, Map as MapIcon, Compass } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const LocalRecommendations = ({ hostelInfo }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Food', 'Bar', 'Sight', 'Tour', 'Excursion', 'Hidden Gem'];

  useEffect(() => {
    if (hostelInfo?.id) {
      fetchRecommendations();
    }
  }, [hostelInfo]);

  const fetchRecommendations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('recommendations')
      .select('*')
      .eq('hostel_id', hostelInfo.id)
      .order('created_at', { ascending: false });

    if (data) setRecommendations(data);
    setLoading(false);
  };

  const getIcon = (category) => {
    switch (category) {
      case 'Food': return <Utensils size={18} />;
      case 'Bar': return <Beer size={18} />;
      case 'Sight': return <Camera size={18} />;
      case 'Tour': return <MapIcon size={18} />;
      case 'Excursion': return <Ship size={18} />;
      default: return <Compass size={18} />;
    }
  };

  const filteredRecs = filter === 'All' 
    ? recommendations 
    : recommendations.filter(r => r.category === filter);

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={24} color="var(--primary)" /> Local Exploration
        </h2>
        <p className="text-muted">Staff-picked favorites and hand-picked local tours.</p>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className="btn"
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              backgroundColor: filter === cat ? 'var(--primary)' : 'var(--surface-hover)',
              color: filter === cat ? 'white' : 'var(--text-main)',
              border: filter === cat ? 'none' : '1px solid var(--border)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '3rem' }}>Discovering local gems...</p>
      ) : filteredRecs.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '3rem' }}>No recommendations in this category yet. Ask at reception!</p>
      ) : (
        <div className="grid-2">
          {filteredRecs.map(rec => (
            <div key={rec.id} className="glass-panel" style={{ 
              padding: '0', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    borderRadius: 'var(--radius-sm)', 
                    backgroundColor: 'rgba(79, 70, 229, 0.1)', 
                    color: 'var(--primary)' 
                  }}>
                    {getIcon(rec.category)}
                  </div>
                  {rec.price_range && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)' }}>{rec.price_range}</span>
                  )}
                </div>
                
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{rec.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{rec.description}</p>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  {rec.map_url && (
                    <a 
                      href={rec.map_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn" 
                      style={{ 
                        flex: 1, 
                        fontSize: '0.875rem', 
                        padding: '0.6rem',
                        backgroundColor: 'var(--surface-hover)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-main)'
                      }}
                    >
                      <MapPin size={16} /> Map
                    </a>
                  )}
                  {rec.external_link && (
                    <a 
                      href={rec.external_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary" 
                      style={{ flex: 1, fontSize: '0.875rem', padding: '0.6rem' }}
                    >
                      <ExternalLink size={16} /> {rec.category === 'Tour' || rec.category === 'Excursion' ? 'Book' : 'Info'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocalRecommendations;

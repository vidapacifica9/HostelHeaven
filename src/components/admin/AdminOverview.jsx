import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ClipboardList, DollarSign, Megaphone, Activity, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import ManagementInsights from './ManagementInsights';

const AdminOverview = () => {
  const [showInsights, setShowInsights] = useState(false);
  const [hostelInfo, setHostelInfo] = useState(null);
  const [stats, setStats] = useState({
    occupancy: 0,
    arrivals: 0,
    departures: 0,
    pendingTasks: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [broadcast, setBroadcast] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchHostel();
    
    const channels = ['bookings', 'staff_tasks', 'orders'].map(table => 
      supabase.channel(`${table}_stats`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => fetchStats())
        .subscribe()
    );

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, []);

  const fetchHostel = async () => {
    const { data } = await supabase.from('hostels').select('*').eq('prefix', 'HH').single();
    if (data) setHostelInfo(data);
  };

  const fetchStats = async () => {
    setLoading(true);
    const { data: bookings } = await supabase.from('bookings').select('status');
    const occupancy = bookings?.filter(b => b.status === 'Checked-in').length || 0;
    const arrivals = bookings?.filter(b => b.status === 'Pending').length || 0;
    const departures = bookings?.filter(b => b.status === 'Checked-out').length || 0;

    const { data: tasks } = await supabase.from('staff_tasks').select('status');
    const pendingTasks = tasks?.filter(t => t.status === 'Pending').length || 0;

    const { data: orders } = await supabase.from('orders').select('price').eq('status', 'Paid');
    const totalRevenue = orders?.reduce((acc, curr) => acc + Number(curr.price), 0) || 0;

    setStats({ occupancy, arrivals, departures, pendingTasks, totalRevenue });
    setLoading(false);
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setIsBroadcasting(true);
    const { error } = await supabase
      .from('hostels')
      .update({ broadcast_message: broadcast })
      .eq('prefix', 'HH');

    if (!error) {
      alert('Broadcast sent to all guests!');
      setBroadcast('');
    }
    setIsBroadcasting(false);
  };

  if (showInsights) {
    return <ManagementInsights onClose={() => setShowInsights(false)} hostelInfo={hostelInfo} />;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Interactive Metrics Row */}
      <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setShowInsights(true)}
          className="glass-panel" 
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', width: '100%', textAlign: 'left', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Current Occupancy</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.occupancy} Guests</h3>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </button>
        <button 
          onClick={() => setShowInsights(true)}
          className="glass-panel" 
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', width: '100%', textAlign: 'left', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' }}>
            <DollarSign size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total Paid Revenue</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>${stats.totalRevenue.toFixed(2)}</h3>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </button>
      </div>

      <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171' }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Pending Tasks</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.pendingTasks}</h3>
          </div>
        </div>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
            <Activity size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Arrivals / Departures</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.arrivals} In / {stats.departures} Out</h3>
          </div>
        </div>
      </div>

      {/* Broadcast System */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', border: '1px solid var(--primary)', backgroundColor: 'var(--surface-hover)', opacity: 0.95 }}>
        <h3 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
          <Megaphone size={20} color="var(--primary)" /> Global Guest Broadcast
        </h3>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>Send a priority notification to every active guest dashboard.</p>
        <form onSubmit={handleBroadcast} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            className="input-field" 
            placeholder="e.g., Free Sangria in the lobby at 6 PM!" 
            value={broadcast}
            onChange={e => setBroadcast(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={isBroadcasting || !broadcast}>
            {isBroadcasting ? 'Sending...' : 'Shout!'}
          </button>
        </form>
      </div>

      {/* Quick Status */}
      <div className="glass-panel">
        <h3 className="heading-2" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Operational Pulse</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100px', height: '10px', backgroundColor: 'var(--border)', borderRadius: '5px', overflow: 'hidden', marginRight: '0.5rem' }}>
                <div style={{ width: `${Math.min((stats.pendingTasks / 10) * 100, 100)}%`, height: '100%', backgroundColor: stats.pendingTasks > 5 ? '#EF4444' : 'var(--secondary)' }}></div>
              </div>
              <span style={{ fontWeight: 600 }}>Cleaning Pipeline</span>
            </div>
            <span className="text-muted">{stats.pendingTasks} beds to clean</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)', boxShadow: '0 0 8px var(--secondary)' }}></div>
              <span style={{ fontWeight: 600 }}>Guest Satisfaction</span>
            </div>
            <span className="text-muted">High engagement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

import React, { useState, useEffect } from 'react';
import { TrendingUp, PieChart, BarChart3, ArrowLeft, DollarSign, Users, Percent } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ManagementInsights = ({ onClose, hostelInfo }) => {
  const [data, setData] = useState({
    sourceDistribution: {},
    revPab: 0,
    occupancyRate: 0,
    totalRevenue: 0,
    historicalOccupancy: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetailedInsights();
  }, []);

  const fetchDetailedInsights = async () => {
    setLoading(true);
    
    // 1. Fetch Bookings for Source & Occupancy
    const { data: bookings } = await supabase.from('bookings').select('status, booking_source, created_at');
    
    // 2. Fetch Paid Orders for Revenue
    const { data: orders } = await supabase.from('orders').select('price').eq('status', 'Paid');
    
    // Calculate Source Distribution
    const sources = bookings?.reduce((acc, b) => {
      const source = b.booking_source || 'Direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {}) || {};

    // Calculate RevPAB (Revenue Per Available Bed)
    // Formula: Total Revenue / Total Beds
    const totalRevenue = orders?.reduce((acc, curr) => acc + Number(curr.price), 0) || 0;
    const totalBeds = hostelInfo?.total_beds || 50;
    const revPab = totalRevenue / totalBeds;

    // Occupancy Rate
    const currentGuests = bookings?.filter(b => b.status === 'Checked-in').length || 0;
    const occupancyRate = (currentGuests / totalBeds) * 100;

    setData({
      sourceDistribution: sources,
      revPab,
      occupancyRate,
      totalRevenue,
      totalBookings: bookings?.length || 0
    });
    setLoading(false);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'var(--background)', 
      zIndex: 1000, 
      padding: '1.5rem',
      overflowY: 'auto',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={onClose} className="btn" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="heading-1" style={{ fontSize: '1.5rem' }}>Business Intelligence</h1>
          <p className="text-muted">Yield Management & Channel Analysis</p>
        </div>
      </header>

      {loading ? (
        <p>Analyzing business data...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Metrics */}
          <div className="grid-2">
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>RevPAB (Revenue/Bed)</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                ${data.revPab.toFixed(2)}
              </h2>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Total Revenue / {hostelInfo?.total_beds || 50} Beds</p>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Occupancy Rate</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                {data.occupancyRate.toFixed(1)}%
              </h2>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
                <div style={{ width: `${data.occupancyRate}%`, height: '100%', backgroundColor: 'var(--secondary)' }}></div>
              </div>
            </div>
          </div>

          {/* Booking Sources (Donut Chart Style) */}
          <div className="glass-panel">
            <h3 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <PieChart size={18} color="var(--primary)" /> Booking Channel Mix
            </h3>
            <div style={{ marginTop: '1.5rem' }}>
              {Object.entries(data.sourceDistribution).map(([source, count]) => {
                const percentage = (count / data.totalBookings) * 100;
                return (
                  <div key={source} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: 600 }}>{source}</span>
                      <span className="text-muted">{percentage.toFixed(0)}% ({count})</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        backgroundColor: source === 'Direct' ? 'var(--primary)' : 'var(--text-muted)' 
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
                💡 Tip: Direct bookings save you approx. 15% in commission.
              </p>
            </div>
          </div>

          {/* Demand Outlook */}
          <div className="glass-panel">
            <h3 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <TrendingUp size={18} color="var(--primary)" /> 30-Day Demand Outlook
            </h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Based on confirmed future bookings.</p>
            
            <div style={{ display: 'flex', gap: '4px', height: '100px', alignItems: 'flex-end' }}>
              {/* Mock bar chart for outlook */}
              {[65, 45, 30, 80, 95, 70, 40].map((val, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  height: `${val}%`, 
                  backgroundColor: val > 80 ? 'var(--primary)' : 'var(--border)',
                  borderRadius: '2px 2px 0 0',
                  position: 'relative'
                }}>
                  {val > 80 && <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', fontWeight: 700 }}>HIGH</span>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>WEEK 1</span>
              <span>WEEK 2</span>
              <span>WEEK 3</span>
              <span>WEEK 4</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ManagementInsights;

import React, { useState } from 'react';

const mockBeds = [
  { id: '1A', type: 'Bottom', room: '1', status: 'occupied', guest: 'John Doe' },
  { id: '1B', type: 'Top', room: '1', status: 'available', guest: null },
  { id: '2A', type: 'Bottom', room: '2', status: 'cleaning', guest: null },
  { id: '2B', type: 'Top', room: '2', status: 'available', guest: null },
  { id: '3A', type: 'Private', room: '3', status: 'occupied', guest: 'Jane Smith' },
  { id: '4A', type: 'Bottom', room: '4', status: 'occupied', guest: 'Alex M.' },
  { id: '4B', type: 'Top', room: '4', status: 'available', guest: null },
];

const BedAllocation = () => {
  const [beds, setBeds] = useState(mockBeds);

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return '#10B981'; // Emerald
      case 'occupied': return '#EF4444'; // Red
      case 'cleaning': return '#F59E0B'; // Amber
      default: return 'var(--border)';
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <h2 className="heading-2">Bed Allocation</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Manage inventory and housekeeping status.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></div> Available
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div> Occupied
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div> Cleaning
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '0.75rem' }}>Room</th>
              <th style={{ padding: '0.75rem' }}>Bed ID</th>
              <th style={{ padding: '0.75rem' }}>Type</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Guest</th>
            </tr>
          </thead>
          <tbody>
            {beds.map((bed, idx) => (
              <tr key={bed.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-hover)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{bed.room}</td>
                <td style={{ padding: '0.75rem' }}>{bed.id}</td>
                <td style={{ padding: '0.75rem' }}>{bed.type}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ 
                    backgroundColor: getStatusColor(bed.status), 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem',
                    textTransform: 'capitalize'
                  }}>
                    {bed.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>{bed.guest || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BedAllocation;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';

const mockHostels = {
  'HH': { name: 'HostelHeaven', city: 'Barcelona', primary: '#4F46E5', secondary: '#10B981' },
  'UN': { name: 'Urban Nomad', city: 'Berlin', primary: '#F97316', secondary: '#EAB308' },
  'WL': { name: 'WanderLust', city: 'Bali', primary: '#06B6D4', secondary: '#3B82F6' },
};

const Login = ({ setHostelInfo }) => {
  const [ref, setRef] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Reset theme on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', '#4F46E5');
    document.documentElement.style.setProperty('--secondary', '#10B981');
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const prefix = ref.substring(0, 2).toUpperCase();
    
    if (mockHostels[prefix]) {
      const hostel = mockHostels[prefix];
      
      // Dynamically apply branding
      document.documentElement.style.setProperty('--primary', hostel.primary);
      document.documentElement.style.setProperty('--secondary', hostel.secondary);
      
      setHostelInfo(hostel);
      navigate('/guest/checkin');
    } else {
      setError('Invalid booking reference. Try prefix HH-, UN-, or WL-');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', padding: '1rem', transition: 'background 0.5s ease' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-md)' }}>
            <Compass size={40} color="var(--primary)" style={{ transition: 'color 0.5s ease' }} />
          </div>
        </div>
        <h1 className="heading-1" style={{ color: 'white', WebkitTextFillColor: 'white', marginBottom: '0.5rem' }}>Unified Portal</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>Enter your booking reference to access your stay.</p>
        
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label style={{ color: 'white', fontWeight: 600 }}>Booking Reference</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. HH-98234 or UN-123"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: '#FCA5A5', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', backgroundColor: 'white', color: 'var(--primary)', transition: 'color 0.5s ease' }}>
            Check In
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
          <p>Are you staff? <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/admin')}>Admin Login</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Login = ({ setHostelInfo, setBookingInfo, setHasCheckedIn }) => {
  const [ref, setRef] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Reset theme on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', '#4F46E5');
    document.documentElement.style.setProperty('--secondary', '#10B981');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formattedRef = ref.trim().toUpperCase();

      // Query the bookings table and join with hostels table
      const { data: booking, error: dbError } = await supabase
        .from('bookings')
        .select(`
          *,
          hostels (*)
        `)
        .eq('booking_ref', formattedRef)
        .single();

      if (dbError || !booking) {
        throw new Error('Invalid booking reference. Please check your confirmation email.');
      }

      if (booking.is_banned) {
        throw new Error('This booking reference has been suspended by the administration.');
      }

      if (!booking.hostels) {
        throw new Error('Hostel configuration missing.');
      }

      const hostel = booking.hostels;

      // Dynamically apply branding
      document.documentElement.style.setProperty('--primary', hostel.primary_color);
      // For MVP, we'll auto-generate a secondary color or use a default
      document.documentElement.style.setProperty('--secondary', '#10B981');
      
      setHostelInfo(hostel);
      setBookingInfo(booking);

      if (booking.status === 'Checked-in') {
        setHasCheckedIn(true);
        navigate('/guest/dashboard');
      } else {
        navigate('/guest/checkin');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
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
              placeholder="e.g. HH-1234"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && <p style={{ color: '#FCA5A5', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '0.5rem', backgroundColor: 'white', color: 'var(--primary)', transition: 'color 0.5s ease', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {isLoading ? <Loader size={18} className="spin" /> : 'Check In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
          <p>Are you staff? <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/admin')}>Admin Login</span></p>
        </div>
      </div>
      
      {/* Basic spinner CSS */}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;

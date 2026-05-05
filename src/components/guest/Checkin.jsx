import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, FileSignature, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Checkin = ({ hostelInfo, bookingInfo, setHasCheckedIn }) => {
  const [idUploaded, setIdUploaded] = useState(false);
  const [rulesSigned, setRulesSigned] = useState(false);
  const navigate = useNavigate();

  const handleComplete = async () => {
    if (idUploaded && rulesSigned && bookingInfo) {
      // Update status in database
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Checked-in' })
        .eq('id', bookingInfo.id);

      if (!error) {
        setHasCheckedIn(true);
        navigate('/guest/dashboard');
      } else {
        alert('Check-in failed: ' + error.message);
      }
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem', maxWidth: '600px', marginTop: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2rem' }}>Welcome to {hostelInfo.name}</h1>
        <p className="text-muted">Please complete your digital check-in to get your key.</p>
      </header>

      <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
          <Camera size={20} color="var(--primary)" /> 1. Upload ID
        </h2>
        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          We need a copy of your Passport or National ID.
        </p>
        {!idUploaded ? (
          <button 
            className="btn" 
            style={{ width: '100%', border: '2px dashed var(--primary)', backgroundColor: 'var(--surface)' }}
            onClick={() => {
              // Simulate file upload
              setTimeout(() => setIdUploaded(true), 500);
            }}
          >
            Select File...
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontWeight: 600 }}>
            <CheckCircle size={20} /> ID Uploaded Successfully
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
          <FileSignature size={20} color="var(--primary)" /> 2. House Rules
        </h2>
        <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1rem', maxHeight: '150px', overflowY: 'auto', fontSize: '0.875rem' }}>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
            <li style={{ marginBottom: '0.5rem' }}>Quiet hours are from 11:00 PM to 7:00 AM.</li>
            <li style={{ marginBottom: '0.5rem' }}>No outside guests allowed in the dormitories.</li>
            <li style={{ marginBottom: '0.5rem' }}>Checkout time is 11:00 AM.</li>
            <li>Smoking is strictly prohibited indoors.</li>
          </ul>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={rulesSigned}
            onChange={(e) => setRulesSigned(e.target.checked)}
            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
          />
          <span style={{ fontWeight: 500 }}>I agree to the House Rules.</span>
        </label>
      </div>

      <button 
        className="btn btn-primary" 
        style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', opacity: (idUploaded && rulesSigned) ? 1 : 0.5 }}
        disabled={!idUploaded || !rulesSigned}
        onClick={handleComplete}
      >
        Complete Check-in
      </button>
    </div>
  );
};

export default Checkin;

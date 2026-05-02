import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';

const OrdersDashboard = ({ orders, setOrders, allowRoomDelivery, setAllowRoomDelivery }) => {
  
  const handleFulfill = (orderId) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'Fulfilled' } : o
    ));
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const fulfilledOrders = orders.filter(o => o.status === 'Fulfilled');

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-2">Order Fulfillment</h2>
          <p className="text-muted">Manage guest in-app purchases and room deliveries.</p>
        </div>
        
        {/* Settings Toggle for Room Delivery */}
        <div style={{ backgroundColor: 'var(--surface-hover)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Allow Room Delivery</div>
            <input 
              type="checkbox" 
              checked={allowRoomDelivery}
              onChange={(e) => setAllowRoomDelivery(e.target.checked)}
              style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
            />
          </label>
        </div>
      </div>
      
      <div className="grid-2">
        {/* Pending Column */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            Pending Orders <span style={{ backgroundColor: '#F59E0B', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.875rem' }}>{pendingOrders.length}</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingOrders.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No pending orders.</p>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #F59E0B' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{order.product.name}</span>
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>{order.time}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Guest: <strong>{order.guestName}</strong> (Room: {order.room})</p>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: order.method === 'room' ? 'var(--primary)' : 'inherit' }}>
                    Method: <strong>{order.method === 'room' ? 'Deliver to Room' : 'Pickup at Bar'}</strong>
                  </p>
                  <button 
                    onClick={() => handleFulfill(order.id)}
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }}
                  >
                    <Check size={16} /> Mark as Fulfilled
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fulfilled Column */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', opacity: 0.8 }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            Recently Fulfilled <span style={{ backgroundColor: '#10B981', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.875rem' }}>{fulfilledOrders.length}</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {fulfilledOrders.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No fulfilled orders.</p>
            ) : (
              fulfilledOrders.map(order => (
                <div key={order.id} style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #10B981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{order.product.name}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{order.guestName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDashboard;

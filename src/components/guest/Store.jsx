import React, { useState } from 'react';
import { ShoppingCart, Coffee, Beer, ShoppingBag, CheckCircle, Lock, Bath, Clock, Utensils, Box } from 'lucide-react';

const products = [
  { id: 1, name: 'Local Draft Beer', price: 4.50, category: 'menu', icon: <Beer size={32} /> },
  { id: 2, name: 'Artisan Coffee', price: 3.00, category: 'menu', icon: <Coffee size={32} /> },
  { id: 3, name: 'Burger & Fries', price: 12.00, category: 'menu', icon: <Utensils size={32} /> },
  { id: 4, name: 'Padlock', price: 5.00, category: 'essentials', icon: <Lock size={32} /> },
  { id: 5, name: 'Dental Kit', price: 3.50, category: 'essentials', icon: <Bath size={32} /> },
  { id: 6, name: 'Towel Rental', price: 2.00, category: 'services', icon: <Bath size={32} /> },
  { id: 7, name: 'Late Checkout', price: 10.00, category: 'services', icon: <Clock size={32} /> }
];

const Store = ({ orders, setOrders, allowRoomDelivery }) => {
  const [activeCategory, setActiveCategory] = useState('menu');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredProducts = products.filter(p => p.category === activeCategory);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSelectedProduct(null); // Clear selection when switching tabs
  };

  const handleOrder = () => {
    if (!selectedProduct) return;
    
    const newOrder = {
      id: Date.now(),
      product: selectedProduct,
      guestName: 'Alex',
      room: '4B',
      method: deliveryMethod,
      status: 'Pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders([newOrder, ...orders]);
    setOrderPlaced(true);
    
    setTimeout(() => {
      setOrderPlaced(false);
      setSelectedProduct(null);
      setDeliveryMethod('pickup');
    }, 3000);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShoppingCart size={24} color="var(--primary)" /> Order Items
      </h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Order essentials directly to your tab.</p>
      
      {/* Sub-navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => handleCategoryChange('menu')}
          className="btn"
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: activeCategory === 'menu' ? 'var(--primary)' : 'transparent', 
            color: activeCategory === 'menu' ? 'white' : 'var(--text-main)',
            border: activeCategory === 'menu' ? 'none' : '1px solid var(--border)'
          }}
        >
          <Utensils size={16} /> Menu
        </button>
        <button 
          onClick={() => handleCategoryChange('essentials')}
          className="btn"
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: activeCategory === 'essentials' ? 'var(--primary)' : 'transparent', 
            color: activeCategory === 'essentials' ? 'white' : 'var(--text-main)',
            border: activeCategory === 'essentials' ? 'none' : '1px solid var(--border)'
          }}
        >
          <Box size={16} /> Essentials
        </button>
        <button 
          onClick={() => handleCategoryChange('services')}
          className="btn"
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: activeCategory === 'services' ? 'var(--primary)' : 'transparent', 
            color: activeCategory === 'services' ? 'white' : 'var(--text-main)',
            border: activeCategory === 'services' ? 'none' : '1px solid var(--border)'
          }}
        >
          <Clock size={16} /> Services
        </button>
      </div>

      {orderPlaced ? (
        <div style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.5rem' }}>
          <CheckCircle size={48} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Order Added to Tab!</h3>
          <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Your total will be updated at checkout.</p>
        </div>
      ) : (
        <>
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {filteredProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => setSelectedProduct(p)}
                style={{ 
                  padding: '1rem', 
                  border: `2px solid ${selectedProduct?.id === p.id ? 'var(--primary)' : 'var(--border)'}`, 
                  borderRadius: 'var(--radius-md)', 
                  backgroundColor: selectedProduct?.id === p.id ? 'var(--surface-hover)' : 'var(--surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ color: 'var(--primary)', backgroundColor: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '50%' }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }}>{p.name}</h3>
                  <p className="text-muted">€{p.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedProduct && (
            <div style={{ backgroundColor: 'var(--surface-hover)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Order Options</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Fulfillment Method</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      value="pickup" 
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    Pick up at Bar / Reception
                  </label>
                  
                  {allowRoomDelivery && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="delivery" 
                        value="room" 
                        checked={deliveryMethod === 'room'}
                        onChange={() => setDeliveryMethod('room')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      Deliver to Bed (Room 4B)
                    </label>
                  )}
                </div>
                {!allowRoomDelivery && (
                  <p style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '0.5rem' }}>Room delivery is currently unavailable.</p>
                )}
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleOrder}>
                Add {selectedProduct.name} to Tab (€{selectedProduct.price.toFixed(2)})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Store;

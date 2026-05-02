import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your digital concierge. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages([...messages, { text: userMsg, isBot: false }]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      let reply = "I can certainly help with that! Let me notify the staff.";
      if (userMsg.toLowerCase().includes('breakfast')) {
        reply = "Breakfast is served from 7:00 AM to 10:30 AM in the main common area on the ground floor.";
      } else if (userMsg.toLowerCase().includes('wifi')) {
        reply = "The Wi-Fi password is 'hostelheaven24' for the network 'HostelHeaven_Guest'.";
      } else if (userMsg.toLowerCase().includes('towel')) {
        reply = "You can rent a towel at the reception for €2. Would you like me to reserve one for you?";
      }

      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    }, 1000);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', height: '400px' }}>
      <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <Bot size={24} color="var(--primary)" /> AI Assistant
      </h2>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.isBot ? 'flex-start' : 'flex-end', maxWidth: '80%' }}>
            <div style={{
              backgroundColor: msg.isBot ? 'var(--surface-hover)' : 'var(--primary)',
              color: msg.isBot ? 'var(--text-main)' : 'white',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              borderBottomLeftRadius: msg.isBot ? '0' : 'var(--radius-md)',
              borderBottomRightRadius: msg.isBot ? 'var(--radius-md)' : '0',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <input 
          type="text" 
          className="input-field" 
          style={{ flex: 1 }} 
          placeholder="Ask about breakfast, towels, etc..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;

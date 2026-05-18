import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am TalentBot. How can I help you with your candidates today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
      
      const res = await api.post('/chat', { messages: chatHistory });
      
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (error) {
      console.error('Failed to get bot reply:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      <button 
        className="chatbot-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: isOpen ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'linear-gradient(135deg, #10b981, #ef4444)'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window glass-panel">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="chatbot-avatar">🤖</span>
              <div>
                <h4 style={{ margin: 0, fontWeight: 600 }}>TalentBot</h4>
                <span className="chatbot-status">HR Assistant</span>
              </div>
            </div>
            <span className="chatbot-status-dot"></span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg-bubble ${msg.role === 'user' ? 'user-msg' : 'bot-msg'}`}>
                {msg.role === 'assistant' ? (
                  <div className="markdown-body chat-markdown">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg-bubble bot-msg loading-dots">
                <span>•</span><span>•</span><span>•</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-form">
            <input 
              type="text" 
              className="input-field chatbot-input" 
              placeholder="Ask about candidates, skills, or exp..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{ marginBottom: 0 }}
            />
            <button type="submit" className="btn btn-primary chatbot-send-btn" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

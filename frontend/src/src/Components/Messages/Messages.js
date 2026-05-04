import React, { useState } from 'react';
import './Messages.css';

const contacts = [
  { id: 1, name: 'NafTech Inc.', role: 'Company', initials: 'NT', color: 'blue', lastMsg: 'Your interview is scheduled tomorrow.', time: '10:30 AM', unread: 2 },
  { id: 2, name: 'Amine Khelifi', role: 'Student', initials: 'AK', color: 'teal', lastMsg: 'Thank you! I will send my CV.', time: 'Yesterday', unread: 0 },
  { id: 3, name: 'Université Oran 1', role: 'University', initials: 'UO', color: 'amber', lastMsg: 'Convention generated and signed.', time: 'Tuesday', unread: 0 },
];

const messagesList = [
  { id: 1, sender: 'them', text: 'Hello, we reviewed your application and would like to schedule an interview.' },
  { id: 2, sender: 'me', text: 'Thank you! I am available any day this week.' },
  { id: 3, sender: 'them', text: 'Great. Your interview is scheduled tomorrow at 10:30 AM on Meet.' }
];

const Messages = () => {
  const [activeChat, setActiveChat] = useState(contacts[0]);
  const [msgs, setMsgs] = useState(messagesList);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMsgs([...msgs, { id: Date.now(), sender: 'me', text: newMsg }]);
    setNewMsg('');
  };

  const navToBack = () => {
    window.history.back();
  };

  return (
    <div className="msg-page">
      <nav className="msg-nav">
        <div className="msg-nav-brand">
          <div className="msg-back-btn" onClick={navToBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          StageLink Messages
        </div>
      </nav>

      <div className="msg-container">
        {/* Sidebar */}
        <div className="msg-sidebar">
          <div className="msg-search">
            <input type="text" placeholder="Search messages..." />
          </div>
          <div className="msg-contacts">
            {contacts.map(c => (
              <div 
                key={c.id} 
                className={`msg-contact-item ${activeChat.id === c.id ? 'active' : ''}`}
                onClick={() => setActiveChat(c)}
              >
                <div className={`msg-avatar msg-av-${c.color}`}>{c.initials}</div>
                <div className="msg-contact-info">
                  <div className="msg-contact-top">
                    <span className="msg-contact-name">{c.name}</span>
                    <span className="msg-contact-time">{c.time}</span>
                  </div>
                  <div className="msg-contact-bot">
                    <span className="msg-contact-last">{c.lastMsg}</span>
                    {c.unread > 0 && <span className="msg-badge">{c.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="msg-chat-area">
          <div className="msg-chat-top">
            <div className={`msg-avatar msg-av-${activeChat.color}`}>{activeChat.initials}</div>
            <div>
              <div className="msg-chat-name">{activeChat.name}</div>
              <div className="msg-chat-role">{activeChat.role}</div>
            </div>
          </div>
          
          <div className="msg-history">
            {msgs.map(m => (
              <div key={m.id} className={`msg-bubble-wrap ${m.sender}`}>
                <div className={`msg-bubble ${m.sender}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form className="msg-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button type="submit" className="msg-send-btn">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M2 3h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="#fff" strokeWidth="1.4" />
                <path d="M2 3l6 5 6-5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;

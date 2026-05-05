import React, { useState, useEffect, useRef } from 'react';
import { getConversations, getChat as getMessages, sendMessage } from '../../api';
import { useAuth } from '../../Context/AuthContext';
import './Messages.css';



const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
        if (data.length > 0) {
          setActiveChat(data[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    const fetchChatMessages = async () => {
      try {
        const data = await getMessages(activeChat.id);
        setMsgs(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchChatMessages();
    // In a real app we'd poll or use websockets here
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeChat) return;
    
    // Optimistic UI update
    const tempMsg = { id: Date.now(), sender_id: user?.email, content: newMsg, created_at: new Date().toISOString() };
    setMsgs([...msgs, tempMsg]);
    setNewMsg('');

    try {
      await sendMessage(activeChat.id, newMsg);
      // Optionally refetch messages
      const updatedMsgs = await getMessages(activeChat.id);
      setMsgs(updatedMsgs);
    } catch (err) {
      console.error('Error sending message:', err);
    }
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
            {loadingChats ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No conversations yet.</div>
            ) : (
              conversations.map(c => {
                const otherUser = c.participants?.find(p => p.email !== user?.email) || c.participants?.[0] || {};
                const name = otherUser.full_name || otherUser.email || 'Unknown User';
                const initials = name.substring(0, 2).toUpperCase();
                const lastMsgText = c.last_message?.content || 'No messages yet';
                const time = c.last_message ? new Date(c.last_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
                const colorObj = ['blue', 'teal', 'amber'][c.id % 3];
                
                return (
                  <div 
                    key={c.id} 
                    className={`msg-contact-item ${activeChat?.id === c.id ? 'active' : ''}`}
                    onClick={() => setActiveChat(c)}
                  >
                    <div className={`msg-avatar msg-av-${colorObj}`}>{initials}</div>
                    <div className="msg-contact-info">
                      <div className="msg-contact-top">
                        <span className="msg-contact-name">{name}</span>
                        <span className="msg-contact-time">{time}</span>
                      </div>
                      <div className="msg-contact-bot">
                        <span className="msg-contact-last">{lastMsgText}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="msg-chat-area">
          {activeChat ? (
            <>
              <div className="msg-chat-top">
                <div className="msg-avatar msg-av-blue">
                  {((activeChat.participants?.find(p => p.email !== user?.email) || {}).full_name || 'U').substring(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="msg-chat-name">
                    {(activeChat.participants?.find(p => p.email !== user?.email) || {}).full_name || 'User'}
                  </div>
                  <div className="msg-chat-role">
                    {(activeChat.participants?.find(p => p.email !== user?.email) || {}).role || ''}
                  </div>
                </div>
              </div>
              
              <div className="msg-history">
                {msgs.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>No messages in this conversation yet.</div>
                ) : (
                  msgs.map(m => {
                    const isMe = m.sender_id === user?.email || m.sender === user?.email || m.sender === 'me';
                    return (
                      <div key={m.id} className={`msg-bubble-wrap ${isMe ? 'me' : 'them'}`}>
                        <div className={`msg-bubble ${isMe ? 'me' : 'them'}`}>
                          {m.content || m.text}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="msg-input-area" onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <button type="submit" className="msg-send-btn" disabled={!newMsg.trim()}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M2 3h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="#fff" strokeWidth="1.4" />
                    <path d="M2 3l6 5 6-5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

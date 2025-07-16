import React, { useState, useEffect, useRef } from 'react';
import { Camera, Send, Shield, AlertTriangle, Info, X, LogIn } from 'lucide-react';
// Import Firebase instead of Socket.IO
import { db } from '../firebase'; // Assuming firebase.js is in src/
import { ref, push, onChildAdded, set } from 'firebase/database';

// Mock harassment detection function (can stay on the client for this version)
const analyzeMessageForHarassment = (message) => {
  const harassmentKeywords = ['stupid', 'ugly', 'hate', 'kill', 'die', 'idiot', 'loser', 'dumb', 'worthless', 'disgusting', 'pathetic'];
  const flirtingKeywords = ['beautiful', 'sexy', 'hot', 'gorgeous', 'pretty', 'attractive', 'cute', 'sweet'];
  const aggressiveKeywords = ['shut up', 'go away', 'leave me alone', 'annoying', 'fuck', 'damn', 'shit'];
  
  const text = message.toLowerCase();
  
  const containsHarassment = harassmentKeywords.some(keyword => text.includes(keyword));
  const containsFlirting = flirtingKeywords.some(keyword => text.includes(keyword));
  const containsAggression = aggressiveKeywords.some(keyword => text.includes(keyword));
  
  let isHarmful = containsHarassment || containsFlirting || containsAggression;
  let confidence = 0;
  let category = 'safe';
  
  if (containsHarassment) {
    confidence = Math.random() * 0.15 + 0.85; // 85-100%
    category = 'harassment';
  } else if (containsFlirting) {
    confidence = Math.random() * 0.25 + 0.65; // 65-90%
    category = 'inappropriate';
  } else if (containsAggression) {
    confidence = Math.random() * 0.3 + 0.7; // 70-100%
    category = 'aggressive';
  } else {
    confidence = Math.random() * 0.15 + 0.05; // 5-20% risk (safe)
    isHarmful = false;
  }
  
  return {
    isHarmful,
    confidence,
    category,
    score: Math.round(confidence * 100)
  };
};

const HarassmentDetector = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joinedChat, setJoinedChat] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // This effect listens for new messages in the Firebase database
  useEffect(() => {
    if (!joinedChat) return;

    // Clear previous messages when joining a new room
    setMessages([]);

    const messagesRef = ref(db, `chats/${room}`);
    
    // onChildAdded listens for new messages added to the path
    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const messageData = snapshot.val();
      const isCurrentUser = messageData.sender === username;
      
      const analysis = analyzeMessageForHarassment(messageData.message);

      const incomingMessage = { 
          ...messageData, 
          id: snapshot.key, // Use Firebase key as ID
          isCurrentUser,
          analysis 
      };

      setMessages((prev) => [...prev, incomingMessage]);

      // Show warning for harmful messages from other users
      if (!isCurrentUser && analysis.isHarmful && analysis.score > 80) {
        setWarningMessage(incomingMessage);
        setShowWarningAlert(true);
      }
    });

    // Clean up the listener when the component unmounts or room changes
    return () => unsubscribe();
  }, [joinedChat, room, username]);

  const joinRoom = () => {
    if (username.trim() && room.trim()) {
      setJoinedChat(true);
    } else {
      alert("Please enter a username and room name.");
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !joinedChat) return;

    const messagesRef = ref(db, `chats/${room}`);
    const newMessageRef = push(messagesRef); // Creates a unique key

    set(newMessageRef, {
      sender: username,
      message: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMessageClick = (message) => {
    if (!message.isCurrentUser && message.analysis) {
      setSelectedMessage(selectedMessage?.id === message.id ? null : message);
    }
  };

  const getScoreColor = (analysis) => {
    if (analysis.isHarmful) {
      if (analysis.score >= 80) return '#dc2626';
      if (analysis.score >= 60) return '#f59e0b';
      return '#10b981';
    }
    return '#10b981';
  };

  const getScoreIcon = (analysis) => {
    if (analysis.isHarmful) {
      return <AlertTriangle size={12} color="white" />;
    }
    return <Shield size={12} color="white" />;
  };

  const closeWarningAlert = () => {
    setShowWarningAlert(false);
    setWarningMessage(null);
  };

  // Login screen UI (unchanged)
  if (!joinedChat) {
    return (
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        height: '100vh',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, #E8D5FF 0%, #F0E9FF 25%, #E0E7FF 50%, #DBEAFE 75%, #E8D5FF 100%)'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6B46C1', textAlign: 'center', marginBottom: '24px' }}>AI Safety Chat</h1>
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '12px', marginBottom: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{ padding: '12px', marginBottom: '24px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
        />
        <button onClick={joinRoom} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#8B5CF6', color: 'white',
          fontSize: '16px', fontWeight: '600', cursor: 'pointer'
        }}>
          <LogIn size={20} /> Join Chat
        </button>
      </div>
    )
  }
  
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #E8D5FF 0%, #F0E9FF 25%, #E0E7FF 50%, #DBEAFE 75%, #E8D5FF 100%)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(139, 92, 246, 0.1)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#6B46C1', margin: '0 0 8px 0' }}>Chat Room: {room}</h1>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#6B46C1' }}>Logged in as: {username}</div>
      </div>
      
      {/* Messages Container */}
      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {messages.map((message) => (
          <div key={message.id} style={{ display: 'flex', flexDirection: 'column', alignItems: message.isCurrentUser ? 'flex-end' : 'flex-start', gap: '8px', margin: '6px 0' }}>
            {!message.isCurrentUser && <div style={{ fontSize: '12px', color: '#6B46C1', marginLeft: '16px', fontWeight: '500' }}>{message.sender}</div>}
            <div
              style={{
                maxWidth: '280px',
                padding: '12px 16px',
                borderRadius: '24px',
                cursor: !message.isCurrentUser ? 'pointer' : 'default',
                alignSelf: message.isCurrentUser ? 'flex-end' : 'flex-start',
                backgroundColor: message.isCurrentUser ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: message.isCurrentUser ? '#FFFFFF' : '#6B46C1',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
                backdropFilter: 'blur(5px)'
              }}
              onClick={() => handleMessageClick(message)}
            >
              <span style={{ fontSize: '14px', lineHeight: '1.4', flex: 1, wordBreak: 'break-word' }}>{message.message}</span>
              {!message.isCurrentUser && message.analysis && (
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: getScoreColor(message.analysis), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getScoreIcon(message.analysis)}
                  </div>
                </div>
              )}
            </div>
            
            {selectedMessage?.id === message.id && message.analysis && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '280px', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Info size={14} color="#6366F1" />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>Safety Analysis</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: getScoreColor(message.analysis) }}>
                    {message.analysis.isHarmful ? `${message.analysis.score}% risk detected` : `${message.analysis.score}% risk level`}
                  </span>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${message.analysis.confidence * 100}%`, backgroundColor: getScoreColor(message.analysis), borderRadius: '2px', transition: 'width 0.3s ease' }} />
                  </div>
                  {message.analysis.isHarmful && (
                    <div style={{ fontSize: '11px', fontStyle: 'italic', color: getScoreColor(message.analysis), marginTop: '4px' }}>This message contains {message.analysis.category} content</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div style={{ padding: '16px 20px', backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(139, 92, 246, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '24px', backdropFilter: 'blur(5px)' }}>
          <Camera size={20} color="#8B5CF6" />
          <input style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', backgroundColor: 'transparent', color: '#6B46C1', fontFamily: 'inherit' }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Your message..." />
          <button style={{ padding: '8px', borderRadius: '50%', border: 'none', backgroundColor: newMessage.trim() ? '#8B5CF6' : '#D1D5DB', color: 'white', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s ease' }} onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Warning Alert Popup */}
      {showWarningAlert && warningMessage && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '320px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1, paddingRight: '8px' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <AlertTriangle size={32} color="white" />
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>⚠️ HIGH RISK DETECTED</h2>
                  <p style={{ color: '#FCA5A5', fontSize: '14px', margin: '0 0 16px 0', lineHeight: '1.4' }}>This message contains potentially harmful content with {warningMessage.analysis.score}% confidence</p>
                </div>
                <button onClick={closeWarningAlert} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0', flexShrink: 0 }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ backgroundColor: 'rgba(127, 29, 29, 0.5)', borderRadius: '16px', padding: '16px', marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: '#FCA5A5', marginBottom: '8px', textTransform: 'uppercase' }}>Flagged Message:</div>
                <div style={{ fontSize: '14px', color: 'white', fontWeight: '500', wordBreak: 'break-word' }}>"{warningMessage.message}"</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span style={{ color: '#FCA5A5' }}>Risk Level:</span><span style={{ color: 'white', fontWeight: 'bold' }}>{warningMessage.analysis.score}%</span></div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#7F1D1D', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#FCA5A5', borderRadius: '4px', width: `${warningMessage.analysis.score}%`, transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#FCA5A5', marginTop: '4px' }}>Category: {warningMessage.analysis.category}</div>
              </div>
              <button onClick={closeWarningAlert} style={{ width: '100%', marginTop: '24px', backgroundColor: 'white', color: '#DC2626', fontWeight: '600', padding: '12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                Acknowledge Warning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarassmentDetector;
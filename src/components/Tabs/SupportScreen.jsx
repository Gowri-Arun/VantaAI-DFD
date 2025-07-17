// src/components/SupportScreen.js

import React from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav'; 
import { Heart, MessageSquare } from 'lucide-react';

function SupportScreen() {
  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.heading}>💖 Emotional Support</h2>
        <p style={styles.subtext}>Your well-being matters. Help is always available.</p>

        <div style={styles.grid}>
          <Link to="/emotionalsupport" style={{ ...styles.card, backgroundColor: '#fff3e0' }}>
            <div style={styles.cardIcon}>
              <MessageSquare size={24} color="#ef6c00" />
            </div>
            <h3 style={styles.cardTitle}>Chatbot</h3>
            <p style={styles.cardText}>Chat confidentially with a certified mental health professional.</p>
          </Link>

          <Link to="/mentalhealth" style={{ ...styles.card, backgroundColor: '#fce4ec' }}>
            <div style={styles.cardIcon}>
              <Heart size={24} color="#d81b60" />
            </div>
            <h3 style={styles.cardTitle}>Mental Health</h3>
            <p style={styles.cardText}>Explore articles and tools to support your mental health.</p>
          </Link>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    paddingBottom: '80px',
    background: 'linear-gradient(to bottom, #fce8ff, #e0f7fa)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#d81b60',
    marginBottom: '6px'
  },
  subtext: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
  card: {
    padding: '20px',
    borderRadius: '16px',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardIcon: {
    width: 'fit-content',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#880e4f',
    margin: 0,
  },
  cardText: {
    fontSize: '14px',
    color: '#4e342e',
    lineHeight: 1.4,
    margin: 0,
  }
};

export default SupportScreen;
// src/components/LegalSupportScreen.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Bot } from 'lucide-react';
import BottomNav from './Tabs/BottomNav';

function LegalSupportScreen() {
  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.heading}>⚖️ Legal Support</h2>
        <p style={styles.subtext}>Access legal resources and expert guidance.</p>

        <div style={styles.grid}>
          <Link to="/LegalChatInterface" style={{ ...styles.card, backgroundColor: '#eef2f9' }}>
            <div style={styles.cardIcon}>
              <Bot size={24} color="#303f9f" />
            </div>
            <h3 style={styles.cardTitle}>Legal Chatbot and FIR Generator</h3>
            <p style={styles.cardText}>Ask legal questions in a safe, anonymous chat and generate FIRs.</p>
          </Link>

          <Link to="/KnowYourRightsHub" style={{ ...styles.card, backgroundColor: '#f3e5f5' }}>
            <div style={styles.cardIcon}>
              <Scale size={24} color="#6a1b9a" />
            </div>
            <h3 style={styles.cardTitle}>Know Your Rights Hub</h3>
            <p style={styles.cardText}>Browse your legal protections in simple language.</p>
          </Link>
        </div>
      </div>
      <BottomNav/>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    paddingBottom: '80px',
    background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3949ab',
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
    margin: 0,
  },
  cardText: {
    fontSize: '14px',
    lineHeight: 1.4,
    margin: 0,
  }
};

export default LegalSupportScreen;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Send,
  Search,
  Heart,
  AlertTriangle,
  Bot,
  Scale,
  UserX,
  Home,
  User,
  FileText
} from 'lucide-react';
import BottomNav from './BottomNav';

function Dashboard() {
  const { pathname } = useLocation();

  const cardData = [
    {
      title: 'Prevention Tools',
      description: 'Proactive AI to stop misuse before it starts.',
      icon: ShieldCheck,
      path: '/prevent',
    },
    {
      title: 'Report Violations',
      description: 'Secure reporting with one-click submission.',
      icon: Send,
      path: '/report',
    },
    {
      title: 'Scan & Detect',
      description: 'Identify unauthorized use of your images & videos.',
      icon: Search,
      path: '/detect',
    },
    {
      title: 'Emotional Support',
      description: 'Mental health resources and professional counseling.',
      icon: Heart,
      path: '/support',
    },
    {
      title: 'Silent SOS',
      description: 'Discreet alerts for immediate assistance in a crisis.',
      icon: AlertTriangle,
      path: '/sos',
    },
    {
      title: 'AI Harassment Detector',
      description: 'Identifies & flags potential harassment patterns.',
      icon: Bot,
      path: '/harassment',
    },
    {
      title: 'Legal Support',
      description: 'Expert guidance for digital rights violations.',
      icon: Scale,
      path: '/legal',
    },
    {
      title: 'Anonymous Reporting',
      description: 'A private channel to ensure your safety.',
      icon: UserX,
      path: '/anonymous',
    },
  ];

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/prevent', icon: ShieldCheck, label: 'Prevention' },
    { path: '/detect', icon: Search, label: 'Detection' },
    { path: '/report', icon: FileText, label: 'Reporting' },
    { path: '/support', icon: Heart, label: 'Support' }
  ];

  const cardSchemes = [
    { // Scheme 0: Soft Pink/Orange
      bgColor: '#FFF0EB',
      iconColor: '#D94D1A',
      titleColor: '#5C2D18',
    },
    { // Scheme 1: Soft Blue
      bgColor: '#EBF8FF',
      iconColor: '#1A759F',
      titleColor: '#114B5F',
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Vanta AI</h1>
        <div style={styles.profileChip}>
          <User size={16} style={{ color: '#4A5568' }} />
          <span style={styles.profileName}>Jaseela</span>
        </div>
      </header>

      {/* Grid of Cards */}
      <main style={styles.grid}>
        {cardData.map((card, index) => {
          const IconComponent = card.icon;
          const scheme = cardSchemes[index % 2];
          return (
            <Link key={index} to={card.path} style={{
              ...styles.card,
              backgroundColor: scheme.bgColor,
            }}>
              <div style={{...styles.iconContainer, color: scheme.iconColor }}>
                 <IconComponent size={20} />
              </div>
              <h3 style={{...styles.cardTitle, color: scheme.titleColor}}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
            </Link>
          );
        })}
      </main>

        <BottomNav/>
    </div>
  );
}

// --- Styles for the Final Clean UI with Gradient ---
const styles = {
  container: {
    height: '100vh',
    maxHeight: '100dvh',
    overflow: 'hidden', 
    padding: '16px 16px 0 16px',
    // --- THIS IS THE UPDATED GRADIENT BACKGROUND ---
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)', 
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    flexShrink: 0,
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: "'Lora', serif",
    color: '#6D28D9',
  },
  profileChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Switched back to semi-transparent to match the gradient
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
  },
  profileName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#4A5568',
  },

  grid: {
    flexGrow: 1, 
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px', 
    minHeight: 0,
    alignContent: 'center', 
  },
  card: {
    borderRadius: '16px',
    padding: '16px',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: '1px solid #FFFFFF50', // A subtle white border
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  iconContainer: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '12px'
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: "'Lora', serif",
    margin: '0 0 4px 0',
  },
  cardDescription: {
    fontSize: '12px',
    color: '#475569',
    lineHeight: '1.5',
    margin: 0,
  },

};

export default Dashboard;
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

  // --- UPDATED BLUE & PINK COLOR SCHEMES ---
  const cardSchemes = [
    { // Scheme 0: Soft Blue
      bgColor: '#EFF6FF', // Tailwind blue-50
      iconColor: '#3B82F6', // Tailwind blue-500
      titleColor: '#1E3A8A', // Tailwind blue-900
    },
    { // Scheme 1: Soft Pink
      bgColor: '#FEF2F2', // Tailwind red-50 (looks pink)
      iconColor: '#F43F5E', // Tailwind rose-500
      titleColor: '#881337', // Tailwind rose-900
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
          // Alternates between blue and pink schemes
          const scheme = cardSchemes[index % 2];
          return (
            <Link key={index} to={card.path} style={{
              ...styles.card,
              // Subtle gradient for depth, using the chosen background color
              background: `linear-gradient(145deg, rgba(255,255,255,0.9), ${scheme.bgColor})`,
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

      {/* Bottom Navigation is expected to be placed here,
          and the container's padding will prevent overlap */}
      <BottomNav/>
    </div>
  );
}

// --- Styles updated for a more seamless Blue & Pink UI ---
const styles = {
  container: {
    height: '100vh',
    maxHeight: '100dvh', // Use dvh for better mobile browser support
    overflow: 'hidden',
    // Added generous bottom padding to make space for the BottomNav
    padding: '16px 16px 96px 16px',
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px', // Slightly more space below header
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
    padding: '6px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Slightly more transparent
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.7)',
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
    overflowY: 'auto', // Allow grid to scroll on smaller screens if content overflows
    minHeight: 0,
    // Add a little padding at the bottom of the scroll area
    paddingBottom: '16px',
    // Hide scrollbar for a cleaner look
    msOverflowStyle: 'none',  /* IE and Edge */
    scrollbarWidth: 'none',  /* Firefox */
  },
  // Hides scrollbar for Webkit browsers (Chrome, Safari)
  '@global': {
    'styles.grid::-webkit-scrollbar': {
      display: 'none',
    },
  },
  card: {
    borderRadius: '20px', // More rounded corners
    padding: '16px',
    textDecoration: 'none',
    color: 'inherit',
    // A softer, more diffused shadow
    boxShadow: '0 6px 20px rgba(109, 40, 217, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    // Semi-transparent to blend with card gradient
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '12px'
  },
  cardTitle: {
    fontSize: '15px', // Slightly larger for better readability
    fontWeight: '600',
    fontFamily: "'Lora', serif",
    margin: '0 0 4px 0',
  },
  cardDescription: {
    fontSize: '12px',
    color: '#64748B', // A softer slate color for description text
    lineHeight: '1.5',
    margin: 0,
  },
};

export default Dashboard;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Shield, Search, FileText, Heart } from 'lucide-react';

function BottomNav() {
  const { pathname } = useLocation();

  // Updated navItems with Lucide icons and labels
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/prevent', icon: Shield, label: 'Prevention' },
    { path: '/detect', icon: Search, label: 'Detection' },
    { path: '/report', icon: FileText, label: 'Reporting' },
    { path: '/support', icon: Heart, label: 'Support' }
  ];

  return (
    <nav style={styles.navbar}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const IconComponent = item.icon;
        
        return (
          <Link key={item.path} to={item.path} style={styles.navLink}>
            <div style={{
                ...styles.navItemContainer,
                // Add a pill background for the active item
                backgroundColor: isActive ? 'rgba(233, 213, 255, 0.7)' : 'transparent',
              }}>
              <IconComponent 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                color={isActive ? styles.activeColor.color : styles.inactiveColor.color}
              />
              <span style={{
                  ...styles.navLabel,
                  color: isActive ? styles.activeColor.color : styles.inactiveColor.color,
                }}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

// Enhanced and modern styles
const styles = {
  // Main navbar with "frosted glass" effect
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)', // Semi-transparent white
    backdropFilter: 'blur(16px)', // The blur effect
    borderTop: '1px solid #E5E7EB', // Lighter border
    padding: '8px 0 16px 0', // Padding for content and iPhone safe area
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
  },
  // Style for the link element
  navLink: {
    textDecoration: 'none',
    flex: 1, // Ensure items take up equal space
    display: 'flex',
    justifyContent: 'center',
  },
  // Container for icon and label
  navItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '16px',
    transition: 'background-color 0.3s ease',
  },
  // Style for the text label
  navLabel: {
    fontSize: '10px',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  // Color definitions
  activeColor: {
    color: '#6D28D9', // Rich, vibrant purple
  },
  inactiveColor: {
    color: '#6B7280', // Soft gray
  },
};

export default BottomNav;
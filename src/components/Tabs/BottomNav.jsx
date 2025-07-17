import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShieldCheck, Search, FileText, Heart } from 'lucide-react';

function BottomNav() {
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'prevent', path: '/prevent', icon: ShieldCheck, label: 'Prevention' },
    { id: 'detect', path: '/detect', icon: Search, label: 'Detection' },
    { id: 'report', path: '/report', icon: FileText, label: 'Reporting' },
    { id: 'support', path: '/support', icon: Heart, label: 'Support' }
  ];

  // This effect calculates the position for the sliding indicator dot
  useEffect(() => {
    const activeItem = document.getElementById(`nav-item-${pathname}`);
    if (activeItem && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      
      setIndicatorStyle({
        width: '6px',
        height: '6px',
        transform: `translateX(${itemRect.left - navRect.left + itemRect.width / 2 - 3}px)`,
        opacity: 1,
      });
    }
  }, [pathname]);

  return (
    <nav ref={navRef} style={styles.navContainer}>
      {/* The animated indicator dot */}
      <div style={{ ...styles.indicator, ...indicatorStyle }} />

      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.path}
            id={`nav-item-${item.path}`} // ID for measuring position
            to={item.path}
            style={styles.navItemLink}
          >
            <IconComponent
              size={24}
              color={isActive ? styles.active.color : styles.inactive.color}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span style={isActive ? styles.activeLabel : styles.inactiveLabel}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

// --- Styles for a Modern, Sleek, and Lovely Aesthetic ---
const styles = {
  navContainer: {
    position: 'fixed',
    // --- Floating Effect ---
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 48px)',
    maxWidth: '400px', // Max width for larger screens
    // ---
    height: '68px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    // --- Refined Glassmorphism ---
    backgroundColor: 'rgba(252, 252, 255, 0.7)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    // ---
    borderRadius: '34px', // Fully rounded corners
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px rgba(109, 40, 217, 0.15)',
  },
  navItemLink: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    textDecoration: 'none',
    height: '100%',
    position: 'relative',
    color: '#4A5568',
    transition: 'color 0.3s ease',
  },
  inactive: {
    color: '#5B657E', // Softer, less prominent color
  },
  active: {
    color: '#6D28D9', // Vibrant primary color
  },
  inactiveLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: '500',
    color: '#5B657E',
    transition: 'all 0.3s ease',
  },
  activeLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: '700', // Bolder for active state
    color: '#6D28D9',
    transition: 'all 0.3s ease',
  },
  // --- The Magic Sliding Dot ---
  indicator: {
    position: 'absolute',
    bottom: '8px',
    height: '6px',
    width: '6px',
    backgroundColor: '#6D28D9',
    borderRadius: '50%',
    opacity: 0,
    // The beautiful, fluid transition
    transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
};

export default BottomNav;
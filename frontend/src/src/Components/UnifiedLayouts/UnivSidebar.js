import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../UnivDash/UnivDash.css';

const UnivSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveId = () => {
    if (location.pathname === '/univ-dashboard') return 'overview';
    if (location.pathname === '/univ-validations') return 'validation';
    if (location.pathname === '/univ-conventions') return 'stats'; // Reusing stats icon for conventions for now or as requested
    if (location.pathname === '/univ-internships') return 'stats'; // Based on sidebar icons
    if (location.pathname === '/univ-profile') return 'profile';
    return '';
  };

  const activeId = getActiveId();

  const navItems = [
    { id: 'overview', path: '/univ-dashboard', icon: <><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="11" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="11" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="11" y="11" width="6" height="6" rx="1.5" fill="currentColor"/></> },
    { id: 'validation', path: '/univ-validations', icon: <><path d="M9 2L3 6v5c0 3.3 2.7 6 6 7 3.3-1 6-3.7 6-7V6l-6-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></> },
    { id: 'conventions', path: '/univ-conventions', icon: <><rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></> },
    { id: 'internships', path: '/univ-internships', icon: <><path d="M2 13l4-5 3 3 3-4 4 6H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></> },
  ];

  return (
    <nav className="sidebar">
      <div className="sb-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L3 6v5c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6l-7-4z" fill="#fff" fillOpacity=".2" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M7 10l2.5 2.5L13 8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {navItems.map(({ id, path, icon }) => (
        <button
          key={id}
          className={`sb-icon ${activeId === id ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18">{icon}</svg>
        </button>
      ))}

      <div className="sb-spacer" />

      <button 
        className={`sb-icon ${activeId === 'profile' ? 'active' : ''}`} 
        onClick={() => navigate('/univ-profile')}
      >
        <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
          <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 16c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      
      <button className="sb-icon" onClick={() => navigate('/signin')}>
        <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
          <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h3M12 13l4-4-4-4M16 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
};

export default UnivSidebar;

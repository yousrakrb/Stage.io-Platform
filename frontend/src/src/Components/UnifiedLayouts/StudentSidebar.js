import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../StudentDash/StudentDash.css';

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveId = () => {
    if (location.pathname === '/student-dashboard') return 'overview';
    if (location.pathname === '/student-matches') return 'offers';
    if (location.pathname === '/student-applications') return 'applications';
    if (location.pathname === '/cv-builder') return 'cv';
    if (location.pathname === '/student-profile' || location.pathname === '/my-profile') return 'profile';
    return '';
  };

  const activeId = getActiveId();

  const navItems = [
    { id: 'overview', path: '/student-dashboard', icon: <><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="11" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="11" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="11" y="11" width="6" height="6" rx="1.5" fill="currentColor"/></> },
    { id: 'offers', path: '/student-matches', icon: <><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></> },
    { id: 'applications', path: '/student-applications', icon: <><path d="M2 14l4-5 3 3 3-4 4 6H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></> },
    { id: 'cv', path: '/cv-builder', icon: <><rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></> },
  ];

  return (
    <nav className="sidebar">
      <div className="sb-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
          <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
        onClick={() => navigate('/my-profile')}
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

export default StudentSidebar;

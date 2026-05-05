import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../CompanyDash/CompanyDash.css';

const CompanySidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (location.pathname === '/company-profile' || location.pathname === '/company-profile-edit') return 'profile';
    if (location.pathname === '/company-dashboard') return tab || 'overview';
    if (location.pathname === '/offers' || location.pathname === '/add-offer') return 'offers';
    // Other pages don't have dedicated icons on the sidebar right now
    return '';
  };

  const activeId = getActiveTab();

  const handleNav = (id) => {
    if (id === 'profile') {
      navigate('/company-profile-edit');
    } else if (id === 'candidates') {
      navigate('/candidates');
    } else {
      navigate(`/company-dashboard?tab=${id}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <nav className="sidebar">
      <div className="sb-logo" onClick={() => navigate('/company-dashboard')} style={{ cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="6" height="6" rx="1.5" fill="#fff" />
          <rect x="11" y="3" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".4" />
          <rect x="3" y="11" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".4" />
          <rect x="11" y="11" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".4" />
        </svg>
      </div>

      {[
        {
          id: 'overview',
          d: (
            <>
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
              <rect x="11" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
              <rect x="1" y="11" width="6" height="6" rx="1.5" fill="currentColor" />
              <rect x="11" y="11" width="6" height="6" rx="1.5" fill="currentColor" />
            </>
          ),
        },
        {
          id: 'offers',
          d: (
            <>
              <rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ),
        },
        {
          id: 'candidates',
          d: (
            <>
              <path d="M4 15c0-2.5 2-4.5 5-4.5s5 2 5 4.5v.5H4v-.5z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 9l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ),
        },
      ].map(({ id, d }) => (
        <button
          key={id}
          className={`sb-icon ${activeId === id ? 'active' : ''}`}
          onClick={() => handleNav(id)}
          title={id.charAt(0).toUpperCase() + id.slice(1)}
        >
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18">{d}</svg>
        </button>
      ))}

      <div className="sb-spacer" />

      {/* Bottom Icons: Profile & Logout */}
      <button 
        className={`sb-icon ${activeId === 'profile' ? 'active' : ''}`}
        onClick={() => handleNav('profile')}
        title="Profile"
      >
        <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
          <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 16c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <button 
        className="sb-icon"
        onClick={handleLogout}
        title="Logout"
        style={{ marginTop: '4px' }}
      >
        <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
          <path d="M11 3H4a2 2 0 00-2 2v8a2 2 0 002 2h7m3-6l3 3-3 3m3-3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
};

export default CompanySidebar;

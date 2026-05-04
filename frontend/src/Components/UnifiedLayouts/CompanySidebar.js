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
    } else {
      navigate(`/company-dashboard?tab=${id}`);
    }
  };

  return (
    <nav className="sidebar">
      <div className="sb-logo">
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
          id: 'profile',
          d: (
            <>
              <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 16c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ),
        },
      ].map(({ id, d }) => (
        <button
          key={id}
          className={`sb-icon ${activeId === id ? 'active' : ''}`}
          onClick={() => handleNav(id)}
        >
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18">{d}</svg>
        </button>
      ))}

      <div className="sb-spacer" />
    </nav>
  );
};

export default CompanySidebar;

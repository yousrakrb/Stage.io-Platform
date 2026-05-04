import React from 'react';
import { Outlet } from 'react-router-dom';
import CompanySidebar from './CompanySidebar';
import '../CompanyDash/CompanyDash.css';

const CompanyLayout = () => {
  return (
    <div className="db">
      <CompanySidebar />
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default CompanyLayout;

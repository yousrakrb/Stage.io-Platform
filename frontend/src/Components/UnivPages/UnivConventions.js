import React from 'react';
import UnivSidebar from '../UnifiedLayouts/UnivSidebar';
import '../UnivDash/UnivDash.css';
import './UnivPages.css';

const conventions = [
  { id: 1, name: 'Convention_Khelifi_Sonatrach.pdf', student: 'Amine Khelifi', company: 'Sonatrach Digital', date: 'Generated 12 Apr 2025', status: 'Signed' },
  { id: 2, name: 'Convention_Rahmani_NafTech.pdf', student: 'Sara Rahmani', company: 'NafTech', date: 'Generated 10 Apr 2025', status: 'Signed' },
  { id: 3, name: 'Convention_Mansouri_Mobilis.pdf', student: 'Lina Mansouri', company: 'Mobilis', date: 'Generated 8 Apr 2025', status: 'Awaiting' },
  { id: 4, name: 'Convention_Belkacem_DZTech.pdf', student: 'Yacine Belkacem', company: 'DZTech', date: 'Generated 5 Apr 2025', status: 'Signed' },
  { id: 5, name: 'Convention_Djebbar_Ooredoo.pdf', student: 'Karim Djebbar', company: 'Ooredoo', date: 'Generated 2 Apr 2025', status: 'Review' },
];

const UnivConventions = () => {
  return (
    <div className="db">
      <UnivSidebar />
      <main className="main">
        <header className="topbar">
          <h1 className="page-title">Recent Conventions</h1>
        </header>

        <div className="univ-pages-container">
          <div className="univ-table-header">
            <span>Document Name</span>
            <span>Student</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {conventions.map(c => (
            <div key={c.id} className="univ-card univ-table-row">
              <div className="univ-doc-info">
                <div className="doc-icon-small">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="1" width="10" height="14" rx="2" stroke="#212EA0" strokeWidth="1.5" />
                    <path d="M5.5 5h5M5.5 8h5M5.5 11h3" stroke="#212EA0" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="univ-doc-name">{c.name}</div>
                  <div className="univ-doc-date">{c.date}</div>
                </div>
              </div>
              <div className="univ-doc-student">{c.student}</div>
              <div className={`univ-status-tag s-${c.status.toLowerCase()}`}>{c.status}</div>
              <button className="univ-dl-btn">Download PDF</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UnivConventions;

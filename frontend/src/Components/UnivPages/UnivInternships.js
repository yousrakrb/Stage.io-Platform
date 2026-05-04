import React from 'react';
import UnivSidebar from '../UnifiedLayouts/UnivSidebar';
import '../UnivDash/UnivDash.css';
import './UnivPages.css';

const activeInternships = [
  { id: 1, name: 'Lina Mansouri', company: 'Mobilis', role: 'Backend Intern', duration: '6 months', start: 'Apr 2025', progress: 15 },
  { id: 2, name: 'Karim Djebbar', company: 'Ooredoo', role: 'DevOps Intern', duration: '4 months', start: 'Mar 2025', progress: 35 },
  { id: 3, name: 'Amine Khelifi', company: 'Sonatrach Digital', role: 'Frontend Intern', duration: '3 months', start: 'May 2025', progress: 0 },
  { id: 4, name: 'Sara Rahmani', company: 'NafTech', role: 'Full Stack Intern', duration: '2 months', start: 'Apr 2025', progress: 10 },
];

const UnivInternships = () => {
  return (
    <div className="db">
      <UnivSidebar />
      <main className="main">
        <header className="topbar">
          <h1 className="page-title">Validated Internships</h1>
        </header>

        <div className="univ-pages-container">
          <div className="univ-grid-pages">
            {activeInternships.map(i => (
              <div key={i.id} className="univ-card univ-intern-card">
                <div className="uic-head">
                  <div className="uic-student">{i.name}</div>
                  <div className="uic-company">@ {i.company}</div>
                </div>
                <div className="uic-role">{i.role}</div>
                <div className="uic-meta">
                  <span>Starts: {i.start}</span>
                  <span>Duration: {i.duration}</span>
                </div>
                <div className="uic-progress-label">
                  <span>Progress</span>
                  <span>{i.progress}%</span>
                </div>
                <div className="uic-progress-bar">
                  <div className="uic-progress-fill" style={{ width: `${i.progress}%` }} />
                </div>
                <button className="uic-btn">View Logbook</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnivInternships;

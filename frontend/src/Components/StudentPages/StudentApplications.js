import React from 'react';
import StudentSidebar from '../UnifiedLayouts/StudentSidebar';
import '../StudentDash/StudentDash.css';
import './StudentPages.css';

const applications = [
  { id: 1, title: 'Frontend Intern', company: 'Sonatrach Digital', status: 'pending', date: '2024-04-20', location: 'Alger', desc: 'Application under review by HR team.' },
  { id: 2, title: 'Backend Intern', company: 'Mobilis', status: 'accepted', date: '2024-04-15', location: 'Alger', desc: 'Interview scheduled for next Tuesday.' },
  { id: 3, title: 'UI/UX Intern', company: 'Djezzy Labs', status: 'refused', date: '2024-04-10', location: 'Alger', desc: 'Positions filled for this cohort.' },
  { id: 4, title: 'DevOps Intern', company: 'Ooredoo Tech', status: 'pending', date: '2024-04-22', location: 'Alger', desc: 'Sent to technical manager for evaluation.' },
];

const StudentApplications = () => {
  return (
    <div className="db">
      <StudentSidebar />
      <main className="main">
        <header className="topbar">
          <h1 className="page-title">My Applications</h1>
        </header>

        <div className="apps-container">
          {applications.map(app => (
            <div key={app.id} className="app-detail-card">
              <div className="app-detail-header">
                <div className="app-co-info">
                  <div className={`co-av ${app.status === 'accepted' ? 'teal' : app.status === 'refused' ? 'purple' : 'blue'}`}>
                    {app.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="app-title-text">{app.title}</h3>
                    <p className="app-company-text">{app.company} • {app.location}</p>
                  </div>
                </div>
                <div className={`status s-${app.status}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </div>
              </div>
              
              <div className="app-detail-body">
                <p className="app-description">{app.desc}</p>
                <div className="app-meta">
                  <span className="app-date">Applied on {app.date}</span>
                  <button className="app-action-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentApplications;

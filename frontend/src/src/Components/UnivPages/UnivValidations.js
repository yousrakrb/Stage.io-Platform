import React, { useState } from 'react';
import UnivSidebar from '../UnifiedLayouts/UnivSidebar';
import '../UnivDash/UnivDash.css';
import './UnivPages.css';

const initialPending = [
  { id: 1, initials: 'AK', color: 'blue', name: 'Amine Khelifi', company: 'Frontend Intern @ Sonatrach Digital', detail: 'Alger · Présentiel · 3 months · L3 Informatique', appliedDate: '2024-04-12' },
  { id: 2, initials: 'SR', color: 'teal', name: 'Sara Rahmani', company: 'Full Stack Intern @ NafTech', detail: 'Oran · Hybride · 2 months · M1 GL', appliedDate: '2024-04-10' },
  { id: 3, initials: 'YB', color: 'purple', name: 'Yacine Belkacem', company: 'Data Intern @ DZTech', detail: 'Constantine · Distanciel · 4 months · L3 Info', appliedDate: '2024-04-08' },
  { id: 4, initials: 'LM', color: 'amber', name: 'Lina Mansouri', company: 'Backend Intern @ Mobilis', detail: 'Alger · Présentiel · 6 months · M2 SI', appliedDate: '2024-04-15' },
];

const avMap = { blue: 'av-blue', teal: 'av-teal', purple: 'av-purple', amber: 'av-amber' };

const UnivValidations = () => {
  const [pendingList, setPendingList] = useState(initialPending);

  const handleAction = (id) => setPendingList(prev => prev.filter(item => item.id !== id));

  return (
    <div className="db">
      <UnivSidebar />
      <main className="main">
        <header className="topbar">
          <h1 className="page-title">Pending Validations</h1>
        </header>

        <div className="univ-pages-container">
          {pendingList.map(p => (
            <div key={p.id} className="univ-card univ-val-card">
              <div className="univ-card-row">
                <div className={`val-av ${avMap[p.color]}`}>{p.initials}</div>
                <div className="univ-val-info">
                  <h3>{p.name}</h3>
                  <p className="univ-val-co">{p.company}</p>
                  <p className="univ-val-meta">{p.detail}</p>
                  <p className="univ-val-date">Applied on {p.appliedDate}</p>
                </div>
                <div className="univ-val-actions">
                  <button className="btn-validate" onClick={() => handleAction(p.id)}>Validate</button>
                  <button className="btn-reject" onClick={() => handleAction(p.id)}>Reject</button>
                </div>
              </div>
            </div>
          ))}
          {pendingList.length === 0 && <p className="empty-msg">No pending validations.</p>}
        </div>
      </main>
    </div>
  );
};

export default UnivValidations;

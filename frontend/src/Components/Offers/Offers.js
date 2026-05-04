import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Offers.css';

const offers = [
  { id: 1, initials: 'FS', color: 'blue', title: 'Full Stack Intern', location: 'Oran · Hybride', tags: ['React', 'Node.js'], tagColor: ['blue', 'teal'], count: 14, open: true, date: 'Posted 2 days ago' },
  { id: 2, initials: 'BE', color: 'teal', title: 'Backend Intern', location: 'Oran · Présentiel', tags: ['Django', 'PostgreSQL'], tagColor: ['teal', 'gray'], count: 9, open: true, date: 'Posted 5 days ago' },
  { id: 3, initials: 'DS', color: 'amber', title: 'Data Analyst Intern', location: 'Alger · Distanciel', tags: ['Python', 'Pandas'], tagColor: ['gray', 'gray'], count: 15, open: false, date: 'Posted 2 weeks ago' },
];

const tagColorMap = { blue: 'pb', teal: 'pt', gray: 'pg', purple: 'ppu', amber: 'pa' };
const avColorMap  = { blue: 'av-blue', teal: 'av-teal', amber: 'av-amber' };

const Offers = () => {
  const navigate = useNavigate();

  return (
    <div className="offers-page">
      <nav className="op-nav">
        <div className="op-nav-brand">
          <div className="op-back-btn" onClick={() => navigate('/profile')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          StageLink Offers
        </div>
        <button className="op-btn-primary" onClick={() => navigate('/add-offer')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12m6-6H2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Add Offer
        </button>
      </nav>

      <div className="op-container">
        <div className="op-header">
           <h1>Active Internship Offers</h1>
           <p>Manage and track the performance of your company's internship placements.</p>
        </div>

        <div className="op-grid">
          {offers.map((o) => (
            <div className="op-card" key={o.id}>
              <div className="op-card-top">
                <div className={`op-av ${avColorMap[o.color]}`}>{o.initials}</div>
                <div className="op-status-wrap">
                  <div className={o.open ? 'op-dot-green' : 'op-dot-gray'} />
                  <span className={o.open ? 'op-ind-open' : 'op-ind-closed'}>{o.open ? 'Accepting Applications' : 'Closed'}</span>
                </div>
              </div>
              <h3 className="op-title">{o.title}</h3>
              <p className="op-location">{o.location}</p>
              
              <div className="op-tags">
                {o.tags.map((t, idx) => (
                   <span key={t} className={`op-pill ${tagColorMap[o.tagColor[idx]]}`}>{t}</span>
                ))}
              </div>

              <div className="op-footer">
                <div className="op-count">
                   <strong>{o.count}</strong> applicants
                </div>
                <div className="op-date">{o.date}</div>
              </div>

              <div className="op-card-actions">
                 <button className="op-btn-outline" onClick={() => navigate('/candidates')}>View Applicants</button>
                 <button className="op-btn-text">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;

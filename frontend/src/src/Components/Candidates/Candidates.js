import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Candidates.css';

const candidates = [
  { id: 1, initials: 'AK', color: 'blue', name: 'Amine Khelifi', uni: 'Univ. Alger · L3 Info', skills: ['React', 'Git'], skillColors: ['blue', 'gray'], score: 94, status: 'new', applyingFor: 'Full Stack Intern' },
  { id: 2, initials: 'SR', color: 'teal', name: 'Sara Rahmani', uni: 'USTHB · M1 GL', skills: ['Node.js', 'Docker'], skillColors: ['teal', 'gray'], score: 87, status: 'new', applyingFor: 'Backend Intern' },
  { id: 3, initials: 'YB', color: 'amber', name: 'Yacine Belkacem', uni: 'ESI · L3 Sécurité', skills: ['Python', 'Cybersec'], skillColors: ['gray', 'purple'], score: 79, status: 'view', applyingFor: 'Data Analyst Intern' },
];

const tagColorMap = { blue: 'pb', teal: 'pt', gray: 'pg', purple: 'ppu', amber: 'pa' };
const avColorMap  = { blue: 'av-blue', teal: 'av-teal', amber: 'av-amber' };

const Candidates = () => {
  const navigate = useNavigate();

  return (
    <div className="cand-page">
      <nav className="cand-nav">
        <div className="cand-nav-brand">
          <div className="cand-back-btn" onClick={() => navigate('/profile')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          Candidates Tracker
        </div>
      </nav>

      <div className="cand-container">
        <div className="cand-header">
           <h1>Pool of Applicants</h1>
           <p>Review and engage with top talent applying to your offers.</p>
        </div>

        <div className="cand-filters">
           <button className="cf-btn active">All Candidates</button>
           <button className="cf-btn">New</button>
           <button className="cf-btn">In Review</button>
           <button className="cf-btn">Accepted</button>
        </div>

        <div className="cand-grid">
          {candidates.map((c) => (
            <div className="cand-card" key={c.id}>
              <div className="cand-card-top">
                <div className="cand-identity">
                    <div className={`cand-av ${avColorMap[c.color]}`}>{c.initials}</div>
                    <div>
                        <h3 className="cand-name">{c.name}</h3>
                        <p className="cand-uni">{c.uni}</p>
                    </div>
                </div>
                <div className="match-badge">
                   <span className="match-pct">{c.score}%</span> Match
                </div>
              </div>
              
              <div className="cand-role-wrap">
                 <span className="cr-label">Applying for:</span> <span className="cr-val">{c.applyingFor}</span>
              </div>

              <div className="cand-tags">
                {c.skills.map((s, idx) => (
                   <span key={s} className={`cand-pill ${tagColorMap[c.skillColors[idx]]}`}>{s}</span>
                ))}
                <span className="cand-pill pg">+2 more</span>
              </div>

              <div className="cand-card-actions">
                 <button className="cand-btn-primary" onClick={() => navigate('/messages')}>Message</button>
                 <button className="cand-btn-outline">View CV</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Candidates;

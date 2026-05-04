import React from 'react';
import StudentSidebar from '../UnifiedLayouts/StudentSidebar';
import '../StudentDash/StudentDash.css';
import './StudentPages.css';

const matches = [
  { id: 1, title: 'Frontend Developer Intern', company: 'Sonatrach Digital', match: 94, location: 'Alger', tags: ['React', 'TypeScript', 'Tailwind'], desc: 'High match based on your recent projects and skills in React.' },
  { id: 2, title: 'Full Stack Intern', company: 'NafTech', match: 88, location: 'Oran', tags: ['Node.js', 'MongoDB', 'Express'], desc: 'Your Node.js proficiency perfectly aligns with this role.' },
  { id: 3, title: 'Software Engineer Intern', company: 'Yassir', match: 85, location: 'Alger', tags: ['Python', 'Go', 'Docker'], desc: 'A great opportunity to expand your backend and devops knowledge.' },
  { id: 4, title: 'Mobile Developer Intern', company: 'TemTem', match: 82, location: 'Alger', tags: ['React Native', 'Firebase'], desc: 'Matches your experience with React-based frameworks.' },
];

const StudentMatches = () => {
  return (
    <div className="db">
      <StudentSidebar />
      <main className="main">
        <header className="topbar">
          <h1 className="page-title">Top Matches for You</h1>
        </header>

        <div className="matches-grid">
          {matches.map(m => (
            <div key={m.id} className="match-detail-card">
              <div className="match-score-badge">{m.match}% Match</div>
              <h3 className="match-card-title">{m.title}</h3>
              <p className="match-card-company">{m.company} • {m.location}</p>
              
              <div className="match-card-tags">
                {m.tags.map(tag => <span key={tag} className="pill pill-blue">{tag}</span>)}
              </div>
              
              <p className="match-card-desc">{m.desc}</p>
              
              <div className="match-card-footer">
                <button className="match-apply-btn">Apply Now</button>
                <button className="match-save-btn">Save</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentMatches;

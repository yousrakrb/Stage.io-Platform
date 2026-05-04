import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './StudentProfile.css'

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('about')
  const navigate = useNavigate()

  return (
    <div className="sp-page">


      {/* ── Body ── */}
      <div className="sp-body">

        {/* ── Left Panel ── */}
        <div className="sp-left">

          {/* Profile card */}
          <div className="sp-card sp-profile-card">
            <div className="sp-cover">
              <div className="sp-cover-pattern" />
            </div>
            <div className="sp-avatar-wrap">
              <div className="sp-avatar">AK</div>
            </div>
            <div className="sp-name">Amine Khelifi</div>
            <div className="sp-role">Frontend Developer</div>
            <div className="sp-location">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="#6b7280" strokeWidth="1.4" />
                <circle cx="8" cy="6" r="1.5" stroke="#6b7280" strokeWidth="1.4" />
              </svg>
              Alger, Algeria
            </div>
            <div className="sp-stats-row">
              <div className="sp-stat"><div className="sp-stat-num">12</div><div className="sp-stat-label">Applied</div></div>
              <div className="sp-stat"><div className="sp-stat-num">3</div><div className="sp-stat-label">Accepted</div></div>
              <div className="sp-stat"><div className="sp-stat-num">94%</div><div className="sp-stat-label">Match</div></div>
            </div>
          </div>

          {/* Skills */}
          <div className="sp-card">
            <div className="sp-card-inner">
              <div className="sp-card-title">Skills</div>
              <div className="sp-skill-list">
                {['React', 'TypeScript', 'Node.js', 'Git', 'Figma', 'CSS', 'Python', 'REST APIs'].map((s, i) => (
                  <span key={s} className={`sp-skill-pill ${i > 4 ? 'gray' : ''}`}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="sp-card">
            <div className="sp-card-inner">
              <div className="sp-card-title">Languages</div>
              {[
                { lang: 'Arabic', level: 'Native' },
                { lang: 'French', level: 'Fluent' },
                { lang: 'English', level: 'Professional' },
              ].map(l => (
                <div className="sp-lang-row" key={l.lang}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{l.lang}</span>
                  <span className="sp-lang-level">{l.level}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Panel ── */}
        <div className="sp-right">

          {/* Top bar */}
          <div className="sp-top-bar">
            <div className="sp-top-info">
              <div className="sp-top-name">Amine Khelifi</div>
              <div className="sp-top-sub">
                Univ. Alger 1 · L3 Computer Science
                <span className="sp-badge available">Available</span>
              </div>
            </div>
            <div className="sp-action-btns">
              <button className="sp-btn-outline" onClick={() => alert('Profile Bookmarked!')}>Bookmark</button>
              <button className="sp-btn-primary" onClick={() => navigate('/messages')}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="#fff" strokeWidth="1.4" />
                  <path d="M2 3l6 5 6-5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Contact
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="sp-tabs">
              {['about', 'experience', 'education', 'skills', 'cv'].map(t => (
                <button
                  key={t}
                  className={`sp-tab ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t === 'cv' ? 'CV' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="sp-tab-content">

              {activeTab === 'about' && (
                <>
                  <div className="sp-card-title" style={{ marginBottom: '1rem' }}>Contact Information</div>
                  <div className="sp-contact-grid">
                    <div className="sp-contact-item"><span className="sp-contact-label">Phone</span><span className="sp-contact-val link">+213 555 123 456</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">Email</span><span className="sp-contact-val link">amine.khelifi@univ-alger.dz</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">LinkedIn</span><span className="sp-contact-val link">linkedin.com/in/aminekhelifi</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">GitHub</span><span className="sp-contact-val link">github.com/aminekhelifi</span></div>
                  </div>
                  <div className="sp-card-title" style={{ margin: '1.5rem 0 1rem' }}>Basic Information</div>
                  <div className="sp-contact-grid">
                    <div className="sp-contact-item"><span className="sp-contact-label">Date of Birth</span><span className="sp-contact-val">March 14, 2002</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">Gender</span><span className="sp-contact-val">Male</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">Nationality</span><span className="sp-contact-val">Algerian</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">Availability</span><span className="sp-contact-val">July 2025</span></div>
                  </div>
                  <div className="sp-card-title" style={{ margin: '1.5rem 0 1rem' }}>Match Score Breakdown</div>
                  {[
                    { label: 'Technical Skills', pct: 94 },
                    { label: 'Profile Completeness', pct: 88 },
                    { label: 'Academic Performance', pct: 82 },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="sp-score-row">
                        <span className="sp-score-label">{s.label}</span>
                        <span className="sp-score-pct">{s.pct}%</span>
                      </div>
                      <div className="sp-score-bar"><div className="sp-score-fill" style={{ width: `${s.pct}%` }} /></div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'experience' && (
                <>
                  {[
                    { initials: 'NT', title: 'Frontend Intern', company: 'NafTech Inc. · Oran', date: 'Jun 2024 – Sep 2024', desc: 'Built React components for the company\'s internal dashboard. Collaborated with backend team on REST API integration.' },
                    { initials: 'FT', title: 'Web Dev Freelancer', company: 'Freelance · Remote', date: 'Jan 2024 – May 2024', desc: 'Developed landing pages and e-commerce sites for local businesses using React and Tailwind CSS.' },
                  ].map(e => (
                    <div className="sp-timeline-item" key={e.title}>
                      <div className="sp-timeline-icon">{e.initials}</div>
                      <div className="sp-timeline-info">
                        <div className="sp-timeline-title">{e.title}</div>
                        <div className="sp-timeline-sub">{e.company}</div>
                        <div className="sp-timeline-date">{e.date}</div>
                        <div className="sp-timeline-desc">{e.desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'education' && (
                <>
                  {[
                    { initials: 'UA', title: 'L3 Computer Science', company: 'Université Alger 1', date: '2022 – Present', desc: 'GPA: 15.4/20 · Specialization in Software Engineering' },
                    { initials: 'LY', title: 'Baccalauréat Sciences', company: 'Lycée Ben Aknoun · Alger', date: '2019 – 2022', desc: 'Mention: Très Bien · Major: Mathematics' },
                  ].map(e => (
                    <div className="sp-timeline-item" key={e.title}>
                      <div className="sp-timeline-icon">{e.initials}</div>
                      <div className="sp-timeline-info">
                        <div className="sp-timeline-title">{e.title}</div>
                        <div className="sp-timeline-sub">{e.company}</div>
                        <div className="sp-timeline-date">{e.date}</div>
                        <div className="sp-timeline-desc">{e.desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'skills' && (
                <>
                  <div className="sp-card-title" style={{ marginBottom: '1rem' }}>Technical Skills</div>
                  {[
                    { label: 'React / Next.js', pct: 90 },
                    { label: 'Node.js / Express', pct: 75 },
                    { label: 'Python', pct: 70 },
                    { label: 'UI/UX & Figma', pct: 65 },
                    { label: 'DevOps / Docker', pct: 50 },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="sp-score-row">
                        <span className="sp-score-label">{s.label}</span>
                        <span className="sp-score-pct">{s.pct}%</span>
                      </div>
                      <div className="sp-score-bar"><div className="sp-score-fill" style={{ width: `${s.pct}%` }} /></div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'cv' && (
                <div className="cv-preview-tab">
                  <div className="sp-card-title" style={{ marginBottom: '1.5rem' }}>Curriculum Vitae</div>
                  <div className="cv-preview-placeholder">
                    <div className="cv-placeholder-img">📄</div>
                    <h3>CV_Amine_Khelifi_2026.pdf</h3>
                    <p>Verified by University of Alger 1</p>
                    <div className="cv-actions">
                      <button className="sp-btn-primary">View Full CV</button>
                      <button className="sp-btn-outline">Download PDF</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
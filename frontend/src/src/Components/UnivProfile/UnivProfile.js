import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './UnivProfile.css'

const UnivProfile = () => {
  const [activeTab, setActiveTab] = useState('about')
  const navigate = useNavigate()

  return (
    <div className="up-page">

      {/* ── Navbar ── */}
      <nav className="up-nav">
        <div className="up-nav-brand">
          <div className="up-nav-brand-dot">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="6" height="6" rx="1.5" fill="#fff" />
              <rect x="11" y="3" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".5" />
              <rect x="3" y="11" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".5" />
              <rect x="11" y="11" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".5" />
            </svg>
          </div>
          StageLink
        </div>
        <div className="up-nav-links">
          <Link to="/dashboard?tab=overview">Our Students</Link>
          <Link to="/dashboard?tab=stats">Company Partners</Link>
          <Link to="/messages">Messages <span style={{ background: '#212EA0', color: '#fff', borderRadius: '100px', fontSize: '10px', padding: '1px 7px', marginLeft: '4px' }}>1</span></Link>
        </div>
        <div className="up-nav-right">
          <button className="up-nav-msg-btn" onClick={() => navigate('/messages')}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 3h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="#212EA0" strokeWidth="1.4" />
              <path d="M2 3l6 5 6-5" stroke="#212EA0" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Broadcast
          </button>
          <div className="up-nav-avatar">UO</div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="up-body">

        {/* ── Left Panel ── */}
        <div className="up-left">

          {/* Profile card */}
          <div className="up-card up-profile-card">
            <div className="up-cover">
              <div className="up-cover-pattern" />
            </div>
            <div className="up-avatar-wrap">
              <div className="up-avatar">UO1</div>
            </div>
            <div className="up-name">Université Oran 1</div>
            <div className="up-role">Ahmed Ben Bella</div>
            <div className="up-location">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="#6b7280" strokeWidth="1.4" />
                <circle cx="8" cy="6" r="1.5" stroke="#6b7280" strokeWidth="1.4" />
              </svg>
              Oran, Algeria
            </div>
            <div className="up-stats-row">
              <div className="up-stat"><div className="up-stat-num">24K</div><div className="up-stat-label">Students</div></div>
              <div className="up-stat"><div className="up-stat-num">150+</div><div className="up-stat-label">Partners</div></div>
            </div>
          </div>

          {/* Top Departments */}
          <div className="up-card">
            <div className="up-card-inner">
              <div className="up-card-title">Top Departments</div>
              <div className="up-skill-list">
                {['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Languages'].map((s, i) => (
                  <span key={s} className={`up-skill-pill ${i > 3 ? 'gray' : ''}`}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="up-card">
            <div className="up-card-inner">
              <div className="up-card-title">Information</div>
              {[
                { lang: 'Website', level: 'univ-oran1.dz' },
                { lang: 'Established', level: '1961' },
                { lang: 'Type', level: 'Public' },
              ].map(l => (
                <div className="up-lang-row" key={l.lang}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{l.lang}</span>
                  <span className="up-lang-level">{l.level}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Panel ── */}
        <div className="up-right">

          {/* Top bar */}
          <div className="up-top-bar">
            <div className="up-top-info">
              <div className="up-top-name">Université Oran 1 - Ahmed Ben Bella</div>
              <div className="up-top-sub">
                Empowering the future generation of professionals
                <span className="up-badge available">✓ Accredited</span>
              </div>
            </div>
            <div className="up-action-btns">
              <button className="up-btn-outline" onClick={() => window.open('https://univ-oran1.dz', '_blank')}>View Site</button>
              <button className="up-btn-primary" onClick={() => navigate('/messages')}>
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
            <div className="up-tabs">
              {['about', 'programs', 'partners', 'alumni'].map(t => (
                <button
                  key={t}
                  className={`up-tab ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="up-tab-content">

              {activeTab === 'about' && (
                <>
                  <div className="up-card-title" style={{ marginBottom: '1rem' }}>Overview</div>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Université Oran 1 Ahmed Ben Bella is one of the most prominent multi-disciplinary universities in Algeria. Located in Oran, it has a rich history dating back to 1961. Today, it hosts thousands of students across highly-rated science, technology, and humanities faculties, acting as a major hub for research and innovation in the western region.
                  </p>
                  
                  <div className="up-contact-grid">
                    <div className="up-contact-item"><span className="up-contact-label">Rector</span><span className="up-contact-val">Prof. Name Surname</span></div>
                    <div className="up-contact-item"><span className="up-contact-label">Phone</span><span className="up-contact-val link">+213 41 51 00 00</span></div>
                    <div className="up-contact-item"><span className="up-contact-label">Email</span><span className="up-contact-val link">contact@univ-oran1.dz</span></div>
                    <div className="up-contact-item"><span className="up-contact-label">Address</span><span className="up-contact-val">Es Sénia, Oran 31000</span></div>
                  </div>

                  <div className="up-card-title" style={{ margin: '1.5rem 0 1rem' }}>Performance Metrics</div>
                  {[
                    { label: 'Internship Placement Rate', pct: 88 },
                    { label: 'Alumni Employment (1yr)', pct: 75 },
                    { label: 'Research Output & Grants', pct: 92 },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="up-score-row">
                        <span className="up-score-label">{s.label}</span>
                        <span className="up-score-pct">{s.pct}%</span>
                      </div>
                      <div className="up-score-bar"><div className="up-score-fill" style={{ width: `${s.pct}%` }} /></div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'programs' && (
                <>
                  {[
                    { icon: 'CS', title: 'Computer Science (Licence & Master)', type: 'Faculty of Exact and Applied Sciences', desc: 'Focuses on software engineering, AI, information systems, and networking. Highly recruited by tech companies.' },
                    { icon: 'MA', title: 'Mathematics', type: 'Faculty of Exact and Applied Sciences', desc: 'Prepares students for analytical roles, data science, and academia.' },
                    { icon: 'BI', title: 'Biotechnology', type: 'Faculty of Life & Nature Sciences', desc: 'Intensive lab research and industrial biology applications.' },
                  ].map(e => (
                    <div className="up-timeline-item" key={e.title}>
                      <div className="up-timeline-icon">{e.icon}</div>
                      <div className="up-timeline-info">
                        <div className="up-timeline-title">{e.title}</div>
                        <div className="up-timeline-sub">{e.type}</div>
                        <div className="up-timeline-desc">{e.desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'partners' && (
                <>
                   <div className="up-card-title" style={{ marginBottom: '1rem' }}>Key Industry Partners</div>
                   <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '1.5rem' }}>Companies that frequently hire our students and facilitate PFE opportunities.</p>
                   
                   {[
                    { icon: 'NT', title: 'NafTech Inc.', type: 'Technology & Software', desc: 'Hires 15+ students annually for Full Stack & Backend roles.' },
                    { icon: 'ST', title: 'Sonatrach', type: 'Energy & Oil', desc: 'Provides massive internship programs for engineering and tech students.' },
                    { icon: 'OR', title: 'Ooredoo Algeria', type: 'Telecommunications', desc: 'Frequent collaborator on networking and telecom PFEs.' },
                  ].map(e => (
                    <div className="up-timeline-item" key={e.title}>
                      <div className="up-timeline-icon" style={{ background: '#0f172a', color: '#fff' }}>{e.icon}</div>
                      <div className="up-timeline-info">
                        <div className="up-timeline-title">{e.title}</div>
                        <div className="up-timeline-sub">{e.type}</div>
                        <div className="up-timeline-desc">{e.desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'alumni' && (
                <>
                  {[
                    { name: 'K. Yassine', date: 'Class of 2022', role: 'Software Engineer at Google', desc: 'Graduated top of his class in Computer Science. Now working remotely on cloud infrastructure.' },
                    { name: 'S. Meriem', date: 'Class of 2021', role: 'Data Scientist at NafTech Inc.', desc: 'Completed her Master in Applied Math. Built an award-winning predictive model for her PFE.' },
                  ].map(r => (
                    <div className="up-timeline-item" key={r.name}>
                      <div className="up-timeline-icon" style={{ background: '#f4f4f5', color: '#0a0a0a' }}>{r.name.charAt(0)}</div>
                      <div className="up-timeline-info">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>{r.name}</span>
                            <span style={{ fontSize: '11px', color: 'var(--gray)' }}>{r.date}</span>
                        </div>
                        <div className="up-timeline-sub">{r.role}</div>
                        <div className="up-timeline-desc">"{r.desc}"</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnivProfile

import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import StudentSidebar from '../UnifiedLayouts/StudentSidebar'
import './StudentDash.css'

const matches = [
  { initials: 'SO', color: 'blue', title: 'Frontend Intern', company: 'Sonatrach Digital', location: 'Alger', tags: ['React', 'TypeScript'], type: 'Présentiel', score: 94 },
  { initials: 'NF', color: 'teal', title: 'Full Stack Intern', company: 'NafTech', location: 'Oran', tags: ['Node.js', 'MongoDB'], type: 'Hybride', score: 88 },
  { initials: 'DZ', color: 'purple', title: 'Data Science Intern', company: 'DZTech', location: 'Constantine', tags: ['Python', 'Pandas'], type: 'Distanciel', score: 81 },
]

const applications = [
  { title: 'Frontend Intern', company: 'Sonatrach Digital', status: 'pending' },
  { title: 'Backend Intern', company: 'Mobilis', status: 'accepted' },
  { title: 'UI/UX Intern', company: 'Djezzy Labs', status: 'refused' },
  { title: 'DevOps Intern', company: 'Ooredoo Tech', status: 'pending' },
]

const statusLabel = { pending: 'Pending', accepted: 'Accepted', refused: 'Refused' }

const StudentDashboard = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(searchParams.get('tab') || 'overview')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveNav(tab)
  }, [searchParams])

  return (
    <div className="db">
      <StudentSidebar />

      <main className="main">
        <div className="topbar">
          <div className="page-title">Hi, Student</div>
          <div className="topbar-right">
            <div className="icon-btn">
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="icon-btn">
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M8 2a5 5 0 015 5v2l1 2H2l1-2V7a5 5 0 015-5zM6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="user-chip" onClick={() => navigate('/my-profile')}>
              <div className="user-av">AK</div>
              <span className="user-name">Amine K.</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5l3 3 3-3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: 'Applications', val: 7, tag: '+2 this week', tagClass: 'tg' },
            { label: 'AI Matches', val: 24, tag: 'Updated today', tagClass: 'tb' },
            { label: 'Accepted', val: 1, tag: 'Convention pending', tagClass: 'ta' },
          ].map((s, i) => (
            <div className="stat-card white" key={i}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-val">{s.val}</div>
              <div className={`stat-tag ${s.tagClass}`}>{s.tag}</div>
            </div>
          ))}
        </div>

        {/* Asset cards */}
        <div className="grid-assets">
          <div className="asset-card blue">
            <div className="asset-title">React · Node.js</div>
            <div className="asset-sub">Top matched skills</div>
            <div className="asset-bottom">
              <div className="asset-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="3" stroke="#212EA0" strokeWidth="1.5" />
                  <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7" stroke="#212EA0" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="asset-pct pct-blue">94% match</span>
            </div>
          </div>
          <div className="asset-card green">
            <div className="asset-title">3 universities</div>
            <div className="asset-sub">Network validated</div>
            <div className="asset-bottom">
              <div className="asset-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L2 6l7 4 7-4-7-4z" stroke="#0F6E56" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M2 11l7 4 7-4" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="asset-pct pct-green">+12 new</span>
            </div>
          </div>
          <div className="asset-card amber" onClick={() => navigate('/cv-builder')} style={{ cursor: 'pointer' }}>
            <div className="asset-title">CV Builder</div>
            <div className="asset-sub">Free · 5 min setup</div>
            <div className="asset-bottom">
              <div className="asset-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="4" y="2" width="10" height="14" rx="2" stroke="#854F0B" strokeWidth="1.5" />
                  <path d="M7 6h4M7 9h4M7 12h2" stroke="#854F0B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="asset-pct pct-amber">78% done</span>
            </div>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="bottom-grid">
          {/* Matches */}
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">Top matches for you</span>
              <button className="sec-link">See all →</button>
            </div>
            {matches.map((m, i) => (
              <div className="match-item" key={i}>
                <div className={`co-av ${m.color}`}>{m.initials}</div>
                <div className="match-info">
                  <div className="match-title">{m.title}</div>
                  <div className="match-company">{m.company} — {m.location}</div>
                  <div className="match-tags">
                    {m.tags.map(t => (
                      <span key={t} className={`pill pill-${m.color}`}>{t}</span>
                    ))}
                    <span className="pill pill-gray">{m.type}</span>
                  </div>
                </div>
                <div className="match-score">{m.score}%</div>
              </div>
            ))}
          </div>

          {/* Applications */}
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">My applications</span>
              <button className="sec-link">View all →</button>
            </div>
            {applications.map((a, i) => (
              <div className="app-item" key={i}>
                <div>
                  <div className="app-name">{a.title}</div>
                  <div className="app-co">{a.company}</div>
                </div>
                <span className={`status s-${a.status}`}>{statusLabel[a.status]}</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
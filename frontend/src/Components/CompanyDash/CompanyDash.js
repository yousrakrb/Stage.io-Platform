// CompanyDash.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import CompanySidebar from '../UnifiedLayouts/CompanySidebar'
import './CompanyDash.css'

const offers = [
  { initials: 'FS', color: 'blue', title: 'Full Stack Intern', location: 'Oran · Hybride', tags: ['React', 'Node.js'], tagColor: ['blue', 'teal'], count: 14, open: true, deadline: 'May 15, 2026' },
  { initials: 'BE', color: 'teal', title: 'Backend Intern', location: 'Oran · Présentiel', tags: ['Django', 'PostgreSQL'], tagColor: ['teal', 'gray'], count: 9, open: true, deadline: 'May 20, 2026' },
  { initials: 'DS', color: 'amber', title: 'Data Analyst Intern', location: 'Alger · Distanciel', tags: ['Python', 'Pandas'], tagColor: ['gray', 'gray'], count: 15, open: false, deadline: 'Closed' },
]

const candidates = [
  { initials: 'AK', color: 'blue', name: 'Amine Khelifi', uni: 'Univ. Alger · L3 Info', skills: ['React', 'Git'], skillColors: ['blue', 'gray'], score: 94, status: 'new', email: 'amine.k@email.com', phone: '0555 12 34 56' },
  { initials: 'SR', color: 'teal', name: 'Sara Rahmani', uni: 'USTHB · M1 GL', skills: ['Node.js', 'Docker'], skillColors: ['teal', 'gray'], score: 87, status: 'new', email: 's.rahmani@email.com', phone: '0777 98 76 54' },
  { initials: 'YB', color: 'amber', name: 'Yacine Belkacem', uni: 'ESI · L3 Sécurité', skills: ['Python', 'Cybersec'], skillColors: ['gray', 'purple'], score: 79, status: 'view', email: 'yacine.b@email.com', phone: '0666 45 67 89' },
]

const accepted = [
  { initials: 'LM', color: 'blue', name: 'Lina Mansouri', role: 'Full Stack Intern', status: 'accepted', startDate: 'July 1, 2026', mentor: 'Dr. Karim' },
  { initials: 'KD', color: 'teal', name: 'Karim Djebbar', role: 'Backend Intern', status: 'accepted', startDate: 'July 15, 2026', mentor: 'Sarah L.' },
  { initials: 'NB', color: 'amber', name: 'Nadia Bouchenak', role: 'Data Intern', status: 'pending', startDate: 'TBD', mentor: 'Unassigned' },
]

const tagColorMap = { blue: 'pb', teal: 'pt', gray: 'pg', purple: 'ppu', amber: 'pa' }
const avColorMap = { blue: 'av-blue', teal: 'av-teal', amber: 'av-amber' }

const CompanyDashboard = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(searchParams.get('tab') || 'overview')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveNav(tab)
  }, [searchParams])

  return (
    <div className="db">
      <CompanySidebar />

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="page-title">Hi, Company</div>
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
            <div className="user-chip" onClick={() => navigate('/company-profile-edit')} style={{ cursor: 'pointer' }}>
              <div className="user-av">NT</div>
              <span className="user-name">NafTech Inc.</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5l3 3 3-3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Overview Tab - Restored original layout */}
        {activeNav === 'overview' && (
          <>
            <div className="stats-row">
              {[
                { label: 'Active offers', val: 4, tag: '2 closing soon', cls: 'tb' },
                { label: 'Total applicants', val: 38, tag: '+12 this week', cls: 'tg' },
                { label: 'Accepted', val: 5, tag: 'Awaiting admin', cls: 'ta' },
              ].map((s, i) => (
                <div className="stat-card white" key={i}>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-val">{s.val}</div>
                  <div className={`stat-tag ${s.cls}`}>{s.tag}</div>
                </div>
              ))}
            </div>

            <div className="grid2">
              <div className="card">
                <div className="sec-head">
                  <span className="sec-title">My internship offers</span>
                  <button className="sec-btn" onClick={() => navigate('/add-offer')}>+ New offer</button>
                </div>
                {offers.map((o, i) => (
                  <div className="offer-row" key={i}>
                    <div className={`offer-av ${avColorMap[o.color]}`}>{o.initials}</div>
                    <div className="offer-info">
                      <div className="offer-title">{o.title}</div>
                      <div className="offer-meta">{o.location}</div>
                      <div className="offer-tags">
                        {o.tags.map((t, j) => (
                          <span key={t} className={`pill ${tagColorMap[o.tagColor[j]]}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="offer-count">
                      <div className="count-num">{o.count}</div>
                      <div className="count-label">applicants</div>
                      <div className="active-ind">
                        <div className={o.open ? 'dot-green' : 'dot-gray'} />
                        <span className={o.open ? 'ind-open' : 'ind-closed'}>{o.open ? 'Open' : 'Closed'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="sec-head">
                  <span className="sec-title">New candidates</span>
                  <button className="sec-link">View all →</button>
                </div>
                {candidates.map((c, i) => (
                  <div className="cand-row" key={i}>
                    <div className={`cand-av ${avColorMap[c.color]}`}>{c.initials}</div>
                    <div className="cand-info">
                      <div className="cand-name">{c.name}</div>
                      <div className="cand-uni">{c.uni}</div>
                      <div className="cand-skills">
                        {c.skills.map((s, j) => (
                          <span key={s} className={`pill ${tagColorMap[c.skillColors[j]]}`}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="match-bar">
                      <div className="bar-wrap">
                        <div className="bar-fill" style={{ width: `${c.score}%` }} />
                      </div>
                      <span className="bar-pct">{c.score}%</span>
                    </div>
                    <div className="action-btns">
                      {c.status === 'new' ? (
                        <>
                          <button className="btn-accept">Accept</button>
                          <button className="btn-refuse">Refuse</button>
                        </>
                      ) : (
                        <button className="btn-view">View CV</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid3">
              <div className="card">
                <div className="sec-head">
                  <span className="sec-title">Accepted candidates</span>
                  <button className="sec-link">See all →</button>
                </div>
                {accepted.map((a, i) => (
                  <div className="cand-row" key={i}>
                    <div className={`cand-av ${avColorMap[a.color]}`}>{a.initials}</div>
                    <div className="cand-info">
                      <div className="cand-name">{a.name}</div>
                      <div className="cand-uni">{a.role}</div>
                    </div>
                    <span className={`status ${a.status === 'accepted' ? 's-accepted' : 's-pending'}`}>
                      {a.status === 'accepted' ? 'Accepted' : 'Conv. pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Offers Tab - Elaborated View */}
        {activeNav === 'offers' && (
          <div className="elaborated-view">
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="sec-head" style={{ marginBottom: '1.5rem' }}>
                <span className="sec-title">Manage Internship Offers</span>
                <button className="sec-btn" onClick={() => navigate('/add-offer')} style={{ padding: '8px 16px', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Create New Offer</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', color: 'var(--gray)' }}>
                      <th style={{ padding: '12px 8px', fontWeight: '500' }}>Position</th>
                      <th style={{ padding: '12px 8px', fontWeight: '500' }}>Location</th>
                      <th style={{ padding: '12px 8px', fontWeight: '500' }}>Applicants</th>
                      <th style={{ padding: '12px 8px', fontWeight: '500' }}>Deadline</th>
                      <th style={{ padding: '12px 8px', fontWeight: '500' }}>Status</th>
                      <th style={{ padding: '12px 8px', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((o, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '12px 8px' }}>
                          <div className="offer-title">{o.title}</div>
                          <div className="offer-tags" style={{ marginTop: '6px' }}>
                            {o.tags.map((t, j) => <span key={t} className={`pill ${tagColorMap[o.tagColor[j]]}`}>{t}</span>)}
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--gray)', fontSize: '0.9rem' }}>{o.location}</td>
                        <td style={{ padding: '12px 8px' }}><strong>{o.count}</strong></td>
                        <td style={{ padding: '12px 8px', color: 'var(--gray)', fontSize: '0.9rem' }}>{o.deadline}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className={o.open ? 'ind-open' : 'ind-closed'} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', background: o.open ? '#e6f4ea' : '#f1f3f4', color: o.open ? '#137333' : '#5f6368' }}>
                            {o.open ? 'Accepting' : 'Closed'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <button style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Edit Offer</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid2">
              <div className="card">
                <div className="sec-head" style={{ marginBottom: '1.5rem' }}>
                  <span className="sec-title">Candidate Details</span>
                </div>
                {candidates.map((c, i) => (
                  <div className="cand-row" key={i} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div className={`cand-av ${avColorMap[c.color]}`}>{c.initials}</div>
                    <div className="cand-info" style={{ flex: 1 }}>
                      <div className="cand-name">{c.name}</div>
                      <div className="cand-uni" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{c.uni}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '6px' }}>
                        <div>📧 {c.email}</div>
                        <div>📞 {c.phone}</div>
                      </div>
                      <div className="cand-skills">
                        {c.skills.map((s, j) => (
                          <span key={s} className={`pill ${tagColorMap[c.skillColors[j]]}`}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="action-btns" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button className="btn-view" style={{ width: '100%' }}>Download CV</button>
                      <button className="btn-accept" style={{ width: '100%' }}>Schedule Interview</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="sec-head" style={{ marginBottom: '1.5rem' }}>
                  <span className="sec-title">Onboarding Tracking</span>
                </div>
                {accepted.map((a, i) => (
                  <div className="cand-row" key={i} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div className={`cand-av ${avColorMap[a.color]}`}>{a.initials}</div>
                    <div className="cand-info" style={{ flex: 1 }}>
                      <div className="cand-name">{a.name}</div>
                      <div className="cand-uni" style={{ fontWeight: '500', color: 'var(--dark)' }}>{a.role}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '8px' }}>
                        <div><strong>Start Date:</strong> {a.startDate}</div>
                        <div><strong>Mentor:</strong> {a.mentor}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`status ${a.status === 'accepted' ? 's-accepted' : 's-pending'}`} style={{ display: 'inline-block', marginBottom: '8px' }}>
                        {a.status === 'accepted' ? 'Contract Signed' : 'Pending Docs'}
                      </span>
                      <br />
                      <button style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>Manage Onboarding</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


      </main>
    </div>
  )
}

export default CompanyDashboard
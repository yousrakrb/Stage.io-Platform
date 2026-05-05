// UnivDash.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import UnivSidebar from '../UnifiedLayouts/UnivSidebar'
import { getPendingApplications, validateApplication, getApplicationStats } from '../../api'
import './UnivDash.css'



const conventions = [
  { name: 'Convention_Khelifi_Sonatrach.pdf', date: 'Generated 12 Apr 2025 · Signed' },
  { name: 'Convention_Rahmani_NafTech.pdf', date: 'Generated 10 Apr 2025 · Signed' },
  { name: 'Convention_Mansouri_Mobilis.pdf', date: 'Generated 8 Apr 2025 · Awaiting signature' },
  { name: 'Convention_Belkacem_DZTech.pdf', date: 'Generated 5 Apr 2025 · Signed' },
]

const validated = [
  { initials: 'LM', color: 'blue', name: 'Lina Mansouri', role: 'Backend Intern @ Mobilis', status: 'validated' },
  { initials: 'KD', color: 'teal', name: 'Karim Djebbar', role: 'DevOps Intern @ Ooredoo', status: 'validated' },
  { initials: 'NB', color: 'amber', name: 'Nadia Bouchenak', role: 'Data Intern @ Condor', status: 'review' },
]

const avMap = { blue: 'av-blue', teal: 'av-teal', purple: 'av-purple', amber: 'av-amber' }

const UnivDashboard = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(searchParams.get('tab') || 'overview')
  
  const [pendingList, setPendingList] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [pendingData, statsData] = await Promise.all([
        getPendingApplications(),
        getApplicationStats()
      ])
      setPendingList(pendingData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching university data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveNav(tab)
  }, [searchParams])

  const handleValidate = async (appId) => {
    try {
      await validateApplication(appId, { status: 'validated' })
      setPendingList(prev => prev.filter(app => app.id !== appId))
    } catch (err) {
      alert('Failed to validate application.')
    }
  }

  const handleReject = async (appId) => {
    try {
      await validateApplication(appId, { status: 'rejected' })
      setPendingList(prev => prev.filter(app => app.id !== appId))
    } catch (err) {
      alert('Failed to reject application.')
    }
  }

  return (
    <div className="db">
      <UnivSidebar />

      <main className="main">
        <div className="topbar">
          <div className="page-title"> Hi, University</div>
          <div className="topbar-right">
            <div className="icon-btn notif-btn">
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M8 2a5 5 0 015 5v2l1 2H2l1-2V7a5 5 0 015-5zM6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="notif-dot" />
            </div>
            <div className="user-chip" onClick={() => navigate('/univ-profile')}>
              <div className="user-av">DH</div>
              <span className="user-name">Dept. Head</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5l3 3 3-3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stats-row">
          {[
            { label: 'Students placed', val: 127, tag: 'Out of 310 total', cls: '', dark: true },
            { label: 'Pending validation', val: pendingList.length, tag: 'Needs action', cls: 'tr', dark: false },
            { label: 'Conventions generated', val: 118, tag: '+6 this week', cls: 'tg', dark: false },
            { label: 'Partner companies', val: 43, tag: '+3 new', cls: 'tb', dark: false },
          ].map((s, i) => (
            <div className={`stat-card ${s.dark ? 'blue' : 'white'}`} key={i}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-val">{s.val}</div>
              <div className={`stat-tag ${s.cls}`}>{s.tag}</div>
            </div>
          ))}
        </div>

        <div className="grid2">
          {/* Pending validations */}
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">Pending validations</span>
              <span className="badge-warn">{pendingList.length} pending</span>
            </div>
            {loading ? <p style={{fontSize:'13px', color:'#6b7280'}}>Loading pending applications...</p> : null}
            {pendingList.length === 0 && !loading && (
              <p className="empty-msg">All validations complete ✓</p>
            )}
            {pendingList.map((p, i) => {
              const studentName = p.student?.full_name || 'Student';
              const initials = studentName.substring(0, 2).toUpperCase();
              const colorKeys = ['blue', 'teal', 'purple', 'amber'];
              const colorObj = colorKeys[p.id % colorKeys.length];
              const companyName = p.offer?.company?.company_name || 'Company';
              const offerTitle = p.offer?.title || 'Offer';
              const detail = `${p.offer?.location || 'Alger'} · ${p.offer?.work_model || 'Présentiel'} · ${p.offer?.duration || 3} months`;

              return (
                <div className="val-row" key={p.id}>
                  <div className={`val-av av-${colorObj}`}>{initials}</div>
                  <div className="val-info">
                    <div className="val-name">{studentName}</div>
                    <div className="val-company">{offerTitle} @ {companyName}</div>
                    <div className="val-detail">{detail}</div>
                  </div>
                  <div className="val-actions">
                    <button className="btn-validate" onClick={() => handleValidate(p.id)}>Validate</button>
                    <button className="btn-reject" onClick={() => handleReject(p.id)}>Reject</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conventions */}
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">Recent conventions (PDF)</span>
              <button className="sec-link">See all →</button>
            </div>
            {conventions.map((c, i) => (
              <div className="doc-row" key={i}>
                <div className="doc-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="1" width="10" height="14" rx="2" stroke="#212EA0" strokeWidth="1.5" />
                    <path d="M5.5 5h5M5.5 8h5M5.5 11h3" stroke="#212EA0" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="doc-info">
                  <div className="doc-name">{c.name}</div>
                  <div className="doc-meta">{c.date}</div>
                </div>
                <button className="doc-dl">↓ PDF</button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid3">
          {/* Validated */}
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">Validated internships</span>
              <button className="sec-link">Export →</button>
            </div>
            {validated.map((v, i) => (
              <div className="val-row" key={i}>
                <div className={`val-av ${avMap[v.color]}`}>{v.initials}</div>
                <div className="val-info">
                  <div className="val-name">{v.name}</div>
                  <div className="val-company">{v.role}</div>
                </div>
                <span className={`status ${v.status === 'validated' ? 's-validated' : 's-review'}`}>
                  {v.status === 'validated' ? 'Validated' : 'In review'}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="card">
            <div className="sec-head"><span className="sec-title">Placement statistics</span></div>
            {[
              { label: 'Placed students', val: '127 / 310', pct: 41, color: 'blue' },
              { label: 'Conventions signed', val: '118 / 127', pct: 93, color: 'green' },
              { label: 'Companies active', val: '43 / 60', pct: 72, color: 'amber' },
            ].map((b, i) => (
              <div className="stat-bar-wrap" key={i}>
                <div className="stat-bar-label">
                  <span className="sbl-text">{b.label}</span>
                  <span className="sbl-val">{b.val}</span>
                </div>
                <div className="bar-track">
                  <div className={`bar-fill-${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="mini-stats">
              <div><div className="mini-label">Unplaced</div><div className="mini-val red">183</div></div>
              <div><div className="mini-label">Placement rate</div><div className="mini-val blue">41%</div></div>
            </div>
          </div>

         
        </div>
      </main>
    </div>
  )
}

export default UnivDashboard
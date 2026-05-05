import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import { getOffers, getMyApplications as getStudentApplications, applyToOffer, getNotifications, markNotificationRead } from '../../api'
import StudentSidebar from '../UnifiedLayouts/StudentSidebar'
import './StudentDash.css'

const statusLabel = { pending: 'Pending', accepted: 'Accepted', refused: 'Refused', new: 'Pending' }

const StudentDashboard = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState(searchParams.get('tab') || 'overview')
  
  const [matches, setMatches] = useState([])
  const [applications, setApplications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(true)
  const notifRef = useRef(null)

  // Generate initials and first name
  const nameParts = user?.name ? user.name.split(' ') : ['Student']
  const firstName = nameParts[0]
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : firstName[0]?.toUpperCase() || 'S'

  const fetchData = async () => {
    try {
      const [offersData, appsData, notifData] = await Promise.all([
        getOffers(),
        getStudentApplications(),
        getNotifications()
      ])
      // Only show active offers
      setMatches(offersData.filter(o => o.is_active !== false).slice(0, 5))
      setApplications(appsData)
      setNotifications(notifData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle click outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveNav(tab)
  }, [searchParams])

  useEffect(() => {
    fetchData()
  }, [])

  const handleApply = async (offerId) => {
    try {
      await applyToOffer(offerId)
      alert('Applied successfully!')
      fetchData() // Refresh list to show new application
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply. You may have already applied.')
    }
  }

  const handleReadNotification = async (notifId) => {
    try {
      await markNotificationRead(notifId)
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, is_read: true } : n))
    } catch (err) {
      console.error('Failed to mark read', err)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="db">
      <StudentSidebar />

      <main className="main">
        <div className="topbar">
          <div className="page-title">Hi, {firstName}</div>
          <div className="topbar-right">
            <div className="icon-btn" onClick={() => navigate('/messages')}>
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M2 3h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 3l6 5 6-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="icon-btn" style={{ position: 'relative' }} ref={notifRef} onClick={() => setShowNotifications(!showNotifications)}>
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M8 2a5 5 0 015 5v2l1 2H2l1-2V7a5 5 0 015-5zM6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'red', color: 'white', borderRadius: '50%', width: '14px', height: '14px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
              
              {showNotifications && (
                <div style={{ position: 'absolute', top: '35px', right: '0', background: 'white', width: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '14px' }}>Notifications</div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} onClick={(e) => { e.stopPropagation(); handleReadNotification(n.id); }} style={{ padding: '12px 16px', borderBottom: '1px solid #f5f5f5', background: n.is_read ? 'white' : '#f0f4ff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '13px', color: '#111' }}>{n.message}</span>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>{new Date(n.created_at).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="user-chip" onClick={() => navigate('/my-profile')}>
              <div className="user-av">{initials}</div>
              <span className="user-name">{user?.name || 'Student'}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5l3 3 3-3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: 'Applications', val: applications.length, tag: 'Total applied', tagClass: 'tg' },
            { label: 'Available Offers', val: matches.length, tag: 'Active now', tagClass: 'tb' },
            { label: 'Accepted', val: applications.filter(a => a.status === 'accepted').length, tag: 'Convention pending', tagClass: 'ta' },
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
              <button className="sec-link" onClick={() => navigate('/student-offers')}>See all →</button>
            </div>
            {loading ? <p style={{fontSize:'13px', color:'#6b7280'}}>Loading offers...</p> : null}
            {matches.length === 0 && !loading ? <p style={{fontSize:'13px', color:'#6b7280'}}>No active offers available.</p> : null}
            {matches.map((m, i) => {
              const initials = m.title ? m.title.substring(0, 2).toUpperCase() : 'OF';
              const colorKeys = ['blue', 'teal', 'amber', 'purple'];
              const colorObj = colorKeys[m.id % colorKeys.length];
              const isApplied = applications.some(a => a.offer?.id === m.id || a.offer_id === m.id);

              return (
                <div className="match-item" key={m.id}>
                  <div className={`co-av av-${colorObj}`}>{initials}</div>
                  <div className="match-info">
                    <div className="match-title">{m.title}</div>
                    <div className="match-company">{m.company?.company_name || 'Company'} — {m.location || m.work_model || 'Anywhere'}</div>
                    <div className="match-tags" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {m.tags && m.tags.slice(0,2).map((t, idx) => {
                        const tName = typeof t === 'string' ? t : t.name;
                        return <span key={idx} className={`pill pill-${colorObj}`}>{tName}</span>
                      })}
                      <span className="pill pill-gray">{m.work_model || 'Hybrid'}</span>
                    </div>
                  </div>
                  <div>
                    {isApplied ? (
                      <span style={{ fontSize: '12px', color: '#0F6E56', fontWeight: '500' }}>Applied ✓</span>
                    ) : (
                      <button 
                        onClick={() => handleApply(m.id)}
                        style={{ background: '#212EA0', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Applications */}
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">My applications</span>
              <button className="sec-link" onClick={() => navigate('/student-applications')}>View all →</button>
            </div>
            {loading ? <p style={{fontSize:'13px', color:'#6b7280'}}>Loading applications...</p> : null}
            {applications.length === 0 && !loading ? <p style={{fontSize:'13px', color:'#6b7280'}}>You haven't applied to any offers yet.</p> : null}
            {applications.slice(0, 5).map((a, i) => (
              <div className="app-item" key={a.id || i}>
                <div>
                  <div className="app-name">{a.offer?.title || 'Unknown Offer'}</div>
                  <div className="app-co">{a.offer?.company?.company_name || 'Company'}</div>
                </div>
                <span className={`status s-${a.status}`}>{statusLabel[a.status] || a.status}</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
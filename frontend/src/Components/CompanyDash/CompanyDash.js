import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getNotifications, markNotificationRead, getCompanyProfile, getMyOffers, getCompanyApplications, deleteOffer } from '../../api'
import CompanySidebar from '../UnifiedLayouts/CompanySidebar'
import './CompanyDash.css'

const statusColorMap = {
  pending: 's-pending',
  accepted: 's-accepted',
  refused: 's-refused',
  validated: 's-validated'
}

const CompanyDashboard = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(searchParams.get('tab') || 'overview')
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [profile, setProfile] = useState(null)
  const [companyOffers, setCompanyOffers] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const notifRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, notifData, offersData, appsData] = await Promise.all([
          getCompanyProfile(),
          getNotifications(),
          getMyOffers(),
          getCompanyApplications()
        ])
        setProfile(profileData)
        setNotifications(notifData)
        setCompanyOffers(offersData)
        setApplications(appsData)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  const handleNotificationClick = async (n) => {
    try {
      if (!n.is_read) {
        await markNotificationRead(n.id)
        setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, is_read: true } : notif))
      }
      
      // Routing logic based on Fix 6
      switch(n.type) {
        case 'new_application':
          navigate('/candidates');
          break;
        case 'pending_validation':
          navigate('/univ-validations'); // Or relevant page
          break;
        case 'validated':
        case 'refused':
          navigate('/student-applications');
          break;
        case 'new_offer':
          navigate('/student-offers');
          break;
        default:
          console.log('Unknown notification type:', n.type);
      }
    } catch (err) {
      console.error('Failed to handle notification click', err)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveNav(tab)
  }, [searchParams])

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f0f2ff' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #212EA0', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteOffer(offerId);
      setCompanyOffers(companyOffers.filter(o => o.id !== offerId));
      alert('Offer deleted successfully!');
    } catch (err) {
      console.error('Failed to delete offer', err);
      alert('Failed to delete offer.');
    }
  };

  const initials = profile?.company_name ? profile.company_name.charAt(0).toUpperCase() : 'C';

  return (
    <div className="db">
      <CompanySidebar />

      <main className="main">
        <div className="topbar">
          <div className="page-title">Hi, {profile?.company_name || 'Company'}</div>
          <div className="topbar-right">
            <div className="icon-btn" onClick={() => navigate('/messages')}>
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
                        <div key={n.id} onClick={(e) => { e.stopPropagation(); handleNotificationClick(n); }} style={{ padding: '12px 16px', borderBottom: '1px solid #f5f5f5', background: n.is_read ? 'white' : '#f0f4ff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '13px', color: '#111' }}>{n.message}</span>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>{new Date(n.created_at).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Re-added Profile Button/Avatar (Fix 5) */}
            <div className="user-chip" onClick={() => navigate('/company-profile')} style={{ cursor: 'pointer' }}>
              <div className="user-av">
                {profile?.logo_url ? (
                  <img src={`http://127.0.0.1:8000${profile.logo_url}`} alt="Logo" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
                ) : initials}
              </div>
              <span className="user-name">{profile?.company_name || 'My Company'}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5l3 3 3-3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeNav === 'overview' && (
          <>
            <div className="stats-row">
              {[
                { label: 'Active offers', val: companyOffers.length, tag: 'Managed by you', cls: 'tb' },
                { label: 'Total applicants', val: applications.length, tag: 'Candidates in pool', cls: 'tg' },
                { label: 'Accepted', val: applications.filter(a => ['accepted', 'validated'].includes(a.status)).length, tag: 'Awaiting placement', cls: 'ta' },
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
                {companyOffers.length === 0 ? (
                  <div style={{padding:'20px', textAlign:'center', color:'#6b7280'}}>No offers published yet.</div>
                ) : companyOffers.slice(0, 3).map((o, i) => {
                  const applicantCount = applications.filter(a => String(a.offer_id) === String(o.id)).length;
                  return (
                    <div className="offer-row" key={i}>
                      <div className="offer-av av-blue">{o.title.charAt(0)}</div>
                      <div className="offer-info">
                        <div className="offer-title">{o.title}</div>
                        <div className="offer-meta">{o.wilaya} · {o.type}</div>
                        <div className="offer-tags">
                          {(o.required_skills || []).map((t, j) => (
                            <span key={j} className="pill pb">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="offer-count">
                        <div className="count-num">{applicantCount}</div>
                        <div className="count-label">applicants</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card">
                <div className="sec-head">
                  <span className="sec-title">New candidates</span>
                  <button className="sec-link" onClick={() => navigate('/candidates')}>View all →</button>
                </div>
                {applications.length === 0 ? (
                  <div style={{padding:'20px', textAlign:'center', color:'#6b7280'}}>No candidates yet.</div>
                ) : (
                  applications.slice(0, 3).map((app, i) => (
                    <div className="cand-row" key={i}>
                      <div className="cand-av av-blue" style={{ background: '#dce0f8', color: '#212EA0' }}>
                        {app.student_name ? app.student_name.charAt(0) : 'S'}
                      </div>
                      <div className="cand-info">
                        <div className="cand-name" 
                             onClick={() => navigate(`/student-profile/${app.student_id}`)} 
                             style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                          {app.student_name}
                        </div>
                        <div className="cand-uni">{app.offer_title}</div>
                      </div>
                      <span className={`status ${statusColorMap[app.status] || 's-pending'}`}>
                        {app.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Offers Tab */}
        {activeNav === 'offers' && (
          <div className="elaborated-view">
             <div className="card">
                <div className="sec-head">
                  <span className="sec-title">Manage All Offers</span>
                  <button className="sec-btn" onClick={() => navigate('/add-offer')}>+ Create New Offer</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#6b7280' }}>
                      <th style={{ padding: '12px' }}>Offer Title</th>
                      <th style={{ padding: '12px' }}>Location</th>
                      <th style={{ padding: '12px' }}>Duration</th>
                      <th style={{ padding: '12px' }}>Applicants</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyOffers.map((o, i) => {
                      const appCount = applications.filter(a => String(a.offer_id) === String(o.id)).length;
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                          <td style={{ padding: '12px', fontWeight: '500' }}>{o.title}</td>
                          <td style={{ padding: '12px' }}>{o.wilaya}</td>
                          <td style={{ padding: '12px' }}>{o.duration} months</td>
                          <td style={{ padding: '12px' }}>{appCount}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            {/* Fix 2: Navigate to Edit Offer page */}
                            <button className="sec-link" style={{ marginRight: '12px' }} onClick={() => navigate(`/add-offer?edit=${o.id}`)}>Edit</button>
                            {/* Fix 1: Delete Offer Functionality */}
                            <button className="sec-link" style={{ color: '#ef4444' }} onClick={() => handleDeleteOffer(o.id)}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CompanyDashboard
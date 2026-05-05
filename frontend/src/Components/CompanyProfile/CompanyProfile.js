import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { getCompanyProfile, getPublicCompanyProfile, followCompany, unfollowCompany, checkFollowStatus } from '../../api'
import CompanySidebar from '../UnifiedLayouts/CompanySidebar'
import StudentSidebar from '../UnifiedLayouts/StudentSidebar'
import '../CompanyDash/CompanyDash.css'
import './CompanyProfile.css'

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('about')
  const navigate = useNavigate()
  const { id: pathId } = useParams()
  const [searchParams] = useSearchParams()
  const companyId = pathId || searchParams.get('id')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const userRole = localStorage.getItem('role')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        let data
        if (companyId) {
          data = await getPublicCompanyProfile(companyId)
          // Also check follow status if logged in
          if (localStorage.getItem('access_token')) {
            const status = await checkFollowStatus(companyId)
            setIsFollowing(status.is_following)
          }
        } else {
          data = await getCompanyProfile()
        }
        setProfile(data)
      } catch (err) {
        console.error('Error fetching company profile:', err)
        setError('Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [companyId])

  const handleFollow = async () => {
    if (!companyId) return
    try {
      if (isFollowing) {
        await unfollowCompany(companyId)
        setIsFollowing(false)
      } else {
        await followCompany(companyId)
        setIsFollowing(true)
      }
    } catch (err) {
      alert('Failed to update follow status')
    }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>
  if (!profile) return null

  // Determine display name
  const displayName = profile.company_name || profile.full_name || 'Company'

  return (
    <div className="db">
      {userRole === 'student' ? <StudentSidebar /> : <CompanySidebar />}

      <div style={{ flex: 1, minHeight: '100vh', overflowY: 'auto', background: '#f0f2ff' }}>

        <div className="cp-page" style={{ minHeight: '100vh' }}>

          {/* ── Body ── */}
          <div className="cp-body">

            {/* ── Left Panel ── */}
            <div className="cp-left">

              {/* Core Tech Stack */}
              <div className="cp-card">
                <div className="cp-card-inner">
                  <div className="cp-card-title">Industry / Domains</div>
                  <div className="cp-skill-list">
                    {profile.industry ? (
                      profile.industry.split(',').map((s, i) => (
                        <span key={i} className="cp-skill-pill">{s.trim()}</span>
                      ))
                    ) : (
                      <span className="cp-skill-pill gray">No industry set</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Links & Socials */}
              <div className="cp-card">
                <div className="cp-card-inner">
                  <div className="cp-card-title">Links</div>
                  <div className="cp-lang-row">
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Website</span>
                    <span className="cp-lang-level">{profile.website || 'Not set'}</span>
                  </div>
                  <div className="cp-lang-row">
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Email</span>
                    <span className="cp-lang-level">{profile.email}</span>
                  </div>
                  <div className="cp-lang-row">
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Wilaya</span>
                    <span className="cp-lang-level">{profile.wilaya || 'Not set'}</span>
                  </div>
                </div>
              </div>

            </div>{/* end cp-left */}

            {/* ── Right Panel ── */}
            <div className="cp-right">

              {/* Top bar */}
              <div className="cp-top-bar">
                <div className="cp-top-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {profile.logo_url && (
                    <img src={`http://127.0.0.1:8000${profile.logo_url}`} alt="Logo" style={{width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover'}} />
                  )}
                  <div>
                    <div className="cp-top-name">{displayName}</div>
                    <div className="cp-top-sub">
                      {profile.description ? profile.description.substring(0, 50) + '...' : 'Building Software Solutions for the Next Generation'}
                      <span className="cp-badge available">✓ Verified</span>
                    </div>
                  </div>
                </div>
                <div className="cp-action-btns">
                  {companyId && (
                    <button 
                      className={isFollowing ? "cp-btn-outline" : "cp-btn-primary"} 
                      onClick={handleFollow}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                  <button className="cp-btn-primary" onClick={() => navigate('/messages')}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M2 3h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="#fff" strokeWidth="1.4" />
                      <path d="M2 3l6 5 6-5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div>
                <div className="cp-tabs">
                  {['about', 'offers', 'culture', 'reviews'].map(t => (
                    <button
                      key={t}
                      className={`cp-tab ${activeTab === t ? 'active' : ''}`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="cp-tab-content">

                  {activeTab === 'about' && (
                    <>
                      <div className="cp-card-title" style={{ marginBottom: '1rem' }}>Overview</div>
                      <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        {profile.description || 'No description provided.'}
                      </p>

                      <div className="cp-contact-grid">
                        <div className="cp-contact-item"><span className="cp-contact-label">Founded</span><span className="cp-contact-val">{profile.founded || '-'}</span></div>
                        <div className="cp-contact-item"><span className="cp-contact-label">Company Size</span><span className="cp-contact-val">{profile.size || '-'}</span></div>
                        <div className="cp-contact-item"><span className="cp-contact-label">Industry</span><span className="cp-contact-val">{profile.industry || '-'}</span></div>
                        <div className="cp-contact-item"><span className="cp-contact-label">Headquarters</span><span className="cp-contact-val">{profile.wilaya || '-'}</span></div>
                      </div>
                      
                      <div className="cp-card-title" style={{ margin: '1.5rem 0 1rem' }}>Director Info</div>
                      <div className="cp-contact-grid">
                        <div className="cp-contact-item"><span className="cp-contact-label">Name</span><span className="cp-contact-val">{profile.director_full_name || '-'}</span></div>
                        <div className="cp-contact-item"><span className="cp-contact-label">Email</span><span className="cp-contact-val link">{profile.director_email || '-'}</span></div>
                        <div className="cp-contact-item"><span className="cp-contact-label">Phone</span><span className="cp-contact-val">{profile.director_phone || '-'}</span></div>
                      </div>

                      <div className="cp-card-title" style={{ margin: '1.5rem 0 1rem' }}>Work Environment</div>
                      {[
                        { label: 'Remote Friendly', pct: 90 },
                        { label: 'Mentorship Rating', pct: 95 },
                        { label: 'Career Growth', pct: 85 },
                      ].map(s => (
                        <div key={s.label}>
                          <div className="cp-score-row">
                            <span className="cp-score-label">{s.label}</span>
                            <span className="cp-score-pct">{s.pct}%</span>
                          </div>
                          <div className="cp-score-bar"><div className="cp-score-fill" style={{ width: `${s.pct}%` }} /></div>
                        </div>
                      ))}
                    </>
                  )}

                  {activeTab === 'offers' && (
                    <>
                      {[
                        { icon: 'FS', title: 'Full Stack Web Developer Intern', type: 'Hybrid', date: 'Posted 2 days ago', desc: 'Join our team to build scalable React and Node.js applications. Perfect for final year students looking for a PFE.' },
                        { icon: 'BE', title: 'Backend Developer Intern', type: 'On-site', date: 'Posted 1 week ago', desc: 'Work with Django and PostgreSQL to optimize APIs and database queries for our enterprise clients.' },
                        { icon: 'UI', title: 'UI/UX Designer Intern', type: 'Remote', date: 'Posted 2 weeks ago', desc: 'Design intuitive interfaces in Figma and collaborate closely with frontend developers.' },
                      ].map(e => (
                        <div className="cp-timeline-item" key={e.title}>
                          <div className="cp-timeline-icon">{e.icon}</div>
                          <div className="cp-timeline-info">
                            <div className="cp-timeline-title">{e.title}</div>
                            <div className="cp-timeline-sub">{e.type}</div>
                            <div className="cp-timeline-desc">{e.desc}</div>
                            <div className="cp-timeline-date">{e.date}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {activeTab === 'culture' && (
                    <>
                      <div className="cp-card-title" style={{ marginBottom: '1rem' }}>Why join us?</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '13px', color: 'var(--blue)', marginBottom: '4px' }}>Continuous Learning</h4>
                          <p style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: '1.5' }}>We provide access to premium courses and weekly tech-talks to ensure you're always growing.</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '13px', color: 'var(--blue)', marginBottom: '4px' }}>Flexible Hours</h4>
                          <p style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: '1.5' }}>We care about results, not when you clock in. Enjoy a hybrid work model.</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '13px', color: 'var(--blue)', marginBottom: '4px' }}>Modern Office</h4>
                          <p style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: '1.5' }}>Located in downtown Oran with free coffee, snacks, and collaborative spaces.</p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '13px', color: 'var(--blue)', marginBottom: '4px' }}>Health &amp; Wellbeing</h4>
                          <p style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: '1.5' }}>Comprehensive health insurance and gym memberships for all employees.</p>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'reviews' && (
                    <>
                      {[
                        { name: 'Former Intern (2023)', date: 'Jan 2024', rating: '★★★★★', desc: 'Amazing place to kickstart your career. The mentorship is top-notch and they treat interns like full-time employees.' },
                        { name: 'Current Frontend Developer', date: 'Nov 2023', rating: '★★★★☆', desc: 'Great technical challenges and a modern tech stack. Sometimes fast-paced, but team is supportive.' },
                      ].map(r => (
                        <div className="cp-timeline-item" key={r.name}>
                          <div className="cp-timeline-icon" style={{ background: '#f4f4f5', color: '#0a0a0a' }}>{r.name.charAt(0)}</div>
                          <div className="cp-timeline-info">
                            <div className="cp-review-header">
                              <span className="cp-reviewer">{r.name}</span>
                              <span className="cp-rating">{r.rating}</span>
                            </div>
                            <div className="cp-timeline-date" style={{ marginTop: 0 }}>{r.date}</div>
                            <div className="cp-timeline-desc" style={{ marginTop: '8px' }}>"{r.desc}"</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                </div>{/* end cp-tab-content */}
              </div>{/* end tabs wrapper */}

            </div>{/* end cp-right */}

          </div>{/* end cp-body */}

        </div>{/* end cp-page */}
      </div>{/* end scroll wrapper */}

    </div> // end db
  )
}

export default CompanyProfile

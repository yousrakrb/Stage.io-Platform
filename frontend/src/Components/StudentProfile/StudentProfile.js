import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getStudentProfile, getPublicStudentProfile } from '../../api'
import StudentSidebar from '../UnifiedLayouts/StudentSidebar'
import CompanySidebar from '../UnifiedLayouts/CompanySidebar'
import '../StudentDash/StudentDash.css'
import './StudentProfile.css'

const StudentProfile = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('about')
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userRole = localStorage.getItem('role')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data;
        if (id) {
          data = await getPublicStudentProfile(id);
        } else {
          data = await getStudentProfile();
        }
        setProfile(data)
      } catch (err) {
        console.error('Error fetching student profile:', err)
        setError('Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>
  if (!profile) return null

  // Helper for initials
  const nameParts = profile.full_name ? profile.full_name.split(' ') : ['Student']
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : nameParts[0][0]?.toUpperCase() || 'S'

  return (
    <div className="db">
      {userRole === 'company' ? <CompanySidebar activeId="candidates" /> : <StudentSidebar />}
      <main className="main">
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
              {profile.avatar_url ? (
                <img src={`http://127.0.0.1:8000${profile.avatar_url}`} alt="Avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
              ) : (
                <div className="sp-avatar">{initials}</div>
              )}
            </div>
            <div className="sp-name">{profile.full_name}</div>
            <div className="sp-role">{profile.speciality || profile.major || 'Student'}</div>
            <div className="sp-location">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="#6b7280" strokeWidth="1.4" />
                <circle cx="8" cy="6" r="1.5" stroke="#6b7280" strokeWidth="1.4" />
              </svg>
              {profile.wilaya || 'Location not set'}
            </div>
            <div className="sp-stats-row">
              <div className="sp-stat"><div className="sp-stat-num">0</div><div className="sp-stat-label">Applied</div></div>
              <div className="sp-stat"><div className="sp-stat-num">0</div><div className="sp-stat-label">Accepted</div></div>
              <div className="sp-stat"><div className="sp-stat-num">0%</div><div className="sp-stat-label">Match</div></div>
            </div>
          </div>

          {/* Skills */}
          <div className="sp-card">
            <div className="sp-card-inner">
              <div className="sp-card-title">Skills</div>
              <div className="sp-skill-list">
                {profile.skills && profile.skills.length > 0 ? profile.skills.map((s, i) => {
                  const skillName = typeof s === 'string' ? s : s.name
                  return <span key={i} className={`sp-skill-pill ${i > 4 ? 'gray' : ''}`}>{skillName}</span>
                }) : <span className="sp-skill-pill gray">No skills added</span>}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="sp-card">
            <div className="sp-card-inner">
              <div className="sp-card-title">Languages</div>
              {profile.languages && profile.languages.length > 0 ? profile.languages.map((l, i) => {
                const langName = typeof l === 'string' ? l : l.name
                const langLevel = typeof l === 'string' ? '' : `${l.percentage}%`
                return (
                  <div className="sp-lang-row" key={i}>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{langName}</span>
                    <span className="sp-lang-level">{langLevel}</span>
                  </div>
                )
              }) : <div style={{ fontSize: '13px', color: '#6b7280' }}>No languages added</div>}
            </div>
          </div>

        </div>

        {/* ── Right Panel ── */}
        <div className="sp-right">

          {/* Top bar */}
          <div className="sp-top-bar">
            <div className="sp-top-info">
              <div className="sp-top-name">{profile.full_name}</div>
              <div className="sp-top-sub">
                {profile.university || 'University not set'} · {profile.major || 'Major not set'}
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
                  {profile.bio && (
                    <>
                      <div className="sp-card-title" style={{ marginBottom: '1rem' }}>About Me</div>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151', marginBottom: '2rem' }}>{profile.bio}</p>
                    </>
                  )}
                  
                  <div className="sp-card-title" style={{ marginBottom: '1rem' }}>Contact Information</div>
                  <div className="sp-contact-grid">
                    <div className="sp-contact-item"><span className="sp-contact-label">Phone</span><span className="sp-contact-val link">{profile.phone || '-'}</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">Email</span><span className="sp-contact-val link">{profile.email}</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">LinkedIn</span><span className="sp-contact-val link">-</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">GitHub</span><span className="sp-contact-val link">{profile.github_link || '-'}</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">Portfolio</span><span className="sp-contact-val link">{profile.portfolio_link || '-'}</span></div>
                  </div>
                  
                  <div className="sp-card-title" style={{ margin: '1.5rem 0 1rem' }}>Academic Information</div>
                  <div className="sp-contact-grid">
                    <div className="sp-contact-item"><span className="sp-contact-label">Student Type</span><span className="sp-contact-val">{profile.student_type}</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">Card ID</span><span className="sp-contact-val">{profile.student_card_id || '-'}</span></div>
                    <div className="sp-contact-item"><span className="sp-contact-label">Graduation Year</span><span className="sp-contact-val">{profile.graduation_year || '-'}</span></div>
                  </div>
                </>
              )}

              {activeTab === 'experience' && (
                <>
                  {profile.experiences && profile.experiences.length > 0 ? profile.experiences.map((e, i) => {
                    const title = typeof e === 'string' ? e : e.title;
                    const company = typeof e === 'string' ? '' : e.company;
                    const duration = typeof e === 'string' ? '' : e.duration;
                    const desc = typeof e === 'string' ? '' : e.description;
                    const expInitials = title ? title.substring(0, 2).toUpperCase() : 'EX';
                    return (
                      <div className="sp-timeline-item" key={i}>
                        <div className="sp-timeline-icon">{expInitials}</div>
                        <div className="sp-timeline-info">
                          <div className="sp-timeline-title">{title}</div>
                          <div className="sp-timeline-sub">{company}</div>
                          <div className="sp-timeline-date">{duration}</div>
                          <div className="sp-timeline-desc">{desc}</div>
                        </div>
                      </div>
                    )
                  }) : <div style={{ fontSize: '14px', color: '#6b7280' }}>No experience added yet.</div>}
                </>
              )}

              {activeTab === 'education' && (
                <>
                  {profile.university ? (
                    <div className="sp-timeline-item">
                      <div className="sp-timeline-icon">UN</div>
                      <div className="sp-timeline-info">
                        <div className="sp-timeline-title">{profile.major || 'Major not specified'}</div>
                        <div className="sp-timeline-sub">{profile.university}</div>
                        <div className="sp-timeline-date">Graduation: {profile.graduation_year || 'Unknown'}</div>
                        <div className="sp-timeline-desc">Speciality: {profile.speciality || 'None'}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>No education data added yet.</div>
                  )}
                </>
              )}

              {activeTab === 'skills' && (
                <>
                  <div className="sp-card-title" style={{ marginBottom: '1rem' }}>Technical Skills</div>
                  {profile.skills && profile.skills.length > 0 ? profile.skills.map((s, i) => {
                    const label = typeof s === 'string' ? s : s.name
                    const pct = typeof s === 'string' ? 50 : (s.percentage || 50)
                    return (
                      <div key={i}>
                        <div className="sp-score-row">
                          <span className="sp-score-label">{label}</span>
                          <span className="sp-score-pct">{pct}%</span>
                        </div>
                        <div className="sp-score-bar"><div className="sp-score-fill" style={{ width: `${pct}%` }} /></div>
                      </div>
                    )
                  }) : <div style={{ fontSize: '14px', color: '#6b7280' }}>No skills added.</div>}
                </>
              )}

              {activeTab === 'cv' && (
                <div className="cv-preview-tab">
                  <div className="sp-card-title" style={{ marginBottom: '1.5rem' }}>Curriculum Vitae</div>
                  {profile.cv_url ? (
                    <div className="cv-preview-placeholder">
                      <div className="cv-placeholder-img">📄</div>
                      <h3>Your CV is available</h3>
                      <div className="cv-actions">
                        <a href={`http://127.0.0.1:8000${profile.cv_url}`} target="_blank" rel="noreferrer" className="sp-btn-primary" style={{textDecoration:'none', color:'white', padding:'8px 16px', borderRadius:'6px', display:'inline-block'}}>View Full CV</a>
                      </div>
                    </div>
                  ) : (
                    <div className="cv-preview-placeholder">
                      <p>You have not generated a CV yet.</p>
                      <button className="sp-btn-primary" onClick={() => navigate('/cv-builder')}>Create CV Now</button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
        </div>
        </div>
      </main>
    </div>
  )
}

export default StudentProfile
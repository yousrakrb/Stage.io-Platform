import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudentProfile, updateStudentProfile, uploadAvatar } from '../../api'
import StudentSidebar from '../UnifiedLayouts/StudentSidebar'
import '../StudentDash/StudentDash.css'
import './StudentProfile.css'

const StudentProfileEdit = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // State for profile data
  const [profileData, setProfileData] = useState({
    full_name: '',
    avatar_url: null,
    speciality: '',
    wilaya: '',
    email: '',
    phone: '',
    github_link: '',
    portfolio_link: '',
    bio: '',
    graduation_year: '',
    student_type: '',
    student_card_id: '',
    skills: [],
    languages: [],
    experiences: [],
    university: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile()
        setProfileData(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
        alert('Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await updateStudentProfile(profileData)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Error updating profile:', err)
      alert('Failed to update profile.')
    }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>

  return (
    <div className="db">
      <StudentSidebar />
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
              <button className="edit-cover-btn" aria-label="Edit cover">✎</button>
            </div>
            <div className="sp-avatar-wrap">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div className="sp-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {profileData.avatar_url ? (
                    <img src={`http://127.0.0.1:8000${profileData.avatar_url}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profileData.full_name ? profileData.full_name.split(' ').map(n => n[0]).join('') : 'S'
                  )}
                </div>
                {isEditing && (
                  <label className="edit-avatar-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }} aria-label="Edit avatar">
                    ✎
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const formData = new FormData();
                        formData.append('avatar', e.target.files[0]);
                        try {
                          const res = await uploadAvatar(formData);
                          setProfileData(prev => ({ ...prev, avatar_url: res.avatar_url }));
                        } catch (err) {
                          alert('Failed to upload avatar');
                        }
                      }
                    }} />
                  </label>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <div style={{ padding: '0 20px', marginTop: '10px' }}>
                <input 
                  className="edit-input-name"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
                <input 
                  className="edit-input-role"
                  name="speciality"
                  value={profileData.speciality}
                  onChange={handleInputChange}
                  placeholder="Speciality"
                />
              </div>
            ) : (
              <>
                <div className="sp-name">{profileData.full_name}</div>
                <div className="sp-role">{profileData.speciality}</div>
              </>
            )}

            <div className="sp-location">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="#6b7280" strokeWidth="1.4" />
                <circle cx="8" cy="6" r="1.5" stroke="#6b7280" strokeWidth="1.4" />
              </svg>
              {isEditing ? (
                <input 
                  className="edit-input-small"
                  name="wilaya"
                  value={profileData.wilaya}
                  onChange={handleInputChange}
                />
              ) : profileData.wilaya || 'Location not set'}
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
              <div className="sp-card-title">
                Skills
                <button className="edit-icon-btn">✎</button>
              </div>
              <div className="sp-skill-list">
                {profileData.skills && profileData.skills.map((s, i) => {
                  const label = typeof s === 'string' ? s : s.name
                  return <span key={i} className={`sp-skill-pill ${i > 4 ? 'gray' : ''}`}>{label}</span>
                })}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="sp-card">
            <div className="sp-card-inner">
              <div className="sp-card-title">
                Languages
                <button className="edit-icon-btn">✎</button>
              </div>
              {profileData.languages && profileData.languages.map((l, i) => {
                const langName = typeof l === 'string' ? l : l.name
                const langLevel = typeof l === 'string' ? '' : `${l.percentage}%`
                return (
                  <div className="sp-lang-row" key={i}>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{langName}</span>
                    <span className="sp-lang-level">{langLevel}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* ── Right Panel ── */}
        <div className="sp-right">

          {/* Top bar */}
          <div className="sp-top-bar">
            <div className="sp-top-info">
              <div className="sp-top-name">{profileData.full_name}</div>
              <div className="sp-top-sub">
                {profileData.university || 'University not set'} · {profileData.speciality || 'Speciality not set'}
                <span className="sp-badge available">Available</span>
              </div>
            </div>
            <div className="sp-action-btns">
              {isEditing ? (
                <>
                  <button className="sp-btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="sp-btn-primary" onClick={handleSave}>Save Changes</button>
                </>
              ) : (
                <button className="sp-btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="sp-tabs">
              {['about', 'experience', 'education', 'cv'].map(t => (
                <button
                  key={t}
                  className={`sp-tab ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t === 'cv' ? 'My CV' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="sp-tab-content">

              {activeTab === 'about' && (
                <>
                  <div className="sp-card-title" style={{ marginBottom: '1rem' }}>
                    Contact Information
                    {!isEditing && <button className="edit-icon-btn" onClick={() => setIsEditing(true)}>✎</button>}
                  </div>
                  <div className="sp-contact-grid">
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Phone</span>
                      {isEditing ? (
                        <input name="phone" value={profileData.phone} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val link">{profileData.phone}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Email</span>
                      {isEditing ? (
                        <input name="email" value={profileData.email} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val link">{profileData.email}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">LinkedIn</span>
                      {isEditing ? (
                        <input name="linkedin" value={profileData.linkedin} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val link">{profileData.linkedin}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">GitHub</span>
                      {isEditing ? (
                        <input name="github_link" value={profileData.github_link} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val link">{profileData.github_link || '-'}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Portfolio</span>
                      {isEditing ? (
                        <input name="portfolio_link" value={profileData.portfolio_link} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val link">{profileData.portfolio_link || '-'}</span>
                      )}
                    </div>
                  </div>

                  <div className="sp-card-title" style={{ margin: '1.5rem 0 1rem' }}>
                    Basic Information
                    {!isEditing && <button className="edit-icon-btn" onClick={() => setIsEditing(true)}>✎</button>}
                  </div>
                  <div className="sp-contact-grid">
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Graduation Year</span>
                      {isEditing ? (
                        <input name="graduation_year" value={profileData.graduation_year} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val">{profileData.graduation_year || '-'}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Student Type</span>
                      {isEditing ? (
                        <input name="student_type" value={profileData.student_type} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val">{profileData.student_type || '-'}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Card ID</span>
                      {isEditing ? (
                        <input name="student_card_id" value={profileData.student_card_id} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val">{profileData.student_card_id || '-'}</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'experience' && (
                <>
                  <div className="experience-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="sp-card-title">Professional Experience</div>
                    <button className="sp-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>+ Add Experience</button>
                  </div>
                  {profileData.experiences && profileData.experiences.map((e, i) => {
                    const title = typeof e === 'string' ? e : e.title;
                    const company = typeof e === 'string' ? '' : e.company;
                    const duration = typeof e === 'string' ? '' : e.duration;
                    const desc = typeof e === 'string' ? '' : e.description;
                    const expInitials = title ? title.substring(0, 2).toUpperCase() : 'EX';
                    return (
                      <div className="sp-timeline-item" key={i}>
                        <div className="sp-timeline-icon">{expInitials}</div>
                        <div className="sp-timeline-info">
                          <div className="sp-timeline-title">
                            {title}
                            <button className="edit-icon-btn-small">✎</button>
                          </div>
                          <div className="sp-timeline-sub">{company}</div>
                          <div className="sp-timeline-date">{duration}</div>
                          <div className="sp-timeline-desc">{desc}</div>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}

              {activeTab === 'education' && (
                <>
                  <div className="experience-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="sp-card-title">Education</div>
                    <button className="sp-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>+ Add Education</button>
                  </div>
                  {[
                    { initials: 'UA', title: 'L3 Computer Science', company: 'Université Alger 1', date: '2022 – Present', desc: 'GPA: 15.4/20 · Specialization in Software Engineering' },
                    { initials: 'LY', title: 'Baccalauréat Sciences', company: 'Lycée Ben Aknoun · Alger', date: '2019 – 2022', desc: 'Mention: Très Bien · Major: Mathematics' },
                  ].map(e => (
                    <div className="sp-timeline-item" key={e.title}>
                      <div className="sp-timeline-icon">{e.initials}</div>
                      <div className="sp-timeline-info">
                        <div className="sp-timeline-title">
                          {e.title}
                          <button className="edit-icon-btn-small">✎</button>
                        </div>
                        <div className="sp-timeline-sub">{e.company}</div>
                        <div className="sp-timeline-date">{e.date}</div>
                        <div className="sp-timeline-desc">{e.desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'cv' && (
                <div className="cv-preview-tab">
                  <div className="sp-card-title" style={{ marginBottom: '1.5rem' }}>Your Generated CV</div>
                  {profileData.cv_url ? (
                    <div className="cv-preview-placeholder">
                      <div className="cv-placeholder-img">📄</div>
                      <h3>{profileData.cv_url.split('/').pop()}</h3>
                      <p>Saved in your profile</p>
                      <div className="cv-actions">
                        <button className="sp-btn-primary" onClick={() => navigate('/cv-builder')}>Edit in CV Builder</button>
                        <a href={`http://127.0.0.1:8000${profileData.cv_url}`} target="_blank" rel="noreferrer" className="sp-btn-outline" style={{textDecoration:'none', color:'inherit'}}>View PDF</a>
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

export default StudentProfileEdit

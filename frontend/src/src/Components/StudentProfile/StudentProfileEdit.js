import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './StudentProfile.css'

const StudentProfileEdit = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  // State for profile data
  const [profileData, setProfileData] = useState({
    name: 'Amine Khelifi',
    profilePic: null,
    role: 'Frontend Developer',
    location: 'Alger, Algeria',
    email: 'amine.khelifi@univ-alger.dz',
    phone: '+213 555 123 456',
    linkedin: 'linkedin.com/in/aminekhelifi',
    github: 'github.com/aminekhelifi',
    dob: 'March 14, 2002',
    gender: 'Male',
    nationality: 'Algerian',
    availability: 'July 2025',
    bio: 'L3 Computer Science student at University of Alger 1. Passionate about building modern web applications and solving complex problems.',
    skills: ['React', 'TypeScript', 'Node.js', 'Git', 'Figma', 'CSS', 'Python', 'REST APIs'],
    languages: [
      { lang: 'Arabic', level: 'Native' },
      { lang: 'French', level: 'Fluent' },
      { lang: 'English', level: 'Professional' },
    ]
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

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
              <button className="edit-cover-btn" aria-label="Edit cover">✎</button>
            </div>
            <div className="sp-avatar-wrap">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div className="sp-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {profileData.profilePic ? (
                    <img src={profileData.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profileData.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                {isEditing && (
                  <label className="edit-avatar-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }} aria-label="Edit avatar">
                    ✎
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (e) => setProfileData(prev => ({ ...prev, profilePic: e.target.result }));
                        reader.readAsDataURL(e.target.files[0]);
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
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
                <input 
                  className="edit-input-role"
                  name="role"
                  value={profileData.role}
                  onChange={handleInputChange}
                  placeholder="Role"
                />
              </div>
            ) : (
              <>
                <div className="sp-name">{profileData.name}</div>
                <div className="sp-role">{profileData.role}</div>
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
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                />
              ) : profileData.location}
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
                {profileData.skills.map((s, i) => (
                  <span key={s} className={`sp-skill-pill ${i > 4 ? 'gray' : ''}`}>{s}</span>
                ))}
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
              {profileData.languages.map(l => (
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
              <div className="sp-top-name">{profileData.name}</div>
              <div className="sp-top-sub">
                Univ. Alger 1 · L3 Computer Science
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
                        <input name="github" value={profileData.github} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val link">{profileData.github}</span>
                      )}
                    </div>
                  </div>

                  <div className="sp-card-title" style={{ margin: '1.5rem 0 1rem' }}>
                    Basic Information
                    {!isEditing && <button className="edit-icon-btn" onClick={() => setIsEditing(true)}>✎</button>}
                  </div>
                  <div className="sp-contact-grid">
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Date of Birth</span>
                      {isEditing ? (
                        <input name="dob" value={profileData.dob} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val">{profileData.dob}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Gender</span>
                      {isEditing ? (
                        <select name="gender" value={profileData.gender} onChange={handleInputChange} className="edit-input-inline">
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      ) : (
                        <span className="sp-contact-val">{profileData.gender}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Nationality</span>
                      {isEditing ? (
                        <input name="nationality" value={profileData.nationality} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val">{profileData.nationality}</span>
                      )}
                    </div>
                    <div className="sp-contact-item">
                      <span className="sp-contact-label">Availability</span>
                      {isEditing ? (
                        <input name="availability" value={profileData.availability} onChange={handleInputChange} className="edit-input-inline" />
                      ) : (
                        <span className="sp-contact-val">{profileData.availability}</span>
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
                  {[
                    { initials: 'NT', title: 'Frontend Intern', company: 'NafTech Inc. · Oran', date: 'Jun 2024 – Sep 2024', desc: 'Built React components for the company\'s internal dashboard. Collaborated with backend team on REST API integration.' },
                    { initials: 'FT', title: 'Web Dev Freelancer', company: 'Freelance · Remote', date: 'Jan 2024 – May 2024', desc: 'Developed landing pages and e-commerce sites for local businesses using React and Tailwind CSS.' },
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
                  <div className="cv-preview-placeholder">
                    <div className="cv-placeholder-img">📄</div>
                    <h3>CV_Amine_Khelifi_2026.pdf</h3>
                    <p>Last updated 2 days ago</p>
                    <div className="cv-actions">
                      <button className="sp-btn-primary" onClick={() => navigate('/cv-builder')}>Edit in CV Builder</button>
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

export default StudentProfileEdit

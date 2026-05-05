import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminProfile, updateAdminProfile, uploadAvatar } from '../../api'
import './UnivProfile.css'

const UnivProfile = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getAdminProfile()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching university profile:', err)
        setError('Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await updateAdminProfile(profile)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (err) {
      alert('Failed to update profile.')
    }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>
  if (!profile) return null

  // Helper for initials
  const nameParts = (profile.full_name || profile.university || 'University').split(' ')
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : nameParts[0][0]?.toUpperCase() || 'U'

  return (
    <div className="up-page">

      {/* ── Navbar ── */}
      <nav className="up-nav">
        <div className="up-nav-brand" onClick={() => navigate('/univ-dashboard')} style={{cursor:'pointer'}}>
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
          <Link to="/univ-dashboard">Our Students</Link>
          <Link to="/univ-dashboard">Company Partners</Link>
          <Link to="/messages">Messages</Link>
        </div>
        <div className="up-nav-right">
          <button className="up-nav-msg-btn" onClick={() => navigate('/messages')}>Broadcast</button>
          <div className="up-nav-avatar">{initials}</div>
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
            <div className="up-avatar-wrap" style={{position:'relative'}}>
              {profile.logo_url ? (
                <img src={`http://localhost:8000${profile.logo_url}`} alt="Avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
              ) : (
                <div className="up-avatar">{initials}</div>
              )}
              {isEditing && (
                <label style={{position:'absolute', bottom:0, right:0, background:'#212EA0', color:'white', borderRadius:'50%', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'2px solid white'}}>
                    ✎
                    <input type="file" accept="image/*" style={{display:'none'}} onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                            const formData = new FormData();
                            formData.append('avatar', e.target.files[0]);
                            try {
                                const res = await uploadAvatar(formData);
                                setProfile(prev => ({ ...prev, logo_url: res.avatar_url }));
                            } catch (err) {
                                alert('Upload failed');
                            }
                        }
                    }} />
                </label>
              )}
            </div>
            <div className="up-name">
                {isEditing ? <input name="full_name" value={profile.full_name || ''} onChange={handleInputChange} style={{width:'100%', textAlign:'center'}} /> : (profile.full_name || 'University')}
            </div>
            <div className="up-role">{profile.email}</div>
            <div className="up-location">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="#6b7280" strokeWidth="1.4" />
                <circle cx="8" cy="6" r="1.5" stroke="#6b7280" strokeWidth="1.4" />
              </svg>
              {isEditing ? <input name="wilaya" value={profile.wilaya || ''} onChange={handleInputChange} placeholder="Wilaya" /> : (profile.wilaya || 'Algeria')}
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

          {/* Information */}
          <div className="up-card">
            <div className="up-card-inner">
              <div className="up-card-title">Information</div>
              <div className="up-lang-row">
                <span style={{ fontSize: '13px', fontWeight: '500' }}>University</span>
                {isEditing ? <input name="university" value={profile.university || ''} onChange={handleInputChange} /> : <span className="up-lang-level">{profile.university || '-'}</span>}
              </div>
              <div className="up-lang-row">
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Location</span>
                {isEditing ? <input name="location" value={profile.location || ''} onChange={handleInputChange} /> : <span className="up-lang-level">{profile.location || '-'}</span>}
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Panel ── */}
        <div className="up-right">

          {/* Top bar */}
          <div className="up-top-bar">
            <div className="up-top-info">
              <div className="up-top-name">{profile.university || profile.full_name}</div>
              <div className="up-top-sub">
                Empowering the future generation of professionals
                <span className="up-badge available">✓ Accredited</span>
              </div>
            </div>
            <div className="up-action-btns">
              {isEditing ? (
                <>
                  <button className="up-btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="up-btn-primary" onClick={handleSave}>Save Changes</button>
                </>
              ) : (
                <button className="up-btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="up-tabs">
              {['about', 'programs', 'partners'].map(t => (
                <button key={t} className={`up-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</button>
              ))}
            </div>

            <div className="up-tab-content">
              {activeTab === 'about' && (
                <>
                  <div className="up-card-title" style={{ marginBottom: '1rem' }}>Overview</div>
                  {isEditing ? (
                    <textarea name="bio" value={profile.bio || ''} onChange={handleInputChange} rows={5} style={{width:'100%', padding:'10px'}} />
                  ) : (
                    <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                      {profile.bio || 'No overview provided.'}
                    </p>
                  )}
                  
                  <div className="up-contact-grid">
                    <div className="up-contact-item">
                        <span className="up-contact-label">Rector</span>
                        {isEditing ? <input name="rector_name" value={profile.rector_name || ''} onChange={handleInputChange} /> : <span className="up-contact-val">{profile.rector_name || 'Not set'}</span>}
                    </div>
                    <div className="up-contact-item">
                        <span className="up-contact-label">Phone</span>
                        {isEditing ? <input name="phone" value={profile.phone || ''} onChange={handleInputChange} /> : <span className="up-contact-val">{profile.phone || '-'}</span>}
                    </div>
                  </div>
                </>
              )}
              {/* Other tabs remain static or can be updated later */}
              {activeTab !== 'about' && <div style={{padding:'20px', textAlign:'center', color:'#6b7280'}}>Content for {activeTab} coming soon.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnivProfile

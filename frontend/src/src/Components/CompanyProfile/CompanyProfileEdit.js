import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CompanyNavbar from '../UnifiedLayouts/CompanyNavbar'
import '../CompanyDash/CompanyDash.css'
import './CompanyProfile.css'

const CompanyProfileEdit = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  // State for company data
  const [companyData, setCompanyData] = useState({
    name: 'NafTech Inc.',
    profilePic: null,
    tagline: 'Building Software Solutions for the Next Generation',
    about: 'NafTech Inc. is a leading technology agency based in Oran. We specialize in building scalable web and mobile applications for clients worldwide. Our mission is to empower businesses with cutting-edge software solutions while fostering local talent through our robust internship programs.',
    founded: '2018',
    size: '50-100 Employees',
    industry: 'Software Development',
    headquarters: 'Oran, Algeria',
    website: 'naftech.dz',
    linkedin: 'naftech-inc',
    twitter: '@naftech',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Python', 'Go', 'Figma'],
    culture: [
      { title: 'Continuous Learning', desc: 'We provide access to premium courses and weekly tech-talks to ensure you\'re always growing.' },
      { title: 'Flexible Hours', desc: 'We care about results, not when you clock in. Enjoy a hybrid work model.' },
      { title: 'Modern Office', desc: 'Located in downtown Oran with free coffee, snacks, and collaborative spaces.' },
      { title: 'Health & Wellbeing', desc: 'Comprehensive health insurance and gym memberships for all employees.' }
    ]
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCompanyData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    alert('Company profile updated successfully!')
  }

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#f0f2ff' }}>
      <div className="cp-page" style={{ minHeight: '100vh' }}>

          {/* ── Body ── */}
          <div className="cp-body">

            {/* ── Left Panel ── */}
            <div className="cp-left">

              {/* Tech Stack */}
              <div className="cp-card">
                <div className="cp-card-inner">
                  <div className="cp-card-title">
                    Tech Stack
                    <button className="edit-icon-btn">✎</button>
                  </div>
                  <div className="cp-skill-list">
                    {companyData.techStack.map((s, i) => (
                      <span key={s} className={`cp-skill-pill ${i > 4 ? 'gray' : ''}`}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="cp-card">
                <div className="cp-card-inner">
                  <div className="cp-card-title">
                    Links
                    {!isEditing && <button className="edit-icon-btn" onClick={() => setIsEditing(true)}>✎</button>}
                  </div>
                  {[
                    { label: 'Website', key: 'website' },
                    { label: 'LinkedIn', key: 'linkedin' },
                    { label: 'Twitter X', key: 'twitter' },
                  ].map(l => (
                    <div className="cp-lang-row" key={l.label}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>{l.label}</span>
                      {isEditing ? (
                        <input name={l.key} value={companyData[l.key]} onChange={handleInputChange} className="edit-input-inline-cp" />
                      ) : (
                        <span className="cp-lang-level">{companyData[l.key]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Right Panel ── */}
            <div className="cp-right">

              {/* Top bar */}
              <div className="cp-top-bar">
                <div className="cp-top-info" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {/* Profile Picture */}
                  <div className="cp-profile-pic-wrapper" style={{ position: 'relative' }}>
                    <div className="cp-profile-pic" style={{ 
                      width: '80px', height: '80px', borderRadius: '50%', 
                      backgroundColor: '#e2e8f0', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', 
                      overflow: 'hidden', border: '2px solid white', 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                    }}>
                      {companyData.profilePic ? (
                        <img src={companyData.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '32px', color: '#64748b', fontWeight: 'bold' }}>{companyData.name.charAt(0)}</span>
                      )}
                    </div>
                    {isEditing && (
                      <label className="cp-pic-edit-btn" style={{ 
                        position: 'absolute', bottom: '0', right: '0', 
                        background: 'var(--blue)', color: 'white', 
                        borderRadius: '50%', width: '28px', height: '28px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        cursor: 'pointer', fontSize: '14px', border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        ✎
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (e) => setCompanyData(prev => ({ ...prev, profilePic: e.target.result }));
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }} />
                      </label>
                    )}
                  </div>

                  {/* Name and Tagline */}
                  <div>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                        <input name="name" value={companyData.name} onChange={handleInputChange} className="edit-input-name-cp" />
                        <input name="tagline" value={companyData.tagline} onChange={handleInputChange} className="edit-input-tagline-cp" />
                      </div>
                    ) : (
                      <>
                        <div className="cp-top-name">{companyData.name}</div>
                        <div className="cp-top-sub">
                          {companyData.tagline}
                          <span className="cp-badge available" style={{ marginLeft: '10px' }}>✓ Verified</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="cp-action-btns">
                  {isEditing ? (
                    <>
                      <button className="cp-btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button className="cp-btn-primary" onClick={handleSave}>Save Changes</button>
                    </>
                  ) : (
                    <button className="cp-btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div>
                <div className="cp-tabs">
                  {['about', 'offers', 'culture'].map(t => (
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
                      <div className="cp-card-title" style={{ marginBottom: '1rem' }}>
                        Overview
                        {!isEditing && <button className="edit-icon-btn" onClick={() => setIsEditing(true)}>✎</button>}
                      </div>
                      {isEditing ? (
                        <textarea name="about" value={companyData.about} onChange={handleInputChange} className="edit-textarea-cp" rows={4} />
                      ) : (
                        <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                          {companyData.about}
                        </p>
                      )}

                      <div className="cp-contact-grid">
                        <div className="cp-contact-item">
                          <span className="cp-contact-label">Founded</span>
                          {isEditing ? <input name="founded" value={companyData.founded} onChange={handleInputChange} className="edit-input-inline-cp" /> : <span className="cp-contact-val">{companyData.founded}</span>}
                        </div>
                        <div className="cp-contact-item">
                          <span className="cp-contact-label">Company Size</span>
                          {isEditing ? <input name="size" value={companyData.size} onChange={handleInputChange} className="edit-input-inline-cp" /> : <span className="cp-contact-val">{companyData.size}</span>}
                        </div>
                        <div className="cp-contact-item">
                          <span className="cp-contact-label">Industry</span>
                          {isEditing ? <input name="industry" value={companyData.industry} onChange={handleInputChange} className="edit-input-inline-cp" /> : <span className="cp-contact-val">{companyData.industry}</span>}
                        </div>
                        <div className="cp-contact-item">
                          <span className="cp-contact-label">Headquarters</span>
                          {isEditing ? <input name="headquarters" value={companyData.headquarters} onChange={handleInputChange} className="edit-input-inline-cp" /> : <span className="cp-contact-val">{companyData.headquarters}</span>}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'offers' && (
                    <>
                      <div className="experience-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div className="cp-card-title">Manage Internship Offers</div>
                        <button className="cp-btn-primary" onClick={() => navigate('/add-offer')} style={{ padding: '8px 16px', fontSize: '13px' }}>+ Post New Offer</button>
                      </div>
                      {[
                        { icon: 'FS', title: 'Full Stack Web Developer Intern', type: 'Hybrid', date: 'Posted 2 days ago', desc: 'Join our team to build scalable React and Node.js applications. Perfect for final year students looking for a PFE.' },
                        { icon: 'BE', title: 'Backend Developer Intern', type: 'On-site', date: 'Posted 1 week ago', desc: 'Work with Django and PostgreSQL to optimize APIs and database queries for our enterprise clients.' },
                      ].map(e => (
                        <div className="cp-timeline-item" key={e.title}>
                          <div className="cp-timeline-icon">{e.icon}</div>
                          <div className="cp-timeline-info">
                            <div className="cp-timeline-title">
                              {e.title}
                              <button className="edit-icon-btn-small">✎</button>
                            </div>
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
                      <div className="cp-card-title" style={{ marginBottom: '1rem' }}>
                        Company Culture
                        <button className="edit-icon-btn">✎</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {companyData.culture.map(item => (
                          <div key={item.title}>
                            <h4 style={{ fontSize: '13px', color: '#212EA0', marginBottom: '4px' }}>{item.title}</h4>
                            <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                </div>
              </div>

            </div>

          </div>

      </div>
    </div>
  )
}

export default CompanyProfileEdit

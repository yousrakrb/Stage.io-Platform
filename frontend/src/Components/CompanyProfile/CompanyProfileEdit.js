import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCompanyProfile, updateCompanyProfile, uploadLogo } from '../../api'
import '../CompanyDash/CompanyDash.css'
import './CompanyProfile.css'

const CompanyProfileEdit = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // State for company data
  const [companyData, setCompanyData] = useState({
    company_name: '',
    logo_url: null,
    tagline: '',
    description: '',
    founded: '',
    size: '',
    industry: '',
    wilaya: '',
    address: '',
    website: '',
    linkedin: '',
    twitter: '',
    tech_stack: [],
    culture: []
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCompanyProfile()
        setCompanyData({
            ...data,
            tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
            culture: Array.isArray(data.culture) ? data.culture : []
        })
      } catch (err) {
        console.error('Error fetching company profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCompanyData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await updateCompanyProfile(companyData)
      setIsEditing(false)
      alert('Company profile updated successfully!')
    } catch (err) {
      console.error('Error updating company profile:', err)
      alert('Failed to update profile.')
    }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading company profile...</div>

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
                    {(companyData.tech_stack || []).map((s, i) => (
                      <span key={s} className={`cp-skill-pill ${i > 4 ? 'gray' : ''}`}>{s}</span>
                    ))}
                    {(companyData.tech_stack || []).length === 0 && <span className="cp-skill-pill gray">No skills set</span>}
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
                        <input name={l.key} value={companyData[l.key] || ''} onChange={handleInputChange} className="edit-input-inline-cp" />
                      ) : (
                        <span className="cp-lang-level">{companyData[l.key] || '-'}</span>
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
                      {companyData.logo_url ? (
                        <img src={`https://blazer-pumice-daylong.ngrok-free.app${companyData.logo_url}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '32px', color: '#64748b', fontWeight: 'bold' }}>{(companyData.company_name || 'C').charAt(0)}</span>
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
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const formData = new FormData();
                            formData.append('logo', e.target.files[0]);
                            try {
                              const res = await uploadLogo(formData);
                              setCompanyData(prev => ({ ...prev, logo_url: res.logo_url }));
                            } catch (err) {
                              alert('Failed to upload logo');
                            }
                          }
                        }} />
                      </label>
                    )}
                  </div>

                  {/* Name and Tagline */}
                  <div style={{ flex: 1 }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                        <input name="company_name" value={companyData.company_name} onChange={handleInputChange} className="edit-input-name-cp" placeholder="Company Name" />
                        <input name="tagline" value={companyData.tagline} onChange={handleInputChange} className="edit-input-tagline-cp" placeholder="Tagline" />
                      </div>
                    ) : (
                      <>
                        <div className="cp-top-name">{companyData.company_name || 'Set Company Name'}</div>
                        <div className="cp-top-sub">
                          {companyData.tagline || 'Set Tagline'}
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
                        <textarea name="description" value={companyData.description} onChange={handleInputChange} className="edit-textarea-cp" rows={4} placeholder="Tell us about your company..." />
                      ) : (
                        <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                          {companyData.description || 'No description added yet.'}
                        </p>
                      )}

                      <div className="cp-contact-grid">
                        <div className="cp-contact-item">
                          <span className="cp-contact-label">Founded</span>
                          {isEditing ? <input name="founded" value={companyData.founded} onChange={handleInputChange} className="edit-input-inline-cp" /> : <span className="cp-contact-val">{companyData.founded || '-'}</span>}
                        </div>
                        <div className="cp-contact-item">
                          <span className="cp-contact-label">Company Size</span>
                          {isEditing ? <input name="size" value={companyData.size} onChange={handleInputChange} className="edit-input-inline-cp" /> : <span className="cp-contact-val">{companyData.size || '-'}</span>}
                        </div>
                        <div className="cp-contact-item">
                          <span className="cp-contact-label">Industry</span>
                          {isEditing ? <input name="industry" value={companyData.industry} onChange={handleInputChange} className="edit-input-inline-cp" /> : <span className="cp-contact-val">{companyData.industry || '-'}</span>}
                        </div>
                        <div className="cp-contact-item">
                          <span className="cp-contact-label">Headquarters</span>
                          {isEditing ? <input name="wilaya" value={companyData.wilaya} onChange={handleInputChange} className="edit-input-inline-cp" /> : <span className="cp-contact-val">{companyData.wilaya || '-'}</span>}
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
                      <p style={{fontSize:'13px', color:'#6b7280'}}>Manage your published offers from the dashboard.</p>
                      <button className="cp-btn-outline" onClick={() => navigate('/company-dashboard?tab=offers')}>Go to Offers Dashboard</button>
                    </>
                  )}

                  {activeTab === 'culture' && (
                    <>
                      <div className="cp-card-title" style={{ marginBottom: '1rem' }}>
                        Company Culture
                        <button className="edit-icon-btn">✎</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {(companyData.culture && companyData.culture.length > 0) ? companyData.culture.map((item, idx) => (
                          <div key={idx}>
                            <h4 style={{ fontSize: '13px', color: '#212EA0', marginBottom: '4px' }}>{item.title}</h4>
                            <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>{item.desc}</p>
                          </div>
                        )) : <p style={{fontSize:'12px', color:'#6b7280'}}>No culture information added.</p>}
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

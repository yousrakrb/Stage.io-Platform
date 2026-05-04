import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CompanySidebar from '../UnifiedLayouts/CompanySidebar'
import CompanyNavbar from '../UnifiedLayouts/CompanyNavbar'
import '../CompanyDash/CompanyDash.css'
import './CompanyProfile.css'

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('about')
  const navigate = useNavigate()

  return (
    <div className="db">
      <CompanySidebar />

      <div style={{ flex: 1, minHeight: '100vh', overflowY: 'auto', background: '#f0f2ff' }}>

        <div className="cp-page" style={{ minHeight: '100vh' }}>

          {/* ── Body ── */}
          <div className="cp-body">

            {/* ── Left Panel ── */}
            <div className="cp-left">

              {/* Core Tech Stack */}
              <div className="cp-card">
                <div className="cp-card-inner">
                  <div className="cp-card-title">Tech Stack</div>
                  <div className="cp-skill-list">
                    {['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Python', 'Go', 'Figma'].map((s, i) => (
                      <span key={s} className={`cp-skill-pill ${i > 4 ? 'gray' : ''}`}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links & Socials */}
              <div className="cp-card">
                <div className="cp-card-inner">
                  <div className="cp-card-title">Links</div>
                  {[
                    { lang: 'Website', level: 'naftech.dz' },
                    { lang: 'LinkedIn', level: 'naftech-inc' },
                    { lang: 'Twitter X', level: '@naftech' },
                  ].map(l => (
                    <div className="cp-lang-row" key={l.lang}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>{l.lang}</span>
                      <span className="cp-lang-level">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>{/* end cp-left */}

            {/* ── Right Panel ── */}
            <div className="cp-right">

              {/* Top bar */}
              <div className="cp-top-bar">
                <div className="cp-top-info">
                  <div className="cp-top-name">NafTech Inc.</div>
                  <div className="cp-top-sub">
                    Building Software Solutions for the Next Generation
                    <span className="cp-badge available">✓ Verified</span>
                  </div>
                </div>
                <div className="cp-action-btns">
                  <button className="cp-btn-outline" onClick={() => alert('Following Company!')}>Follow</button>
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
                        NafTech Inc. is a leading technology agency based in Oran. We specialize in building scalable web and mobile applications for clients worldwide. Our mission is to empower businesses with cutting-edge software solutions while fostering local talent through our robust internship programs.
                      </p>

                      <div className="cp-contact-grid">
                        <div className="cp-contact-item"><span className="cp-contact-label">Founded</span><span className="cp-contact-val">2018</span></div>
                        <div className="cp-contact-item"><span className="cp-contact-label">Company Size</span><span className="cp-contact-val">50-100 Employees</span></div>
                        <div className="cp-contact-item"><span className="cp-contact-label">Industry</span><span className="cp-contact-val">Software Development</span></div>
                        <div className="cp-contact-item"><span className="cp-contact-label">Headquarters</span><span className="cp-contact-val">Oran, Algeria</span></div>
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

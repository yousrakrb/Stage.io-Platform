import React, { useEffect, useState } from 'react'
import './Programs.css'

const offers = [
  {
    number: '01',
    title: 'Smart Matching',
    desc: 'Our algorithm pairs you with internships that fit your skills, field, and academic level — no more endless scrolling.',
    tag: 'AI-powered',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="3" fill="currentColor" fillOpacity=".9"/>
        <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.22 4.22l1.41 1.41M12.37 12.37l1.41 1.41M12.37 5.63l1.41-1.41M4.22 13.78l1.41-1.41"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    iconClass: 'icon-inv',
    featured: true,
  },
  {
    number: '02',
    title: 'University Network',
    desc: 'Validated, credit-eligible internships your professors actually approve — sourced directly from partner universities.',
    tag: 'Verified',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L3 5v4c0 3.31 2.58 6.41 6 7 3.42-.59 6-3.69 6-7V5L9 2z"
          stroke="#1D9E75" strokeWidth="1.5" strokeLinejoin="round" fill="#1D9E75" fillOpacity=".15"/>
        <path d="M6.5 9l2 2 3-3" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    iconClass: 'icon-teal',
  },
  {
    number: '03',
    title: 'Verified Companies',
    desc: 'Every company is vetted before posting. Apply with confidence — every offer on our platform is 100% legitimate.',
    tag: 'Trusted',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="7" width="12" height="8" rx="2" stroke="#7F77DD" strokeWidth="1.5" fill="#7F77DD" fillOpacity=".1"/>
        <path d="M6 7V5a3 3 0 016 0v2" stroke="#7F77DD" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="11" r="1.5" fill="#7F77DD"/>
      </svg>
    ),
    iconClass: 'icon-purple',
  },
  {
    number: '04',
    title: 'CV Builder',
    desc: 'Build a standout CV in minutes with our guided builder — designed specifically for internship applications.',
    tag: 'Free tool',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="4" y="2" width="10" height="14" rx="2" stroke="#BA7517" strokeWidth="1.5" fill="#BA7517" fillOpacity=".1"/>
        <path d="M7 6h4M7 9h4M7 12h2" stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    iconClass: 'icon-amber',
  },
  {
    number: '05',
    title: 'Real-time Alerts',
    desc: 'Get notified the instant a new internship matching your profile is posted. Be first to apply, every time.',
    tag: 'Instant',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2a7 7 0 100 14A7 7 0 009 2z" stroke="#185FA5" strokeWidth="1.5" fill="#185FA5" fillOpacity=".1"/>
        <path d="M9 5v4l3 2" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    iconClass: 'icon-blue',
  },
  {
    number: '06',
    title: 'Application Tracker',
    desc: 'Track every application from submission to offer in one clean dashboard. Know exactly where you stand.',
    tag: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#1D9E75" strokeWidth="1.5" fill="#1D9E75" fillOpacity=".1"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="#1D9E75" strokeWidth="1.5" fill="#1D9E75" fillOpacity=".1"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="#1D9E75" strokeWidth="1.5" fill="#1D9E75" fillOpacity=".1"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="#1D9E75" strokeWidth="1.5" fill="#1D9E75" fillOpacity=".1"/>
      </svg>
    ),
    iconClass: 'icon-teal',
  },
]

const WhatWeOffer = () => {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.offer-reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const featured = offers[0]
  const rest = offers.slice(1)

  return (
    <section className="lp-offers" id="program">

      {/* ── Header ── */}
      <div className="offers-header offer-reveal">
        <div className="offers-eyebrow">
          <span className="eyebrow-line" />
          <span className="eyebrow-text">What we offer</span>
        </div>
        <h2 className="offers-title">
          Everything you need<br /><em>to land your internship.</em>
        </h2>
        <p className="offers-sub">
          From discovery to offer — all the tools you need, in one place.
        </p>
      </div>

      {/* ── Card grid ── */}
      <div className="offers-grid">

        {/* Featured card */}
        <div className="offer-card offer-card--featured offer-reveal">
          <div className="card-meta">
            <span className="card-num">{featured.number}</span>
            <span className="card-badge badge-dark">{featured.tag}</span>
          </div>
          <div className={`card-icon ${featured.iconClass}`}>{featured.icon}</div>
          <h3 className="card-title">{featured.title}</h3>
          <p className="card-desc">{featured.desc}</p>
          <div className="card-footer">
            <span className="cta-link">Learn more</span>
            <div className="cta-arrow">→</div>
          </div>
        </div>

        {/* Small cards */}
        {rest.map((o, i) => (
          <div
            key={i}
            className={`offer-card offer-reveal ${active === i ? 'offer-card--hovered' : ''}`}
            style={{ transitionDelay: `${(i + 1) * 0.07}s` }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <div className="card-meta">
              <span className="card-num">{o.number}</span>
              <span className="card-badge badge-light">{o.tag}</span>
            </div>
            <div className={`card-icon ${o.iconClass}`}>{o.icon}</div>
            <h3 className="card-title">{o.title}</h3>
            <p className="card-desc">{o.desc}</p>
            <div className="card-footer">
              <span className="cta-link">Explore</span>
              <div className="cta-arrow">→</div>
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}

export default WhatWeOffer
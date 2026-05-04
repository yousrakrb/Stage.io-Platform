import React, { useEffect } from 'react'
import './About.css'

const team = [
  {
    initials: 'YK',
    name: 'Yousra Kerboua',
    role: 'Co-founder & CEO',
    color: 'avatar-teal',
  },
  {
    initials: 'YY',
    name: 'Yasmine Ykhelfoune',
    role: 'Co-founder & CEO',
    color: 'avatar-purple',
  },

]

const milestones = [

  {
    year: '2026',
    text: 'Built in Algeria, with students, universities and companies from all over thr country.',
  },
   {
    year: 'Future',
    text: 'Working on making the platform automated, and expand it internationally.',
  },
]

const AboutUs = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.about-reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="lp-about" id="about">

      {/* ── Header ── */}
      <div className="about-header about-reveal">
        <div className="about-eyebrow">
          <span className="eyebrow-line" />
          <span className="eyebrow-text">About us</span>
        </div>
        <div className="about-header-inner">
          <h2 className="about-title">
            Built for students.<br />
            <em>Trusted by institutions.</em>
          </h2>
          <p className="about-lead">
            We started StageLink because we lived the frustration firsthand —
            talented students in Algeria with no clear path to real professional
            experience. We set out to change that, permanently.
          </p>
        </div>
      </div>

      {/* ── Mission + Story ── */}
      <div className="about-top about-reveal">

        {/* Mission card — dark */}
        <div className="about-card about-card--dark">
          <div className="about-card-label">Our mission</div>
          <h3 className="about-card-title">
            Closing the gap between education and employment.
          </h3>
          <p className="about-card-desc">
            Algeria produces thousands of graduates every year. Too many of them
            enter the job market without a single real-world experience on their
            CV. We exist to fix that — by building the infrastructure that
            connects students, companies, and universities in one trusted place.
          </p>
          <div className="about-mission-values">
            {['Accessibility', 'Transparency', 'Efficiency'].map(v => (
              <span key={v} className="mission-pill">{v}</span>
            ))}
          </div>
        </div>

        {/* Story timeline */}
        <div className="about-card about-card--light">
          <div className="about-card-label1">Our story</div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-year">{m.year}</div>
                <div className="timeline-connector">
                  <div className="timeline-dot" />
                  {i < milestones.length - 1 && <div className="timeline-line" />}
                </div>
                <p className="timeline-text">{m.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Team ── */}
      <div className="about-team-header about-reveal">
        <div className="about-eyebrow">
          <span className="eyebrow-line" />
          <span className="eyebrow-text">The team</span>
        </div>
        <p className="about-team-sub">
          A small, focused team — engineers, educators, and operators — obsessed
          with making internships work better for everyone.
        </p>
      </div>

      <div className="about-team-grid about-reveal">
        {team.map((t, i) => (
          <div key={i} className="team-card">
            <div className={`team-avatar ${t.color}`}>{t.initials}</div>
            <div className="team-info">
              <p className="team-name">{t.name}</p>
              <p className="team-role">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default AboutUs
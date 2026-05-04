import React, { useEffect } from 'react'
import './Hero.css'

const Hero = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="lp-hero" id="hero">
      {/* Animated blobs */}
      <div className="hero-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Left — text */}
      <div className="hero-content reveal">
        <span className="hero-eyebrow">Your career, in perfect rhythm.</span>
        <h1 className="hero-title">
          Find Your Internship,<br />
          <em>Shape Your Future.</em>
        </h1>
        <p className="hero-sub">
          The smartest platform connecting Algerian students with verified internship opportunities — matched to your skills, your field, your ambitions.
        </p>
        <div className="hero-btns">
          <a href="/signin" className="btn-primary">Start for free →</a>
        </div>
      </div>

      {/* Right — visual card */}
      <div className="hero-visual reveal" style={{ animationDelay: '0.18s' }}>


        <div className="hero-stats">
          <div className="hero-stat"><strong>2,400+</strong><span>Internships</span></div>
          <div className="hero-stat"><strong>180+</strong><span>Companies</span></div>
          <div className="hero-stat"><strong>34</strong><span>Universities</span></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
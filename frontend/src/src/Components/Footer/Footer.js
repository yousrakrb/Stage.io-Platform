import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-main">
      {/* Decorative top shape */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L1440 120V0C1440 0 1162 100 720 100C278 100 0 0 0 0V120Z" fill="#212EA0"/>
        </svg>
      </div>

      <div className="footer-container">
        <div className="footer-newsletter">
          <div className="newsletter-text">
            <h3>Stay ahead of the curve</h3>
            <p>Get the latest internships and career tips delivered to your inbox.</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn-subscribe">Subscribe</button>
          </div>
        </div>

        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Stage.io</span>
            </div>
            <p className="footer-desc">
              Bridging the gap between ambitious Algerian students and world-class companies. 
              The infrastructure for the next generation of professional talent.
            </p>
            <div className="social-links">
              <a href="#" className="social-pill" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                <span>LinkedIn</span>
              </a>
              <a href="#" className="social-pill" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="#">Find Internships</a></li>
                <li><a href="#">CV Builder</a></li>
                <li><a href="#">Top Matches</a></li>
                <li><a href="#">Applications</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Partners</h4>
              <ul>
                <li><a href="#">Post an Offer</a></li>
                <li><a href="#">University Portal</a></li>
                <li><a href="#">Case Studies</a></li>
                <li><a href="#">Resources</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Use</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2026 Stage.io. All rights reserved. Built with passion for Algerian talent.</p>
          </div>
          <div className="footer-status">
            <div className="status-dot"></div>
            <span>System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

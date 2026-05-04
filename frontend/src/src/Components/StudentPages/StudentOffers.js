import React, { useState } from 'react';
import StudentSidebar from '../UnifiedLayouts/StudentSidebar';
import '../StudentDash/StudentDash.css';
import './StudentPages.css';

const allOffers = [
  { id: 1, title: 'Frontend Developer Intern', company: 'Sonatrach Digital', location: 'Alger', type: 'Hybrid', duration: '3-6 months', sector: 'Energy', tags: ['React', 'TypeScript'], match: 94, date: '2 days ago' },
  { id: 2, title: 'Full Stack Intern', company: 'NafTech', location: 'Oran', type: 'On-site', duration: '2 months', sector: 'Tech', tags: ['Node.js', 'MongoDB'], match: 88, date: '5 days ago' },
  { id: 3, title: 'Software Engineer Intern', company: 'Yassir', location: 'Alger', type: 'Remote', duration: '3-6 months', sector: 'Logistics', tags: ['Python', 'Docker'], match: 85, date: '1 week ago' },
  { id: 4, title: 'UI/UX Designer Intern', company: 'TemTem', location: 'Alger', type: 'Hybrid', duration: '1 month', sector: 'Transportation', tags: ['Figma', 'UI/UX'], match: 82, date: '3 days ago' },
  { id: 5, title: 'Backend Intern', company: 'Ooredoo', location: 'Alger', type: 'On-site', duration: '3-6 months', sector: 'Telecom', tags: ['Java', 'Spring'], match: 78, date: 'Just now' },
  { id: 6, title: 'Marketing Intern', company: 'Condor', location: 'Bordj Bou Arreridj', type: 'On-site', duration: '2 months', sector: 'Electronics', tags: ['SEO', 'Content'], match: 75, date: '4 days ago' },
];

const StudentOffers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: 'All',
    type: 'All',
    duration: 'All'
  });

  const filteredOffers = allOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         offer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filters.location === 'All' || offer.location === filters.location;
    const matchesType = filters.type === 'All' || offer.type === filters.type;
    const matchesDuration = filters.duration === 'All' || offer.duration === filters.duration;
    
    return matchesSearch && matchesLocation && matchesType && matchesDuration;
  });

  return (
    <div className="db">
      <StudentSidebar />
      <main className="main">
        
        {/* ── Top Bar ── */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">Explore Internship Offers</h1>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
              Find the perfect internship that matches your academic goals and skills.
            </p>
          </div>
          <div className="topbar-right">
            <div className="search-box-wrap">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#9ca3af" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input 
                type="text" 
                placeholder="Search by role or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* ── Filters ── */}
        <div className="offers-filter-bar">
          <div className="filter-group">
            <label>Location</label>
            <select value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})}>
              <option>All</option>
              <option>Alger</option>
              <option>Oran</option>
              <option>Bordj Bou Arreridj</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Type</label>
            <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
              <option>All</option>
              <option>Hybrid</option>
              <option>Remote</option>
              <option>On-site</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Duration</label>
            <select value={filters.duration} onChange={(e) => setFilters({...filters, duration: e.target.value})}>
              <option>All</option>
              <option>1 month</option>
              <option>2 months</option>
              <option>3-6 months</option>
            </select>
          </div>
          <button className="reset-filter" onClick={() => setFilters({location: 'All', type: 'All', duration: 'All'})}>
            Reset Filters
          </button>
        </div>

        {/* ── Offers List ── */}
        <div className="offers-results-count">
          Showing {filteredOffers.length} available offers
        </div>

        <div className="student-offers-grid">
          {filteredOffers.map(o => (
            <div key={o.id} className="offer-item-card">
              <div className="offer-card-head">
                <div className="company-info-row">
                  <div className="company-logo-mini">{o.company.charAt(0)}</div>
                  <div className="company-name-tag">{o.company}</div>
                </div>
                <div className="offer-match-score">
                  <div className="match-score-dot" />
                  {o.match}% Match
                </div>
              </div>

              <h2 className="offer-item-title">{o.title}</h2>
              
              <div className="offer-item-details">
                <div className="detail-tag">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  {o.location}
                </div>
                <div className="detail-tag">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 4V2a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  {o.type}
                </div>
                <div className="detail-tag">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {o.duration}
                </div>
              </div>

              <div className="offer-item-tags">
                {o.tags.map(tag => (
                  <span key={tag} className="offer-skill-pill">{tag}</span>
                ))}
              </div>

              <div className="offer-card-footer">
                <span className="posted-time">{o.date}</span>
                <button className="apply-offer-btn">View Details</button>
              </div>
            </div>
          ))}

          {filteredOffers.length === 0 && (
            <div className="no-offers-found">
              <div className="no-offers-icon">🔍</div>
              <h3>No offers match your search</h3>
              <p>Try adjusting your filters or search terms to find more results.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentOffers;

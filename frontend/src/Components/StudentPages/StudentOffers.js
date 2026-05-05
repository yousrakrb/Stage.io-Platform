import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOffers, applyToOffer, getPublicCompanyProfile } from '../../api';
import StudentSidebar from '../UnifiedLayouts/StudentSidebar';
import '../StudentDash/StudentDash.css';
import './StudentPages.css';

const CompanyTag = ({ companyId, navigate }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getPublicCompanyProfile(companyId);
        setCompany(data);
      } catch (err) {
        console.error('Error fetching company for tag:', err);
      } finally {
        setLoading(false);
      }
    };
    if (companyId) fetchCompany();
  }, [companyId]);

  if (loading) return <div className="company-info-row"><div className="company-logo-mini">...</div><div className="company-name-tag">Loading...</div></div>;

  const logoUrl = company?.logo_url ? `http://127.0.0.1:8000${company.logo_url}` : null;
  const name = company?.company_name || 'Company';

  return (
    <div className="company-info-row" onClick={(e) => { e.stopPropagation(); navigate(`/company-profile/${companyId}`); }} style={{ cursor: 'pointer' }}>
      <div className="company-logo-mini">
        {logoUrl ? <img src={logoUrl} alt="logo" style={{width:'100%', height:'100%', borderRadius:'4px', objectFit:'cover'}} /> : name.charAt(0)}
      </div>
      <div className="company-name-tag" style={{ textDecoration: 'underline', color: '#212EA0' }}>{name}</div>
    </div>
  );
};

const StudentOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: 'All',
    type: 'All',
    skill: ''
  });

  useEffect(() => {
    const fetchOffers = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in to view offers.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getOffers();
        // Ensure data is an array
        const offersList = Array.isArray(data) ? data : [];
        setOffers(offersList.filter(o => o.is_active !== false));
        setError(null);
      } catch (err) {
        console.error('Full Error Object:', err);
        const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to fetch offers.';
        setError(`${errorMsg}. Please ensure you are logged in and your connection is stable.`);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleApply = async (offerId) => {
    try {
      await applyToOffer(offerId);
      alert('Applied successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply.');
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      location: 'All',
      type: 'All',
      skill: ''
    });
  };

  const filteredOffers = (offers || []).filter(offer => {
    // Search matches title or location (since company name is fetched async in CompanyTag, we search title for now or company_id if needed)
    const matchesSearch = (offer.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = filters.location === 'All' || 
                           (offer.wilaya || '').toLowerCase() === filters.location.toLowerCase();
                           
    const matchesType = filters.type === 'All' || 
                       (offer.type || '').toLowerCase() === filters.type.toLowerCase();
    
    // Skill filter: search in required_skills array
    const matchesSkill = filters.skill === '' || (offer.required_skills || []).some(s => 
      s.toLowerCase().includes(filters.skill.toLowerCase())
    );
    
    return matchesSearch && matchesLocation && matchesType && matchesSkill;
  });

  // Extract unique wilayas and types for filters
  const locations = ['All', ...new Set((offers || []).map(o => o.wilaya).filter(Boolean))];
  const types = ['All', ...new Set((offers || []).map(o => o.type).filter(Boolean))];

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
            <div className="search-box-wrap" style={{ position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="7" cy="7" r="5" stroke="#9ca3af" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input 
                type="text" 
                placeholder="Search by role or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px', height: '40px', borderRadius: '10px', border: '1px solid #e8e8e8', width: '280px' }}
              />
            </div>
          </div>
        </header>

        {/* ── Filters ── */}
        <div className="offers-filter-bar">
          <div className="filter-group">
            <label>Location</label>
            <select value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})}>
              {locations.map(loc => <option key={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Work Type</label>
            <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Skills</label>
            <input 
              type="text" 
              placeholder="e.g. React, Adobe, Financial Analysis" 
              value={filters.skill}
              onChange={(e) => setFilters({...filters, skill: e.target.value})}
            />
          </div>
          <button className="reset-filter" onClick={handleReset}>
            Reset Filters
          </button>
        </div>

        {/* ── Offers List ── */}
        <div className="offers-results-count">
          {loading ? 'Fetching opportunities...' : error ? 'Error loading offers' : `Showing ${filteredOffers.length} available offers`}
        </div>

        <div className="student-offers-grid">
          {loading && (
            <div className="loading-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #212EA0', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <p style={{ color: '#666' }}>Scanning for best matches...</p>
            </div>
          )}

          {error && (
            <div className="no-offers-found" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>
              <div className="no-offers-icon">⚠️</div>
              <h3 style={{ color: '#991b1b' }}>Something went wrong</h3>
              <p style={{ color: '#b91c1c' }}>{error}</p>
              <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 16px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Retry</button>
            </div>
          )}

          {!loading && !error && filteredOffers.length > 0 && filteredOffers.map(o => (
            <div key={o.id} className="offer-item-card">
              <div className="offer-card-head">
                <CompanyTag companyId={o.company_id} navigate={navigate} />
                <div className="offer-match-score">
                  <div className="match-score-dot" />
                  94% Match
                </div>
              </div>

              <h2 className="offer-item-title">{o.title}</h2>
              
              <div className="offer-item-details">
                <div className="detail-tag">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  {o.wilaya || 'Remote'}
                </div>
                <div className="detail-tag">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 4V2a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  {o.type || 'Hybrid'}
                </div>
                <div className="detail-tag">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {o.duration || '3-6 months'}
                </div>
              </div>

              <div className="offer-item-tags">
                {o.required_skills && o.required_skills.map((tag, idx) => (
                  <span key={idx} className="offer-skill-pill">{tag}</span>
                ))}
              </div>

              <div className="offer-card-footer">
                <span className="posted-time">{new Date(o.created_at).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="apply-offer-btn" style={{ background: '#f3f4f6', color: '#374151' }} onClick={() => navigate(`/company-profile/${o.company_id}`)}>Company</button>
                  <button className="apply-offer-btn" onClick={() => handleApply(o.id)}>Apply Now</button>
                </div>
              </div>
            </div>
          ))}

          {!loading && !error && filteredOffers.length === 0 && (
            <div className="no-offers-found">
              <div className="no-offers-icon">🔍</div>
              <h3>{offers.length === 0 ? 'No offers available' : 'No matches found'}</h3>
              <p>
                {offers.length === 0 
                  ? "There are currently no internship offers in the database." 
                  : "We couldn't find any offers matching your current filters. Try resetting them!"}
              </p>
              {offers.length > 0 && (
                <button className="reset-filter" onClick={handleReset} style={{ marginTop: '16px' }}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentOffers;


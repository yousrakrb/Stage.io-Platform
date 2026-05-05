import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOffers } from '../../api';
import './Offers.css';



const tagColorMap = { blue: 'pb', teal: 'pt', gray: 'pg', purple: 'ppu', amber: 'pa' };
const avColorMap  = { blue: 'av-blue', teal: 'av-teal', amber: 'av-amber' };

const Offers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOffers();
        setOffers(data);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('Failed to load offers.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading offers...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className="offers-page">
      <nav className="op-nav">
        <div className="op-nav-brand">
          <div className="op-back-btn" onClick={() => navigate('/profile')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          StageLink Offers
        </div>
        <button className="op-btn-primary" onClick={() => navigate('/add-offer')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12m6-6H2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Add Offer
        </button>
      </nav>

      <div className="op-container">
        <div className="op-header">
           <h1>Active Internship Offers</h1>
           <p>Manage and track the performance of your company's internship placements.</p>
        </div>

        <div className="op-grid">
          {offers.length === 0 ? (
            <div style={{ padding: '20px', color: '#6b7280' }}>No offers posted yet.</div>
          ) : (
            offers.map((o) => {
              const initials = o.title ? o.title.substring(0, 2).toUpperCase() : 'OF';
              const colorKeys = ['blue', 'teal', 'amber'];
              const colorObj = colorKeys[o.id % colorKeys.length];
              const isActive = o.is_active !== undefined ? o.is_active : true;
              
              return (
                <div className="op-card" key={o.id}>
                  <div className="op-card-top">
                    <div className={`op-av ${avColorMap[colorObj]}`}>{initials}</div>
                    <div className="op-status-wrap">
                      <div className={isActive ? 'op-dot-green' : 'op-dot-gray'} />
                      <span className={isActive ? 'op-ind-open' : 'op-ind-closed'}>{isActive ? 'Accepting Applications' : 'Closed'}</span>
                    </div>
                  </div>
                  <h3 className="op-title">{o.title}</h3>
                  <p className="op-location">{o.location || o.work_model || 'Not specified'}</p>
                  
                  <div className="op-tags">
                    {o.tags ? o.tags.map((t, idx) => {
                      const tagName = typeof t === 'string' ? t : t.name;
                      return <span key={idx} className={`op-pill pg`}>{tagName}</span>
                    }) : <span className="op-pill pg">No tags</span>}
                  </div>

                  <div className="op-footer">
                    <div className="op-count">
                      <strong>{o.applicant_count || 0}</strong> applicants
                    </div>
                    <div className="op-date">{new Date(o.created_at).toLocaleDateString()}</div>
                  </div>

                  <div className="op-card-actions">
                    <button className="op-btn-outline" onClick={() => navigate(`/candidates?offer=${o.id}`)}>View Applicants</button>
                    <button className="op-btn-text">Edit</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Offers;

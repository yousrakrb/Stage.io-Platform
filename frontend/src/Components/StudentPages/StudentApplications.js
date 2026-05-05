import React, { useState, useEffect } from 'react';
import StudentSidebar from '../UnifiedLayouts/StudentSidebar';
import { getMyApplications, downloadApplication } from '../../api';
import '../StudentDash/StudentDash.css';
import './StudentPages.css';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleDownload = async (appId) => {
    try {
      const blob = await downloadApplication(appId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `convention_${appId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download convention.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="db">
      <StudentSidebar />
      <main className="main">
        <header className="topbar">
          <h1 className="page-title">My Applications</h1>
        </header>

        <div className="apps-container">
          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading applications...</p>
          ) : applications.length === 0 ? (
            <div className="no-offers-found">
              <div className="no-offers-icon">📁</div>
              <h3>No applications yet</h3>
              <p>You haven't applied to any internship offers yet. Go to "Explore Offers" to find matches!</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app.id} className={`app-detail-card ${expandedId === app.id ? 'expanded' : ''}`} onClick={() => toggleExpand(app.id)} style={{ cursor: 'pointer' }}>
                <div className="app-detail-header">
                  <div className="app-co-info">
                    <div className={`co-av ${app.status === 'accepted' || app.status === 'validated' ? 'teal' : app.status === 'refused' ? 'purple' : 'blue'}`}>
                      {app.offer?.company?.company_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="app-title-text">{app.offer?.title || 'Unknown Offer'}</h3>
                      <p className="app-company-text">{app.offer?.company?.company_name || 'Company'} • {app.offer?.location || 'Alger'}</p>
                    </div>
                  </div>
                  <div className={`status s-${app.status}`}>
                    {app.status}
                  </div>
                </div>
                
                {(expandedId === app.id || app.status === 'validated') && (
                  <div className="app-detail-body" onClick={(e) => e.stopPropagation()}>
                    <p className="app-description">
                      {app.status === 'pending' && "Your application has been received and is currently being reviewed by the company's recruitment team."}
                      {app.status === 'accepted' && "Great news! Your application has been accepted. The company will contact you soon for the next steps."}
                      {app.status === 'refused' && "Thank you for your interest. Unfortunately, the company has decided not to proceed with your application at this time."}
                      {app.status === 'validated' && "Congratulations! Your internship has been officially validated by the university. You can now download your convention."}
                    </p>
                    <div className="app-meta">
                      <span className="app-date">Applied on {new Date(app.created_at).toLocaleDateString()}</span>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {app.status === 'validated' && (
                          <button className="download-btn" onClick={() => handleDownload(app.id)}>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M8 2v8m0 0l3-3m-3 3L5 7m10 5v1a2 2 0 01-2 2H3a2 2 0 01-2-2v-1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Download Convention
                          </button>
                        )}
                        <button className="app-action-btn" onClick={() => toggleExpand(app.id)}>
                          {expandedId === app.id ? 'Show Less' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentApplications;


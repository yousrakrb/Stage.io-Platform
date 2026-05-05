import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCompanyApplications, updateApplicationDecision, getPublicStudentProfile, downloadStudentCV } from '../../api';
import './Candidates.css';

const statusColorMap = {
  pending: 'yellow',
  accepted: 'green',
  refused: 'red',
  validated: 'blue'
};

const CandidateCard = ({ application, onDecision }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvLoading, setCvLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (application.student_id) {
          const data = await getPublicStudentProfile(application.student_id);
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [application.student_id]);

  const handleViewCV = async () => {
    if (!application.student_id) return;
    setCvLoading(true);
    try {
      const blob = await downloadStudentCV(application.student_id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error downloading CV:', err);
      alert('Failed to download CV.');
    } finally {
      setCvLoading(false);
    }
  };

  if (loading) return <div className="cand-card loading">Loading profile...</div>;

  const studentName = profile?.full_name || application.student_name || 'Student';
  const initials = studentName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const university = profile?.university || 'Independent';
  const skills = profile?.skills || [];
  const status = application.status || 'pending';
  const studentType = profile?.student_type || 'independent';

  // Fix 3: Status logic based on student type
  let statusText = status.charAt(0).toUpperCase() + status.slice(1);
  if (status === 'accepted') {
    if (studentType === 'independent') {
      statusText = 'Fully Accepted';
    } else {
      statusText = 'Waiting for Univ';
    }
  } else if (status === 'validated') {
    statusText = 'Fully Validated';
  }

  return (
    <div className="cand-card">
      <div className="cand-card-top">
        <div className="cand-identity">
          {profile?.avatar_url ? (
            <img src={`http://127.0.0.1:8000${profile.avatar_url}`} alt="Avatar" className="cand-av-img" />
          ) : (
            <div className="cand-av initials-av" style={{ backgroundColor: '#212EA0', color: '#fff' }}>{initials}</div>
          )}
          <div>
            <h3 className="cand-name" onClick={() => navigate(`/student-profile/${application.student_id}`)} style={{ cursor: 'pointer' }}>
              {studentName}
            </h3>
            <p className="cand-uni">{university}</p>
          </div>
        </div>
        <div className={`cand-status-badge ${status} ${studentType === 'independent' && status === 'accepted' ? 'validated' : ''}`}>
          {statusText}
        </div>
      </div>
      
      <div className="cand-role-wrap">
        <span className="cr-label">Applying for:</span> <span className="cr-val">{application.offer_title}</span>
      </div>

      <div className="cand-tags">
        {skills.length > 0 ? skills.slice(0, 3).map((s, idx) => {
          const sName = typeof s === 'string' ? s : s.name;
          return <span key={idx} className="cand-pill pg">{sName}</span>
        }) : <span className="cand-pill pg">No skills listed</span>}
      </div>

      <div className="cand-card-actions">
        {status === 'pending' && (
          <>
            <button className="cand-btn-primary" onClick={() => onDecision(application.id, 'accepted')}>Accept</button>
            <button className="cand-btn-outline" onClick={() => onDecision(application.id, 'refused')}>Reject</button>
          </>
        )}
        {status === 'accepted' && studentType !== 'independent' && (
          <button className="cand-btn-outline" disabled>Waiting for Univ</button>
        )}
        {(status === 'validated' || (status === 'accepted' && studentType === 'independent')) && (
          <button className="cand-btn-primary" style={{ background: '#212EA0' }} disabled>Finalized</button>
        )}
        {profile?.cv_url && (
          <button className="cand-btn-outline" onClick={handleViewCV} disabled={cvLoading}>
            {cvLoading ? 'Loading CV...' : 'View CV'}
          </button>
        )}
      </div>
    </div>
  );
};

const Candidates = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const offerIdFilter = searchParams.get('offer');
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All'); // All, New, In Review, Accepted

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getCompanyApplications();
        const filtered = offerIdFilter ? data.filter(a => String(a.offer_id) === offerIdFilter) : data;
        setApplications(filtered);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load candidates.');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [offerIdFilter]);

  const handleDecision = async (appId, decision) => {
    try {
      await updateApplicationDecision(appId, { decision });
      setApplications(applications.map(a => a.id === appId ? { ...a, status: decision } : a));
    } catch (err) {
      alert('Failed to update decision.');
    }
  };

  const filteredApps = applications.filter(app => {
    if (filter === 'All') return true;
    if (filter === 'New') return app.status === 'pending';
    if (filter === 'In Review') return app.status === 'accepted';
    if (filter === 'Accepted') return app.status === 'validated';
    return true;
  });

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading candidates...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className="cand-page">
      <nav className="cand-nav">
        <div className="cand-nav-brand">
          Candidates Tracker
        </div>
      </nav>

      <div className="cand-container">
        <div className="cand-header">
           <h1>Pool of Applicants</h1>
           <p>Review and engage with top talent applying to your offers.</p>
        </div>

        <div className="cand-filters">
           {['All', 'New', 'In Review', 'Accepted'].map(f => (
             <button 
               key={f}
               className={`cf-btn ${filter === f ? 'active' : ''}`}
               onClick={() => setFilter(f)}
             >
               {f === 'All' ? 'All Candidates' : f}
             </button>
           ))}
        </div>

        <div className="cand-grid">
          {filteredApps.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3>No candidates found</h3>
              <p>Try changing your filter or check back later.</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <CandidateCard key={app.id} application={app} onDecision={handleDecision} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidates;

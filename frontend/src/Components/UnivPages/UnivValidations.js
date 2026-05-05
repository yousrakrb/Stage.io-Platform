import React, { useState, useEffect } from 'react';
import { getPendingApplications, validateApplication } from '../../api';
import UnivSidebar from '../UnifiedLayouts/UnivSidebar';
import '../UnivDash/UnivDash.css';
import './UnivPages.css';



const avMap = { blue: 'av-blue', teal: 'av-teal', purple: 'av-purple', amber: 'av-amber' };

const UnivValidations = () => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const data = await getPendingApplications();
      setPendingList(data);
    } catch (error) {
      console.error('Error fetching pending applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await validateApplication(id, { status });
      setPendingList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to update application status.');
    }
  };

  return (
    <div className="db">
      <UnivSidebar />
      <main className="main">
        <header className="topbar">
          <h1 className="page-title">Pending Validations</h1>
        </header>

        <div className="univ-pages-container">
          {loading ? <p style={{textAlign: 'center', padding: '20px'}}>Loading...</p> : null}
          {pendingList.map(p => {
            const studentName = p.student?.full_name || 'Student';
            const initials = studentName.substring(0, 2).toUpperCase();
            const colorKeys = ['blue', 'teal', 'purple', 'amber'];
            const colorObj = colorKeys[p.id % colorKeys.length];
            const companyName = p.offer?.company?.company_name || 'Company';
            const offerTitle = p.offer?.title || 'Offer';
            const detail = `${p.offer?.location || 'Alger'} · ${p.offer?.work_model || 'Présentiel'} · ${p.offer?.duration || 3} months`;
            const appliedDate = new Date(p.applied_at).toLocaleDateString();

            return (
              <div key={p.id} className="univ-card univ-val-card">
                <div className="univ-card-row">
                  <div className={`val-av av-${colorObj}`}>{initials}</div>
                  <div className="univ-val-info">
                    <h3>{studentName}</h3>
                    <p className="univ-val-co">{offerTitle} @ {companyName}</p>
                    <p className="univ-val-meta">{detail}</p>
                    <p className="univ-val-date">Applied on {appliedDate}</p>
                  </div>
                  <div className="univ-val-actions">
                    <button className="btn-validate" onClick={() => handleAction(p.id, 'validated')}>Validate</button>
                    <button className="btn-reject" onClick={() => handleAction(p.id, 'rejected')}>Reject</button>
                  </div>
                </div>
              </div>
            );
          })}
          {pendingList.length === 0 && !loading && <p className="empty-msg">No pending validations.</p>}
        </div>
      </main>
    </div>
  );
};

export default UnivValidations;

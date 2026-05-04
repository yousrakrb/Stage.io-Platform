import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AddOffer.css';

const AddOffer = () => {
  const navigate = useNavigate();

  return (
    <div className="ao-page">
      <nav className="ao-nav">
        <div className="ao-nav-brand">
          <div className="ao-back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          Create New Offer
        </div>
      </nav>

      <div className="ao-container">
        <div className="ao-header">
           <h1>Post an Internship Offer</h1>
           <p>Fill out the details below to attract the best student talent for your company.</p>
        </div>

        <form className="ao-form" onSubmit={(e) => { e.preventDefault(); navigate('/?tab=offers'); }}>
           <div className="ao-form-card">
              <h3>Basic Information</h3>
              
              <div className="ao-form-group">
                 <label>Job Title</label>
                 <input type="text" placeholder="e.g. Full Stack Web Developer Intern" required />
              </div>

              <div className="ao-row">
                 <div className="ao-form-group">
                    <label>Work Type</label>
                    <select>
                      <option>On-site</option>
                      <option>Hybrid</option>
                      <option>Remote</option>
                    </select>
                 </div>
                 <div className="ao-form-group">
                    <label>Location</label>
                    <input type="text" placeholder="e.g. Oran, Algeria" required />
                 </div>
              </div>
              
              <div className="ao-row">
                 <div className="ao-form-group">
                    <label>Duration (Months)</label>
                    <input type="number" placeholder="e.g. 3" required min="1" max="12" />
                 </div>
                 <div className="ao-form-group">
                    <label>Positions Available</label>
                    <input type="number" placeholder="e.g. 2" required min="1" />
                 </div>
              </div>
           </div>

           <div className="ao-form-card">
              <h3>Requirements & Details</h3>
              
              <div className="ao-form-group">
                 <label>Required Skills (Comma separated)</label>
                 <input type="text" placeholder="e.g. React, Node.js, PostgreSQL" required />
              </div>

              <div className="ao-form-group">
                 <label>Job Description</label>
                 <textarea placeholder="Describe the responsibilities, project details, and what the intern will learn..." rows="6" required></textarea>
              </div>
           </div>

           <div className="ao-actions">
              <button type="button" className="ao-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="ao-btn-submit">Publish Offer</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default AddOffer;

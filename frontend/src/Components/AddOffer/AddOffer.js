import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createOffer, updateOffer, getMyOffers } from '../../api';
import './AddOffer.css';

const AddOffer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [formData, setFormData] = useState({
    title: '',
    work_model: 'On-site',
    location: '',
    duration: '',
    positions_available: '1',
    tags: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      const fetchOffer = async () => {
        try {
          const offers = await getMyOffers();
          const offer = offers.find(o => String(o.id) === String(editId));
          if (offer) {
            const revMapping = {
              'presentiel': 'On-site',
              'hybride': 'Hybrid',
              'remote': 'Remote'
            };
            setFormData({
              title: offer.title || '',
              work_model: revMapping[offer.type] || 'On-site',
              location: offer.wilaya || '',
              duration: offer.duration || '',
              positions_available: offer.positions_available || '1',
              tags: Array.isArray(offer.required_skills) ? offer.required_skills.join(', ') : '',
              description: offer.description || ''
            });
          }
        } catch (err) {
          console.error('Error fetching offer details:', err);
          alert('Failed to load offer details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchOffer();
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const typeMapping = {
        'On-site': 'presentiel',
        'Hybrid': 'hybride',
        'Remote': 'remote'
      };

      const payload = {
        title: formData.title,
        description: formData.description,
        required_skills: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
        wilaya: formData.location,
        type: typeMapping[formData.work_model] || 'presentiel',
        duration: formData.duration
      };

      if (editId) {
        await updateOffer(editId, payload);
        alert('Offer updated successfully!');
      } else {
        await createOffer(payload);
        alert('Offer created successfully!');
      }
      navigate(-1);
    } catch (error) {
      console.error('Error saving offer:', error);
      alert(error.response?.data?.error || 'Failed to save offer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ao-page">
      <nav className="ao-nav">
        <div className="ao-nav-brand">
          <div className="ao-back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {editId ? 'Edit Offer' : 'Create New Offer'}
        </div>
      </nav>
      {isLoading ? (
        <div style={{ padding: '50px', textAlign: 'center' }}>Loading offer details...</div>
      ) : (
        <div className="ao-container">
          <div className="ao-header">
             <h1>{editId ? 'Edit Internship Offer' : 'Post an Internship Offer'}</h1>
             <p>Fill out the details below to attract the best student talent for your company.</p>
          </div>

        <form className="ao-form" onSubmit={handleSubmit}>
           <div className="ao-form-card">
              <h3>Basic Information</h3>
              
              <div className="ao-form-group">
                 <label>Job Title</label>
                  <input type="text" placeholder="e.g. Full Stack Web Developer Intern" required 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="ao-row">
                 <div className="ao-form-group">
                    <label>Work Type</label>
                    <select value={formData.work_model} onChange={e => setFormData({...formData, work_model: e.target.value})}>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </select>
                 </div>
                 <div className="ao-form-group">
                    <label>Location</label>
                    <input type="text" placeholder="e.g. Oran, Algeria" required 
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
              </div>
              
              <div className="ao-row">
                 <div className="ao-form-group">
                    <label>Duration (Months)</label>
                    <input type="number" placeholder="e.g. 3" required min="1" max="12" 
                      value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                 </div>
                 <div className="ao-form-group">
                    <label>Positions Available</label>
                    <input type="number" placeholder="e.g. 2" required min="1" 
                      value={formData.positions_available} onChange={e => setFormData({...formData, positions_available: e.target.value})} />
                 </div>
              </div>
           </div>

           <div className="ao-form-card">
              <h3>Requirements & Details</h3>
              
              <div className="ao-form-group">
                 <label>Required Skills (Comma separated)</label>
                  <input type="text" placeholder="e.g. React, Node.js, PostgreSQL" required 
                    value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
              </div>

              <div className="ao-form-group">
                 <label>Job Description</label>
                  <textarea placeholder="Describe the responsibilities, project details, and what the intern will learn..." rows="6" required
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
           </div>

           <div className="ao-actions">
              <button type="button" className="ao-btn-cancel" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancel</button>
               <button type="submit" className="ao-btn-submit" disabled={isSubmitting}>
                 {isSubmitting ? 'Saving...' : (editId ? 'Save Changes' : 'Publish Offer')}
               </button>
            </div>
         </form>
       </div>
      )}
    </div>
  );
};

export default AddOffer;

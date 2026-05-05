import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { getCV, saveCV, downloadCV } from '../../api';
import './CvBuilder.css';

const CvBuilder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    profession: '',
    email: user?.email || '',
    phone: '',
    wilaya: '',
    university: '',
    aboutMe: '',
    education: {
      university: '',
      major: '',
      specialty: '',
      graduationYear: ''
    },
    skills: [],
    languages: [],
    experiences: [],
    certifications: '',
    links: {
      github: '',
      portfolio: ''
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const data = await getCV();
        if (data && Object.keys(data).length > 0) {
          setFormData({
            fullName: user?.name || '', 
            profession: data.speciality || '',
            email: user?.email || '',
            phone: data.phone || '',
            wilaya: data.wilaya || '',
            aboutMe: data.bio || '',
            education: {
              university: data.university || '',
              major: data.major || '',
              specialty: data.speciality || '',
              graduationYear: data.graduation_year || ''
            },
            skills: (data.skills || []).map(s => ({ name: s.name || s, level: s.percentage || 50 })),
            languages: (data.languages || []).map(l => ({ name: l.name || l, level: l.percentage || 50 })),
            experiences: (data.experiences || []).map(e => ({ 
              title: e.title || '', 
              company: e.company || '', 
              duration: e.duration || '', 
              desc: e.description || '' 
            })),
            certifications: Array.isArray(data.certifications) ? data.certifications.join(', ') : (data.certifications || ''),
            links: {
              github: data.github_link || '',
              portfolio: data.portfolio_link || ''
            }
          });
        }
      } catch (err) {
        console.error('Error fetching CV:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

  const handleSave = async () => {
    try {
      // Map frontend structure to backend expected fields
      const payload = {
        bio: formData.aboutMe,
        wilaya: formData.wilaya,
        phone: formData.phone,
        university: formData.education.university,
        major: formData.education.major,
        speciality: formData.education.specialty,
        graduation_year: formData.education.graduationYear,
        github_link: formData.links.github,
        portfolio_link: formData.links.portfolio,
        // Map 'level' to 'percentage' for backend
        skills: formData.skills.map(s => ({ name: s.name, percentage: s.level })),
        languages: formData.languages.map(l => ({ name: l.name, percentage: l.level })),
        experiences: formData.experiences.map(e => ({ 
          title: e.title, 
          company: e.company, 
          duration: e.duration, 
          description: e.desc 
        })),
        certifications: Array.isArray(formData.certifications) 
          ? formData.certifications 
          : formData.certifications.split(',').map(c => c.trim()).filter(c => c)
      };

      await saveCV(payload);
      alert('CV saved successfully!');
    } catch (err) {
      console.error('Error saving CV:', err);
      alert('Failed to save CV. Check console for details.');
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadCV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'My_CV.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading CV:', err);
      alert('Failed to download CV. Make sure you saved it first.');
    }
  };

  const handleChange = (e, section, field, index) => {
    const { name, value } = e.target;
    if (section) {
      if (index !== undefined) {
        const updatedList = [...formData[section]];
        updatedList[index][field] = value;
        setFormData({ ...formData, [section]: updatedList });
      } else if (field) {
        setFormData({ ...formData, [section]: { ...formData[section], [field]: value } });
      } else {
        setFormData({ ...formData, [section]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addListItem = (section, item) => {
    setFormData({ ...formData, [section]: [...formData[section], item] });
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading CV Builder...</div>

  return (
    <div className="cv-builder-container">
      {/* Main Content: Form */}
      <main className="cv-main">
        <div className="cv-header-actions">
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="cv-back-btn" onClick={() => navigate('/student-dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <button className="cv-save-btn" onClick={handleSave} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', padding: '0 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save CV
            </button>
          </div>
          <div className="cv-sidebar-title">CV Builder</div>
        </div>

        <div className="cv-form-section">
          <h2>Personal Information</h2>
          <div className="cv-grid">
            <div className="cv-field">
              <label>Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="cv-field">
              <label>Profession</label>
              <input name="profession" value={formData.profession} onChange={handleChange} />
            </div>
            <div className="cv-field">
              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="cv-field">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="cv-field">
              <label>Wilaya</label>
              <input name="wilaya" value={formData.wilaya} onChange={handleChange} />
            </div>
          </div>
          <div className="cv-field">
            <label>About Me</label>
            <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} />
          </div>

          <hr />

          <h2>Education</h2>
          <div className="cv-grid">
            <div className="cv-field">
              <label>University</label>
              <input value={formData.education.university} onChange={(e) => handleChange(e, 'education', 'university')} />
            </div>
            <div className="cv-field">
              <label>Major</label>
              <input value={formData.education.major} onChange={(e) => handleChange(e, 'education', 'major')} />
            </div>
            <div className="cv-field">
              <label>Specialty</label>
              <input value={formData.education.specialty} onChange={(e) => handleChange(e, 'education', 'specialty')} />
            </div>
            <div className="cv-field">
              <label>Graduation Year</label>
              <input value={formData.education.graduationYear} onChange={(e) => handleChange(e, 'education', 'graduationYear')} />
            </div>
          </div>

          <hr />

          <h2>Skills</h2>
          {formData.skills.map((s, i) => (
            <div key={i} className="cv-grid-3">
              <input placeholder="Skill Name" value={s.name} onChange={(e) => handleChange(e, 'skills', 'name', i)} />
              <input type="number" placeholder="Level %" value={s.level} onChange={(e) => handleChange(e, 'skills', 'level', i)} />
            </div>
          ))}
          <button className="cv-add-btn" onClick={() => addListItem('skills', { name: '', level: 50 })}>+ Add Skill</button>

          <hr />

          <h2>Experiences</h2>
          {formData.experiences.map((exp, i) => (
            <div key={i} className="cv-exp-block">
              <div className="cv-grid">
                <input placeholder="Job Title" value={exp.title} onChange={(e) => handleChange(e, 'experiences', 'title', i)} />
                <input placeholder="Company" value={exp.company} onChange={(e) => handleChange(e, 'experiences', 'company', i)} />
                <input placeholder="Duration" value={exp.duration} onChange={(e) => handleChange(e, 'experiences', 'duration', i)} />
              </div>
              <textarea placeholder="Description" value={exp.desc} onChange={(e) => handleChange(e, 'experiences', 'desc', i)} />
            </div>
          ))}
          <button className="cv-add-btn" onClick={() => addListItem('experiences', { title: '', company: '', duration: '', desc: '' })}>+ Add Experience</button>
          <hr />

          <h2>Certifications</h2>
          <div className="cv-field">
            <textarea placeholder="e.g. Python Certificate, Django REST Framework" value={formData.certifications} onChange={(e) => handleChange(e, 'certifications')} />
          </div>

          <hr />

          <h2>Links</h2>
          <div className="cv-grid">
            <div className="cv-field">
              <label>GitHub</label>
              <input value={formData.links.github} onChange={(e) => handleChange(e, 'links', 'github')} />
            </div>
            <div className="cv-field">
              <label>Portfolio</label>
              <input value={formData.links.portfolio} onChange={(e) => handleChange(e, 'links', 'portfolio')} />
            </div>
          </div>

          <div className="cv-form-footer">
            <button className="cv-download-btn-middle" onClick={handleDownload}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </main>

      {/* Live Preview */}
      <section className="cv-preview">
        <div className="cv-paper">
          <header className="cv-paper-header">
            <h1>{formData.fullName}</h1>
            <p className="cv-paper-sub">{formData.profession}</p>
            <div className="cv-paper-contact">
              <span>{formData.email}</span> • <span>{formData.phone}</span> • <span>{formData.wilaya}</span>
            </div>
            <div className="cv-paper-contact">
              <span>{formData.education.university}</span>
            </div>
          </header>

          <div className="cv-paper-body">
            <section className="cv-paper-section">
              <h3>ABOUT ME</h3>
              <p>{formData.aboutMe}</p>
            </section>

            <section className="cv-paper-section">
              <h3>EDUCATION</h3>
              <div className="cv-paper-item">
                <strong>{formData.education.university}</strong>
                <p>{formData.education.major} | {formData.education.specialty}</p>
                <p className="cv-paper-date">Class of {formData.education.graduationYear}</p>
              </div>
            </section>

            <section className="cv-paper-section">
              <h3>SKILLS</h3>
              <div className="cv-paper-skills">
                {formData.skills.map((s, i) => (
                  <div key={i} className="cv-paper-skill">
                    <div className="cv-paper-skill-row">
                      <span>{s.name}</span>
                      <span>{s.level}%</span>
                    </div>
                    <div className="cv-paper-skill-bar">
                      <div className="cv-paper-skill-fill" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="cv-paper-section">
              <h3>EXPERIENCES</h3>
              {formData.experiences.map((exp, i) => (
                <div key={i} className="cv-paper-item">
                  <div className="cv-paper-item-head">
                    <strong>{exp.title} @ {exp.company}</strong>
                    <span>{exp.duration}</span>
                  </div>
                  <p>{exp.desc}</p>
                </div>
              ))}
            </section>
            
            <section className="cv-paper-section">
              <h3>CERTIFICATIONS</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{formData.certifications}</p>
            </section>
            
            <section className="cv-paper-section">
              <h3>LINKS</h3>
              <p>GitHub: {formData.links.github}</p>
              <p>Portfolio: {formData.links.portfolio}</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CvBuilder;

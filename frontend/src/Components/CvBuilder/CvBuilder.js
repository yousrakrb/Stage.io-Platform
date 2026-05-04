import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CvBuilder.css';

const CvBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: 'Amine Khelifi',
    profession: 'Web Development',
    email: 'amine.k@email.com',
    phone: '0555 12 34 56',
    wilaya: 'Alger',
    university: 'Univ. Alger 1',
    aboutMe: 'Passionate software engineering student with experience in web development.',
    education: {
      university: 'Univ. Alger 1',
      major: 'Computer Science',
      specialty: 'Software Engineering',
      graduationYear: '2026'
    },
    skills: [
      { name: 'React', level: 90 },
      { name: 'Node.js', level: 85 }
    ],
    languages: [
      { name: 'Arabic', level: 100 },
      { name: 'French', level: 80 },
      { name: 'English', level: 70 }
    ],
    experiences: [
      { title: 'Frontend Intern', company: 'NafTech', duration: '3 months', desc: 'Worked on React UI development.' }
    ],
    certifications: 'React Certification, Node.js Expert',
    links: {
      github: 'github.com/aminek',
      portfolio: 'aminek.dev'
    }
  });

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

  return (
    <div className="cv-builder-container">
      {/* Main Content: Form */}
      <main className="cv-main">
        <div className="cv-header-actions">
          <button className="cv-back-btn" onClick={() => navigate('/student-dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
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
            <button className="cv-download-btn-middle">
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

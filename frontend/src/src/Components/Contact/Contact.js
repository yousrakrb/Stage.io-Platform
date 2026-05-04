import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "5c3f3b99-45d8-41f3-a532-8579f01f6c17");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setResult("Message sent successfully!");
        event.target.reset();
      } else {
        setResult("Something went wrong. Please try again.");
      }
    } catch (error) {
      setResult("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="lp-contact" id="contact">
      <div className="contact-wrapper">
        
        {/* ── Left Column: Info ── */}
        <div className="contact-info">
          <div className="contact-info-header">
            <span className="contact-eyebrow">Get in touch</span>
            <h2>Let’s start a conversation.</h2>
            <p>
              Have questions about the platform? Our team is here to help you navigate 
              the future of internships in Algeria.
            </p>
          </div>

          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className="method-text">
                <strong>Email us</strong>
                <span>stagio.platform@gmail.com</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="method-text">
                <strong>Call support</strong>
                <span>+213 567 89 19 11</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="method-text">
                <strong>Our office</strong>
                <span>Constantine, Algeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Form ── */}
        <div className="contact-form-card">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Yasmine Benali" required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="+213 600 00 00 00" required />
            </div>

            <div className="form-group">
              <label>How can we help?</label>
              <textarea name="message" rows="5" placeholder="Tell us what's on your mind..." required></textarea>
            </div>

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
            </button>
          </form>
          {result && <p className={`form-result ${result.includes('Success') ? 'success' : ''}`}>{result}</p>}
        </div>

      </div>
    </section>
  );
};

export default Contact;

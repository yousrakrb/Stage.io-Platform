import React, { useState, useEffect, useCallback } from 'react';
import './Testimonials.css';

// Import gallery images (adjust paths as needed)
import gallery_1 from '../../assets/gallery_1.jpg';
import gallery_2 from '../../assets/gallery_2.png';
import gallery_3 from '../../assets/gallery_3.jpeg';
import gallery_4 from '../../assets/gallery_4.png';

// Testimonial data - easily expandable
const testimonialsData = [
  {
    id: 1,
    name: "Emily Rodriguez",
    role: "Alumni, Class of 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    text: "The campus environment pushed me to grow both academically and personally. The faculty mentorship and cutting-edge labs prepared me for a top-tier tech career. Absolutely transformative experience!"
  },
  {
    id: 2,
    name: "Daniel Okonkwo",
    role: "CS Senior",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    text: "From global hackathons to research symposiums, this university gives you wings. The community is inclusive and the energy is electrifying. I've built lifelong friendships and professional networks."
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Design Lead @ CreativeHub",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    text: "Modern facilities, inspiring lectures, and real-world projects — my time here shaped my design philosophy. The campus embraces innovation at every corner. Highly recommend to future creators!"
  },
  {
    id: 4,
    name: "Marcus Thompson",
    role: "Startup Founder",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    text: "The entrepreneurial ecosystem here is unmatched. From incubator programs to industry connections, this campus turned my startup idea into reality. Forever grateful!"
  }
];

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalSlides = testimonialsData.length;

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reset auto-play timer when manually navigating
    setIsAutoPlaying(true);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const handleSeeMore = () => {
    // Replace with your actual navigation or modal logic
    window.location.href = '/gallery';
  };

  return (
    <div className="campus-container">
      {/* ===== GALLERY SECTION ===== */}
      <div className="gallery-section">
        <div className="section-header">
          <span className="badge">Our Campus</span>
          <h2>Explore the <span className="gradient-text">Modern Campus</span></h2>
          <p>State-of-the-art facilities designed for innovation and collaboration</p>
        </div>
        
        <div className="gallery-grid">
          <div className="gallery-item">
            <img src={gallery_1} alt="Campus main building" />
            <div className="overlay">
              <span>Innovation Hub</span>
            </div>
          </div>
          <div className="gallery-item">
            <img src={gallery_2} alt="Library" />
            <div className="overlay">
              <span>Digital Library</span>
            </div>
          </div>
          <div className="gallery-item">
            <img src={gallery_3} alt="Student lounge" />
            <div className="overlay">
              <span>Collaborative Spaces</span>
            </div>
          </div>
          <div className="gallery-item">
            <img src={gallery_4} alt="Lab facilities" />
            <div className="overlay">
              <span>Advanced Labs</span>
            </div>
          </div>
        </div>
        
        <button className="btn-primary" onClick={handleSeeMore}>
          See more here
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <div className="testimonials-section" id="testimonials">
        <div className="section-header">
          <span className="badge">Testimonials</span>
          <h2>What Our <span className="gradient-text">Community Says</span></h2>
          <p>Real stories from students and alumni who shaped their future here</p>
        </div>

        <div 
          className="slider-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Buttons */}
          <button className="nav-btn prev-btn" onClick={prevSlide} aria-label="Previous slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <button className="nav-btn next-btn" onClick={nextSlide} aria-label="Next slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* Slider Track */}
          <div className="slider-container">
            <div 
              className="slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonialsData.map((testimonial) => (
                <div className="slide" key={testimonial.id}>
                  <div className="testimonial-card">
                    <div className="quote-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M10 11h-4v-4h4v4zm8 0h-4v-4h4v4z" fill="currentColor"/>
                        <path d="M6 7v10M18 7v10" stroke="currentColor"/>
                      </svg>
                    </div>
                    <p className="testimonial-text">"{testimonial.text}"</p>
                    <div className="user-info">
                      <img src={testimonial.avatar} alt={testimonial.name} className="avatar" />
                      <div className="user-details">
                        <h3>{testimonial.name}</h3>
                        <span>{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="dots">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

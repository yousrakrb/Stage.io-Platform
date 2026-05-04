import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CompanyNavbar = () => {
  const navigate = useNavigate()

  return (
    <nav className="sp-nav" style={{ 
      background: '#fff', 
      borderBottom: '1px solid #e5e7eb', 
      padding: '0 2.5rem', 
      height: '60px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="sp-nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: '#212EA0' }}>
        <div className="sp-nav-brand-dot" style={{ width: '32px', height: '32px', background: '#212EA0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="3" width="6" height="6" rx="1.5" fill="#fff" />
            <rect x="11" y="3" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".5" />
            <rect x="3" y="11" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".5" />
            <rect x="11" y="11" width="6" height="6" rx="1.5" fill="#fff" fillOpacity=".5" />
          </svg>
        </div>
        StageLink
      </div>

      <div className="sp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '14px', fontWeight: '500' }}>
        <Link to="/messages" style={{ color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          Messages 
          <span style={{ background: '#212EA0', color: '#fff', borderRadius: '100px', fontSize: '10px', padding: '1px 7px', marginLeft: '6px' }}>3</span>
        </Link>
      </div>

      <div className="sp-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="sp-nav-msg-btn" onClick={() => navigate('/messages')} style={{ 
          display: 'flex', alignItems: 'center', gap: '6px', background: '#e8eaf6', color: '#212EA0', 
          border: 'none', borderRadius: '100px', padding: '7px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' 
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 3h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="#212EA0" strokeWidth="1.4" />
            <path d="M2 3l6 5 6-5" stroke="#212EA0" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Send message
        </button>
        <div className="sp-nav-avatar" style={{ 
          width: '36px', height: '36px', borderRadius: '50%', background: '#212EA0', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600'
        }}>NT</div>
      </div>
    </nav>
  )
}

export default CompanyNavbar

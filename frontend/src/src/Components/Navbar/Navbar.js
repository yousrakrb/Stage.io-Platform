import React, { useEffect, useState } from 'react'
import './Navbar.css'
import Flora from '../../assets/Flora.png'
import { Link } from 'react-scroll';

const Navbar = () => {

  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 200 ? setSticky(true) : setSticky(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
      <img src={Flora} alt="logo" className='logo' />

      <ul>
        <li><Link to='hero' smooth={true} offset={0} duration={500} className="nav-link">Home</Link></li>
        <li><Link to='program' smooth={true} offset={-10} duration={500} className="nav-link">Program</Link></li>
        <li><Link to='about' smooth={true} offset={-10} duration={500} className="nav-link">About</Link></li>
        <li><Link to='testimonials' smooth={true} offset={-10} duration={500} className="nav-link">Testimonials</Link></li>
        <li><Link to='contact' smooth={true} offset={-10} duration={500} className='btn'>Contact us</Link></li>
      </ul>

      <a href='/signin' className='login-btn' aria-label="Log in">
        <svg className='login-icon' viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className='login-text'>Log in</span>
      </a>
    </nav>
  )
}

export default Navbar
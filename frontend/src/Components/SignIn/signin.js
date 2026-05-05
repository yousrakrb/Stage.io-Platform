import React, { useState } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './signin.css'
import { login as loginRequest, registerUser, verifyEmail } from '../../api'

const ROLES = ['Student', 'Company']


const BackArrow = ({ onClick }) => (
  <button className="step-back-btn" onClick={onClick} type="button" aria-label="Go back">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" /><path d="M12 5l-7 7 7 7" />
    </svg>
  </button>
)

const SignIn = () => {
  const [mode, setMode] = useState('sign-in-mode')
  const { login } = useAuth()
  const navigate = useNavigate()

  // Sign In state
  const [signInData, setSignInData] = useState({ email: '', password: '', role: 'Company' })

  // Sign Up multi-step state
  // Steps: 1=name, 2=role, 3=role fields, 4=confirm code (ALL roles)
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [studentType, setStudentType] = useState('') // 'independent' or 'university'
  const [confirmCode, setConfirmCode] = useState('')
  const [registeredUserId, setRegisteredUserId] = useState('')

  const [studentData, setStudentData] = useState({
    studentId: '', phone: '', univEmail: '', password: '', repeatPassword: ''
  })
  const [companyData, setCompanyData] = useState({
    companyEmail: '', location: '', domain: '', directorName: '', directorEmail: '', directorPhone: '', password: '', repeatPassword: ''
  })

  const switchToSignUp = () => { setMode('sign-up-mode'); setStep(1); setRole(''); setStudentType('') }
  const switchToSignIn = () => { setMode('sign-in-mode'); setStep(1); setRole(''); setStudentType('') }

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const data = await loginRequest({ email: signInData.email, password: signInData.password })
      login({ role: data.role, email: signInData.email, name: data.full_name })

      // Redirect based on role
      if (data.role === 'student') navigate('/dashboard')
      else if (data.role === 'company') navigate('/dashboard')
      else if (data.role === 'administration') navigate('/dashboard')

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Invalid email or password. Please try again.'
      alert(errorMsg)
      console.error('Login error:', error)
    }
  }

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleRoleSelect = (r) => {
    setRole(r)
    if (r === 'Student') {
      setStep(2.5) // Sub-step for student type
    } else {
      setStep(3)
    }
  }

  const handleStudentTypeSelect = (type) => {
    setStudentType(type)
    setStep(3)
  }

  // Get the confirmation email based on role
  const getConfirmEmail = () => {
    if (role === 'Student') return studentData.univEmail
    if (role === 'Company') return companyData.directorEmail
    return ''
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    
    let payload = {}
    
    if (role === 'Student') {
      if (studentData.password !== studentData.repeatPassword) {
        alert('Passwords do not match!')
        return
      }
      payload = {
        full_name: fullName,
        email: studentData.univEmail,
        password: studentData.password,
        confirm_password: studentData.repeatPassword,
        role: 'student',
        student_type: studentType,
        phone: studentData.phone,
        student_card_id: studentType === 'university' ? studentData.studentId : ''
      }
    } else if (role === 'Company') {
      if (companyData.password !== companyData.repeatPassword) {
        alert('Passwords do not match!')
        return
      }
      payload = {
        full_name: fullName,
        email: companyData.companyEmail,
        password: companyData.password,
        confirm_password: companyData.repeatPassword,
        role: 'company',
        director_full_name: companyData.directorName,
        director_email: companyData.directorEmail,
        director_phone: companyData.directorPhone,
        phone: companyData.directorPhone
      }
    }

    try {
      const data = await registerUser(payload)
      setRegisteredUserId(data.user_id)
      console.log('Sending confirmation code to:', getConfirmEmail())
      setStep(4)
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Registration failed. Please try again.'
      alert(errorMsg)
      console.error('Registration error:', error)
    }
  }

  const handleConfirmCode = async (e) => {
    e.preventDefault()
    try {
      const data = await verifyEmail({ user_id: registeredUserId, code: confirmCode })
      alert('Email verified successfully! You can now log in.')
      switchToSignIn()
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Verification failed. Please try again.'
      alert(errorMsg)
      console.error('Verification error:', error)
    }
  }

  // Step labels — all roles now have 4 steps
  const stepLabels = ['Name', 'Role', 'Details', 'Verify']

  return (
    <div className="auth-page-body">

      {/* Back to Home */}
      <a href="/" className="back-home-btn" aria-label="Back to Home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 5l-7 7 7 7" />
        </svg>
        <span>Home</span>
      </a>

      <div className={`auth-wrapper ${mode}`}>
        <div className="forms-container">

          {/* ── LOG IN FORM ── */}
          <div className="form-panel signin-form">
            <h1>Log In</h1>
            <div className="social-icons">
              <a href="#" aria-label="Google">G</a>
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="GitHub">⌥</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
            <span className="or-text">Sign in with Email &amp; Password</span>
            <form onSubmit={handleSignIn} style={{ width: '100%' }}>
              <input type="email" placeholder="Enter E-mail"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })} required />
              <input type="password" placeholder="Enter Password"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })} required />

              <p className="forgot-link">Forgot Password?</p>
              <button type="submit" className="btn-submit">Sign In</button>
            </form>
          </div>

          {/* ── SIGN UP FORM (multi-step) ── */}
          <div className="form-panel signup-form">

            {/* Step indicator */}
            <div className="step-indicator">
              {stepLabels.map((label, i) => (
                <div key={i} className={`step-dot-wrap ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                  <div className="step-dot">{step > i + 1 ? '✓' : i + 1}</div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* STEP 1 — Full Name */}
            {step === 1 && (
              <div className="step-content">
                <h1>Create Account</h1>
                <span className="or-text">Let's start with your name</span>
                <input type="text" placeholder="Full Name" value={fullName}
                  onChange={(e) => setFullName(e.target.value)} style={{ width: '100%' }} />
                <button className="btn-submit" style={{ width: '100%', marginTop: '8px' }}
                  onClick={handleNext} disabled={!fullName.trim()}>
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 2 — Role Selection */}
            {step === 2 && (
              <div className="step-content">
                <BackArrow onClick={handleBack} />
                <h1>Who are you?</h1>
                <span className="or-text">Select your role to continue</span>
                <div className="role-cards">
                  {ROLES.map((r) => (
                    <button key={r} className={`role-card ${role === r ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect(r)}>
                      <span className="role-icon">
                        {r === 'Student' ? '🎓' : r === 'University' ? '🏛️' : '🏢'}
                      </span>
                      <span className="role-label">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2.5 — Student Type Selection */}
            {step === 2.5 && (
              <div className="step-content">
                <BackArrow onClick={() => setStep(2)} />
                <h1>Independent or Linked?</h1>
                <span className="or-text">Tell us about your student status</span>
                <div className="student-type-options">
                  <button className={`type-btn ${studentType === 'independent' ? 'selected' : ''}`}
                    onClick={() => handleStudentTypeSelect('independent')}>
                    <span className="type-icon">👤</span>
                    <div className="type-text">
                      <strong>Independent Student</strong>
                      <p>Register without university affiliation</p>
                    </div>
                  </button>
                  <button className={`type-btn ${studentType === 'university' ? 'selected' : ''}`}
                    onClick={() => handleStudentTypeSelect('university')}>
                    <span className="type-icon">🎓</span>
                    <div className="type-text">
                      <strong>University Student</strong>
                      <p>Register using your university email</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Role-specific fields */}
            {step === 3 && (
              <div className="step-content">
                <BackArrow onClick={handleBack} />
                <h1>
                  {role === 'Student' ? (studentType === 'independent' ? 'Your Details' : 'Academic Details')
                    : 'Company Info'}
                </h1>
                <form onSubmit={handleSignUp} style={{ width: '100%' }}>

                  {role === 'Student' && (<>
                    {studentType === 'university' && (
                      <input type="text" placeholder="Student ID / Card Number"
                        value={studentData.studentId}
                        onChange={(e) => setStudentData({ ...studentData, studentId: e.target.value })} required />
                    )}
                    <input type="tel" placeholder="Phone Number"
                      value={studentData.phone}
                      onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })} required />
                    <input type="email" placeholder={studentType === 'university' ? "University Email" : "Personal Email"}
                      value={studentData.univEmail}
                      onChange={(e) => setStudentData({ ...studentData, univEmail: e.target.value })} required />
                    <input type="password" placeholder="Password"
                      value={studentData.password}
                      onChange={(e) => setStudentData({ ...studentData, password: e.target.value })} required />
                    <input type="password" placeholder="Repeat Password"
                      value={studentData.repeatPassword}
                      onChange={(e) => setStudentData({ ...studentData, repeatPassword: e.target.value })} required />
                  </>)}


                  {role === 'Company' && (<>
                    <input type="email" placeholder="Company Email"
                      value={companyData.companyEmail}
                      onChange={(e) => setCompanyData({ ...companyData, companyEmail: e.target.value })} required />
                    <input type="text" placeholder="Company Location"
                      value={companyData.location}
                      onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })} required />
                    <input type="text" placeholder="Company Domain"
                      value={companyData.domain}
                      onChange={(e) => setCompanyData({ ...companyData, domain: e.target.value })} required />
                    <input type="text" placeholder="Director Full Name"
                      value={companyData.directorName}
                      onChange={(e) => setCompanyData({ ...companyData, directorName: e.target.value })} required />
                    <input type="email" placeholder="Director Email Address"
                      value={companyData.directorEmail}
                      onChange={(e) => setCompanyData({ ...companyData, directorEmail: e.target.value })} required />
                    <input type="tel" placeholder="Director Phone Number"
                      value={companyData.directorPhone}
                      onChange={(e) => setCompanyData({ ...companyData, directorPhone: e.target.value })} required />
                    <input type="password" placeholder="Password"
                      value={companyData.password}
                      onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })} required />
                    <input type="password" placeholder="Repeat Password"
                      value={companyData.repeatPassword}
                      onChange={(e) => setCompanyData({ ...companyData, repeatPassword: e.target.value })} required />
                  </>)}

                  <button type="submit" className="btn-submit" style={{ marginTop: '6px' }}>
                    Send Confirmation Code →
                  </button>
                </form>
              </div>
            )}

            {/* STEP 4 — Confirmation Code (ALL roles) */}
            {step === 4 && (
              <div className="step-content">
                <BackArrow onClick={handleBack} />
                <div className="confirm-icon">📧</div>
                <h1>Check your email</h1>
                <span className="or-text">
                  A confirmation code was sent to<br />
                  <strong>{getConfirmEmail()}</strong>
                </span>
                <form onSubmit={handleConfirmCode} style={{ width: '100%' }}>
                  <input type="text" placeholder="Enter 6-digit code"
                    value={confirmCode} maxLength={6}
                    onChange={(e) => setConfirmCode(e.target.value.replace(/\D/, ''))} required />
                  <button type="submit" className="btn-submit" style={{ width: '100%', marginTop: '8px' }}>
                    Confirm &amp; Register
                  </button>
                </form>
                <p className="resend-link" onClick={() => alert('Code resent!')}>
                  Didn't receive it? Resend code
                </p>
              </div>
            )}

          </div>{/* end signup-form */}
        </div>

        {/* ── Sliding Overlay Panel ── */}
        <div className="overlay-panel">
          {mode === 'sign-in-mode' ? (
            <>
              <h1>Hello, Welcome!</h1>
              <p>You are new here? Sign up now and enjoy<br />our internship platform</p>
              <button className="btn-outline" onClick={switchToSignUp}>Sign Up</button>
            </>
          ) : (
            <>
              <h1>Welcome Back!</h1>
              <p>Already have an account?<br />Log in with your credentials</p>
              <button className="btn-outline" onClick={switchToSignIn}>Log In</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignIn
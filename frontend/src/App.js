import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Hero from './Components/Hero/Hero'
import Programs from './Components/Programs/Programs'
import Title from './Components/Title/Title'
import About from './Components/About/About'
import Campus from './Components/Campus/Campus'
import Testimonials from './Components/Testimonials/Testimonials'
import Contact from './Components/Contact/Contact'
import Footer from './Components/Footer/Footer'
import SignIn from './Components/SignIn/signin'
import LoginExample from './LoginExample'

import DashboardWrapper from './Components/UnifiedLayouts/DashboardWrapper'
import ProfileWrapper from './Components/UnifiedLayouts/ProfileWrapper'

import Messages from './Components/Messages/Messages'

// Standalone Pages
import Offers from './Components/Offers/Offers'
import Candidates from './Components/Candidates/Candidates'
import AddOffer from './Components/AddOffer/AddOffer'

import CompanyDashboard from './Components/CompanyDash/CompanyDash'
import CompanyProfile from './Components/CompanyProfile/CompanyProfile'
import CompanyProfileEdit from './Components/CompanyProfile/CompanyProfileEdit'
import CompanyLayout from './Components/UnifiedLayouts/CompanyLayout'
import StudentDashboard from './Components/StudentDash/StudentDash'
import StudentProfile from './Components/StudentProfile/StudentProfile'
import StudentProfileEdit from './Components/StudentProfile/StudentProfileEdit'
import CvBuilder from './Components/CvBuilder/CvBuilder'
import StudentApplications from './Components/StudentPages/StudentApplications'
import StudentMatches from './Components/StudentPages/StudentMatches'
import StudentOffers from './Components/StudentPages/StudentOffers'
import UnivDashboard from './Components/UnivDash/UnivDash'
import UnivProfile from './Components/UnivProfile/UnivProfile'
import UnivValidations from './Components/UnivPages/UnivValidations'
import UnivConventions from './Components/UnivPages/UnivConventions'
import UnivInternships from './Components/UnivPages/UnivInternships'

const App = () => {
  return (
    <Routes>

      {/* Main page */}
      <Route path='/' element={
        <div>
          <Navbar />
          <Hero />
          <div className='container'>
            <Programs />
            <About />
            <Testimonials />
            <Contact />
          </div>
          <Footer />
        </div>
      } />

      {/* Login page */}
      <Route path='/signin' element={<SignIn />} />
      <Route path='/test-login' element={<LoginExample />} />

      {/* Unified Dynamic Routes */}
      <Route path='/dashboard' element={<DashboardWrapper />} />
      <Route path='/profile' element={<ProfileWrapper />} />

      {/* Standalone Secondary Pages – with CompanyLayout sidebar */}
      <Route element={<CompanyLayout />}>
        <Route path='/offers' element={<Offers />} />
        <Route path='/candidates' element={<Candidates />} />
        <Route path='/add-offer' element={<AddOffer />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/company-profile-edit' element={<CompanyProfileEdit />} />
      </Route>

      {/* Company pages – manage their own sidebar internally */}
      <Route path='/company-dashboard' element={<CompanyDashboard />} />
      <Route path='/company-profile/:id' element={<CompanyProfile />} />
      <Route path='/company-profile' element={<CompanyProfile />} />
      <Route path='/student-dashboard' element={<StudentDashboard />} />
      <Route path='/student-profile/:id' element={<StudentProfile />} />
      <Route path='/student-profile' element={<StudentProfile />} />
      <Route path='/my-profile' element={<StudentProfileEdit />} />
      <Route path='/cv-builder' element={<CvBuilder />} />
      <Route path='/student-applications' element={<StudentApplications />} />
      <Route path='/student-matches' element={<StudentMatches />} />
      <Route path='/student-offers' element={<StudentOffers />} />
      <Route path='/univ-dashboard' element={<UnivDashboard />} />
      <Route path='/univ-profile' element={<UnivProfile />} />
      <Route path='/univ-validations' element={<UnivValidations />} />
      <Route path='/univ-conventions' element={<UnivConventions />} />
      <Route path='/univ-internships' element={<UnivInternships />} />

      {/* Catch-all redirect for broken or old links */}
      <Route path="*" element={<Navigate to="/signin" replace />} />

    </Routes>
  )
}

export default App

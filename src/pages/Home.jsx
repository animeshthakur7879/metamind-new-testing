import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/Herosection'
import KeyFeatures from '../components/Keyfeatures'
import BenefitsSection from '../components/BenifitSection'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import FinalCTASection from '../components/FinalCTASection'
import Footer from '../components/Footer'
import AboutSection from '../components/AboutSection'


const Home = () => {
  return (
    <div className='bg-gradient-to-b min-h-screen from-black via-gray-900 to-gray-950 text-white py-16'>
      <Navbar/>
      <HeroSection/>
      <AboutSection/>
      <KeyFeatures/>
      <BenefitsSection/>
      <TestimonialsCarousel/>
      <FinalCTASection/>
      <Footer/>
      
    </div>
  )
}

export default Home

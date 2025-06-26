import React from 'react'
import Hero from '../components/Hero'
import Companies from '../components/Companies'
import Features from '../components/Features'
import Properties from '../components/propertiesshow'
import Steps from '../components/Steps'
import Testimonials from '../components/testimonial'
import Blog from '../components/Blog'
import FAQ from '../components/FAQ'

const Home = () => {
  return (
    <div>
      <Hero />
      <Steps />
      <Companies />
      <Features />
      <Properties />
      <Testimonials />
      <Blog />
      <FAQ />
    </div>
  )
}

export default Home

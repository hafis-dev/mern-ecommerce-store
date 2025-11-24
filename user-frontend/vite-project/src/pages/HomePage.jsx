import React from 'react'
import FeaturedSection from '../components/FeaturedSection'
import NewArrivalSection from '../components/NewArrivalSection'
import Carousel from '../components/ControlledCarousel'
import ControlledCarousel from '../components/ControlledCarousel'

function HomePage() {
  return (
    <div>
      <ControlledCarousel/>
      <FeaturedSection/>
      <NewArrivalSection/>
    </div>
  )
}

export default HomePage
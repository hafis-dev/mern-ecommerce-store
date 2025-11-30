import React from 'react'
import FeaturedSection from './FeaturedSection'
import NewArrivalSection from './newArrivalSection'
import ControlledCarousel from './ControlledCarousel'

function HomePage() {
  return (
    <div>
      <ControlledCarousel />
      <FeaturedSection />
      <NewArrivalSection />
    </div>
  )
}

export default HomePage
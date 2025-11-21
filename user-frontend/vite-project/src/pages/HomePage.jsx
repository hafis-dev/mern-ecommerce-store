import React from 'react'
import FeaturedSection from '../components/FeaturedSection'
import NewArrivalSection from '../components/NewArrivalSection'
import { Container } from 'react-bootstrap'

function HomePage() {
  return (
    <Container>
      <FeaturedSection/>
      <NewArrivalSection/>
    </Container>
  )
}

export default HomePage
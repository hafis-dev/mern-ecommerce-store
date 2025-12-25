
import FeaturedSection from './FeaturedSection'

import ControlledCarousel from './ControlledCarousel'
import NewArrivalSection from './NewArrivalSection'

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
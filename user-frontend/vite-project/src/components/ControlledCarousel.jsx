import { useState } from "react";
import { Container } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <style>{`
        /* Caption background style */
        .custom-caption {
          background: rgba(27, 26, 25, 0.55);
          padding: 20px 25px;
          border-radius: 8px;
          backdrop-filter: blur(4px);
        }

        .custom-caption h3 {
          color: #fafafb;
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 10px;
          text-shadow: 0px 2px 4px rgba(0,0,0,0.5);
        }

        .custom-caption p {
          color: #dbd9d9;
          font-size: 16px;
          margin: 0;
          text-shadow: 0px 2px 3px rgba(0,0,0,0.3);
        }
      `}</style>
      <Container className="pt-5 mt-3 mt-lg-0 mt-md-4 mt-sm-3">
   <Carousel activeIndex={index} onSelect={handleSelect}>
        {/* Slide 1 */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            alt="First slide"
            style={{ height: "450px", objectFit: "cover" }}
          />
          <Carousel.Caption className="custom-caption">
            <h3>Premium Collection</h3>
            <p>Discover elegant designs crafted for every moment.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
            alt="Second slide"
            style={{ height: "450px", objectFit: "cover" }}
          />
          <Carousel.Caption className="custom-caption">
            <h3>New Arrivals</h3>
            <p>Fresh styles picked just for you — shop the latest trends.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 3 */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f"
            alt="Third slide"
            style={{ height: "450px", objectFit: "cover" }}
          />
          <Carousel.Caption className="custom-caption">
            <h3>Classic Essentials</h3>
            <p>Timeless pieces that never go out of style.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
</Container>
     
    </>
  );
}

export default ControlledCarousel;

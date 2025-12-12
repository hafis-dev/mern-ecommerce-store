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
            src="banner1.jpg"
            alt="First slide"
            style={{ maxHeight: "550px", objectFit: "cover" }}
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
              src="banner2.jpg"
            alt="Second slide"
            style={{ maxHeight: "550px", objectFit: "cover" }}
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
              src="banner3.jpg

"
            alt="Third slide"
            style={{ maxHeight: "550px", objectFit: "cover" }}
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

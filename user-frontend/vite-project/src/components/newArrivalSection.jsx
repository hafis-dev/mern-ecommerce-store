import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "./ProductCard";

const NewArrivalSection = () => {
    const { newArrival } = useContext(ProductContext);

    return (
        <Container fluid className="mt-5 mb-5">
            <h3 className="fw-bold mb-3">New Arrivals</h3>

            <Row className="g-4">
                {newArrival.map((item) => (
                    <Col key={item._id} xs={6} sm={6} md={4} lg={3}>
                        <ProductCard product={item} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default NewArrivalSection;

import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "./ProductCard";

const FeaturedSection = () => {
    const { featured } = useContext(ProductContext);

    return (
        <Container fluid className="mt-5">
            <h3 className="fw-bold mb-3">Featured Products</h3>

            <Row className="g-4">
                {featured.map((item) => (
                    <Col key={item._id} xs={6} sm={6} md={4} lg={3}>
                        <ProductCard product={item} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default FeaturedSection;

import { Row, Col, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";

const CollectionPage = () => {
    const [products, setProducts] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        loadProductsFromURL();
    }, [location.search]);

    const loadProductsFromURL = async () => {
        const res = await api.get(`/products${location.search}`);
        setProducts(res.data.products || []);
    };

    const loadWithFilters = (filters = {}) => {
        const params = new URLSearchParams(location.search);

        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        navigate(`/products?${params.toString()}`);
    };

    return (
        <Container fluid className="py-5 mt-4 mt-lg-0 mt-md-4 mt-sm-3">

            <Row >
                {/* Sidebar */}
                <Col
                    xs={12}
                    md={3}
                    className="mb-4 mb-md-0"
                >
                    <FilterSidebar
                        onApply={loadWithFilters}
                        onClear={() => navigate("/products")}
                    />
                </Col>

                {/* Products */}
                <Col xs={12} md={9}>
                    <Row className="g-3">
                        {products.length === 0 && <p>No products found</p>}

                        {products.map((p) => (
                            <Col
                                key={p._id}
                                xs={6}   // 2 per row on mobile
                                sm={6}
                                md={4}   // 3 per row on tablet
                                lg={3}   // 4 per row on desktop
                                xl={3}
                            >
                                <ProductCard product={p} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

        </Container>
    );
};

export default CollectionPage;

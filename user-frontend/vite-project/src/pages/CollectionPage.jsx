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

    // Load products whenever URL changes
    useEffect(() => {
        loadProductsFromURL();
    }, [location.search]);

    // Load based on current URL
    const loadProductsFromURL = async () => {
        const res = await api.get(`/products${location.search}`);
        setProducts(res.data.products || []);
    };

    // Apply filters but keep search/category/etc from URL
    const loadWithFilters = (filters = {}) => {
        const params = new URLSearchParams(location.search);

        // Merge new filter values
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        // Update URL → triggers useEffect → reloads products
        navigate(`/products?${params.toString()}`);
    };

    return (
        <Container fluid>

      
        <Row className="mt-4">
            <Col md={3}>
                <FilterSidebar
                    onApply={loadWithFilters}
                    onClear={() => navigate("/products")}
                />
            </Col>

            <Col md={9}>
                <Row>
                    {products.length === 0 && <p>No products found</p>}

                    {products.map((p) => (
                        <Col md={4} key={p._id}>
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

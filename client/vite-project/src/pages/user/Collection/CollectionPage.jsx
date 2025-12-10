import { Row, Col, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api/axios";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "../../../components/ProductCard";

const CollectionPage = () => {
    const [products, setProducts] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await api.get(`/products${location.search}`);
                setProducts(res.data.products || []);
            } catch (err) {
                console.error(err);
            }
        };

        loadProducts();
    }, [location.search]);

    const loadWithFilters = (filters = {}) => {
        const params = new URLSearchParams(location.search);

        // ✨ If category changed → remove previous attributes
        if (filters.category) {
            // remove everything except category, price, sort
            params.forEach((value, key) => {
                const whitelist = ["category", "minPrice", "maxPrice", "sort"];
                if (!whitelist.includes(key)) {
                    params.delete(key);
                }
            });
        }

        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        navigate(`/products?${params.toString()}`);
    };


    return (
        <Container fluid className="py-5 mt-4">
            <Row>
                <Col xs={12} md={3} className="mb-4 mb-md-0">
                    <FilterSidebar
                        onApply={loadWithFilters}
                        onClear={() => navigate("/products")}
                    />
                </Col>

                <Col xs={12} md={9}>
                    <Row className="g-3">
                        {products.length === 0 && <p>No products found</p>}

                        {products.map((p) => (
                            <Col
                                key={p._id}
                                xs={6}
                                sm={6}
                                md={4}
                                lg={3}
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

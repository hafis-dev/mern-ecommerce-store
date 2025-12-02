import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import api from "../../../services/api/axios";
import ProductCard from "../../../components/ProductCard";

const FeaturedSection = () => {
    const [featured, setFeatured] = useState([]);

    // Load featured only for this section
    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const res = await api.get("/products/featured");
                setFeatured(res.data.products || []);
            } catch (err) {
                console.error(err);
            }
        };

        loadFeatured();
    }, []);

    return (
        <>
            {/* ⭐ CSS */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

                .featured-wrapper {
                    background: transparent !important;
                    padding: 120px 0 0 0;
                    font-family: 'Urbanist', sans-serif;
                }

                .featured-title {
                    text-align: center;
                    font-size: 34px;
                    font-weight: 800;
                    color: var(--c6);
                    letter-spacing: 0.3px;
                }

                .featured-subtext {
                    text-align: center;
                    color: var(--c4);
                    font-size: 15px;
                    margin-top: 6px;
                }

                .featured-line {
                    width: 60px;
                    height: 3px;
                    margin: 14px auto 50px auto;
                    background: var(--c5);
                    border-radius: 4px;
                }

                .product-container {
                    display: flex;
                    justify-content: center;
                }

                .featured-wrapper {
                    animation: fadeIn 0.5s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="featured-wrapper">
                <Container>
                    <h2 className="featured-title">Featured Products</h2>
                    <p className="featured-subtext">Our top picks curated just for you</p>
                    <div className="featured-line"></div>

                    <Row className="g-4 product-container">
                        {featured.map((item) => (
                            <Col key={item._id} xs={6} sm={6} md={4} lg={3}>
                                <ProductCard product={item} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default FeaturedSection;

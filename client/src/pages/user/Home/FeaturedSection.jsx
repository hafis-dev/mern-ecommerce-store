import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../../../components/ProductCard";
import styles from "./featuredSection.module.css";
import { getFeaturedProducts } from "../../../services/api/product.service";

const FeaturedSection = () => {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                setLoading(true);
                const res = await getFeaturedProducts();
                setFeatured(res.data.products || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadFeatured();
    }, []);

    return (
        <div className={styles.featuredWrapper}>
            <Container>
                <h2 className={styles.featuredTitle}>Featured Products</h2>
                <p className={styles.featuredSubtext}>
                    Our top picks curated just for you
                </p>
                <div className={styles.featuredLine}></div>

                <Row className={`g-4 ${styles.productContainer}`}>
                    
                    {loading && (
                        <div
                            className="d-flex justify-content-center align-items-center w-100"
                            style={{ minHeight: "200px" }}
                        >
                            <div className="spinner-border" role="status" />
                        </div>
                    )}

                    
                    {!loading && featured.length === 0 && (
                        <div className={styles.emptyState}>
                            No featured products available right now.
                        </div>
                    )}

                    
                    {!loading &&
                        featured.length > 0 &&
                        featured.map((item) => (
                            <Col key={item._id} xs={6} sm={6} md={4} lg={3}>
                                <ProductCard product={item} />
                            </Col>
                        ))}
                </Row>
            </Container>
        </div>
    );
};

export default FeaturedSection;

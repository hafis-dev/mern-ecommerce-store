import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import api from "../../../services/api/axios";
import ProductCard from "../../../components/ProductCard";
import styles from "./featuredSection.module.css";

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
        <div className={styles.featuredWrapper}>
            <Container>
                <h2 className={styles.featuredTitle}>Featured Products</h2>
                <p className={styles.featuredSubtext}>Our top picks curated just for you</p>
                <div className={styles.featuredLine}></div>

                <Row className={`g-4 ${styles.productContainer}`}>
                    {featured.map((item) => (
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

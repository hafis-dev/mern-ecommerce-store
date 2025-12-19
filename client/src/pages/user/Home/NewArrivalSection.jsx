import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../../../components/ProductCard";
import styles from "./newArrivalSection.module.css";
import { getNewArrivalProducts } from "../../../services/api/product.service";

const NewArrivalSection = () => {
    const [newArrival, setNewArrival] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNewArrival = async () => {
            try {
                setLoading(true);
                const res = await getNewArrivalProducts();
                setNewArrival(res.data.products || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadNewArrival();
    }, []);


    return (
        <div className={styles.arrivalWrapper}>
            <Container>
                <h2 className={styles.arrivalTitle}>New Arrivals</h2>
                <p className={styles.arrivalSubtext}>Fresh picks just added to our store</p>
                <div className={styles.arrivalLine}></div>

                <Row className={`g-4 ${styles.arrivalRow}`}>
                    {loading && (
                        <div
                            className="d-flex justify-content-center align-items-center w-100"
                            style={{ minHeight: "200px" }}
                        >
                            <div className="spinner-border" role="status" />
                        </div>
                    )}

                    {!loading &&
                        newArrival.map((item) => (
                            <Col key={item._id} xs={6} sm={6} md={4} lg={3}>
                                <ProductCard product={item} />
                            </Col>
                        ))}
                </Row>

            </Container>
        </div>
    );
};

export default NewArrivalSection;

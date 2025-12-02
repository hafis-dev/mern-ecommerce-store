import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import api from "../../../services/api/axios";
import ProductCard from "../../../components/ProductCard";

const NewArrivalSection = () => {
    const [newArrival, setNewArrival] = useState([]);

    useEffect(() => {
        const loadNewArrival = async () => {
            try {
                const res = await api.get("/products/new");
                setNewArrival(res.data.products || []);
            } catch (err) {
                console.error(err);
            }
        };

        loadNewArrival();
    }, []);

    return (
        <>
            {/* ⭐ CSS */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

                .arrival-wrapper {
                    background: transparent !important;
                    padding: 120px 0 80px 0;
                    font-family: 'Urbanist', sans-serif;
                }

                .arrival-title {
                    text-align: center;
                    font-size: 34px;
                    font-weight: 800;
                    color: var(--c6);
                    letter-spacing: 0.3px;
                }

                .arrival-subtext {
                    text-align: center;
                    color: var(--c4);
                    font-size: 15px;
                    margin-top: 6px;
                }

                .arrival-line {
                    width: 60px;
                    height: 3px;
                    margin: 14px auto 50px auto;
                    background: var(--c5);
                    border-radius: 4px;
                }

                .arrival-row {
                    display: flex;
                    justify-content: center;
                }

                .arrival-wrapper {
                    animation: fadeInArrival 0.5s ease-in-out;
                }

                @keyframes fadeInArrival {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="arrival-wrapper">
                <Container>
                    <h2 className="arrival-title">New Arrivals</h2>
                    <p className="arrival-subtext">Fresh picks just added to our store</p>
                    <div className="arrival-line"></div>

                    <Row className="g-4 arrival-row">
                        {newArrival.map((item) => (
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

export default NewArrivalSection;

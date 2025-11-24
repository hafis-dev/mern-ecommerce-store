import { Container, Row, Col } from "react-bootstrap";

const AboutPage = () => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

                :root {
                    --c1: #fafafb;
                    --c2: #dbd9d9;
                    --c3: #beb7b3;
                    --c4: #908681;
                    --c5: #6d5a4e;
                    --c6: #1b1a19;
                }

                .about-wrapper {
                    background: var(--c1);
                    padding-top: 120px;
                    font-family: 'Urbanist', sans-serif;
                    color: var(--c6);
                }

                .about-hero {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .about-title {
                    font-size: 40px;
                    font-weight: 800;
                    color: var(--c6);
                }

                .about-subtext {
                    font-size: 16px;
                    color: var(--c4);
                    width: 70%;
                    margin: 10px auto;
                }

                .about-line {
                    width: 70px;
                    height: 3px;
                    background: var(--c5);
                    margin: 20px auto 0;
                    border-radius: 4px;
                }

                /* Mission Section */
                .about-section {
                    padding: 50px 0;
                }

                .section-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 15px;
                }

                .section-text {
                    font-size: 16px;
                    color: var(--c4);
                    line-height: 1.7;
                }

                /* Highlights */
                .highlight-box {
                    background: #ffffff;
                    border: 1px solid var(--c2);
                    border-radius: 12px;
                    padding: 25px;
                    text-align: center;
                    transition: 0.3s ease;
                }

                .highlight-box:hover {
                    transform: translateY(-5px);
                    border-color: var(--c5);
                }

                .highlight-icon {
                    font-size: 40px;
                    color: var(--c5);
                    margin-bottom: 15px;
                }

                .highlight-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .highlight-text {
                    font-size: 14px;
                    color: var(--c4);
                }
            `}</style>

            <div className="about-wrapper">

                {/* HERO SECTION */}
                <Container className="about-hero">
                    <h1 className="about-title">About MyShop</h1>
                    <p className="about-subtext">
                        We believe shopping should be simple, enjoyable, and trustworthy.
                        Our mission is to bring premium quality products directly to your door.
                    </p>
                    <div className="about-line"></div>
                </Container>

                {/* MISSION SECTION */}
                <Container className="about-section">
                    <Row>
                        <Col md={6}>
                            <h2 className="section-title">Our Mission</h2>
                            <p className="section-text">
                                At MyShop, we aim to provide a seamless online shopping experience
                                with high-quality products, fast delivery, secure payments,
                                and excellent customer support. Your satisfaction is our priority.
                            </p>
                        </Col>

                        <Col md={6}>
                            <h2 className="section-title">Who We Are</h2>
                            <p className="section-text">
                                We are a passionate team dedicated to offering curated collections,
                                affordable pricing, and a smooth checkout experience. From trending
                                items to daily essentials, we bring you the best of everything.
                            </p>
                        </Col>
                    </Row>
                </Container>

                {/* HIGHLIGHTS SECTION */}
                <Container className="about-section">
                    <Row className="g-4">

                        <Col md={4}>
                            <div className="highlight-box">
                                <div className="highlight-icon">🚚</div>
                                <h4 className="highlight-title">Fast Delivery</h4>
                                <p className="highlight-text">
                                    Quick and reliable shipping across all regions.
                                </p>
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="highlight-box">
                                <div className="highlight-icon">🔐</div>
                                <h4 className="highlight-title">Secure Payments</h4>
                                <p className="highlight-text">
                                    100% secure transactions with verified payment gateways.
                                </p>
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className="highlight-box">
                                <div className="highlight-icon">🎁</div>
                                <h4 className="highlight-title">Quality Products</h4>
                                <p className="highlight-text">
                                    Every item is checked and verified before shipping.
                                </p>
                            </div>
                        </Col>

                    </Row>
                </Container>

            </div>
        </>
    );
};

export default AboutPage;

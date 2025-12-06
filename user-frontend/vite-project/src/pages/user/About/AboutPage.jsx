import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import styles from "./AboutPage.module.css";

const AboutPage = () => {
    return (
        <div className={styles.aboutWrapper}>

            {/* HERO SECTION */}
            <Container className={styles.aboutHero}>
                <h1 className={styles.aboutTitle}>About ShopX</h1>
                <p className={styles.aboutSubtext}>
                    We believe shopping should be simple, enjoyable, and trustworthy.
                    Our mission is to bring premium quality products directly to your door.
                </p>
                <div className={styles.aboutLine}></div>
            </Container>

            {/* MISSION SECTION */}
            <Container className={styles.aboutSection}>
                <Row className="gy-4"> {/* Added gy-4 for vertical gap on mobile */}
                    <Col md={6}>
                        <h2 className={styles.sectionTitle}>Our Mission</h2>
                        <p className={styles.sectionText}>
                            At ShopX, we aim to provide a seamless online shopping experience
                            with high-quality products, fast delivery, secure payments,
                            and excellent customer support. Your satisfaction is our priority.
                        </p>
                    </Col>

                    <Col md={6}>
                        <h2 className={styles.sectionTitle}>Who We Are</h2>
                        <p className={styles.sectionText}>
                            We are a passionate team dedicated to offering curated collections,
                            affordable pricing, and a smooth checkout experience. From trending
                            items to daily essentials, we bring you the best of everything.
                        </p>
                    </Col>
                </Row>
            </Container>

            {/* HIGHLIGHTS SECTION */}
            <Container className={styles.aboutSection}>
                <Row className="g-4">
                    <Col md={4}>
                        <div className={styles.highlightBox}>
                            <div className={styles.highlightIcon}>🚚</div>
                            <h4 className={styles.highlightTitle}>Fast Delivery</h4>
                            <p className={styles.highlightText}>
                                Quick and reliable shipping across all regions.
                            </p>
                        </div>
                    </Col>

                    <Col md={4}>
                        <div className={styles.highlightBox}>
                            <div className={styles.highlightIcon}>🔐</div>
                            <h4 className={styles.highlightTitle}>Secure Payments</h4>
                            <p className={styles.highlightText}>
                                100% secure transactions with verified payment gateways.
                            </p>
                        </div>
                    </Col>

                    <Col md={4}>
                        <div className={styles.highlightBox}>
                            <div className={styles.highlightIcon}>🎁</div>
                            <h4 className={styles.highlightTitle}>Quality Products</h4>
                            <p className={styles.highlightText}>
                                Every item is checked and verified before shipping.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>

        </div>
    );
};

export default AboutPage;
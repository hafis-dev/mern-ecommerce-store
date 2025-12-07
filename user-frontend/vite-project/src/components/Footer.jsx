import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faBox,
    faInfoCircle,
    faEnvelope,
    faLocationDot,
    faPhone,
    faQuestionCircle,
    faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import styles from "./footer.module.css";

const Footer = () => {
    return (
        <footer className={`mt-5 pt-4 pb-3 ${styles.footer}`}>
            <Container>

                <Row className="mb-4">

                    {/* BRAND */}
                    <Col md={4} className="mb-3">
                        <h5 className={`text-uppercase fw-bold ${styles.brandTitle}`}>
                            ShopX
                        </h5>
                        <p className={styles.brandTagline}>
                            Quality products. Fast delivery. Trusted service.
                        </p>
                    </Col>

                    {/* LINKS */}
                    <Col md={2} className="mb-3">
                        <h6 className={`fw-bold ${styles.sectionTitle}`}>Links</h6>
                        <ul className="list-unstyled">
                            <li>
                                <Link to="/" className={styles.linkItem}>
                                    <FontAwesomeIcon icon={faHome} /> &nbsp; Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className={styles.linkItem}>
                                    <FontAwesomeIcon icon={faBox} /> &nbsp; Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className={styles.linkItem}>
                                    <FontAwesomeIcon icon={faInfoCircle} /> &nbsp; About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className={styles.linkItem}>
                                    <FontAwesomeIcon icon={faEnvelope} /> &nbsp; Contact
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    {/* SUPPORT */}
                    <Col md={3} className="mb-3">
                        <h6 className={`fw-bold ${styles.sectionTitle}`}>Support</h6>
                        <ul className="list-unstyled">
                            <li>
                                <Link to="#" className={styles.linkItem}>
                                    <FontAwesomeIcon icon={faQuestionCircle} /> &nbsp; FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className={styles.linkItem}>
                                    <FontAwesomeIcon icon={faShieldHalved} /> &nbsp; Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className={styles.linkItem}>
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    {/* CONTACT */}
                    <Col md={3} className="mb-3">
                        <h6 className={`fw-bold ${styles.sectionTitle}`}>Contact</h6>

                        <p className={`mb-1 ${styles.contactText}`}>
                            <FontAwesomeIcon icon={faLocationDot} /> &nbsp; Wayanad, Kerala
                        </p>

                        <p className={`mb-1 ${styles.contactText}`}>
                            <FontAwesomeIcon icon={faPhone} /> &nbsp; +91 98765 43210
                        </p>

                        <p className={`mb-1 ${styles.contactText}`}>
                            
                          
                            <Link to="mailto:support@shopx.com" className={styles.linkItem}>
                                <FontAwesomeIcon icon={faEnvelope} /> &nbsp; 
                                support@shopx.com
                            </Link>
                        </p>
                    </Col>

                </Row>

                {/* BOTTOM LINE */}
                <Row>
                    <Col className="text-center">
                        <small className={styles.bottomLine}>
                            © {new Date().getFullYear()} ShopX — All Rights Reserved
                        </small>
                    </Col>
                </Row>

            </Container>
        </footer>
    );
};

export default Footer;

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
    faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub,faLinkedin } from "@fortawesome/free-brands-svg-icons";

import { Link } from "react-router-dom";

import styles from "./footer.module.css";

const Footer = () => {
    return (
        <footer className={`mt-5 pt-4 pb-3 ${styles.footer}`}>
            <Container>

                <Row className="mb-4">

                    
                    <Col md={4} className="mb-3">
                        <h5 className={`text-uppercase fw-bold ${styles.brandTitle}`}>
                            ShopX
                        </h5>
                        <p className={styles.brandTagline}>
                            Quality products. Fast delivery. Trusted service.
                        </p>
                    </Col>

                    
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

                    
                    <Col md={3} className="mb-3">
                        <h6 className={`fw-bold ${styles.sectionTitle}`}>Contact</h6>

                        <p className={`mb-1 ${styles.contactText}`}>
                            <FontAwesomeIcon icon={faLocationDot} /> &nbsp; Wayanad, Kerala
                        </p>

                        <p className={`mb-1 ${styles.contactText}`}>
                            <FontAwesomeIcon icon={faPhone} /> &nbsp; +91 97782 06112
                        </p>

                        <p className={`mb-1 ${styles.contactText}`}>
                            
                          
                            <Link to="mailto:support@shopx.com" className={styles.linkItem}>
                                <FontAwesomeIcon icon={faEnvelope} /> &nbsp; 
                                support@shopx.com
                            </Link>
                        </p>
                    </Col>

                </Row>

                
                <Row>
                    <Col className="text-center">
                        <small className={styles.bottomLine}>
                            © {new Date().getFullYear()} ShopX — All Rights Reserved
                            <span className="ms-2 d-inline-flex align-items-center gap-1">
                                |
                                <a
                                    href="https://github.com/hafis-dev/mern-ecommerce-store"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.linkItem}
                                    aria-label="GitHub"
                                >
                                    <FontAwesomeIcon
                                        icon={faGithub}
                                        className={styles.socialIcon}
                                    />
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/muhammed-hafis01/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.linkItem}
                                    aria-label="LinkedIn"
                                >
                                    <FontAwesomeIcon
                                        icon={faLinkedin}
                                        className={styles.socialIcon}
                                    />
                                </a>
                            </span>


                        </small>
                    </Col>
                </Row>


            </Container>
        </footer>
    );
};

export default Footer;

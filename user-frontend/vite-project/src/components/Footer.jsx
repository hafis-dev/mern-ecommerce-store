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

const Footer = () => {
    return (
        <footer
            className="mt-5 pt-4 pb-3"
            style={{
                background: "transparent",
                color: "#1b1a19", // DARK text
                borderTop: "1px solid #dbd9d9",
                paddingTop: "10px",
            }}
        >
            <Container>

                <Row className="mb-4">
                    {/* BRAND */}
                    <Col md={4} className="mb-3">
                        <h5
                            className="text-uppercase fw-bold"
                            style={{ color: "#908681" }}
                        >
                            MyShop
                        </h5>
                        <p style={{ color: "#6d5a4e", fontSize: "14px" }}>
                            Quality products. Fast delivery. Trusted service.
                        </p>
                    </Col>

                    {/* LINKS */}
                    <Col md={2} className="mb-3">
                        <h6 className="fw-bold" style={{ color: "#908681" }}>
                            Links
                        </h6>
                        <ul className="list-unstyled">
                            <li>
                                <a href="/" className="text-decoration-none" style={{ color: "#1b1a19" }}>
                                    <FontAwesomeIcon icon={faHome} /> &nbsp; Home
                                </a>
                            </li>
                            <li>
                                <a href="/products" className="text-decoration-none" style={{ color: "#1b1a19" }}>
                                    <FontAwesomeIcon icon={faBox} /> &nbsp; Products
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-decoration-none" style={{ color: "#1b1a19" }}>
                                    <FontAwesomeIcon icon={faInfoCircle} /> &nbsp; About
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-decoration-none" style={{ color: "#1b1a19" }}>
                                    <FontAwesomeIcon icon={faEnvelope} /> &nbsp; Contact
                                </a>
                            </li>
                        </ul>
                    </Col>

                    {/* SUPPORT */}
                    <Col md={3} className="mb-3">
                        <h6 className="fw-bold" style={{ color: "#908681" }}>
                            Support
                        </h6>
                        <ul className="list-unstyled">
                            <li>
                                <a href="#" className="text-decoration-none" style={{ color: "#1b1a19" }}>
                                    <FontAwesomeIcon icon={faQuestionCircle} /> &nbsp; FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-decoration-none" style={{ color: "#1b1a19" }}>
                                    <FontAwesomeIcon icon={faShieldHalved} /> &nbsp; Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-decoration-none" style={{ color: "#1b1a19" }}>
                                    Terms & Conditions
                                </a>
                            </li>
                        </ul>
                    </Col>

                    {/* CONTACT */}
                    <Col md={3} className="mb-3">
                        <h6 className="fw-bold" style={{ color: "#908681" }}>
                            Contact
                        </h6>

                        <p className="mb-1" style={{ color: "#1b1a19" }}>
                            <FontAwesomeIcon icon={faLocationDot} /> &nbsp; Wayanad, Kerala
                        </p>

                        <p className="mb-1" style={{ color: "#1b1a19" }}>
                            <FontAwesomeIcon icon={faPhone} /> &nbsp; +91 98765 43210
                        </p>

                        <p className="mb-1" style={{ color: "#1b1a19" }}>
                            <FontAwesomeIcon icon={faEnvelope} /> &nbsp; support@myshop.com
                        </p>
                    </Col>
                </Row>

                {/* BOTTOM LINE */}
                <Row>
                    <Col
                        className="text-center"
                        style={{
                            borderTop: "1px solid #dbd9d9",
                            paddingTop: "10px",
                        }}
                    >
                        <small style={{ color: "#6d5a4e" }}>
                            © {new Date().getFullYear()} MyShop — All Rights Reserved
                        </small>
                    </Col>
                </Row>

            </Container>
        </footer>
    );
};

export default Footer;

import { useContext } from "react";
import {
    Navbar,
    Nav,
    Container,
    NavDropdown,
    Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./appbar.module.css";

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);

    return (
        <Navbar
            className={`${styles.navbar} container`}
            expand="lg"
            fixed="top"
        >
            <Container className="pt-2">
                {/* LOGO */}
                <Navbar.Brand as={Link} to="/" className={styles.brand}>
                    MyShop
                </Navbar.Brand>

                {/* MOBILE LINKS */}
                <Nav className="me-auto gap-3 d-flex flex-row d-lg-none">
                    <Nav.Link as={Link} to="/" className={styles.navlink}>
                        HOME
                    </Nav.Link>

                    <Nav.Link as={Link} to="/products" className={styles.navlink}>
                        COLLECTION
                    </Nav.Link>
                </Nav>

                {/* MOBILE CART */}
                <Nav.Link
                    as={Link}
                    to="/cart"
                    className={`position-relative ms-auto me-4 fw-semibold d-lg-none ${styles.mobileCart}`}
                >
                    <FontAwesomeIcon icon={faCartShopping} size="lg" />

                    {cartCount > 0 && user && (
                        <Badge
                            className={`${styles.cartBadge} rounded-circle position-absolute d-flex align-items-center justify-content-center`}
                        >
                            {cartCount}
                        </Badge>
                    )}
                </Nav.Link>

                {/* TOGGLE */}
                <Navbar.Toggle aria-controls="main-navbar" />

                {/* MOBILE SEARCH */}
                <div className="d-lg-none w-100 mt-2">
                    <NavbarSearch />
                </div>

                <Navbar.Collapse
                    id="main-navbar"
                    className="justify-content-between"
                >
                    {/* LEFT MENU (DESKTOP) */}
                    <Nav className="me-auto d-none d-lg-flex">
                        <Nav.Link as={Link} to="/" className={styles.navlink}>
                            HOME
                        </Nav.Link>

                        <Nav.Link as={Link} to="/products" className={styles.navlink}>
                            COLLECTION
                        </Nav.Link>

                        <Nav.Link as={Link} to="/about" className={styles.navlink}>
                            ABOUT
                        </Nav.Link>

                        {/* <Nav.Link as={Link} to="/contact" className={styles.navlink}>
                            CONTACT
                        </Nav.Link> */}
                    </Nav>

                    {/* DESKTOP SEARCH */}
                    <div className="d-none d-lg-block mx-3">
                        <NavbarSearch />
                    </div>

                    {/* MOBILE MENU */}
                    <Nav className="d-lg-none">
                        <Nav.Link as={Link} to="/about" className={styles.navlink}>
                            ABOUT
                        </Nav.Link>

                        {/* <Nav.Link as={Link} to="/contact" className={styles.navlink}>
                            CONTACT
                        </Nav.Link> */}

                        {user ? (
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/orders"
                                    className={styles.navlink}
                                >
                                    MY ORDERS
                                </Nav.Link>
                                <Nav.Link onClick={logout} className={styles.navlink}>
                                    LOGOUT
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login" className={styles.navlink}>
                                LOGIN
                            </Nav.Link>
                        )}
                    </Nav>

                    {/* DESKTOP RIGHT SIDE */}
                    <Nav className="d-none d-lg-flex align-items-center">
                        {/* CART DESKTOP */}
                        <Nav.Link
                            as={Link}
                            to="/cart"
                            className={`position-relative fw-semibold me-2 ${styles.navlink}`}
                        >
                            <FontAwesomeIcon icon={faCartShopping} size="lg" />

                            {cartCount > 0 && user && (
                                <Badge
                                    className={`${styles.cartBadgeDesktop} rounded-circle position-absolute d-flex align-items-center justify-content-center`}
                                >
                                    {cartCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        {/* PROFILE DROPDOWN */}
                        <NavDropdown
                            className={styles.noCaret}
                            align="end"
                            title={
                                user ? (
                                    `Hi, ${user.username}`
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faCircleUser}
                                        size="lg"
                                        style={{ color: "#1b1a19" }}
                                    />
                                )
                            }
                        >
                            {user ? (
                                <>
                                    <NavDropdown.Item as={Link} to="/orders" className={styles.dropdownItem}>
                                        MY ORDERS
                                    </NavDropdown.Item>

                                    <NavDropdown.Divider className={styles.dropdownDivider} />

                                    <NavDropdown.Item onClick={logout} className={styles.dropdownItem}>
                                        LOGOUT
                                    </NavDropdown.Item>
                                </>
                            ) : (
                                    <NavDropdown.Item as={Link} to="/login" className={styles.dropdownItem}>
                                    LOGIN
                                </NavDropdown.Item>
                            )}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;

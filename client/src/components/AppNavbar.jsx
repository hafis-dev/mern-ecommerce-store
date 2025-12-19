import { useContext, useState } from "react";
import {
    Navbar,
    Nav,
    Container,
    NavDropdown,
    Badge,
} from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faCircleUser,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./appbar.module.css";
import ThemeToggleButton from "./ThemeToggleButton";
import { useWishlist } from "../context/Wishlist/useWishlist";
import { useCart } from "../context/Cart/useCart";

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useCart();
    const { wishlistIds } = useWishlist();
    const wishlistCount = wishlistIds.length;
    const navigate = useNavigate();
    const location = useLocation();

    const [expanded, setExpanded] = useState(false);

    const closeNavbar = () => setExpanded(false);
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        closeNavbar();
        navigate("/login");
    };

    const mainLinks = [
        { to: "/", label: "HOME" },
        { to: "/products", label: "COLLECTION" },
        { to: "/about", label: "ABOUT" },
    ];

    const userLinks = [
        { to: "/wishlist", label: `MY WISHLIST (${wishlistCount})` },
        { to: "/orders", label: "MY ORDERS" },
        { to: "/profile", label: "PROFILE" },
    ];

    return (
        <Navbar
            expanded={expanded}
            onToggle={setExpanded}
            expand="lg"
            fixed="top"
            className={`${styles.navbar} container pb-1`}
        >
            <Container>

                {/* LOGO */}
                <Navbar.Brand
                    as={NavLink}
                    to="/"
                    className={styles.brand}
                    onClick={closeNavbar}
                >
                    ShopX
                </Navbar.Brand>

                {/* MOBILE QUICK LINKS */}
                <Nav className="me-auto gap-2 d-flex flex-row d-lg-none">
                    {mainLinks.slice(0, 2).map(({ to, label }) => (
                        <Nav.Link
                            key={to}
                            as={NavLink}
                            to={to}
                            onClick={closeNavbar}
                            className={`${styles.navlink} ${isActive(to) ? styles.active : ""}`}
                        >
                            {label}
                        </Nav.Link>
                    ))}
                </Nav>

                {/* MOBILE CART */}
                <Nav.Link
                    as={NavLink}
                    to="/cart"
                    onClick={closeNavbar}
                    className={`position-relative ms-auto fw-semibold d-lg-none ${styles.navlink} ${styles.mobileCart} ${isActive("/cart") ? styles.active : ""}`}
                >
                    <FontAwesomeIcon icon={faCartShopping} size="lg" />
                    {cartCount > 0 && user && (
                        <Badge className={`${styles.cartBadge} rounded-circle position-absolute`}>
                            {cartCount}
                        </Badge>
                    )}
                </Nav.Link>

                <Navbar.Toggle
                    className={styles.togglerIcon}
                    onClick={() => setExpanded(!expanded)}
                />

                {/* MOBILE SEARCH */}
                <div className="d-lg-none w-100 mt-2">
                    <NavbarSearch />
                </div>

                <Navbar.Collapse className="justify-content-between">

                    {/* DESKTOP LEFT */}
                    <Nav className="me-auto d-none d-lg-flex">
                        {mainLinks.map(({ to, label }) => (
                            <Nav.Link
                                key={to}
                                as={NavLink}
                                to={to}
                                className={`${styles.navlink} ${isActive(to) ? styles.active : ""}`}
                            >
                                {label}
                            </Nav.Link>
                        ))}
                    </Nav>

                    {/* DESKTOP SEARCH */}
                    <div className="d-none d-lg-block mx-3">
                        <NavbarSearch />
                    </div>

                    {/* MOBILE MENU */}
                    <Nav className="d-lg-none">
                        <div className={styles.themeBtn}>
                            <ThemeToggleButton />
                        </div>

                        {mainLinks.slice(2).map(({ to, label }) => (
                            <Nav.Link
                                key={to}
                                as={NavLink}
                                to={to}
                                onClick={closeNavbar}
                                className={`${styles.navlink} ${isActive(to) ? styles.active : ""}`}
                            >
                                {label}
                            </Nav.Link>
                        ))}

                        {user ? (
                            <>
                                {userLinks.map(({ to, label }) => (
                                    <Nav.Link
                                        key={to}
                                        as={NavLink}
                                        to={to}
                                        onClick={closeNavbar}
                                        className={`${styles.navlink} ${isActive(to) ? styles.active : ""}`}
                                    >
                                        {label}
                                    </Nav.Link>
                                ))}

                                <Nav.Link onClick={handleLogout} className={styles.navlink}>
                                    LOGOUT
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link
                                as={NavLink}
                                to="/login"
                                onClick={closeNavbar}
                                className={`${styles.navlink} ${styles.dropdownItem} ${isActive("/login") ? styles.active : ""}`}
                            >
                                LOGIN
                            </Nav.Link>
                        )}
                    </Nav>

                    {/* DESKTOP RIGHT */}
                    <Nav className="d-none d-lg-flex align-items-center">

                        <Nav.Link
                            as={NavLink}
                            to="/wishlist"
                            className={`position-relative fw-semibold me-2 ${styles.navlink} ${isActive("/wishlist") ? styles.active : ""}`}
                        >
                            <FontAwesomeIcon icon={faHeart} size="lg" />
                            {wishlistCount > 0 && user && (
                                <Badge className={`${styles.cartBadgeDesktop} rounded-circle position-absolute`}>
                                    {wishlistCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        <Nav.Link
                            as={NavLink}
                            to="/cart"
                            className={`position-relative fw-semibold me-2 ${styles.navlink} ${isActive("/cart") ? styles.active : ""}`}
                        >
                            <FontAwesomeIcon icon={faCartShopping} size="lg" />
                            {cartCount > 0 && user && (
                                <Badge className={`${styles.cartBadgeDesktop} rounded-circle position-absolute`}>
                                    {cartCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        <NavDropdown
                            align="end"
                            title={user ? user.username : <FontAwesomeIcon icon={faCircleUser} size="lg" />}
                        >
                            <div className={styles.themeBtn}>
                                <ThemeToggleButton />
                            </div>

                            {userLinks.slice(1).map(({ to, label }) => (
                                <NavDropdown.Item
                                    key={to}
                                    as={NavLink}
                                    to={to}
                                    className={`${styles.dropdownItem} ${isActive(to) ? styles.active : ""}`}
                                >
                                    {label.replace(/\s?\(.+\)/, "")}
                                </NavDropdown.Item>
                            ))}

                            <NavDropdown.Divider />

                            <NavDropdown.Item onClick={handleLogout} className={styles.dropdownItem}>
                                LOGOUT
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;

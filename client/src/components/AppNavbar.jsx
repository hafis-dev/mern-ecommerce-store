import { useContext } from "react";
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

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Navbar
            className={`${styles.navbar} container pb-1`}
            expand="lg"
            fixed="top"
        >
            <Container>

                {/* LOGO */}
                <Navbar.Brand as={NavLink} to="/" className={styles.brand}>
                    ShopX
                </Navbar.Brand>

                {/* MOBILE LINKS */}
                <Nav className="me-auto gap-2 d-flex flex-row d-lg-none">
                    <Nav.Link
                        as={NavLink}
                        to="/"
                        className={`${styles.navlink} ${isActive("/") ? styles.active : ""}`}
                    >
                        HOME
                    </Nav.Link>

                    <Nav.Link
                        as={NavLink}
                        to="/products"
                        className={`${styles.navlink} ${isActive("/products") ? styles.active : ""}`}
                    >
                        COLLECTION
                    </Nav.Link>
                </Nav>

                {/* MOBILE CART */}
                {/* MOBILE CART */}
                <Nav.Link
                    as={NavLink}
                    to="/cart"
                    className={`position-relative ms-auto fw-semibold d-lg-none ${styles.navlink} ${styles.mobileCart} ${isActive("/cart") ? styles.active : ""}`}
                >
                    <FontAwesomeIcon icon={faCartShopping} size="lg" />

                    {cartCount > 0 && user && (
                        <Badge className={`${styles.cartBadge} rounded-circle position-absolute`}>
                            {cartCount}
                        </Badge>
                    )}
                </Nav.Link>


                <Navbar.Toggle className={styles.togglerIcon} />

                {/* MOBILE SEARCH */}
                <div className="d-lg-none w-100 mt-2">
                    <NavbarSearch />
                </div>

                <Navbar.Collapse className="justify-content-between">

                    {/* DESKTOP LEFT */}
                    <Nav className="me-auto d-none d-lg-flex">
                        <Nav.Link
                            as={NavLink}
                            to="/"
                            className={`${styles.navlink} ${isActive("/") ? styles.active : ""}`}
                        >
                            HOME
                        </Nav.Link>

                        <Nav.Link
                            as={NavLink}
                            to="/products"
                            className={`${styles.navlink} ${isActive("/products") ? styles.active : ""}`}
                        >
                            COLLECTION
                        </Nav.Link>

                        <Nav.Link
                            as={NavLink}
                            to="/about"
                            className={`${styles.navlink} ${isActive("/about") ? styles.active : ""}`}
                        >
                            ABOUT
                        </Nav.Link>
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

                        <Nav.Link
                            as={NavLink}
                            to="/about"
                            className={`${styles.navlink} ${isActive("/about") ? styles.active : ""}`}
                        >
                            ABOUT
                        </Nav.Link>

                        {user ? (
                            <>
                                <Nav.Link
                                    as={NavLink}
                                    to="/wishlist"
                                    className={`${styles.navlink} ${isActive("/wishlist") ? styles.active : ""}`}
                                >
                                    MY WISHLIST ({wishlistCount})
                                </Nav.Link>

                                <Nav.Link
                                    as={NavLink}
                                    to="/orders"
                                    className={`${styles.navlink} ${isActive("/orders") ? styles.active : ""}`}
                                >
                                    MY ORDERS
                                </Nav.Link>

                                <Nav.Link
                                    as={NavLink}
                                    to="/profile"
                                    className={`${styles.navlink} ${isActive("/profile") ? styles.active : ""}`}
                                >
                                    PROFILE
                                </Nav.Link>

                                <Nav.Link onClick={handleLogout} className={styles.navlink}>
                                    LOGOUT
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link
                                as={NavLink}
                                to="/login"
                                className={`${styles.navlink} ${styles.dropdownItem} ${isActive("/login") ? styles.active : ""}`}
                            >
                                LOGIN
                            </Nav.Link>
                        )}
                    </Nav>

                    {/* DESKTOP RIGHT */}
                    <Nav className="d-none d-lg-flex align-items-center">

                        {/* WISHLIST */}
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

                        {/* CART */}
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

                        {/* PROFILE DROPDOWN */}
                        <NavDropdown
                            align="end"
                            title={
                                user ? user.username : (
                                    <FontAwesomeIcon icon={faCircleUser} size="lg" />
                                )
                            }
                        >
                            <div className={styles.themeBtn}>
                                <ThemeToggleButton />
                            </div>

                            <NavDropdown.Item
                                as={NavLink}
                                to="/orders"
                                className={`${styles.dropdownItem} ${isActive("/orders") ? styles.active : ""}`}
                            >
                                MY ORDERS
                            </NavDropdown.Item>

                            <NavDropdown.Item
                                as={NavLink}
                                to="/profile"
                                className={`${styles.dropdownItem} ${isActive("/profile") ? styles.active : ""}`}
                            >
                                PROFILE
                            </NavDropdown.Item>

                            <NavDropdown.Divider />

                            <NavDropdown.Item
                                onClick={handleLogout}
                                className={styles.dropdownItem}
                            >
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

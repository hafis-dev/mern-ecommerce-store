import { useContext } from "react";
import {
    Navbar,
    Nav,
    Container,
    NavDropdown,
    Badge,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";   // 🔥 Use NavLink
import NavbarSearch from "./NavbarSearch";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useWishlist } from "../context/WishListContext";

import styles from "./appbar.module.css";
import ThemeToggleButton from "./ThemeToggleButton";

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate()
    const { wishlistIds } = useWishlist();
    const wishlistCount = wishlistIds.length;
    const setActive = ({ isActive }) =>
        isActive ? `${styles.navlink} ${styles.active}` : styles.navlink;
    function handleLogout() {
        logout()
        navigate('/login')
    }
    return (
        <Navbar
            className={`${styles.navbar} container   pb-1`}
            expand="lg"
            fixed="top"
        >
            <Container >

                {/* LOGO */}
                <Navbar.Brand as={NavLink} to="/" className={styles.brand}>
                    ShopX
                </Navbar.Brand>

                {/* MOBILE LINKS */}
                <Nav className="me-auto gap-2 d-flex flex-row d-lg-none">
                    <Nav.Link as={NavLink} to="/" className={setActive}>
                        HOME
                    </Nav.Link>

                    <Nav.Link as={NavLink} to="/products" className={setActive}>
                        COLLECTION
                    </Nav.Link>
                </Nav>


                {/* MOBILE CART */}
                <Nav.Link
                    as={NavLink}
                    to="/cart"
                    className={`position-relative ms-auto  fw-semibold d-lg-none ${styles.mobileCart}`}
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
                <Navbar.Toggle aria-controls="main-navbar"  className={styles.togglerIcon} />

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
                        <Nav.Link as={NavLink} to="/" className={setActive}>
                            HOME
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/products" className={setActive}>
                            COLLECTION
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/about" className={setActive}>
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
                        <Nav.Link as={NavLink} to="/about" className={setActive} >
                            ABOUT
                        </Nav.Link>

                        {user ? (
                            <>
                                <Nav.Link as={NavLink} to="/wishlist" className={setActive}>
                                    MY WISHLIST({wishlistCount})
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/orders" className={setActive} >
                                    MY ORDERS
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/profile" className={setActive}>
                                    PROFILE
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout} className={styles.navlink}>
                                    LOGOUT
                                </Nav.Link>
                            </>
                        ) : (

                            <Nav.Link as={NavLink} to="/login" className={`${setActive} ${styles.dropdownItem}`}>
                                LOGIN
                            </Nav.Link>
                        )}
                    </Nav>

                    {/* DESKTOP RIGHT SIDE */}
                    <Nav className="d-none d-lg-flex align-items-center">
                        {/* WISHLIST DESKTOP */}
                        <Nav.Link
                            as={NavLink}
                            to="/wishlist"
                            className={`position-relative fw-semibold me-2 ${styles.navlink}`}
                        >
                            <FontAwesomeIcon icon={faHeart} size="lg" />

                            {wishlistCount > 0 && user && (
                                <Badge
                                    className={`${styles.cartBadgeDesktop} rounded-circle position-absolute d-flex align-items-center justify-content-center`}
                                >
                                    {wishlistCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        {/* CART DESKTOP */}
                        <Nav.Link
                            as={NavLink}
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
                            align="end"
                            title={
                                user ? (
                                    ` ${user.username}`
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faCircleUser}
                                        size="lg"
                                        style={{ color: "var(--c6)" }}
                                    />
                                )
                            }
                        >
                            {user ? (
                                <>
                                    <div className={styles.themeBtn}>
                                        <ThemeToggleButton />

                                    </div>
                                    <NavDropdown.Item

                                        as={NavLink}
                                        to="/orders"
                                        className={`${setActive}  ${styles.dropdownItem}`}
                                    >
                                        MY ORDERS
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={NavLink}
                                        to="/profile"
                                        className={`${setActive}  ${styles.dropdownItem}`}
                                    >
                                        PROFILE
                                    </NavDropdown.Item >
                                    <NavDropdown.Divider className={styles.dropdownDivider} />

                                    <NavDropdown.Item onClick={handleLogout} className={styles.dropdownItem}>
                                        LOGOUT
                                    </NavDropdown.Item>
                                </>
                            ) : (
                                <>
                                    <div className={styles.themeBtn}>
                                        <ThemeToggleButton />

                                    </div>
                                    <NavDropdown.Item
                                        as={NavLink}
                                        to="/login"
                                        className={styles.dropdownItem}
                                    >
                                        LOGIN
                                    </NavDropdown.Item>
                                </>

                            )}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;

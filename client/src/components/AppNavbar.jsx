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
    faHeart
} from "@fortawesome/free-solid-svg-icons";

import styles from "./appbar.module.css";
import ThemeToggleButton from "./ThemeToggleButton";
import { useWishlist } from "../context/Wishlist/useWishlist";
import { useCart } from "../context/Cart/useCart";

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation(); 
    const { wishlistIds } = useWishlist();
    const wishlistCount = wishlistIds.length;

    
    const setActive = (path) =>
        location.pathname === path ? `${styles.navlink} ${styles.active}` : styles.navlink;

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <Navbar
            className={`${styles.navbar} container pb-1`}
            expand="lg"
            fixed="top"
        >
            <Container >

                
                <Navbar.Brand as={NavLink} to="/" className={styles.brand}>
                    ShopX
                </Navbar.Brand>

                
                <Nav className="me-auto gap-2 d-flex flex-row d-lg-none">
                    <Nav.Link as={NavLink} to="/" className={setActive("/")}>
                        HOME
                    </Nav.Link>

                    <Nav.Link as={NavLink} to="/products" className={setActive("/products")}>
                        COLLECTION
                    </Nav.Link>
                </Nav>


                
                <Nav.Link
                    as={NavLink}
                    to="/cart"
                    className={`position-relative ms-auto fw-semibold d-lg-none ${styles.mobileCart}`}
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

                
                <Navbar.Toggle aria-controls="main-navbar" className={styles.togglerIcon} />

                
                <div className="d-lg-none w-100 mt-2">
                    <NavbarSearch />
                </div>

                <Navbar.Collapse
                    id="main-navbar"
                    className="justify-content-between"
                >
                    
                    <Nav className="me-auto d-none d-lg-flex">
                        <Nav.Link as={NavLink} to="/" className={setActive("/")}>
                            HOME
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/products" className={setActive("/products")}>
                            COLLECTION
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/about" className={setActive("/about")}>
                            ABOUT
                        </Nav.Link>
                    </Nav>

                    
                    <div className="d-none d-lg-block mx-3">
                        <NavbarSearch />
                    </div>

                    
                    <Nav className="d-lg-none">
                        <div className={styles.themeBtn}>
                            <ThemeToggleButton />
                        </div>
                        <Nav.Link as={NavLink} to="/about" className={setActive("/about")} >
                            ABOUT
                        </Nav.Link>

                        {user ? (
                            <>
                                <Nav.Link as={NavLink} to="/wishlist" className={setActive("/wishlist")}>
                                    MY WISHLIST({wishlistCount})
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/orders" className={setActive("/orders")} >
                                    MY ORDERS
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/profile" className={setActive("/profile")}>
                                    PROFILE
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout} className={styles.navlink}>
                                    LOGOUT
                                </Nav.Link>
                            </>
                        ) : (

                            <Nav.Link as={NavLink} to="/login" className={`${setActive("/login")} ${styles.dropdownItem}`}>
                                LOGIN
                            </Nav.Link>
                        )}
                    </Nav>

                    
                    <Nav className="d-none d-lg-flex align-items-center">
                        
                        <Nav.Link
                            as={NavLink}
                            to="/wishlist"
                            className={`position-relative fw-semibold me-2 ${setActive("/wishlist")}`}
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

                        
                        <Nav.Link
                            as={NavLink}
                            to="/cart"
                            className={`position-relative fw-semibold me-2 ${setActive("/cart")}`}
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
                                        className={`${setActive("/orders")} ${styles.dropdownItem}`}
                                    >
                                        MY ORDERS
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={NavLink}
                                        to="/profile"
                                        className={`${setActive("/profile")} ${styles.dropdownItem}`}
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
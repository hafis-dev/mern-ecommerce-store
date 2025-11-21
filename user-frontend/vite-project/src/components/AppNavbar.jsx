import { useContext } from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
            <Container>

                {/* LOGO */}
                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="fw-bold text-primary"
                    style={{ fontSize: "22px" }}
                >
                    MyShop
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">

                    {/* LEFT MENU */}
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/products">Collection</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                    </Nav>

                    {/* SEARCH */}
                    <NavbarSearch />

                    {/* RIGHT SIDE */}
                    <Nav className="ms-3 d-flex align-items-center">

                        {/* CART WITH BADGE */}
                        <Nav.Link
                            as={Link}
                            to="/cart"
                            className="position-relative fw-semibold me-2"
                        >
                            🛒 Cart

                            {cartCount > 0 && (
                                <Badge
                                    bg="success"
                                    pill
                                    style={{ marginLeft: '5px' }}
                                >
                                    {cartCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        {/* PROFILE DROPDOWN */}
                        <NavDropdown
                            title={user ? `Hi, ${user.username}` : "Profile"}
                            id="profile-dropdown"
                            align="end"
                        >
                            {user ? (
                                <>
                                    <NavDropdown.Item as={Link} to="/orders">
                                        My Orders
                                    </NavDropdown.Item>

                                    <NavDropdown.Divider />

                                    <NavDropdown.Item onClick={logout}>
                                        🚪 Logout
                                    </NavDropdown.Item>
                                </>
                            ) : (
                                <NavDropdown.Item as={Link} to="/login">
                                    Login
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

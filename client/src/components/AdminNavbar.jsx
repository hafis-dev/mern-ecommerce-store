import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./adminNavbar.module.css";
import ThemeToggleButton from "./ThemeToggleButton";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <Navbar expand="lg" fixed="top" className={styles.navbar}>
            <Container className={styles.navContainer}>
                <Navbar.Brand
                    as={Link}
                    to="/admin/dashboard"
                    className={styles.brand}
                >
                    Admin Panel
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="admin-navbar"
                    className={styles.togglerIcon}
                />

                <Navbar.Collapse id="admin-navbar">
                    <Nav className="ms-auto">
                        <div className={styles.themeBtn}>
                            <ThemeToggleButton />
                        </div>

                        <Nav.Link
                            as={Link}
                            to="/admin/dashboard"
                            className={`${styles.link} ${isActive("/admin/dashboard") ? styles.active : ""}`}
                        >
                            Dashboard
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/admin/products"
                            className={`${styles.link} ${isActive("/admin/products") ? styles.active : ""}`}
                        >
                            Products
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/admin/product-add"
                            className={`${styles.link} ${isActive("/admin/product-add") ? styles.active : ""}`}
                        >
                            Add Product
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/admin/orders"
                            className={`${styles.link} ${isActive("/admin/orders") ? styles.active : ""}`}
                        >
                            Orders
                        </Nav.Link>

                        <Nav.Link
                            onClick={handleLogout}
                            className={styles.logout}
                        >
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AdminNavbar;

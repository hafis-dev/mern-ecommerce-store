import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./adminNavbar.module.css";
import ThemeToggleButton from "./ThemeToggleButton";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const [expanded, setExpanded] = useState(false);

    const closeNavbar = () => setExpanded(false);
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        closeNavbar();
        navigate("/login");
    };

    const adminLinks = [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/products", label: "Products" },
        { to: "/admin/product-add", label: "Add Product" },
        { to: "/admin/orders", label: "Orders" },
    ];

    return (
        <Navbar
            expand="lg"
            fixed="top"
            expanded={expanded}
            onToggle={setExpanded}
            className={styles.navbar}
        >
            <Container className={styles.navContainer}>
                <Navbar.Brand
                    as={Link}
                    to="/admin/dashboard"
                    className={styles.brand}
                    onClick={closeNavbar}
                >
                    Admin Panel
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="admin-navbar"
                    className={styles.togglerIcon}
                    onClick={() => setExpanded(!expanded)}
                />

                <Navbar.Collapse id="admin-navbar">
                    <Nav className="ms-auto">

                        <div className={styles.themeBtn}>
                            <ThemeToggleButton />
                        </div>

                        {adminLinks.map(({ to, label }) => (
                            <Nav.Link
                                key={to}
                                as={Link}
                                to={to}
                                onClick={closeNavbar}
                                className={`${styles.link} ${isActive(to) ? styles.active : ""}`}
                            >
                                {label}
                            </Nav.Link>
                        ))}

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

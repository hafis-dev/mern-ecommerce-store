import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./navbarSearch.module.css";

const NavbarSearch = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = () => {
        const params = new URLSearchParams(location.search);
        params.set("search", search.trim());
        navigate(`/products?${params.toString()}`);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
            className={styles.searchForm}
        >
            <input
                type="text"
                className={`form-control me-2 ${styles.searchInput}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
            />

            <button
                className={styles.searchButton}
                type="submit"
            >
                Search
            </button>
        </form>
    );
};

export default NavbarSearch;

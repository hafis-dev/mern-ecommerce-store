import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
            className="d-flex"
        >
            <input
                type="text"
                className="form-control me-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
            />
            <button className="btn btn-outline-primary" type="submit">
                Search
            </button>
        </form>
    );
};

export default NavbarSearch;

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
                style={{
                    backgroundColor: "#dbd9d9",
                    border: "1px solid #beb7b3",
                    color: "#1b1a19",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
            />
            <button
                className="btn"
                type="submit"
                style={{
                    backgroundColor: "#6d5a4e",
                    color: "#fafafb",
                    border: "none",
                }}
            >
                Search
            </button>
        </form>
    );
};

export default NavbarSearch;

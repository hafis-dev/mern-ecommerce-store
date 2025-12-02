import { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import api from "../../../services/api/axios";

const FilterSidebar = ({ onApply, onClear }) => {
    const [filters, setFilters] = useState({});
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");
    const [attributes, setAttributes] = useState({});
    const [open, setOpen] = useState(false);

    // Load filters ONCE when page loads
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const res = await api.get("/products/filters");
                setFilters(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        loadFilters();
    }, []);

    const dynamicAttrs = category ? Object.keys(filters[category] || {}) : [];

    const handleApply = () => {
        const f = {};

        if (category) f.category = category;
        if (minPrice) f.minPrice = minPrice;
        if (maxPrice) f.maxPrice = maxPrice;

        if (sort === "price_low") f.sort = "price_asc";
        if (sort === "price_high") f.sort = "price_desc";
        if (sort === "newest") f.sort = "newest";

        Object.keys(attributes).forEach((key) => {
            if (attributes[key]) f[key] = attributes[key];
        });

        onApply(f);
        setOpen(false);
    };

    const handleClear = () => {
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setAttributes({});
        onClear();
    };

    return (
        <>
            {/* ⭐ CSS THEME + NEW MODERN MODEL */}
            <style>{`
                .filter-toggle {
                    display: none;
                    background: var(--c5);
                    color: var(--c1);
                    border: none;
                    padding: 10px 18px;
                    font-size: 15px;
                    font-weight: 500;
                    
                }

                .filter-toggle:hover {
                    background: var(--c4);
                }

                @media (max-width: 768px) {
                    .filter-toggle {
                        display: block;
                    }
                    .filter-card {
                        display: ${open ? "block" : "none"};
                    }
                }

                .filter-card {
                    background: transparent !important;
                    border-radius: 0px;
                    padding: 22px;
                    box-shadow: 0px 3px 10px var(--c6);
                    border: 1px solid var(--c2);
                }

                .filter-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--c6);
                    text-align: center;
                    margin-bottom: 18px;
                }

                .filter-label {
                    color: var(--c6);
                    font-weight: 500;
                    font-size: 14px;
                }

                .filter-input,
                .filter-select {
                    background: var(--c2);
                    border: none;
                    border-radius: 0px;
                    color: var(--c6);
                    padding: 10px;
                    font-size: 15px;
                }

                .filter-input:focus,
                .filter-select:focus {
                    outline: none;
                    box-shadow: none;
                    background: var(--c3);
                }

                .btn-apply {
                    background: var(--c5);
                    border: none;
                    color: var(--c1);
                    font-weight: 500;
                    border-radius:0px
                }

                .btn-apply:hover {
                    background: var(--c4);
                }

                .btn-clear {
                    background: var(--c2);
                    border: none;
                    color: var(--c6);
                    border-radius:0px
                }

                .btn-clear:hover {
                    background: var(--c3);
                }
            `}</style>

            {/* ⭐ MOBILE TOGGLE BUTTON */}
            <button className="filter-toggle" onClick={() => setOpen(!open)}>
                {open ? "Close Filters" : "Open Filters"}
            </button>

            {/* ⭐ FILTER SIDEBAR */}
            <Card className="filter-card my-0"
                style={{ maxHeight: "78vh", overflow: "auto" }}>

                <h5 className="filter-title">Filters</h5>

                {/* Category */}
                <Form.Group className="mb-3">
                    <Form.Label className="filter-label">Category</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setAttributes({});
                        }}
                        className="filter-select"
                    >
                        <option value="">All</option>
                        {/* <option>Men Accessories</option>
                        <option>Electronics</option>
                        <option>Shoes</option>
                        <option>Clothing</option>
                        <option>Bags</option>
                        <option>Beauty</option>
                        <option>Home Appliances</option>
                        <option>Mobile</option>
                        <option>Laptop</option> */}
                        <option>Wallet</option>
                        <option>Watch</option>
                        <option>Glass</option>
                    </Form.Select>
                </Form.Group>

                {/* Price */}
                <Form.Group className="mb-3">
                    <Form.Label className="filter-label">Min Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="filter-input"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="filter-label">Max Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="filter-input"
                    />
                </Form.Group>

                {/* Sort */}
                <Form.Group className="mb-3">
                    <Form.Label className="filter-label">Sort By</Form.Label>
                    <Form.Select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Default</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                    </Form.Select>
                </Form.Group>

                {/* Dynamic Attributes */}
                {/* Dynamic Attributes */}
                {dynamicAttrs.length > 0 && (
                    <>
                        <hr />

                        {dynamicAttrs.map((attr) => (
                            <Form.Group className="mb-3" key={attr}>
                                <Form.Label className="filter-label">
                                    {attr.toUpperCase()}
                                </Form.Label>

                                <Form.Select
                                    value={attributes[attr] || ""}
                                    onChange={(e) =>
                                        setAttributes((prev) => ({
                                            ...prev,
                                            [attr]: e.target.value,
                                        }))
                                    }
                                    className="filter-select"
                                >
                                    <option value="">All</option>

                                    {filters[category]?.[attr]?.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        ))}
                    </>
                )}




                {/* Buttons */}
                <div className="d-flex gap-2 mt-3">
                    <Button className="btn-apply w-50" onClick={handleApply}>
                        Apply
                    </Button>
                    <Button className="btn-clear w-50" onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default FilterSidebar;

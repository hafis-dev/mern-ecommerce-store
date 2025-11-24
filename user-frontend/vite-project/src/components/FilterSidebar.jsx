import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { CATEGORY_ATTRIBUTES } from "../data/categoryAttributes";

const FilterSidebar = ({ onApply, onClear }) => {
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");
    const [attributes, setAttributes] = useState({});

    const [open, setOpen] = useState(false);

    const dynamicAttrs = CATEGORY_ATTRIBUTES[category] || [];

    const handleApply = () => {
        const filters = {};

        if (category) filters.category = category;
        if (minPrice) filters.minPrice = minPrice;
        if (maxPrice) filters.maxPrice = maxPrice;

        if (sort === "price_low") filters.sort = "price_asc";
        if (sort === "price_high") filters.sort = "price_desc";
        if (sort === "newest") filters.sort = "newest";

        Object.keys(attributes).forEach((key) => {
            if (attributes[key]) filters[key] = attributes[key];
        });

        onApply(filters);
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
                    background: #6d5a4e;
                    color: #fafafb;
                    border: none;
                    padding: 10px 18px;
                    font-size: 15px;
                    font-weight: 500;
                    
                }

                .filter-toggle:hover {
                    background: #908681;
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
                    background: #fafafb;
                    border-radius: 0px;
                    padding: 22px;
                    box-shadow: 0px 3px 10px rgba(0,0,0,0.1);
                    border: 1px solid #dbd9d9;
                }

                .filter-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #1b1a19;
                    text-align: center;
                    margin-bottom: 18px;
                }

                .filter-label {
                    color: #1b1a19;
                    font-weight: 500;
                    font-size: 14px;
                }

                .filter-input,
                .filter-select {
                    background: #dbd9d9;
                    border: none;
                    border-radius: 0px;
                    color: #1b1a19;
                    padding: 10px;
                    font-size: 15px;
                }

                .filter-input:focus,
                .filter-select:focus {
                    outline: none;
                    box-shadow: none;
                    background: #beb7b3;
                }

                .btn-apply {
                    background: #6d5a4e;
                    border: none;
                    color: #fafafb;
                    font-weight: 500;
                    border-radius:0px
                }

                .btn-apply:hover {
                    background: #908681;
                }

                .btn-clear {
                    background: #dbd9d9;
                    border: none;
                    color: #1b1a19;
                    border-radius:0px
                }

                .btn-clear:hover {
                    background: #beb7b3;
                }
            `}</style>

            {/* ⭐ MOBILE TOGGLE BUTTON */}
            <button className="filter-toggle" onClick={() => setOpen(!open)}>
                {open ? "Close Filters" : "Open Filters"}
            </button>

            {/* ⭐ FILTER SIDEBAR */}
            <Card className="filter-card my-0">

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
                        <option>Men Accessories</option>
                        <option>Electronics</option>
                        <option>Shoes</option>
                        <option>Clothing</option>
                        <option>Bags</option>
                        <option>Beauty</option>
                        <option>Home Appliances</option>
                        <option>Mobile</option>
                        <option>Laptop</option>
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
                {dynamicAttrs.length > 0 && (
                    <>
                        <hr />

                        {dynamicAttrs.map((attr) => (
                            <Form.Group className="mb-3" key={attr}>
                                <Form.Label className="filter-label">{attr.toUpperCase()}</Form.Label>
                                <Form.Control
                                    placeholder={`Enter ${attr}`}
                                    value={attributes[attr] || ""}
                                    onChange={(e) =>
                                        setAttributes((prev) => ({ ...prev, [attr]: e.target.value }))
                                    }
                                    className="filter-input"
                                />
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

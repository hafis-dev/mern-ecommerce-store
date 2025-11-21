import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { CATEGORY_ATTRIBUTES } from "../data/categoryAttributes";

const FilterSidebar = ({ onApply, onClear }) => {
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");

    // dynamic attribute states stored in an object
    const [attributes, setAttributes] = useState({});

    const dynamicAttrs = CATEGORY_ATTRIBUTES[category] || [];

    const handleAttributeChange = (attr, value) => {
        setAttributes((prev) => ({ ...prev, [attr]: value }));
    };

    const handleApply = () => {
        const filters = {};

        if (category) filters.category = category;
        if (minPrice) filters.minPrice = minPrice;
        if (maxPrice) filters.maxPrice = maxPrice;

        if (sort === "price_low") filters.sort = "price_asc";
        if (sort === "price_high") filters.sort = "price_desc";
        if (sort === "newest") filters.sort = "newest";

        // Add dynamic attributes
        for (const key in attributes) {
            if (attributes[key]) filters[key] = attributes[key];
        }

        onApply(filters);
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
        <Card className="p-3 shadow-sm">
            <h5 className="mb-3">Filters</h5>

            {/* Category */}
            <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setAttributes({}); // reset when category changes
                    }}
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
                </Form.Select>
            </Form.Group>

            {/* Price */}
            <Form.Group className="mb-3">
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </Form.Group>

            {/* Sort */}
            <Form.Group className="mb-3">
                <Form.Label>Sort By</Form.Label>
                <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Default</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                </Form.Select>
            </Form.Group>

            {/* Dynamic Attribute Section */}
            {dynamicAttrs.length > 0 && (
                <>
                    <hr />
                    <h6>Attributes</h6>

                    {dynamicAttrs.map((attr) => (
                        <Form.Group className="mb-3" key={attr}>
                            <Form.Label>{attr.toUpperCase()}</Form.Label>
                            <Form.Control
                                placeholder={`Enter ${attr}`}
                                value={attributes[attr] || ""}
                                onChange={(e) => handleAttributeChange(attr, e.target.value)}
                            />
                        </Form.Group>
                    ))}
                </>
            )}

            {/* Buttons */}
            <div className="d-flex gap-2">
                <Button variant="primary" onClick={handleApply}>
                    Apply Filters
                </Button>
                <Button variant="secondary" onClick={handleClear}>
                    Clear
                </Button>
            </div>
        </Card>
    );
};

export default FilterSidebar;

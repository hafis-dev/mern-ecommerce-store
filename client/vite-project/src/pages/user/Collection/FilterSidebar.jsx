import { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import api from "../../../services/api/axios";
import styles from "./filterSidebar.module.css";
import { CATEGORY_OPTIONS } from "../../../constants/categories";

const FilterSidebar = ({ onApply, onClear }) => {
    const [filters, setFilters] = useState({});
    const [category, setCategory] = useState("");

    // ⭐ GENDER ARRAY STATE
    const [gender, setGender] = useState([]);

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");
    const [attributes, setAttributes] = useState({});
    const [open, setOpen] = useState(false);

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

    // ⭐ CHECKBOX HANDLER FOR GENDER
    const handleGenderChange = (e) => {
        const value = e.target.value;

        setGender((prev) => {
            if (prev.includes(value)) {
                return prev.filter((g) => g !== value); // remove
            }
            return [...prev, value]; // add
        });
    };

    const handleApply = () => {
        const f = {};

        if (category) f.category = category;

        // ⭐ FIX: send "Men,Women" instead of array
        if (gender.length > 0) f.gender = gender.join(",");

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
        setGender([]);       // ⭐ CLEAR ARRAY
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setAttributes({});
        onClear();
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                className={styles.filterToggle}
                onClick={() => setOpen(!open)}
            >
                {open ? "Close Filters" : "Open Filters"}
            </button>

            {/* Filter Card */}
            <Card className={`${styles.filterCard} ${!open ? styles.mobileHidden : ""}`}>
                <h5 className={styles.filterTitle}>Filters</h5>

                {/* ⭐ GENDER CHECKBOX FILTER */}
                <Form.Group className="mb-3">
                    <Form.Label className={styles.filterLabel}>Gender</Form.Label>

                    <div>
                        <Form.Check
                            type="checkbox"
                            label="Men"
                            value="Men"
                            checked={gender.includes("Men")}
                            onChange={handleGenderChange}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Women"
                            value="Women"
                            checked={gender.includes("Women")}
                            onChange={handleGenderChange}
                        />
                    </div>
                </Form.Group>

                {/* CATEGORY */}
                <Form.Group className="mb-3">
                    <Form.Label className={styles.filterLabel}>Category</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setAttributes({});
                        }}
                        className={styles.filterSelect}
                    >
                        <option value="">All</option>

                        {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>


                {/* PRICE FILTERS */}
                <Form.Group className="mb-3">
                    <Form.Label className={styles.filterLabel}>Min Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className={styles.filterInput}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className={styles.filterLabel}>Max Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className={styles.filterInput}
                    />
                </Form.Group>

                {/* SORT */}
                <Form.Group className="mb-3">
                    <Form.Label className={styles.filterLabel}>Sort By</Form.Label>
                    <Form.Select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Default</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                    </Form.Select>
                </Form.Group>

                {/* DYNAMIC ATTRIBUTES */}
                {dynamicAttrs.length > 0 && (
                    <>
                        <hr />

                        {dynamicAttrs.map((attr) => (
                            <Form.Group className="mb-3" key={attr}>
                                <Form.Label className={styles.filterLabel}>
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
                                    className={styles.filterSelect}
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

                {/* BUTTONS */}
                <div className="d-flex gap-2 mt-3">
                    <Button className={`${styles.btnApply} w-50`} onClick={handleApply}>
                        Apply
                    </Button>
                    <Button className={`${styles.btnClear} w-50`} onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default FilterSidebar;

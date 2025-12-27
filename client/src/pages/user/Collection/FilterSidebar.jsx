import { useState, useEffect } from "react";
import { Card, Form, } from "react-bootstrap";
import api from "../../../services/api/axios";
import styles from "./filterSidebar.module.css";
import Select from "react-select";
import { CATEGORY_GROUPS } from "../../../constants/categories";

const FilterSidebar = ({ onApply, onClear }) => {
    const [filters, setFilters] = useState({});
    const [category, setCategory] = useState("");
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

    const handleGenderChange = (e) => {
        const value = e.target.value;

        setGender((prev) => {
            if (prev.includes(value)) {
                return prev.filter((g) => g !== value);
            }
            return [...prev, value];
        });
    };

    const handleApply = () => {
        const f = {};

        if (category) f.category = category;
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
        setGender([]);
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setAttributes({});
        onClear();
    };

    return (
        <>
            <button
                className={styles.filterToggle}
                onClick={() => setOpen(!open)}
            >
                Filter
            </button>

            <Card className={`${styles.filterCard} ${!open ? styles.mobileHidden : ""}`}>
                <h5 className={styles.filterTitle}>Filters</h5>

                <Form.Group className="mb-3">
                    <Form.Label className={styles.filterLabel}>Gender</Form.Label>

                    <div>
                        <Form.Check type="checkbox">
                            <Form.Check.Input
                                id="men"
                                value="Men"
                                checked={gender.includes("Men")}
                                onChange={handleGenderChange}
                                className={styles.checkBox}
                            />
                            <Form.Check.Label htmlFor="men" className={styles.genderLabel}>
                                Men
                            </Form.Check.Label>
                        </Form.Check>

                        <Form.Check type="checkbox">
                            <Form.Check.Input
                                id="women"
                                value="Women"
                                checked={gender.includes("Women")}
                                onChange={handleGenderChange}
                                className={styles.checkBox}
                            />
                            <Form.Check.Label htmlFor="women" className={styles.genderLabel}>
                                Women
                            </Form.Check.Label>
                        </Form.Check>
                    </div>
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label className={styles.filterLabel}>Category</Form.Label>

                    <Select
                        value={
                            category
                                ? { value: category, label: category }
                                : null
                        }
                        onChange={(option) => {
                            setCategory(option?.value || "");
                            setAttributes({});
                        }}
                        placeholder="All Categories"
                        isClearable
                        options={CATEGORY_GROUPS.map(group => ({
                            label: (
                                <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                                    {group.icon} {group.label}
                                </div>
                            ),
                            options: group.items.map(item => ({
                                value: item.name,
                                label: (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        {item.icon} {item.name}
                                    </div>
                                )
                            }))
                        }))}
                        menuPlacement="auto"
                        className="reactSelect"
                        styles={{
                            
                            control: (base,state) => ({
                                ...base,
                                borderColor: state.isFocused ? "var(--c4)" : "var(--c3)",
                                backgroundColor: "var(--c1)",
                                borderRadius: 0,
                                minHeight: 36,
                                color: "var(--c6)",
                                boxShadow: "none",     
                                "&:hover": {
                                    borderColor: "var(--c4)",
                                },
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 99999,
                                backgroundColor: "var(--c1)",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "var(--c6)",
                            }),
                            option: (base, state) => ({
                                ...base,
                                color: "var(--c6)",
                                backgroundColor: state.isSelected
                                    ? "var(--c3)"
                                    : state.isFocused
                                        ? "var(--c2)"
                                        : "var(--c1)",
                            }),
                        }}
                    />
                </Form.Group>

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

                <div className="d-flex gap-2 mt-3">
                    <button className={`${styles.btnApply} w-50`} onClick={handleApply}>
                        Apply
                    </button>
                    <button className={`${styles.btnClear} w-50`} onClick={handleClear}>
                        Clear
                    </button>
                </div>
            </Card>
        </>
    );
};

export default FilterSidebar;

import { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./ProductAddPage.module.css";
import { CATEGORY_GROUPS } from "../../constants/categories";
import Select from "react-select";
import { createProduct } from "../../services/api/product.service";

const ProductAddPage = () => {
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        attributes: {},
        gender: [],
        isFeatured: false,
        isNewArrival: false,
    });

    const handleGenderChange = (e) => {
        const value = e.target.value;

        setFormData((prev) => {
            const updatedGender = prev.gender.includes(value)
                ? prev.gender.filter((g) => g !== value)
                : [...prev.gender, value];

            return { ...prev, gender: updatedGender };
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAttributeChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            attributes: { ...prev.attributes, [key]: value },
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }

        setImages((prev) => [...prev, ...files]);
        setPreviewImages((prev) => [
            ...prev,
            ...files.map((file) => URL.createObjectURL(file)),
        ]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fd = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "attributes") {
                    fd.append("attributes", JSON.stringify(formData.attributes));
                }
                else if (key === "gender") {
                    formData.gender.forEach((g) => fd.append("gender", g));
                }
                else {
                    fd.append(key, formData[key]);
                }
            });

            images.forEach((img) => fd.append("images", img));

            await createProduct(fd);

            toast.success("Product created successfully!");

            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                attributes: {},
                gender: [],
                isFeatured: false,
                isNewArrival: false,
            });

            setImages([]);
            setPreviewImages([]);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className={styles.wrapper}>
            <h3 className={styles.heading}>Add New Product</h3>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Card className={styles.card}>
                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Product Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={styles.textarea}
                                    required
                                />
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-2">
                                        <Form.Label className={styles.label}>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-2">
                                        <Form.Label className={styles.label}>Stock</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Select
                                value={
                                    formData.category
                                        ? { value: formData.category, label: formData.category }
                                        : null
                                }
                                onChange={(option) =>
                                    setFormData(prev => ({ ...prev, category: option.value }))
                                }
                                placeholder="Select Category"
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
                                menuPlacement="bottom"
                                className="reactSelect"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: "var(--c1)",
                                        borderColor: "var(--c3)",
                                        borderRadius: 0,
                                        minHeight: 36,
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    })
                                }}
                            />

                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Gender</Form.Label>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Men"
                                        value="Men"
                                        checked={formData.gender.includes("Men")}
                                        onChange={handleGenderChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Women"
                                        value="Women"
                                        checked={formData.gender.includes("Women")}
                                        onChange={handleGenderChange}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Check
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleInputChange}
                                label="Featured Product"
                                className="mb-2"
                            />

                            <Form.Check
                                name="isNewArrival"
                                checked={formData.isNewArrival}
                                onChange={handleInputChange}
                                label="New Arrival"
                            />
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className={styles.card}>
                            <h6 className={styles.attrTitle}>Attributes</h6>

                            {Object.keys(formData.attributes).map((key) => (
                                <div className={styles.attrRow} key={key}>
                                    <Form.Control
                                        disabled
                                        value={key}
                                        className={`${styles.input} ${styles.attrKey}`}
                                    />

                                    <Form.Control
                                        value={formData.attributes[key]}
                                        onChange={(e) =>
                                            handleAttributeChange(key, e.target.value)
                                        }
                                        className={styles.input}
                                    />

                                    <Button
                                        size="sm"
                                        className={styles.removeBtn}
                                        onClick={() => {
                                            const updated = { ...formData.attributes };
                                            delete updated[key];
                                            setFormData((prev) => ({
                                                ...prev,
                                                attributes: updated,
                                            }));
                                        }}
                                    >
                                        X
                                    </Button>
                                </div>
                            ))}

                            <Button
                                size="sm"
                                variant="outline-dark"
                                className={styles.addAttrBtn}
                                onClick={() => {
                                    const key = prompt("Enter attribute name");
                                    if (key) handleAttributeChange(key, "");
                                }}
                            >
                                + Add Attribute
                            </Button>

                            <hr />

                            <Form.Group>
                                <Form.Label className={styles.label}>Product Images (Max 5)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className={styles.input}
                                />
                            </Form.Group>

                            <div className={styles.previewWrapper}>
                                {previewImages.map((src, i) => (
                                    <div className={styles.previewBox} key={i}>
                                        <img src={src} alt="" className={styles.previewImg} />

                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className={styles.removeImgBtn}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Uploading...
                        </>
                    ) : (
                        "Create Product"
                    )}
                </Button>
            </Form>
        </Container>
    );
};

export default ProductAddPage;

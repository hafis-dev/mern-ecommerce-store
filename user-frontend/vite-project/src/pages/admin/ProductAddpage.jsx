import { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import api from "../../services/api/axios";
import { toast } from "react-toastify";
import styles from "./ProductAddPage.module.css";

const ProductAddPage = () => {
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        attributes: {},
        isFeatured: false,
        isNewArrival: false,
    });

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "attributes") {
                    fd.append("attributes", JSON.stringify(formData.attributes));
                } else {
                    fd.append(key, formData[key]);
                }
            });

            images.forEach((img) => fd.append("images", img));

            await api.post("/products/create", fd);

            toast.success("Product created successfully!");

            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                attributes: {},
                isFeatured: false,
                isNewArrival: false,
            });

            setImages([]);
            setPreviewImages([]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to create product");
        }
    };

    return (
        <Container className={styles.wrapper}>
            <h3 className={styles.heading}>Add New Product</h3>

            <Form onSubmit={handleSubmit}>
                <Row>
                    {/* LEFT */}
                    <Col md={6}>
                        <Card className={styles.card}>
                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>
                                    Product Name
                                </Form.Label>
                                <Form.Control
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>
                                    Description
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={styles.textarea}
                                    required
                                />
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-2">
                                        <Form.Label className={styles.label}>
                                            Price (₹)
                                        </Form.Label>
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
                                        <Form.Label className={styles.label}>
                                            Stock
                                        </Form.Label>
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

                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>
                                    Category
                                </Form.Label>
                                <Form.Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Wallet">Wallet</option>
                                    <option value="Watch">Watch</option>
                                    <option value="Glass">Glass</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Check
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleInputChange}
                                label="Featured Product"
                                className={`${styles.check} mb-1`}
                            />

                            <Form.Check
                                name="isNewArrival"
                                checked={formData.isNewArrival}
                                onChange={handleInputChange}
                                label="New Arrival"
                                className={styles.check}
                            />
                        </Card>
                    </Col>

                    {/* RIGHT */}
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
                                        variant="outline-danger"
                                        className={styles.removeBtn}
                                        onClick={() => {
                                            const updated = { ...formData.attributes };
                                            delete updated[key];
                                            setFormData({
                                                ...formData,
                                                attributes: updated,
                                            });
                                        }}
                                    >
                                        X
                                    </Button>
                                </div>
                            ))}

                            <Button
                                size="sm"
                                variant="outline-dark"
                                onClick={() => {
                                    const key = prompt("Enter attribute name");
                                    if (key) handleAttributeChange(key, "");
                                }}
                                className={styles.addAttrBtn}
                            >
                                + Add Attribute
                            </Button>

                            <hr />

                            <Form.Group>
                                <Form.Label className={styles.label}>
                                    Product Images (Max 5)
                                </Form.Label>
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

                <Button type="submit" className={styles.submitBtn}>
                    Create Product
                </Button>
            </Form>
        </Container>
    );
};

export default ProductAddPage;

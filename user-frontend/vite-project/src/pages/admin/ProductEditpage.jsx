import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api/axios";
import { toast } from "react-toastify";
import styles from "./ProductEditPage.module.css";

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);

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

    const loadProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);

            setProduct(res.data.product);

            setFormData({
                name: res.data.product.name,
                description: res.data.product.description,
                price: res.data.product.price,
                stock: res.data.product.stock,
                category: res.data.product.category,
                attributes: res.data.product.attributes || {},
                isFeatured: res.data.product.isFeatured,
                isNewArrival: res.data.product.isNewArrival,
            });

            setPreviewImages(res.data.product.images);
            setLoading(false);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load product");
        }
    };

    useEffect(() => {
        loadProduct();
    }, [id]);

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
        if (previewImages.length + files.length > 5) {
            toast.error("Maximum 5 images allowed.");
            return;
        }

        setImages((prev) => [...prev, ...files]);
        setPreviewImages((prev) => [
            ...prev,
            ...files.map((f) => URL.createObjectURL(f)),
        ]);
    };

    const removeImage = (index) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setImages((prev) => prev.filter((_, i) => i !== index));
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

            await api.put(`/products/${id}`, fd);

            toast.success("Product updated successfully!");
            navigate("/admin/products");
        } catch (err) {
            console.log(err);
            toast.error("Failed to update product");
        }
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <Container className={styles.wrapper}>
            <h3 className={styles.heading}>Edit Product</h3>

            <Form onSubmit={handleSubmit}>
                <Row>
                    {/* LEFT */}
                    <Col md={6}>
                        <Card className={styles.card}>
                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Name</Form.Label>
                                <Form.Control
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>
                                    Description
                                </Form.Label>
                                <Form.Control
                                    required
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={styles.textarea}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Price</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Stock</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Category</Form.Label>
                                <Form.Select
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                >
                                    <option value="Wallet">Wallet</option>
                                    <option value="Watch">Watch</option>
                                    <option value="Glass">Glass</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Check
                                className={styles.check}
                                label="Featured"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleInputChange}
                            />

                            <Form.Check
                                className={styles.check}
                                label="New Arrival"
                                name="isNewArrival"
                                checked={formData.isNewArrival}
                                onChange={handleInputChange}
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
                                className={styles.addAttrBtn}
                                onClick={() => {
                                    const key = prompt("Enter new attribute key");
                                    if (key) handleAttributeChange(key, "");
                                }}
                            >
                                + Add Attribute
                            </Button>

                            <hr />

                            <Form.Group>
                                <Form.Label className={styles.label}>
                                    Replace Images
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
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
};

export default ProductEditPage;

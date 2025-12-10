import { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./productEditPage.module.css";
import api from "../../services/api/axios";

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

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

    // Load single product
    const loadProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.product);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load product");
        }
    };
    // UPDATE PRODUCT
    const updateProduct = async (id, formData) => {
        try {
            await api.put(`/products/${id}`, formData);
            toast.success("Product updated successfully!");
            return true;
        } catch (err) {
            console.log(err)
            toast.error("Failed to update product");
            return false;
        }
    };
    // FIXED: Wait for product to load before setting formData
    useEffect(() => {
        const fetchData = async () => {
            await loadProduct();
        };
        fetchData();
    }, [id]);

    // When product is fetched → fill the form
    useEffect(() => {
        if (!product) return;

        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            attributes: product.attributes || {},
            isFeatured: product.isFeatured,
            isNewArrival: product.isNewArrival,
        });

        setPreviewImages(product.images || []);
        setLoading(false);
    }, [product]);

    // Input handler
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Attribute change
    const handleAttributeChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            attributes: { ...prev.attributes, [key]: value },
        }));
    };

    // Image upload
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

    // Remove image
    const [removedIndexes, setRemovedIndexes] = useState([]);

    const removeImage = (index) => {
        // Add index to removed list (only original images)
        if (!images[index]) {
            setRemovedIndexes((prev) => [...prev, index]);
        }

        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setImages((prev) => prev.filter((_, i) => i !== index));
    };


    // Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true); // start loading

        const fd = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === "attributes") {
                fd.append("attributes", JSON.stringify(formData.attributes));
            } else {
                fd.append(key, formData[key]);
            }
        });

        fd.append("removeImages", JSON.stringify(removedIndexes));
        images.forEach((img) => fd.append("images", img));

        const success = await updateProduct(id, fd);

        setSubmitLoading(false); // stop loading

        if (success) navigate("/admin/products");
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
                                <Form.Label className={styles.label}>Description</Form.Label>
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

                <Button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitLoading}
                >
                    {submitLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}

                </Button>

            </Form>
        </Container>
    );
};

export default ProductEditPage;

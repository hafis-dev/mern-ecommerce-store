import {  useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CATEGORY_OPTIONS } from "../../constants/categories";
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
        gender: [],          // ⭐ ADDED
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

    useEffect(() => {
        loadProduct();
    }, [id]);

    // When product loads → fill form
    useEffect(() => {
        if (!product) return;

        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            attributes: product.attributes || {},
            gender: product.gender || [],   // ⭐ LOAD GENDER ARRAY
            isFeatured: product.isFeatured,
            isNewArrival: product.isNewArrival,
        });

        setPreviewImages(product.images || []);
        setLoading(false);
    }, [product]);

    // Input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ⭐ Gender checkbox toggle
    const handleGenderChange = (value) => {
        setFormData((prev) => {
            let updated = [...prev.gender];

            if (updated.includes(value)) {
                updated = updated.filter((g) => g !== value);
            } else {
                updated.push(value);
            }

            return { ...prev, gender: updated };
        });
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

    const [removedIndexes, setRemovedIndexes] = useState([]);

    const removeImage = (index) => {
        if (!images[index]) {
            setRemovedIndexes((prev) => [...prev, index]);
        }

        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        const fd = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === "attributes") {
                fd.append("attributes", JSON.stringify(formData.attributes));
            }
            else if (key === "gender") {
                formData.gender.forEach((g) => fd.append("gender", g));  // ⭐ SEND ARRAY
            }
            else {
                fd.append(key, formData[key]);
            }
        });

        fd.append("removeImages", JSON.stringify(removedIndexes));
        images.forEach((img) => fd.append("images", img));

        const success = await updateProduct(id, fd);

        setSubmitLoading(false);

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
                            {/* NAME */}
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

                            {/* DESCRIPTION */}
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

                            {/* PRICE */}
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

                            {/* STOCK */}
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

                            {/* CATEGORY */}
                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Category</Form.Label>
                                <Form.Select
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                >
                                    <option value="">Select</option>
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>


                            {/* ⭐ GENDER */}
                            <Form.Group className="mb-2">
                                <Form.Label className={styles.label}>Gender</Form.Label>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Men"
                                        checked={formData.gender.includes("Men")}
                                        onChange={() => handleGenderChange("Men")}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Women"
                                        checked={formData.gender.includes("Women")}
                                        onChange={() => handleGenderChange("Women")}
                                    />
                                </div>
                            </Form.Group>

                            {/* FEATURED */}
                            <Form.Check
                                className={styles.check}
                                label="Featured"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleInputChange}
                            />

                            {/* NEW ARRIVAL */}
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
                                <Form.Label className={styles.label}>Replace Images</Form.Label>
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

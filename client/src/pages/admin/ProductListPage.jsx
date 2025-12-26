import { useEffect, useState } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./productListPage.module.css";
import { deleteProduct, getProducts } from "../../services/api/product.service";

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const res = await getProducts();
            setProducts(res.data.products);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await deleteProduct(id);
            toast.success("Product deleted");
            loadProducts();
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete");
        }
    };
    if (loading) {
        return (
            <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "85vh" }}
            >
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (
        <Container className="py-4" style={{ minHeight: "85vh" }}>
            <h3
                style={{
                    fontFamily: "Urbanist",
                    fontWeight: 700,
                    color: "var(--c6)",
                    marginBottom: "20px",

                }}
            >
                All Products
            </h3>

            {products.map((p) => (
                <Card key={p._id} className={styles.productCard}>
                    <div className={styles.rowBox}>
                        <img
                            src={p.images?.[0] || "/no-image.png"}
                            alt=""
                            className={styles.productImg}
                        />

                        <div className={styles.productInfo}>
                            <p className={styles.productName}>{p.name}</p>
                            <p className={styles.productMeta}>Category: {p.category}</p>
                            <p className={styles.productMeta}>Stock: {p.stock}</p>
                            <p className={styles.productPrice}>₹{p.price}</p>
                        </div>

                        <div className="d-flex flex-column gap-2">
                            <button
                            type="button"
                                className={styles.btnEdit}
                                onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                            >
                                Edit
                            </button>

                            <Button
                                variant="danger"
                                className={styles.btnDelete}
                                onClick={() => handleDelete(p._id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </Container>
    );
}

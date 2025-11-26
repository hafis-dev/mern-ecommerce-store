import { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const COLORS = {
    bg: "#fafafb",
    border: "#dbd9d9",
    borderStrong: "#beb7b3",
    textSoft: "#908681",
    accent: "#6d5a4e",
    dark: "#1b1a19",
};

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data.products);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load products");
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted");
            loadProducts();
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete");
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <Container className="py-4">
            <h3 style={{ color: COLORS.dark }}>All Products</h3>

            <Table striped bordered hover className="mt-3" style={{ fontSize: "14px" }}>
                <thead>
                    <tr style={{ background: COLORS.bg }}>
                        <th>#</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price (₹)</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p, i) => (
                        <tr key={p._id}>
                            <td>{i + 1}</td>

                            <td>
                                <img
                                    src={p.images[0]}
                                    alt=""
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: "6px",
                                        objectFit: "cover",
                                        border: `1px solid ${COLORS.borderStrong}`,
                                    }}
                                />
                            </td>

                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>{p.stock}</td>
                            <td>{p.category}</td>

                            <td>
                                <Button
                                    size="sm"
                                    style={{
                                        background: COLORS.accent,
                                        border: "none",
                                    }}
                                    onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                                >
                                    Edit
                                </Button>
                            </td>

                            <td>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => deleteProduct(p._id)}
                                >
                                    X
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ProductListPage;

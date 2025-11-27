import { useEffect, useState } from "react";
import { Button, Container, Card } from "react-bootstrap";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data.products);
        } catch (err) {
            toast.error("Failed to load products");
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted");
            loadProducts();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <>
            {/* Inline CSS — OrderCard Style for Products */}
            <style>{`
                :root {
                    --c1: #fafafb;
                    --c2: #dbd9d9;
                    --c3: #beb7b3;
                    --c4: #908681;
                    --c5: #6d5a4e;
                    --c6: #1b1a19;
                }

                .productCard {
                    background: var(--c1);
                    border: 1px solid var(--c2);
                    border-radius: 0px !important;
                    padding: 15px;
                    margin-bottom: 12px;
                    font-family: "Urbanist", sans-serif;
                    transition: 0.2s ease;
                    cursor: pointer;
                }

                .productCard:hover {
                    border-color: var(--c5);
                }

                .rowBox {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                }

                .productImg {
                    width: 70px;
                    height: 70px;
                    object-fit: cover;
                    border-radius: 6px;
                    border: 1px solid var(--c3);
                }

                .productInfo {
                    flex: 1;
                }

                .productName {
                    font-size: 17px;
                    font-weight: 700;
                    color: var(--c6);
                    margin: 0;
                }

                .productMeta {
                    font-size: 14px;
                    color: var(--c4);
                    margin: 0;
                }

                .productPrice {
                    font-weight: 700;
                    font-size: 16px;
                    color: var(--c5);
                    margin-top: 5px;
                }

                .btnEdit {
                    background: var(--c5) !important;
                    border: none !important;
                    color: var(--c1) !important;
                    font-weight: 600 !important;
                    padding: 6px 12px !important;
                    border-radius: 6px !important;
                }

                .btnEdit:hover {
                    background: #59483d !important;
                }

                .btnDelete {
                    border-radius: 6px !important;
                    padding: 6px 12px !important;
                }

                // @media (max-width: 576px) {
                //     .rowBox {
                //         flex-direction: column;
                //         align-items: flex-start;
                //     }

                //     .productImg {
                //         width: 100%;
                //         height: 180px;
                //     }
                // }
            `}</style>

            <Container className="py-4">
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
                    <Card key={p._id} className="productCard">
                        <div className="rowBox" onClick={() => navigate(`/admin/products/edit/${p._id}`)}>

                            {/* IMAGE */}
                            <img src={p.images[0]} alt="" className="productImg" />

                            {/* PRODUCT INFO */}
                            <div className="productInfo">
                                <p className="productName">{p.name}</p>
                                <p className="productMeta">Category: {p.category}</p>
                                <p className="productMeta">Stock: {p.stock}</p>

                                <p className="productPrice">₹{p.price}</p>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="d-flex flex-column gap-2">
                                <Button
                                    className="btnEdit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/admin/products/edit/${p._id}`);
                                    }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="danger"
                                    className="btnDelete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteProduct(p._id);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </Container>
        </>
    );
}

import { Container } from "react-bootstrap";
import styles from "./AdminFooter.module.css";

const AdminFooter = () => {
    return (
        <footer className={styles.footer}>
            <Container className="text-center py-3">
                <p className={styles.text}>
                    © {new Date().getFullYear()} Admin Panel — MyShop
                </p>
            </Container>
        </footer>
    );
};

export default AdminFooter;

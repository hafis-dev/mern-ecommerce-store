import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import styles from "./login.module.css";

const LoginPage = () => {
    const { user, login } = useContext(AuthContext);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");

    if (user) return <Navigate to="/" replace />;

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
                emailOrPhone,
                password,
            });

            login(res.data);
            toast.success("Login successful");
            window.location.href = "/";
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Login</h2>

            <input
                className={styles.input}
                placeholder="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
            />

            <input
                className={styles.input}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className={styles.forgot}>
                <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button className={styles.button} onClick={handleLogin}>
                Login
            </button>

            <p className={styles.bottomText}>
                Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
};

export default LoginPage;

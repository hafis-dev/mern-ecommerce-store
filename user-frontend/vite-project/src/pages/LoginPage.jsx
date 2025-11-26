import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./login.module.css";

const LoginPage = () => {
    const navigate = useNavigate()
    const { user, login } = useContext(AuthContext);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    // REGEX patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    // 🔥 If logged in already, redirect based on isAdmin
    if (user) {
        if (user.isAdmin) {
            return <Navigate to="/admin/product-add" replace />;
        }
        return <Navigate to="/" replace />;
    }


    const handleLogin = async () => {
        const value = emailOrPhone.trim();
        const passwordValue = password;


        // VALIDATIONS
        if (!value) {
            return toast.error("Email or phone is required");
        }

        const isEmail = emailRegex.test(value);
        const isPhone = phoneRegex.test(value);

        if (!isEmail && !isPhone) {
            return toast.error("Enter a valid email or 10-digit phone number");
        }

        if (!passwordValue) {
            return toast.error("Password is required");
        }

        // API request
        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
                emailOrPhone: value,
                password: passwordValue,
            });

            login(res.data);
            toast.success("Login successful");
            // 🔥 Redirect based on admin or user
            if (res.data.user.isAdmin) {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }


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

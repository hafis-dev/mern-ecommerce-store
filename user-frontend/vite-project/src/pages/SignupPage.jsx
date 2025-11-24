import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import styles from "./signup.module.css";

function SignupPage() {
    const { user, login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
    });

    if (user) return <Navigate to="/" replace />;

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSignup() {
        try {
            const res = await axios.post("http://localhost:3000/api/auth/register", {
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password,
            });

            login(res.data);
            toast.success("Account created successfully!");
            window.location.replace("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        }
    }

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Create Account</h2>

            <input
                className={styles.input}
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
            />

            <input
                className={styles.input}
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />

            <input
                className={styles.input}
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
            />

            <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />

            <button className={styles.button} onClick={handleSignup}>
                Create Account
            </button>

            <p className={styles.bottomText}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default SignupPage;

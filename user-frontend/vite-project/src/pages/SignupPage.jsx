import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import styles from "./signup.module.css";

function SignupPage() {
    const { user, login } = useContext(AuthContext);
    // REGEX VALIDATION
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

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
        
        const username = formData.username.trim();
        const email = formData.email.trim().toLowerCase();
        const phone = formData.phone.trim();
        const password = formData.password;

        // FRONTEND VALIDATIONS
        if (!username) {
            return toast.error("Username is required");
        }
        if (!usernameRegex.test(username)) {
            return toast.error("Username must be 3–20 chars (letters, numbers, underscore)");
        }

        if (!email) {
            return toast.error("Email is required");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Invalid email format");
        }

        if (phone && !phoneRegex.test(phone)) {
            return toast.error("Phone must be 10 digits");
        }

        if (!password || password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        // SEND REQUEST AFTER VALIDATION
        try {
            const res = await axios.post("http://localhost:3000/api/auth/register", {
                username,
                email,
                phone,
                password,
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

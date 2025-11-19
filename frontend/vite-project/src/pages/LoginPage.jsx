import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";

const LoginPage = () => {
    const {user, login } = useContext(AuthContext);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    // 🚀 Prevent logged-in users from accessing login page
    if (user) {
        return <Navigate to="/" replace />;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

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
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button>Login</button>
            <p>
                Don’t have an account? <Link to='/signup'>Sign up</Link> 
            </p>
            <p>
                <Link to='/forgot-password'>Forgot Password?</Link>
            </p>
        </form>
    );
};

export default LoginPage;

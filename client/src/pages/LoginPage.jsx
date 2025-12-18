import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { loginUser } from "../services/api/auth.service";

const LoginPage = () => {
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);

    const [rememberMe, setRememberMe] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (user) {
        return (
            <Navigate
                to={user.isAdmin ? "/admin/dashboard" : "/"}
                replace
            />
        );
    }

    const handleLogin = async () => {
        const value = emailOrPhone.trim();

        if (!value) {
            return toast.error("Email or phone is required");
        }

        const isEmail = emailRegex.test(value);
        const isPhone = phoneRegex.test(value);

        if (!isEmail && !isPhone) {
            return toast.error("Enter a valid email or 10-digit phone number");
        }

        if (!password) {
            return toast.error("Password is required");
        }

        try {
            const res = await loginUser({
                emailOrPhone: value,
                password,
                rememberMe,
            });

            login(res.data);
            toast.success("Login successful");

            navigate(
                res.data.user.isAdmin ? "/admin/dashboard" : "/"
            );

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login failed"
            );
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

            <div className={styles.actionsRow}>
                <label className={styles.rememberMe}>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) =>
                            setRememberMe(e.target.checked)
                        }
                    />
                    <span>Remember me</span>
                </label>

                <Link
                    to="/forgot-password"
                    className={styles.forgot}
                >
                    Forgot password?
                </Link>
            </div>

            <button
                className={styles.button}
                onClick={handleLogin}
            >
                Login
            </button>

            <p className={styles.bottomText}>
                Don’t have an account?{" "}
                <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
};

export default LoginPage;

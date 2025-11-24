import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styles from "./resetPassword.module.css";

const ResetPasswordPage = () => {
    const query = new URLSearchParams(useLocation().search);
    const identifier = query.get("identifier");

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    if (!identifier) {
        toast.error("Invalid password reset request");
        return <Navigate to="/forgot-password" replace />;
    }

    const handleReset = async () => {
        try {
            await axios.post("http://localhost:3000/api/auth/reset-password", {
                emailOrPhone: identifier,
                otp,
                newPassword,
            });

            toast.success("Password reset successfully! Please Login");
            setTimeout(() => navigate("/login"), 800);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Reset Password</h2>

            <input
                className={styles.input}
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />

            <input
                className={styles.input}
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <button className={styles.button} onClick={handleReset}>
                Reset Password
            </button>
        </div>
    );
};

export default ResetPasswordPage;

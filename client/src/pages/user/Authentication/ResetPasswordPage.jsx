import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styles from "./resetPassword.module.css";
import { resetPassword } from "../../../services/api/auth.service";

const ResetPasswordPage = () => {
    const query = new URLSearchParams(useLocation().search);
    const identifier = query.get("identifier");
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const otpRegex = /^[0-9]{6}$/;

    useEffect(() => {
        if (!identifier) {
            toast.error("Invalid password reset request");
        }
    }, [identifier]);

    if (!identifier) {
        return <Navigate to="/forgot-password" replace />;
    }

    const handleReset = async (e) => {
        e.preventDefault();

        const value = identifier.trim();
        const otpValue = otp.trim();
        const passwordValue = newPassword.trim();

        // VALIDATE email/phone
        const isEmail = emailRegex.test(value);
        const isPhone = phoneRegex.test(value);

        if (!isEmail && !isPhone) {
            return toast.error("Enter a valid email or 10-digit phone number");
        }

        // VALIDATE OTP
        if (!otpValue || !otpRegex.test(otpValue)) {
            return toast.error("OTP must be a 6-digit number");
        }

        // VALIDATE PASSWORD
        if (!passwordValue || passwordValue.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            await resetPassword({
                emailOrPhone: value,
                otp: otpValue,
                newPassword: passwordValue,
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
                type="text"
                onChange={(e) => setOtp(e.target.value)}
            />

            <input
                className={styles.input}
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
                type="button"
                className={styles.button}
                onClick={handleReset}
            >
                Reset Password
            </button>
        </div>
    );
};

export default ResetPasswordPage;

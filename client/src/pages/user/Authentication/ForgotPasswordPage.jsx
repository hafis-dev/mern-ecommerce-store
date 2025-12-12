import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./forgotPassword.module.css";
import { useNavigate } from "react-router-dom";
import { requestForgotPassword } from "../../../services/api/auth.service";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

const ForgotPasswordPage = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = emailOrPhone.trim();

        if (!value) return toast.error("Email or phone is required");

        const isEmail = emailRegex.test(value);
        const isPhone = phoneRegex.test(value);

        if (!isEmail && !isPhone) {
            return toast.error("Enter a valid email or 10-digit phone number");
        }

        const identifier = isEmail ? value.toLowerCase() : value;

        try {
            await requestForgotPassword({ emailOrPhone: identifier });

            toast.success("OTP sent successfully!");
            navigate(`/reset-password?identifier=${identifier}`);

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Forgot Password</h2>

            <input
                className={styles.input}
                placeholder="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
            />

            <button
                type="button"
                className={styles.button}
                onClick={handleSubmit}
            >
                Send OTP
            </button>
        </div>
    );
};

export default ForgotPasswordPage;

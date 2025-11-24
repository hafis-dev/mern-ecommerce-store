import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./forgotPassword.module.css";

const ForgotPasswordPage = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:3000/api/auth/forgot-password", {
                emailOrPhone: emailOrPhone.trim().toLowerCase(),
            });

            toast.success("OTP sent successfully!");
            window.location.href = `/reset-password?identifier=${emailOrPhone}`;
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

            <button className={styles.button} onClick={handleSubmit}>
                Send OTP
            </button>
        </div>
    );
};

export default ForgotPasswordPage;

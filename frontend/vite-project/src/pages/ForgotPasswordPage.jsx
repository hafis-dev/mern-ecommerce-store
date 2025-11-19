import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/api/auth/forgot-password", {
                emailOrPhone: emailOrPhone.trim().toLowerCase(),
            });

            toast.success("OTP sent successfully!");
            window.location.href = window.location.href = `/reset-password?identifier=${emailOrPhone}`;

        } catch (error) {
            console.log(emailOrPhone)
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Email or Phone"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                />

                <button type="submit">Send OTP</button>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;

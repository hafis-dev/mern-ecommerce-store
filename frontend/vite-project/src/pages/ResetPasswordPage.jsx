import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

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
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/api/auth/reset-password", {
                emailOrPhone: identifier,
                otp,
                newPassword,
            });

            toast.success("Password reset successfully! Please Login");
            setTimeout(() => {
                navigate('/login')
            }, 800)
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <input
                    placeholder="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;

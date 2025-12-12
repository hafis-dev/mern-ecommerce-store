import { Navigate } from "react-router-dom";

const AdminProtectRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtectRoute;

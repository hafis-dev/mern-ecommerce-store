import { Navigate } from "react-router-dom";

const adminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

export default adminRoute;

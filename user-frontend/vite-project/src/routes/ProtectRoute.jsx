import { Navigate } from "react-router-dom";
const ProtectRoute = ({children}) => {
  const token = localStorage.getItem('accessToken');

  if(!token){
    return <Navigate to="/login" />
  }
  return children;
}

export default ProtectRoute;
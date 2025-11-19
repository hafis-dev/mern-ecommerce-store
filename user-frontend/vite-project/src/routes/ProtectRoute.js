import { Navigate } from "react-router-dom";
const protectRoute = ({children}) => {
  const token = localStorage.getItem('accessToken');

  if(!token){
    return <Navigate to="/login" />
  }
  return children;
}

export default protectRoute;
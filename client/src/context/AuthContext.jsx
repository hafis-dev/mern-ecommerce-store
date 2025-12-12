import { createContext, useEffect, useState } from "react";
import { setLogoutHandler } from "../services/api/axios";
import { logoutUser } from "../services/api/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;

  const [user, setUser] = useState(storedUser);

  const login = (data) => {
    localStorage.setItem("accessToken", data.accessToken);

    const userData = {
      id: data.user.id,
      username: data.user.username,
      isAdmin: data.user.isAdmin,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout error:", err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

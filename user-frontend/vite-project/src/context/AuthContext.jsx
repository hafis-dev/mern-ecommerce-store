import { createContext, useEffect, useState } from "react";
import { setLogoutHandler } from "../services/api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;

  const [user, setUser] = useState(storedUser);

  const login = (data) => {
    // Save token
    localStorage.setItem("accessToken", data.accessToken);

    // Save user (now includes isAdmin)
    const userData = {
      id: data.user.id,
      username: data.user.username,
      isAdmin: data.user.isAdmin, // 🔥 very important
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
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

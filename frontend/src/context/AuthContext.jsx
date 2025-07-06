// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Tạo context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Load thông tin từ localStorage khi mở trang
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setAuth({
        user: JSON.parse(storedUser),
        token: storedToken,
        isAuthenticated: true,
      });
    }
  }, []);

  // Hàm đăng nhập
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setAuth({
      user: userData,
      token,
      isAuthenticated: true,
    });
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
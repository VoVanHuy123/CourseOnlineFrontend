import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { endpoints } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);             // access token
  const [refreshToken, setRefreshToken] = useState(null); // refresh token
  const [loading, setLoading] = useState(true);

  // ✅ Load từ localStorage khi app khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedRefresh = localStorage.getItem("refreshToken");

    if (storedUser && storedToken && storedRefresh) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setRefreshToken(storedRefresh);
      scheduleRefresh(storedToken);
    }

    setLoading(false);
  }, []);

  // ✅ Tự refresh token trước khi hết hạn
  const scheduleRefresh = (accessToken) => {
    try {
      const { exp } = jwtDecode(accessToken);
      const now = Date.now() / 1000;
      const timeUntilExpiry = exp - now - 60; // -60s đệm

      if (timeUntilExpiry > 0) {
        setTimeout(() => {
          refreshAccessToken();
        }, timeUntilExpiry * 1000);
      } else {
        refreshAccessToken();
      }
    } catch (e) {
      console.error("Invalid token", e);
      logout();
    }
  };

  // ✅ Gọi API refresh access token
  const refreshAccessToken = async () => {
    // if (!refreshToken) return logout();

    try {
      const response = await axios.post(endpoints['refresh'], {
        refresh_token: refreshToken,
      });
      if(response.status === 200) {
        const { access_token } = response.data;

        updateToken(access_token);
        scheduleRefresh(access_token);
      }
      else return logout();
      

    } catch (err) {
      console.error("Refresh token expired or invalid", err);
      logout();
    }
  };

  const login = (userData, accessToken, refreshTokenFromServer) => {
    setUser(userData);
    setToken(accessToken);
    setRefreshToken(refreshTokenFromServer);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshTokenFromServer);

    scheduleRefresh(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

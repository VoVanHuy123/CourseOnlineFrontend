// components/layout/HeaderLayout.jsx
import React, { useContext } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"
const { Header } = Layout;

const HeaderLayout = () => {
    const navigate = useNavigate();
    const { user, logout,isAuthenticated } = useContext(AuthContext);

  const handleClick = ({ key }) => {
    if (key === "logout") {
      logout();
      navigate("/login");
    } else {
      navigate(key);
    }
  };

  const nav = isAuthenticated
    ? [
        { label: "Trang chủ", key: "/" },
        { label: "Đăng xuất", key: "logout" },
      ]
    : [
        { label: "Trang chủ", key: "/" },
        { label: "Đăng nhập", key: "/login" },
        { label: "Đăng ký", key: "/register" },
      ];

          
  return (
    <Header style={{ color: "white", fontSize: 20 }}>
      <div className="min-h-screen w-full bg-[#0f172a] relative">
          {/* Blue Radial Glow Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)`,
            }}
          />
            {/* Your Content/Components */}
        
      <div style={{ float: "left", color: "white" }}>
        Course Online
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ float: "right" }}
        onClick={handleClick}
        items={nav}
      />
      </div>
    </Header>
  );
};

export default HeaderLayout;

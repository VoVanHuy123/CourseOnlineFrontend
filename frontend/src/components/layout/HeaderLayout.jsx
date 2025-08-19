import React, { useContext } from "react";
import { Avatar, Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import defaultImage from "../../assets/img/avatar.png";

const { Header } = Layout;

const HeaderLayout = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  console.log(user)
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
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        background: "#0f172a",
      }}
    >
      {/* Left: Logo or Title */}
      <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
        Course Online
      </div>

      {/* Right: Menu + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={handleClick}
          items={nav}
          style={{ background: "transparent", borderBottom: "none" }}
        />
        {isAuthenticated && (
          <div 
            onClick={() => {
                navigate(`/profile/${user.role}/${user.id}`, {
                  state: { allowEdit: true }
                });
              }} 
              className="flex felx-row justify-center items-center gap-4 cursor-pointer">
            <Avatar size={40} src={user?.avatar || defaultImage}
              // onClick={() => {
              //   navigate(`/profile/${user.role}/${user.id}`, {
              //     state: { allowEdit: true }
              //   });
              // }}
            />
            <div className="text-white flex flex-col leading-tight">
              <span>{user?.first_name} {user?.last_name}</span>
              <span>{user?.role}</span>
            </div>
          </div>

        )}
      </div>
    </Header>
  );
};

export default HeaderLayout;

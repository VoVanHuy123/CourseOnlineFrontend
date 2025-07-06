// components/layout/HeaderLayout.jsx
import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
const { Header } = Layout;

const HeaderLayout = () => {
    const navigate = useNavigate();

  const handleClick = ({ key }) => {
    navigate(key); // key chính là đường dẫn
  };
  return (
    <Header style={{ color: "white", fontSize: 20 }}>
      <div style={{ float: "left", color: "white" }}>
        Course Online
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ float: "right" }}
        onClick={handleClick}
        items={[
          { label: "Trang chủ", key: "/" },
          { label: "Đăng nhập", key: "/login" },
          { label: "Đăng ký", key: "/register" },
        ]}
      />
    </Header>
    //  <Header
    //     style={{
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "space-between",
    //       background: "#001529",
    //       padding: "0 24px",
    //     }}
    //   >
    //     <div style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
    //       🎓 CourseOnline
    //     </div>
    //     <Menu
    //       theme="dark"
    //       mode="horizontal"
    //       defaultSelectedKeys={["home"]}
    //       style={{ flex: 1, justifyContent: "flex-end", background: "transparent" }}
    //     >
    //       <Menu.Item key="home">
    //         <Link to="/">Trang chủ</Link>
    //       </Menu.Item>
    //       <Menu.Item key="register">
    //         <Link to="/register">Đăng ký</Link>
    //       </Menu.Item>
    //       <Menu.Item key="login">
    //         <Link to="/login">Đăng nhập</Link>
    //       </Menu.Item>
    //     </Menu>
    //   </Header> 
  );
};

export default HeaderLayout;

// src/components/layouts/BaseLayout.jsx
import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";

const { Header, Content, Footer } = Layout;

const BaseLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header full width */}
      {/* <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#001529",
          padding: "0 24px",
        }}
      >
        <div style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          🎓 CourseOnline
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["home"]}
          style={{ flex: 1, justifyContent: "flex-end", background: "transparent" }}
        >
          <Menu.Item key="home">
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/register">Đăng ký</Link>
          </Menu.Item>
          <Menu.Item key="login">
            <Link to="/login">Đăng nhập</Link>
          </Menu.Item>
        </Menu>
      </Header> */}
      <HeaderLayout/>
      {/* Nội dung chiếm toàn bộ chiều ngang */}
      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        <div
          style={{
            width: "100%",
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            minHeight: "calc(100vh - 134px)",
          }}
        >
          {children}
        </div>
      </Content>

      {/* <Footer style={{ textAlign: "center" }}>
        CourseOnline ©{new Date().getFullYear()} | Built by Võ Văn Huy
      </Footer> */}
      <FooterLayout/>
    </Layout>
  );
};

export default BaseLayout;

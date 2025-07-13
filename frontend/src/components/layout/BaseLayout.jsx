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
      
      <HeaderLayout/>
      {/* Nội dung chiếm toàn bộ chiều ngang */}
      <Content style={{ background: "#f0f2f5" }}>
        <div className="min-h-screen w-full bg-[#fefcff] relative">
  {/* Dreamy Sky Pink Glow */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
    }}
  />
    {/* Your Content/Components */}
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
          <div className="shadow-2xl rounded-b-2xl px-10 pb-10">

            {children}
          </div>
        </div>
</div>


        
      </Content>

      <FooterLayout/>
    </Layout>
  );
};

export default BaseLayout;

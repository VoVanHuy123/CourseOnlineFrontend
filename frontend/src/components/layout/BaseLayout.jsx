
// export default BaseLayout;
import { Layout } from "antd";
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";
import TeacherDrawer from "../drawer/TeacherDrawer";

const { Content } = Layout;

const BaseLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderLayout />

      <Content style={{ background: "#f0f2f5" }}>
        <TeacherDrawer />

        <div className="min-h-screen w-full bg-[#faf9f6] relative">
          {/* Paper Texture */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
              `,
              backgroundSize: "8px 8px, 32px 32px, 32px 32px",
            }}
          />

          {/* Content Wrapper */}
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
            <div className="shadow-xl rounded-b-2xl px-10 py-10">
              {children}
            </div>
          </div>
        </div>
      </Content>

      <FooterLayout />
    </Layout>
  );
};

export default BaseLayout;


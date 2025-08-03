// import BaseLayout from "../components/layout/BaseLayout";
// import TeacherHomePage from "./teacher/TeacherHomePgae";
// import { AuthContext } from "../context/AuthContext";
// import { useContext } from "react";

// const HomePage = () => {
//     const {user} = useContext(AuthContext)
    
//     return (
//         <>
//       {user?.role === "teacher" ? (
//         <TeacherHomePage />
//       ) : (
//         <div>Chào bạn!</div>
//       )}
//     </>
//     );
// };
// export default HomePage

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TeacherHomePage from "./teacher/TeacherHomePgae";
import StudentHomePage from "./student/StudentHomePage";
import AdminPage from "./admin/AdminHomePage";

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);
  console.log("vào")
  // Chờ load xong dữ liệu context từ localStorage
  if (loading) return <div>Đang tải...</div>;

  // Nếu là giáo viên → chuyển đến TeacherHomePage
  if (user?.role === "teacher") {
    console.log("teacher")
    return <TeacherHomePage />;
  }
if (user?.role === "student") {
  console.log("student")
    // Nếu là học sinh → chuyển đến StudentHomePage
    return <StudentHomePage />;
}
if (user?.role === "admin") {
  console.log("admin")
    // Nếu là học sinh → chuyển đến StudentHomePage
    return <AdminPage />;
}
  console.log("Vai trò không xác định hoặc chưa hỗ trợ:", user?.role);
// Các vai trò khác → render trang chung hoặc thông báo
return <StudentHomePage />;
};

export default HomePage;

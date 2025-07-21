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

const HomePage = () => {
  const { user, loading } = useContext(AuthContext);

  // Chờ load xong dữ liệu context từ localStorage
  if (loading) return <div>Đang tải...</div>;

  // Nếu là giáo viên → chuyển đến TeacherHomePage
  if (user?.role === "teacher") {
    return <TeacherHomePage />;
  }
if (user?.role === "student") {
    // Nếu là học sinh → chuyển đến StudentHomePage
    return <StudentHomePage />;
}

// Các vai trò khác → render trang chung hoặc thông báo
return <div>Chào mừng đến hệ thống học online!</div>;
};

export default HomePage;

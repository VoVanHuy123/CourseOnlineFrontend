// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from './context/AuthContext';

// import HomePage from './page/HomePage';
// import RegisterPage from './page/RegisterPage';
// import LoginPage from './page/LoginPage';
// import BaseLayout from './components/layout/BaseLayout';
// import PrivateRoute from './components/routes/PrivateRoute'
// import TeacherHomePage from './page/teacher/TeacherHomePgae';
// import CreateCourseForm from './page/teacher/CreateCoursePage';

// function App() {

//   return (
//       <AuthProvider>
//         <Router>
//         <BaseLayout>
//           <Routes>
//             <Route  path="/register" element={<RegisterPage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/"
//               element={
//                 <PrivateRoute allowedRoles={[]}>
//                   <HomePage />
//                 </PrivateRoute>
//               } />
//             <Route path="/create"
//               element={
//                 <PrivateRoute allowedRoles={["teacher"]}>
//                   <CreateCourseForm />
//                 </PrivateRoute>
//               } />
//             {/* <Route path="/teacher-home"
//               element={
//                 <PrivateRoute allowedRoles={["teacher"]}>
//                   <TeacherHomePage />
//                 </PrivateRoute>
//               } /> */}
//           </Routes>
//         </BaseLayout>
//         </Router>
//       </AuthProvider>
//   )
// }

// export default App
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import BaseLayout from "./components/layout/BaseLayout";
import { useContext } from "react";
import AppRoutes from "./AppRoutes";

const Main = () => {
  const { loading } = useContext(AuthContext);
  if (loading) return <div>Đang tải thông tin đăng nhập...</div>;
  return (
    <BaseLayout>
      <AppRoutes />
    </BaseLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>
  );
}

export default App;

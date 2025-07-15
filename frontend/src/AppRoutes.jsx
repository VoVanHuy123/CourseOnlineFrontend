
import { Routes, Route } from "react-router-dom";
import HomePage from './page/HomePage';
import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import CreateCourseForm from './page/teacher/CreateCoursePage';
import PrivateRoute from './components/routes/PrivateRoute';
import CreateChapTerLesson from "./page/teacher/CreateChapTerLesson";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/"
      element={
        <PrivateRoute allowedRoles={["teacher", "student", "admin"]}>
          <HomePage />
        </PrivateRoute>
      }
    />
    <Route path="/create"
      element={
        <PrivateRoute allowedRoles={["teacher"]}>
          <CreateCourseForm />
        </PrivateRoute>
      }
    />
    <Route
      path="/courses/:id"
      element={
        <PrivateRoute allowedRoles={["teacher", "student"]}>
          <CreateChapTerLesson />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;

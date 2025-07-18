
import { Routes, Route } from "react-router-dom";
import HomePage from './page/HomePage';
import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import CreateCourse from './page/teacher/CreateCoursePage';
import PrivateRoute from './components/routes/PrivateRoute';
import CreateChapTerLesson from "./page/teacher/CreateChapTerLesson";
import UpdateCoure from "./page/teacher/UpdateCoursePage";

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
          <CreateCourse />
        </PrivateRoute>
      }
    />
    <Route
      path="/courses/options/:id"
      element={
        <PrivateRoute allowedRoles={["teacher"]}>
          <CreateChapTerLesson />
        </PrivateRoute>
      }
    />
    <Route
      path="/courses/update/:id"
      element={
        <PrivateRoute allowedRoles={["teacher"]}>
          <UpdateCoure />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;

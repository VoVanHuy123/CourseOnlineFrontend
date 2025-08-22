import { Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import CreateCourse from "./page/teacher/CreateCoursePage";
import PrivateRoute from "./components/routes/PrivateRoute";
import CreateChapTerLesson from "./page/teacher/CreateChapTerLesson";
import UpdateCoure from "./page/teacher/UpdateCoursePage";
import DetailCoursePage from "./page/student/DetailCoursePage";
import LessonPage from "./page/student/LessonPage";
import PaymentReturnPage from "./page/payment/PaymentReturnPage";
import TeacherStatsPage from "./page/teacher/TeacherStatsPage";
import UserProfilePage from "./page/UserProfilePage";
import LessonHistoryList from "./components/list/LessonHistoryList";
import MyCoursePage from "./page/student/MyCoursePage";

const AppRoutes = () => (
  <Routes>
    {/* <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} /> */}
    <Route
      path="/"
      element={
        // <PrivateRoute allowedRoles={["teacher", "student", "admin",]}>
        <HomePage />
        // </PrivateRoute>
      }
    />

    <Route
      path="/create"
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
      path="/courses/my-courses"
      element={
        <PrivateRoute allowedRoles={["student"]}>
          <MyCoursePage />
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
    <Route
      path="/courses/:id"
      element={
        // <PrivateRoute allowedRoles={["student"]}>
        <DetailCoursePage />
        // </PrivateRoute>
      }
    />

    <Route
      path="/courses/:courseId/lessons/:lessonId"
      element={
        <PrivateRoute allowedRoles={["student"]}>
          <LessonPage />
        </PrivateRoute>
      }
    />

    {/* Payment Return Routes */}
    <Route
      path="/payment/return"
      element={
        <PrivateRoute allowedRoles={["student"]}>
          <PaymentReturnPage />
        </PrivateRoute>
      }
    />

    <Route
      path="/teacher/stats"
      element={
        <PrivateRoute allowedRoles={["teacher"]}>
          <TeacherStatsPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile/:role/:id"
      element={
        <PrivateRoute allowedRoles={["student", "admin", "teacher"]}>
          <UserProfilePage />
        </PrivateRoute>
      }
    />
    <Route
      path="/lessons/:lessonId/history"
      element={
        <PrivateRoute allowedRoles={["teacher"]}>
          <LessonHistoryList />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;

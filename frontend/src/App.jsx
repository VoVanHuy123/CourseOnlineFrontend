
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import BaseLayout from "./components/layout/BaseLayout";
import { useContext } from "react";
import AppRoutes from "./AppRoutes";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";

const Main = () => {
  const { loading } = useContext(AuthContext);
  if (loading) return <div>Đang tải thông tin đăng nhập...</div>;
  return (
    <Routes>
      {/* <BaseLayout> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route  path="/*"element={
        <BaseLayout >
          <AppRoutes/>
        </BaseLayout>
        }>
        
      </Route>
      {/* </BaseLayout> */}
    </Routes>
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

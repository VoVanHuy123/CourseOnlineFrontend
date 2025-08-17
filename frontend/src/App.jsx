
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

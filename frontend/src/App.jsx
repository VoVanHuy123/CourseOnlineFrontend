import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

import HomePage from './page/HomePage';
import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import BaseLayout from './components/layout/BaseLayout';
import CreateCourseForm from './page/CreateCoursePage';

function App() {

  return (
      <AuthProvider>
        <Router>
        <BaseLayout>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage  />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create" element={<CreateCourseForm />} />
            {/* Bạn có thể thêm các route khác ở đây */}
          </Routes>
        </BaseLayout>
        </Router>
      </AuthProvider>
  )
}

export default App

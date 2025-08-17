// src/components/routes/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { loading, isAuthenticated, user } = useContext(AuthContext);
  if (loading) {
  return <div>Loading...</div>; // hoặc spinner đẹp hơn
}
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if(user.role === "teacher" && user.is_validate === false){
  return <Navigate to="/login" replace />;
}
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.log("vaooooooooooooooooooooooo")
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
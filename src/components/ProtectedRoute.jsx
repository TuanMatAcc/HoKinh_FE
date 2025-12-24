// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userInfo = localStorage.getItem("userInfo");

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userInfo);

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap = {
      0: "/dashboard",
      1: "/dashboard",
      2: "/huan_luyen_vien",
      3: "/huan_luyen_vien",
      4: "/vo_sinh",
    };
    return <Navigate to={redirectMap[user.role] || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
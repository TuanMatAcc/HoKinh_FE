// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const user = JSON.parse(userInfo);

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

export default PublicRoute;
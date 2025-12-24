import "@/App.css";
import "react-toastify/dist/ReactToastify.css";
import { Homepage } from "@/pages/Homepage.jsx";
import { LoginPage } from "@/pages/LoginPage.jsx";
import { ArticlePage } from "@/features/article/components/article-display.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPage } from "@/pages/Dashboard.jsx";
import WebsiteManagement from "@/pages/WebsiteManagement.jsx";
import FacilityManagement from "@/pages/FacilityManagement.jsx";
import EquipmentManagement from "@/pages/EquipmentManagement.jsx";
import SessionManagement from "@/pages/SessionManagement.jsx";
import InstructorSessionUI from "./pages/Instructor/Schedule";
import StatisticsManagement from "./pages/StatisticsManagement";
import SessionStatisticsInstructor from "./pages/Instructor/SessionStatisticsManagementForInstructor";
import InstructorDashboardPage from "./pages/Instructor/InstructorDashboard";
import StudentSchedule from "./pages/Student/ScheduleForStudent";
import StudentDashboardPage from "./pages/Student/StudentDashboard";
import UserManagement from "./pages/UserManagement";
import ManagerManagement from "./pages/ManagerManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { ToastContainer } from 'react-toastify'; 

function App() {
  const router = createBrowserRouter([
    {
      errorElement: <Homepage />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        // other pages....
        {
          path: "/login",
          element: <PublicRoute>
            <LoginPage/>
          </PublicRoute>,
        },
        {
          path: "/article/:id",
          element: <ArticlePage />,
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute allowedRoles={[0, 1]}>
              <DashboardPage />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "website", // results in /dashboard/website
              element: <WebsiteManagement />,
            },
            {
              path: "co_so", // results in /dashboard/website
              element: <FacilityManagement />,
            },
            {
              path: "nguoi_dung", // results in /dashboard/website
              element: <UserManagement />,
            },
            {
              path: "buoi_hoc", // results in /dashboard/website
              element: <SessionManagement />,
            },
            {
              path: "thiet_bi",
              element: <EquipmentManagement />,
            },
            {
              path: "thong_ke",
              element: <StatisticsManagement />,
            },
            {
              path: "quan_ly",
              element: <ManagerManagement />,
            },
          ],
        },
        {
          path: "/huan_luyen_vien",
          element: (
            <ProtectedRoute allowedRoles={[2, 3]}>
              <InstructorDashboardPage />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "lich_day",
              element: <InstructorSessionUI />,
            },
            {
              path: "thong_ke",
              element: <SessionStatisticsInstructor />,
            },
          ],
        },
        {
          path: "/vo_sinh",
          element: (
            <ProtectedRoute allowedRoles={[4]}>
              <StudentDashboardPage />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "lich_hoc",
              element: <StudentSchedule />,
            },
            {
              path: "thong_ke",
              element: <SessionStatisticsInstructor />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;

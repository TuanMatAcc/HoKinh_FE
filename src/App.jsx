import "@/App.css";
import { Homepage } from "@/pages/Homepage.jsx";
import { LoginPage } from "@/pages/LoginPage.jsx";
import { ArticlePage } from "@/features/article/components/article-display.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPage } from "@/pages/Dashboard.jsx";
import WebsiteManagement from "@/pages/WebsiteManagement.jsx";
import FacilityManagement from "@/pages/FacilityManagement.jsx";
import EquipmentManagement from "@/pages/EquipmentManagement.jsx";
import UserManagement from "@/pages/UserManagement.jsx";
import SessionManagement from "@/pages/SessionManagement.jsx";
import InteractiveMap from "./features/map/components/Map";
import InstructorSessionUI from "./pages/Instructor/Schedule";
import InstructorStatisticsDetailPage from "./pages/DetailInstructorSessionStatistics";
import StatisticsManagement from "./pages/StatisticsManagement";
import SessionStatisticsInstructor from "./pages/Instructor/SessionStatisticsManagementForInstructor";
import InstructorDashboardPage from "./pages/Instructor/InstructorDashboard";

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
          element: <LoginPage />,
        },
        {
          path: "/article/:id",
          element: <ArticlePage />,
        },
        {
          path: "/map",
          element: <InteractiveMap />,
        },
        {
          path: "/dashboard",
          element: <DashboardPage />,
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
          ],
        },
        {
          path: "/huan_luyen_vien",
          element: <InstructorDashboardPage />,
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
          path: "/thong_ke_hlv",
          element: <SessionStatisticsInstructor />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

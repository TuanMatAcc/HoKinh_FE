import "./App.css";
import { Homepage } from "./pages/Homepage.jsx";
import { LoginPage } from "./features/authentication/components/LoginPage.jsx";
import { ArticlePage } from "./features/article/components/article-display.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard.jsx";
import ClassSessionManager from "./features/session_management/components/session_edit/ClassSessionEdit.jsx";
import SessionManagement from "./pages/SessionManagement.jsx";
import WebsiteManagement from "./pages/WebsiteManagement.jsx";
import FacilityManagement from "./pages/FacilityManagement.jsx";
import HVGenerator from "./pages/test2.jsx";

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
              element: <ClassSessionManager />,
            },
            {
              path: "buoi_hoc", // results in /dashboard/website
              element: <SessionManagement />,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

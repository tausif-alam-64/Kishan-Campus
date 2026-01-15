import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainLayout from "../component/layout/MainLayout";
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import NotFound from "../pages/public/NotFound";
import AuthLayout from "../component/layout/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherNotice from "../pages/teacher/TeacherNotice";
import TeacherUploads from "../pages/teacher/TeacherUploads";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/student",
        element: <RoleRoute role="student" />,
        children: [{index: true, element: <StudentDashboard />}]
      },
      {
        path: "/teacher",
        element: <RoleRoute role="teacher" />,
        children:[{index: true, element: <TeacherDashboard />},
          {
            path: "/teacher/notices",
            element: <TeacherNotice />
          },
          {
            path: "/teacher/uploads",
            element: <TeacherUploads />
          }
        ]
      },
      {
        path : "/admin",
        element: <RoleRoute role="/admin" />,
        children:[{index: true, element: <AdminDashboard />}]
      },
    ]
  }
]);

export default router;

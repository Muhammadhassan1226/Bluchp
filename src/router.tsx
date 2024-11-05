import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "./layouts/authlayout";
import { Signup } from "./pages/auth/signup";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./layouts/Dashboard.1";
import Home from "./pages/dashboard/Home";
import { Verify_Email } from "./pages/auth/verifyemail";
import { OTP } from "./pages/auth/otp";
import { NewPassword } from "./pages/auth/newPassword";
import Stocktable from "./pages/dashboard/stocktable";
import Profile from "./pages/user/Profile";
import { Social } from "./pages/dashboard/Social";
import CreatePost from "./pages/Social/Createposts";
import News from "./pages/dashboard/News";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "register",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "email_verify",
        element: <Verify_Email />,
      },
      {
        path: "otp",
        element: <OTP />,
      },
      {
        path: "reset",
        element: <NewPassword />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "stocks",
        element: <Stocktable />,
      },
      {
        path: "social",
        element: <Social />,
      },
      {
        path: "social/create",
        element: <CreatePost />,
      },
      {
        path: "news",
        element: <News/>
      }
    ],
  },
  {
    path: "profile/:username",
    element: <Profile />,
  },
]);

"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Error404 from '@pages/Error404'
import Users from '@pages/Users'
import Profile from '@pages/Profile'
import Evaluaciones from '@pages/Evaluaciones'
import GradesManager from '@pages/GradesManager'
import RequestReport from '@pages/RequestReport'
import Notificaciones from '@pages/Notificaciones'
import ProtectedRoute from '@components/ProtectedRoute'
import Appeals from '@pages/Appeals';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/evaluaciones",
        element: <Evaluaciones />,
      },
      {
        path: "/calificaciones",
        element: <GradesManager />,
      },
      {
        path: "/reportes",
        element: <RequestReport />,
      },
      {
        path: "/notificaciones",
        element: <Notificaciones />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "apelaciones",
        element: (
          <ProtectedRoute>
            <Appeals />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import RequestReport from './pages/RequestReport.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Error404 from './pages/Error404.jsx';
import Root from './pages/Root.jsx';
import './styles/styles.css';
import React from 'react';
const Notifications = React.lazy(() => import('./pages/Notifications.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/auth',
        element: <Login />
      },
      {
        path: '/home',
        element: <Home />
      }
      ,
      {
        path: '/request-report',
        element: (
          <ProtectedRoute>
            <RequestReport />
          </ProtectedRoute>
        )
      }
      ,
      {
        path: '/notifications/me',
        element: (
          <ProtectedRoute>
            {/* lazy page will be Notifications */}
            <React.Suspense fallback={<div>Cargando...</div>}>
              <Notifications />
            </React.Suspense>
          </ProtectedRoute>
        )
      }
      ,
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

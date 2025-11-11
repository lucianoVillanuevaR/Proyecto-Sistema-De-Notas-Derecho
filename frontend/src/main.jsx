import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import RequestReport from './pages/RequestReport.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Error404 from './pages/Error404.jsx';
import Root from './pages/Root.jsx';
import './styles/styles.css';

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
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx'; 

export default function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

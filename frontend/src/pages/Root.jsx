import { Outlet } from "react-router-dom";
import "@styles/root.css";
import { AuthProvider } from "@context/AuthContext";
import Sidebar from "../components/Sidebar";
import NotificationButton from "../components/NotificationButton";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <div className="page-root">
      <Sidebar />
      <NotificationButton />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Root;

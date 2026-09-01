import React from "react";
import SideNavbar from "../components/SideNavbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useGetprofileQuery } from "../lib/api";
const Layout = () => {
  const { data, isLoading } = useGetprofileQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text-secondary">
        <p className="animate-pulse text-sm">Loading your conversations...</p>
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <SideNavbar Userprofile={data} />
      <main className="min-w-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

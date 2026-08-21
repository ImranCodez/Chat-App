import React from "react";
import SideNavbar from "./sideNavbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useGetprofileQuery } from "../lib/api";
const Layout = () => {
  const { data, isLoading } = useGetprofileQuery();

  // Profile এখনো load হচ্ছে
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text-secondary">
        <p className="animate-pulse text-sm">Loading your conversations...</p>
      </div>
    );
  }
  console.log("akhne asche ");
  // Data না থাকলে login page এ যাবে
  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <SideNavbar profile={data} />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

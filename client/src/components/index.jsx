import React from "react";
import SideNavbar from "../components/SideNavbar";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetprofileQuery } from "../lib/api";
const Layout = () => {
  const { data, isLoading } = useGetprofileQuery();
  const activeConversation = useSelector((state) => state.activeconv.active);

  if (isLoading) {
    return (
      <div className="flex min-h-screen max-lg:min-h-dvh items-center justify-center bg-bg text-text-secondary">
        <p className="animate-pulse text-sm">Loading your conversations...</p>
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/Signup" replace />;
  }

  return (
    <div className="flex h-screen max-lg:h-dvh overflow-hidden bg-bg">
      <div
        className={
          activeConversation ? "max-lg:hidden" : "max-lg:flex max-lg:w-full"
        }
      >
        <SideNavbar Userprofile={data} />
      </div>
      <main
        className={`min-w-0 flex-1 overflow-hidden max-lg:w-full ${
          activeConversation ? "" : "max-lg:hidden"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

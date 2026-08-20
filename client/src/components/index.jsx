import React from "react";
import SideNavbar from "./sideNavbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useGetprofileQuery } from "../lib/api";
const Layout = () => {
  const { data, isLoading } = useGetprofileQuery();

  // Profile এখনো load হচ্ছে
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-200">
        <p>Profile loading...</p>
      </div>
    );
  }
  console.log("akhne asche ");
  // Data না থাকলে login page এ যাবে
  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex gap-5">
      <SideNavbar profile={data} />
      <Outlet />
    </div>
  );
};

export default Layout;

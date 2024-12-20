import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./dashboard/sidebar";
import { Toaster } from "../ui/sonner";

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 px-8 overflow-y-auto bg-background">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
    // <div>
    //   {/* <Sidebar /> */}
    //   <Outlet />
    //   <footer className="p-4 text-center bg-gray-100">
    //     <p>&copy; 2023 My Portfolio</p>
    //   </footer>
    // </div>
  );
};

export default Layout;

'use client';
import * as React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
// import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // <AuthProvider>
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 overflow-y-auto overflow-x-hidden ${isSidebarOpen ? "ml-0" : "ml-0"
            } transition-all duration-300`}
        >
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
    //</div> </AuthProvider>
  );
}
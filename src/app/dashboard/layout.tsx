"use client";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
// import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // <AuthProvider>
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 ${isSidebarOpen ? "ml-0" : "ml-0"
            } transition-all duration-300`}
        >
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
    // </AuthProvider>
  );
}

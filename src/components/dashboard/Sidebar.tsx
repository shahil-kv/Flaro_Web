// /app/components/Sidebar.tsx
"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Home,
  Group,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (group: string) => {
    setExpandedItems((prev) =>
      prev.includes(group)
        ? prev.filter((item) => item !== group)
        : [...prev, group]
    );
  };

  const menuItems = [
    {
      group: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
      subItems: [],
    },
    {
      group: "Groups",
      icon: <Group className="h-5 w-5" />,
      path: "/dashboard/groups",
      subItems: ["Manage Groups", "Group History"],
    },
    {
      group: "Calls",
      icon: <MessageCircle className="h-5 w-5" />,
      path: "/dashboard/calls",
      subItems: ["All Calls", "Missed Calls", "Recent Calls"],
    },
  ];

  return (
    <div
      className={`bg-gray-900 text-white h-screen ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {isOpen && <span className="text-xl font-bold">CoinVerse</span>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <div key={item.group} className="mb-2">
            <Link href={item.path}>
              <div
                className={`flex items-center p-4 hover:bg-gray-800 ${
                  pathname === item.path ? "bg-gray-800" : ""
                } cursor-pointer`}
                onClick={() => toggleExpand(item.group)}
              >
                {item.icon}
                {isOpen && (
                  <>
                    <span className="ml-3 flex-1">{item.group}</span>
                    {item.subItems.length > 0 &&
                      (expandedItems.includes(item.group) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      ))}
                  </>
                )}
              </div>
            </Link>
            {isOpen &&
              expandedItems.includes(item.group) &&
              item.subItems.length > 0 && (
                <div className="pl-8">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem}
                      href={`${item.path}/${subItem
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <div
                        className={`p-2 hover:bg-gray-700 text-sm ${
                          pathname ===
                          `${item.path}/${subItem
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                            ? "bg-gray-700"
                            : ""
                        }`}
                      >
                        {subItem}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
      {isOpen && (
        <div className="p-4 border-t border-gray-700">
          <p className="text-sm">User ID: 4822379156</p>
        </div>
      )}
    </div>
  );
}

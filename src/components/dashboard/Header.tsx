"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, User, Phone, Settings, LogOut as LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AUTH_CONFIG } from "@/utils/auth.config";

interface HeaderProps {
  toggleSidebar: () => void;
}

interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  is_premium: boolean;
  is_phone_verified: boolean;
  premium_expiry: string | null;
  created_at: string;
  updated_at: string;
  password_hash?: string;
}

export default function Header({ }: HeaderProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    setMounted(true);

    // Get user data from localStorage or your auth system
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const formatDisplayName = (segment: string): string =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const LogOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user_data");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = AUTH_CONFIG.ROUTES.LOGIN;
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const breadcrumbItems = pathSegments
    .map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const displayName =
        segment === "dashboard" ? "Dashboard" : formatDisplayName(segment);
      if (segment === "dashboard" && pathSegments.length > 1) return null;
      return { path, displayName };
    })
    .filter(
      (item): item is { path: string; displayName: string } => item !== null
    );

  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({ path: "/dashboard", displayName: "Dashboard" });
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 p-3 px-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center">
        {/* Breadcrumbs */}
        <Breadcrumb className="ml-4">
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <div key={item.path} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={item.path}
                    className={
                      index === breadcrumbItems.length - 1
                        ? "text-gray-500 dark:text-gray-400 cursor-default"
                        : "text-gray-800 dark:text-gray-200 hover:underline"
                    }
                  >
                    {item.displayName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator className="text-gray-400 dark:text-gray-500" />
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-800 hover:bg-gray-200 bg-gray-100   dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )
          ) : (
            <div className="h-5 w-5" />
          )}
        </Button>

        {/* Profile/Group Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={userData?.full_name || "User"} />
                <AvatarFallback className="bg-blue-500 text-white text-sm">
                  {userData?.full_name ? getInitials(userData.full_name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userData?.full_name || "User Name"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userData?.email || "user@example.com"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  Role: {userData?.role || "USER"}
                </p>
                {userData?.is_premium && (
                  <p className="text-xs leading-none text-emerald-600 dark:text-emerald-400 font-medium">
                    ✨ Premium User
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm">{userData?.phone_number || "No phone"}</span>
                {userData?.is_phone_verified && (
                  <span className="text-xs text-green-600 dark:text-green-400">✓ Verified</span>
                )}
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={LogOut} className="text-red-600 dark:text-red-400">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
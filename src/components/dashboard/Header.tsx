// /app/components/Header.tsx
"use client";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Define props for the Header component
interface HeaderProps {
  toggleSidebar: () => void; // Function to toggle the sidebar visibility
}

// Header component that renders the top bar with a sidebar toggle and breadcrumbs
export default function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname(); // Get the current URL path (e.g., "/dashboard/calls/all-calls")
  const pathSegments = pathname.split("/").filter((segment) => segment); // Split path into segments (e.g., ["dashboard", "calls", "all-calls"])

  // Function to format a segment into a display name
  // Example: "all-calls" becomes "All Calls"
  const formatDisplayName = (segment: string): string => {
    return segment
      .split("-") // Split on hyphens (e.g., "all-calls" -> ["all", "calls"])
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join with a space (e.g., "All Calls")
  };

  // Generate breadcrumb items dynamically
  const breadcrumbItems = pathSegments
    .map((segment, index) => {
      // Construct the path for this breadcrumb item
      // Example: for "calls" in "/dashboard/calls/all-calls", path is "/dashboard/calls"
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

      // Set display name: use "Dashboard" for the root, otherwise format the segment
      const displayName =
        segment === "dashboard" ? "Dashboard" : formatDisplayName(segment);

      // Skip the "dashboard" segment for display if it's not the only segment
      // This ensures we show "Calls > All Calls" instead of "Dashboard > Calls > All Calls"
      if (segment === "dashboard" && pathSegments.length > 1) {
        return null; // Skip rendering this item, but keep the path for hierarchy
      }

      return { path, displayName };
    })
    .filter(
      (item): item is { path: string; displayName: string } => item !== null
    ); // Remove null items

  // If there are no breadcrumb items (e.g., on "/dashboard"), default to "Dashboard"
  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({ path: "/dashboard", displayName: "Dashboard" });
  }

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        {/* Button to toggle the sidebar */}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        {/* Breadcrumb navigation */}
        <Breadcrumb className="ml-4">
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <div key={item.path} className="flex items-center">
                <BreadcrumbItem>
                  {/* Render the breadcrumb link; disable clicking on the last item */}
                  <BreadcrumbLink
                    href={item.path}
                    className={
                      index === breadcrumbItems.length - 1
                        ? "text-gray-400 cursor-default" // Last item: non-clickable, grayed out
                        : "hover:underline" // Other items: clickable with hover effect
                    }
                  >
                    {item.displayName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* Add a separator between items, except for the last one */}
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Right side of the header: displays static financial data */}
      <div className="flex items-center space-x-2">
        <span>USD: $946,256.25</span>
        <span>BTC: 3,254.84</span>
        <span className="text-green-400">Synced</span>
      </div>
    </header>
  );
}

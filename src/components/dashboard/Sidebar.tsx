'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Home,
  Group,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (group: string) => {
    setExpandedItems((prev) =>
      prev.includes(group) ? prev.filter((item) => item !== group) : [...prev, group]
    );
  };

  const menuItems = [
    {
      group: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard',
      subItems: [],
    },
    {
      group: 'Groups',
      icon: <Group className="h-5 w-5" />,
      path: '/dashboard/groups',
      subItems: ['Manage Groups', 'workflow'],
    },
    {
      group: 'Calls',
      icon: <MessageCircle className="h-5 w-5" />,
      path: '/dashboard/calls',
      subItems: ['Manage Calls'],
    },
  ];

  const MenuItemContent = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = pathname === item.path;
    const isExpanded = expandedItems.includes(item.group);

    return (
      <Link href={item.path}>
        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors ${isActive
            ? 'bg-gray-100 dark:bg-gray-800 font-semibold'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          onClick={() => toggleExpand(item.group)}
        >
          {item.icon}
          {isOpen && (
            <>
              <span className="flex-1">{item.group}</span>
              {item.subItems.length > 0 &&
                (isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                ))}
            </>
          )}
        </div>
      </Link>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={`h-screen transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-700 ${isOpen ? 'w-64' : 'w-16'
          } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100`}
      >
        {/* Header */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          {isOpen && (
            <div className="w-full text-center">
              <span className="text-lg font-semibold">Flaro</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const isExpanded = expandedItems.includes(item.group);

            return (
              <div key={item.group}>
                {/* Main Menu Item with Tooltip when sidebar is collapsed */}
                {!isOpen ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <MenuItemContent item={item} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p>{item.group}</p>
                      {item.subItems.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.subItems.join(', ')}
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <MenuItemContent item={item} />
                )}

                {/* Sub Items */}
                {isOpen && isExpanded && item.subItems.length > 0 && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => {
                      const subPath = `${item.path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`;
                      const isSubActive = pathname === subPath;

                      return (
                        <Link key={subItem} href={subPath}>
                          <div
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${isSubActive
                              ? 'bg-gray-100 dark:bg-gray-800 font-medium'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                          >
                            {subItem}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm">
            <p>
              User ID:{' '}
              <span className="font-mono text-blue-600 dark:text-blue-400">
                4822379156
              </span>
            </p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
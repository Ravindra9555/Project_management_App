// /components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { FolderIcon, HomeIcon, LogOutIcon, SettingsIcon, UsersIcon } from "lucide-react";
// import { signOut } from "next-auth/react";

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <HomeIcon /> },
    { name: "Projects", href: "/dashboard/projects", icon: <FolderIcon /> },
    { name: "Team", href: "/dashboard/team", icon: <UsersIcon/> },
    { name: "Settings", href: "/dashboard/settings", icon: <SettingsIcon /> },
  ];

  return (
    <aside className="w-64 border-r bg-white dark:bg-gray-800">
      <div className="p-4">
        <h1 className="text-xl font-bold">ProjectFlow</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-2",
              pathname === item.href 
                ? "bg-gray-100 dark:bg-gray-700" 
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 p-4">
        <button 
        //   onClick={() => signOut()}
          className="flex items-center text-red-500"
        >
          <LogOutIcon />
          <span className="ml-3">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
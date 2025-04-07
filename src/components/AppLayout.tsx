"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Pen, FileText, Settings, LogOut, Home } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 border-r border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-950 hidden md:block">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold">Levercast</h1>
        </div>
        <div className="space-y-2">
          <NavItem
            href="/dashboard"
            icon={<Home className="w-5 h-5 mr-3" />}
            isActive={pathname === "/dashboard"}
          >
            Dashboard
          </NavItem>
          <NavItem
            href="/new-post"
            icon={<Pen className="w-5 h-5 mr-3" />}
            isActive={pathname === "/new-post"}
          >
            New Post
          </NavItem>
          <NavItem
            href="/drafts"
            icon={<FileText className="w-5 h-5 mr-3" />}
            isActive={pathname === "/drafts"}
          >
            Drafts
          </NavItem>
          <NavItem
            href="/settings"
            icon={<Settings className="w-5 h-5 mr-3" />}
            isActive={pathname === "/settings"}
          >
            Settings
          </NavItem>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <NavItem
            href="/logout"
            icon={<LogOut className="w-5 h-5 mr-3" />}
            isActive={false}
          >
            Logout
          </NavItem>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between bg-white dark:bg-neutral-950">
          <div className="md:hidden text-xl font-bold">
            Levercast
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              John Doe
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 bg-neutral-50 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  children: React.ReactNode;
};

function NavItem({ href, icon, isActive, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md ${
        isActive
          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
} 
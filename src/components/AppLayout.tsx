"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Pen, 
  FileText, 
  Settings, 
  LogOut, 
  Home, 
  Menu, 
  X, 
  User
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { NavItem } from './NavItem'
import { MobileNavItem } from './MobileNavItem'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut(() => router.push("/"));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - desktop only */}
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
            href="/posts/new"
            icon={<Pen className="w-5 h-5 mr-3" />}
            isActive={pathname === "/posts/new"}
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
          <button
            onClick={handleSignOut}
            className="flex items-center px-3 py-2 rounded-md w-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-950 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold">Levercast</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-3 py-3">
            {isLoaded && user ? (
              <>
                {user.hasImage ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.firstName || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              </>
            ) : (
              <div className="animate-pulse">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <MobileNavItem
            href="/dashboard"
            icon={<Home className="w-5 h-5 mr-3" />}
            isActive={pathname === "/dashboard"}
          >
            Dashboard
          </MobileNavItem>
          <MobileNavItem
            href="/posts/new"
            icon={<Pen className="w-5 h-5 mr-3" />}
            isActive={pathname === "/posts/new"}
          >
            New Post
          </MobileNavItem>
          <MobileNavItem
            href="/drafts"
            icon={<FileText className="w-5 h-5 mr-3" />}
            isActive={pathname === "/drafts"}
          >
            Drafts
          </MobileNavItem>
          <MobileNavItem
            href="/settings"
            icon={<Settings className="w-5 h-5 mr-3" />}
            isActive={pathname === "/settings"}
          >
            Settings
          </MobileNavItem>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleSignOut}
            className="flex items-center px-3 py-3 rounded-md w-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between bg-white dark:bg-neutral-950">
          <div className="flex items-center">
            <button 
              className="md:hidden p-2 mr-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="md:hidden text-xl font-bold">
              Levercast
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {isLoaded && user && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">
                  {user.firstName} {user.lastName}
                </div>
              )}
              {isLoaded && user ? (
                user.hasImage ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.firstName || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </div>
                )
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              )}
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 bg-neutral-50 dark:bg-neutral-900 overflow-auto">
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

function MobileNavItem({ href, icon, isActive, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-3 rounded-md ${
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
"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !userId) {
      const currentPath = encodeURIComponent(pathname);
      router.replace(`/sign-in?redirect_url=${currentPath}`);
    }
  }, [isLoaded, userId, router, pathname]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mb-2" />
          <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't show anything while redirecting
  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image 
              src="/logo.svg" 
              width={120} 
              height={32} 
              alt="Levercast Logo"
              className="dark:invert" 
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link 
              href="/new-post" 
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              New Post
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 
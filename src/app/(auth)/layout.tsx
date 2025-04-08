import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="w-full p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/logo.svg" 
            width={120} 
            height={32} 
            alt="Levercast Logo" 
            className="dark:invert" 
          />
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 
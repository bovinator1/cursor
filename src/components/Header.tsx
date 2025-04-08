import { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between bg-white dark:bg-neutral-950">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Levercast</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {children}
      </div>
    </header>
  );
} 
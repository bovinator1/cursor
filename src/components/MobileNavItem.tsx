import Link from 'next/link'
import { cn } from '@/lib/utils'

interface MobileNavItemProps {
  href: string
  icon: React.ReactNode
  isActive?: boolean
  children: React.ReactNode
}

export function MobileNavItem({ href, icon, isActive, children }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
      )}
    >
      {icon}
      {children}
    </Link>
  )
} 
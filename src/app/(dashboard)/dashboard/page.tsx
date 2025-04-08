'use client'

import { useRouter } from 'next/navigation'
import { UserButton, useAuth } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const { isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mb-2" />
          <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
          <p className="text-neutral-600 dark:text-neutral-400">No posts yet. Create your first post!</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Analytics</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Start creating content to see your analytics.</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <Button 
            className="w-full"
            onClick={() => router.push('/posts/new')}
          >
            Create New Post
          </Button>
        </div>
      </div>
    </div>
  )
} 
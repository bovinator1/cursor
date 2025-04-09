'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton, useAuth } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { Post, PostStatus } from '@prisma/client'
import { Button } from "@/components/ui/button"
import { PostsList } from '@/features/posts/PostsList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface PostsResponse {
  posts: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function DashboardPage() {
  const router = useRouter()
  const { isLoaded } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data: PostsResponse = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
        toast.error("Failed to load posts. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded) {
      fetchPosts()
    }
  }, [isLoaded])

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post')
      }
      
      setPosts(posts.filter(post => post.id !== postId))
      toast.success(data.message || "Post deleted successfully.")
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error(error instanceof Error ? error.message : "Failed to delete post. Please try again.")
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mb-2" />
          <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  const draftPosts = posts.filter(post => post.status === PostStatus.DRAFT)
  const publishedPosts = posts.filter(post => post.status === PostStatus.PUBLISHED)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => router.push('/posts/new')}
          >
            Create New Post
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      
      <Tabs defaultValue="drafts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="drafts">
            Drafts ({draftPosts.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({publishedPosts.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="drafts">
          <PostsList posts={draftPosts} onDelete={handleDeletePost} />
        </TabsContent>
        <TabsContent value="published">
          <PostsList posts={publishedPosts} onDelete={handleDeletePost} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 
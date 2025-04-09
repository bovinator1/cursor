'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Post } from '@/types/post'

interface PostsListProps {
  posts: Post[]
  status: 'DRAFT' | 'PUBLISHED'
  onDelete?: (id: string) => void
  onPublish?: (id: string) => void
}

export function PostsList({ posts, status, onDelete, onPublish }: PostsListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setSelectedPostId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedPostId && onDelete) {
      onDelete(selectedPostId)
      setDeleteDialogOpen(false)
      setSelectedPostId(null)
    }
  }

  const handlePublish = async (id: string) => {
    if (onPublish) {
      onPublish(id)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          You don&apos;t have any {status.toLowerCase()} posts yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  {status === "DRAFT" ? (
                    <>Last edited: {new Date(post.updatedAt).toLocaleDateString()}</>
                  ) : (
                    <>Published: {new Date(post.publishedAt || post.updatedAt).toLocaleDateString()}</>
                  )}
                </div>
                <h3 className="font-medium mb-2">{post.title || "Untitled Post"}</h3>
                <div className="flex flex-wrap gap-2">
                  {post.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/posts/${post.id}`)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit post</span>
                </Button>
                {status === "DRAFT" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePublish(post.id)}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Publish post</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete post</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The post will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
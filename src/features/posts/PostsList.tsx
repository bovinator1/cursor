'use client'

import { useRouter } from 'next/navigation'
import { Post, PostStatus } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { Edit, Trash, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PostsListProps {
  posts: Post[]
  onDelete?: (postId: string) => Promise<void>
}

const getStatusVariant = (status: PostStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case PostStatus.DRAFT:
      return 'secondary'
    case PostStatus.PUBLISHED:
      return 'default'
    case PostStatus.SCHEDULED:
      return 'outline'
    case PostStatus.ARCHIVED:
      return 'destructive'
    default:
      return 'default'
  }
}

export function PostsList({ posts, onDelete }: PostsListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!postToDelete || !onDelete) return

    setDeletingId(postToDelete.id)
    await onDelete(postToDelete.id)
    setDeletingId(null)
    setShowDeleteDialog(false)
    setPostToDelete(null)
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-neutral-600 dark:text-neutral-400">No posts found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{post.title || 'Untitled Post'}</span>
                <Badge variant={getStatusVariant(post.status)}>
                  {post.status.toLowerCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Last modified {formatDistanceToNow(new Date(post.updatedAt))} ago
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(post)}
                  disabled={deletingId === post.id}
                >
                  {deletingId === post.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 mr-2" />
                  )}
                  {deletingId === post.id ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{postToDelete?.title || 'Untitled Post'}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 
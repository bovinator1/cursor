'use client'

import { useRouter } from 'next/navigation'
import { Post, PostStatus } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PostsListProps {
  posts: Post[]
  onDelete?: (postId: string) => void
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

  if (posts.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-neutral-600 dark:text-neutral-400">No posts found.</p>
      </div>
    )
  }

  return (
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
                onClick={() => onDelete(post.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 
import { PostForm } from "@/features/posts/PostForm"
import { Suspense } from "react"

interface EditPostPageProps {
  params: Promise<{ postId: string }> | { postId: string }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await Promise.resolve(params)
  
  return (
    <div className="container max-w-4xl py-6">
      <PostForm postId={postId} />
    </div>
  )
} 
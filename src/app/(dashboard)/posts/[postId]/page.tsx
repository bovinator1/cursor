import { PostForm } from "@/features/posts/PostForm"
import { Suspense } from "react"

interface EditPostPageProps {
  params: {
    postId: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const postId = await Promise.resolve(params.postId)
  
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <PostForm postId={postId} />
      </Suspense>
    </div>
  )
} 
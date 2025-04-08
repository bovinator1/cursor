import { PostForm } from "@/features/posts/PostForm"

interface EditPostPageProps {
  params: {
    postId: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  return (
    <div className="container max-w-4xl py-6">
      <PostForm postId={params.postId} />
    </div>
  )
} 
import { PostForm } from "@/features/posts/PostForm"

export default function NewPostPage() {
  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm />
    </div>
  )
} 
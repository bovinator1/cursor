"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostForm } from "@/features/posts/PostForm";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create post");
      }

      const post = await response.json();
      toast.success("Post created successfully");
      router.push(`/edit/${post.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Write your post content and select your target platforms.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Post Details</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Fill in the details for your new post. Don&apos;t worry, you can save it as a draft and edit it later.
            </p>
          </div>
          <PostForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Here&apos;s how to get started:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Enter your post content in the editor above</li>
            <li>Select which platforms you want to target</li>
            <li>Click &quot;Save Draft&quot; to save your progress</li>
            <li>When ready, click &quot;Publish&quot; to post to your selected platforms</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 
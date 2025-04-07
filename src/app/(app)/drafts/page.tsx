"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Edit, Trash2 } from "lucide-react";
import useStore from "@/store/useStore";

export default function DraftsPage() {
  const router = useRouter();
  const posts = useStore((state) => state.posts);
  const deletePost = useStore((state) => state.deletePost);
  
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setDrafts(posts.filter(post => post.status === "draft"));
      setIsLoading(false);
    }, 500);
  }, [posts]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      deletePost(id);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mb-2" />
          <p className="text-neutral-500 dark:text-neutral-400">Loading drafts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Drafts</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Continue working on your saved drafts.
          </p>
        </div>
        <Link
          href="/new-post"
          className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:ring-offset-2 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            You don't have any drafts yet.
          </p>
          <Link
            href="/new-post"
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:ring-offset-2 transition-colors"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                    Last edited: {new Date(draft.updatedAt).toLocaleDateString()}
                  </div>
                  <h3 className="font-medium mb-2">{draft.rawContent}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/edit/${draft.id}`)}
                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
                    aria-label="Edit draft"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="p-2 text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
                    aria-label="Delete draft"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                {Object.keys(draft.processedContent).length > 0 ? (
                  <div className="flex space-x-2">
                    {draft.processedContent.linkedin && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                        LinkedIn
                      </span>
                    )}
                    {draft.processedContent.twitter && (
                      <span className="inline-flex items-center rounded-full bg-sky-100 dark:bg-sky-900 px-2 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
                        Twitter
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Not processed yet
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
"use client";

import Link from "next/link";
import { Pen, FileText, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { mockPosts, Post } from "@/mocks/posts";
import { currentUser } from "@/mocks/users";

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const allPosts = mockPosts;
      setPosts(allPosts.filter(post => post.status === "published"));
      setDrafts(allPosts.filter(post => post.status === "draft"));
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-neutral-500 dark:text-neutral-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Here's an overview of your content creation activities.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/new-post"
          className="flex items-center p-6 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        >
          <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-4">
            <Pen className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Create New Post</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Capture your ideas and transform them
            </p>
          </div>
        </Link>

        <Link
          href="/drafts"
          className="flex items-center p-6 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        >
          <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-4">
            <FileText className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">View Drafts</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Continue working on your saved drafts
            </p>
          </div>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          {posts.length > 5 && (
            <Link
              href="/posts"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center"
            >
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You haven't published any posts yet.
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
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
              >
                <div className="flex justify-between mb-2">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    {post.platforms.includes("linkedin") && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                        LinkedIn
                      </span>
                    )}
                    {post.platforms.includes("twitter") && (
                      <span className="inline-flex items-center rounded-full bg-sky-100 dark:bg-sky-900 px-2 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
                        Twitter
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-medium mb-2 line-clamp-1">
                  {post.rawContent}
                </h3>
                <div className="flex space-x-2">
                  <Link
                    href={`/edit/${post.id}`}
                    className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Draft section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Drafts</h2>
          {drafts.length > 3 && (
            <Link
              href="/drafts"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center"
            >
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          )}
        </div>

        {drafts.length === 0 ? (
          <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              You don't have any drafts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.slice(0, 3).map((draft) => (
              <Link
                key={draft.id}
                href={`/edit/${draft.id}`}
                className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                  Last edited: {new Date(draft.updatedAt).toLocaleDateString()}
                </div>
                <p className="line-clamp-3 text-sm mb-2">{draft.rawContent}</p>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  Continue editing →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Send, RefreshCw } from "lucide-react";
import useStore from "@/store/useStore";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"linkedin" | "twitter">("linkedin");
  const [editedContent, setEditedContent] = useState<{
    linkedin?: string;
    twitter?: string;
  }>({});

  const posts = useStore((state) => state.posts);
  const updatePost = useStore((state) => state.updatePost);
  const publishPost = useStore((state) => state.publishPost);
  const processPostWithAI = useStore((state) => state.processPostWithAI);

  const post = posts.find(p => p.id === id);

  useEffect(() => {
    // Simulate loading the post data
    setTimeout(() => {
      if (post) {
        setEditedContent(post.processedContent);
      }
      setIsLoading(false);
    }, 500);
  }, [post]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <Loader2 className="h-8 w-8 text-neutral-400 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The post you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:ring-offset-2 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSaveDraft = () => {
    updatePost(id, {
      processedContent: editedContent,
    });
    
    // Show success message in a real app
    alert("Draft saved successfully!");
  };

  const handlePublish = () => {
    const platforms: ("linkedin" | "twitter")[] = [];
    
    if (editedContent.linkedin) {
      platforms.push("linkedin");
    }
    
    if (editedContent.twitter) {
      platforms.push("twitter");
    }
    
    if (platforms.length === 0) {
      alert("Please create content for at least one platform before publishing.");
      return;
    }
    
    publishPost(id, platforms);
    
    // Show success message in a real app
    alert("Post published successfully!");
    router.push("/dashboard");
  };

  const handleRegenerateContent = (platform: "linkedin" | "twitter") => {
    // For the prototype, we'll use the default "professional" tone
    processPostWithAI(id, platform, "professional");
    
    // In a real app, we'd show a loading indicator
    setTimeout(() => {
      // This will get the updated content from the store
      setEditedContent(posts.find(p => p.id === id)?.processedContent || {});
    }, 500);
  };

  const handleContentChange = (platform: "linkedin" | "twitter", content: string) => {
    setEditedContent(prev => ({
      ...prev,
      [platform]: content
    }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Post</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Refine your post for each platform before publishing.
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center justify-center rounded-md bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:ring-offset-2 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:ring-offset-2 transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Original content */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <h2 className="text-lg font-semibold mb-3">Original Input</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              This is your original idea that was processed by AI.
            </p>
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-4 text-sm">
              {post.rawContent}
            </div>
          </div>
        </div>

        {/* Processed content with tabs */}
        <div className="md:col-span-2">
          <Tabs 
            defaultValue="linkedin" 
            value={activeTab} 
            onValueChange={(value: string) => setActiveTab(value as "linkedin" | "twitter")}
            className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Platform Preview & Edit</h2>
              <TabsList className="grid grid-cols-2 w-[200px]">
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                <TabsTrigger value="twitter">Twitter</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="linkedin" className="pt-2">
              <div className="mb-3 flex justify-between items-center">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  LinkedIn Post
                </h3>
                <button
                  onClick={() => handleRegenerateContent("linkedin")}
                  className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </button>
              </div>
              <textarea
                className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 min-h-[240px] text-sm"
                value={editedContent.linkedin || ""}
                onChange={(e) => handleContentChange("linkedin", e.target.value)}
                placeholder="No LinkedIn content generated yet. Click 'Regenerate' to create content."
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                <span className="font-semibold">LinkedIn best practices:</span> Professional tone, include hashtags, ask questions to encourage engagement.
              </p>
            </TabsContent>

            <TabsContent value="twitter" className="pt-2">
              <div className="mb-3 flex justify-between items-center">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Twitter Post
                </h3>
                <button
                  onClick={() => handleRegenerateContent("twitter")}
                  className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </button>
              </div>
              <textarea
                className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 min-h-[240px] text-sm"
                value={editedContent.twitter || ""}
                onChange={(e) => handleContentChange("twitter", e.target.value)}
                placeholder="No Twitter content generated yet. Click 'Regenerate' to create content."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="font-semibold">Twitter best practices:</span> Keep it under 280 characters, use relevant hashtags.
                </p>
                <p className={`text-xs ${
                  (editedContent.twitter?.length || 0) > 280 
                    ? "text-red-500 dark:text-red-400" 
                    : "text-neutral-500 dark:text-neutral-400"
                }`}>
                  {editedContent.twitter?.length || 0}/280
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 
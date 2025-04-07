"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Loader2 } from "lucide-react";
import { processContent } from "@/mocks/aiProcessing";
import useStore from "@/store/useStore";
import { useToast } from "@/components/ui/toast";

export default function NewPostPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const createPost = useStore((state) => state.createPost);
  const processPostWithAI = useStore((state) => state.processPostWithAI);
  
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"input" | "processing" | "preview">("input");
  const [generatedPostId, setGeneratedPostId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    // Start AI processing
    setIsProcessing(true);
    setStep("processing");
    
    // Show info toast
    addToast({
      title: "Processing started",
      description: "Your content is being processed by our AI. This should take just a moment.",
      type: "info",
    });
    
    // In a real app, this would call the AI service
    // For the prototype, we'll use a timeout to simulate processing
    setTimeout(() => {
      const newPostId = String(Date.now());
      
      // Create a new post draft
      createPost(content);
      setGeneratedPostId(newPostId);
      
      // Process for both platforms with the default tone
      processPostWithAI(newPostId, "linkedin", "professional");
      processPostWithAI(newPostId, "twitter", "professional");
      
      // Show success toast
      addToast({
        title: "Processing complete",
        description: "Your content has been transformed. You can now edit and publish it.",
        type: "success",
      });
      
      // Move to edit page for the new post
      router.push(`/edit/${newPostId}`);
    }, 2000);
  };

  const handleVoiceInput = () => {
    // This would be implemented with the Web Speech API in a real app
    addToast({
      title: "Voice input not available",
      description: "Voice input is not available in the prototype. Please type your content.",
      type: "warning",
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Capture your thoughts and let AI transform them into engaging posts.
        </p>
      </div>

      {step === "input" && (
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                What's on your mind?
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  rows={8}
                  className="w-full p-4 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600"
                  placeholder="Share your idea, insight, or announcement here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className="absolute right-3 bottom-3 p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors rounded-full bg-neutral-100 dark:bg-neutral-800"
                  aria-label="Voice input"
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Pro tip: Be clear and concise. Our AI works best with specific ideas.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-white px-6 py-3 text-base font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:ring-offset-2 transition-colors"
                disabled={!content.trim()}
              >
                Transform with AI
              </button>
            </div>
          </form>
        </div>
      )}

      {step === "processing" && (
        <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-16 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-neutral-500 dark:text-neutral-400 animate-spin mb-4" />
          <h2 className="text-xl font-bold mb-2">AI is processing your content</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-md">
            We're analyzing your ideas and transforming them into platform-optimized posts.
            This usually takes a few seconds.
          </p>
        </div>
      )}
    </div>
  );
} 
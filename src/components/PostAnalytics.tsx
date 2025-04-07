"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Post } from "@/mocks/posts";

// Mock analytics data generator
const generateMockAnalytics = (post: Post) => {
  // Generate random data for the last 7 days
  const now = new Date();
  const data = [];
  
  // Determine base engagement levels based on platform
  const linkedinBase = post.platforms.includes("linkedin") ? 10 : 0;
  const twitterBase = post.platforms.includes("twitter") ? 15 : 0;
  
  // Generate mock data for each day
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // For older posts, generate more stable data
    const daysSincePublished = Math.floor((now.getTime() - new Date(post.publishedAt || post.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const stabilityFactor = Math.min(1, daysSincePublished / 14); // More stable after 14 days
    
    // Random factors with stability consideration
    const linkedinRandom = Math.floor(Math.random() * 15 * (1 - stabilityFactor * 0.7));
    const twitterRandom = Math.floor(Math.random() * 20 * (1 - stabilityFactor * 0.7));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      linkedin: linkedinBase + linkedinRandom,
      twitter: twitterBase + twitterRandom
    });
  }
  
  return data;
};

// Mock totals data generator
const generateTotals = (analyticsData: any[]) => {
  return {
    linkedinLikes: analyticsData.reduce((total, day) => total + day.linkedin, 0),
    twitterLikes: analyticsData.reduce((total, day) => total + day.twitter, 0),
    comments: Math.floor(Math.random() * 20) + 5,
    shares: Math.floor(Math.random() * 15) + 3
  };
};

type PostAnalyticsProps = {
  post: Post;
};

export default function PostAnalytics({ post }: PostAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      const data = generateMockAnalytics(post);
      setAnalyticsData(data);
      setTotals(generateTotals(data));
      setIsLoading(false);
    }, 1000);
  }, [post]);
  
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-52">
        <div className="text-neutral-500 dark:text-neutral-400 animate-pulse">
          Loading analytics...
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
      <h3 className="text-lg font-medium mb-4">Engagement Analysis</h3>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">LinkedIn Likes</p>
          <p className="text-xl font-bold">{totals.linkedinLikes}</p>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Twitter Likes</p>
          <p className="text-xl font-bold">{totals.twitterLikes}</p>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Comments</p>
          <p className="text-xl font-bold">{totals.comments}</p>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Shares</p>
          <p className="text-xl font-bold">{totals.shares}</p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                border: '1px solid #e5e5e5',
                borderRadius: '4px',
                fontSize: '12px'
              }} 
            />
            <Bar dataKey="linkedin" name="LinkedIn" fill="#0A66C2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="twitter" name="Twitter" fill="#1DA1F2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2">
        Daily engagement over the last 7 days
      </p>
    </div>
  );
} 
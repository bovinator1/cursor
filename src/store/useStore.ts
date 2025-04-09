import { create } from 'zustand';
import { currentUser, User } from '@/mocks/users';
import { mockPosts } from '@/mocks/posts';
import { processContent } from '@/mocks/aiProcessing';
import type { Post, Platform } from '@/types/post';

interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Posts state
  posts: Post[];
  drafts: Post[];
  
  // UI state
  currentTheme: 'light' | 'dark' | 'system';
  
  // Actions
  login: (userId: string) => void;
  logout: () => void;
  createPost: (data: Partial<Post>) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  publishPost: (postId: string, platforms: Platform[]) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  processPostWithAI: (postId: string, platform: 'linkedin' | 'twitter', tone: 'professional' | 'casual' | 'witty') => void;
}

const useStore = create<StoreState>()((set) => ({
  // Initial state
  user: currentUser,
  isAuthenticated: true, // For prototyping, we'll assume the user is authenticated
  posts: mockPosts,
  drafts: mockPosts.filter(post => post.status === 'DRAFT'),
  currentTheme: currentUser?.settings.theme || 'system',
  
  // Actions
  login: (userId: string) => set((state) => {
    // In a real app, this would make an API call
    // For the prototype, we'll just set the user from our mock data
    const user = { ...currentUser, id: userId };
    return { user, isAuthenticated: true };
  }),
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  createPost: (data) => set((state) => {
    const newPost: Post = {
      id: String(Date.now()),
      title: data.title || '',
      content: data.content || '',
      rawContent: data.rawContent || '',
      processedContent: data.processedContent || {
        html: data.content || '',
        markdown: data.rawContent || ''
      },
      platforms: data.platforms || [],
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return { 
      posts: [...state.posts, newPost],
      drafts: [...state.drafts, newPost],
    }
  }),
  
  updatePost: (postId, updates) => set((state) => {
    const updatedPosts = state.posts.map(post => 
      post.id === postId ? { 
        ...post, 
        ...updates, 
        updatedAt: new Date().toISOString() 
      } : post
    )
    
    return { 
      posts: updatedPosts,
      drafts: updatedPosts.filter(post => post.status === 'DRAFT'),
    }
  }),
  
  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter(post => post.id !== postId),
    drafts: state.drafts.filter(post => post.id !== postId),
  })),
  
  publishPost: (postId, platforms) => set((state) => {
    const updatedPosts = state.posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            status: 'PUBLISHED', 
            platforms,
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
          } 
        : post
    )
    
    return { 
      posts: updatedPosts,
      drafts: updatedPosts.filter(post => post.status === 'DRAFT'),
    }
  }),
  
  setTheme: (theme: 'light' | 'dark' | 'system') => set((state) => ({
    currentTheme: theme,
    user: state.user ? { ...state.user, settings: { ...state.user.settings, theme } } : null,
  })),
  
  processPostWithAI: (postId: string, platform: 'linkedin' | 'twitter', tone: 'professional' | 'casual' | 'witty') => set((state) => {
    const post = state.posts.find(p => p.id === postId);
    
    if (!post) return {};
    
    const processedContent = {
      ...post.processedContent,
      [platform]: processContent(post.rawContent, { platform, tone }),
    };
    
    const updatedPosts = state.posts.map(p => 
      p.id === postId 
        ? { 
            ...p, 
            processedContent, 
            platforms: [...new Set([...p.platforms, platform])],
            updatedAt: new Date().toISOString(),
          } 
        : p
    );
    
    return { 
      posts: updatedPosts,
      drafts: updatedPosts.filter(p => p.status === 'DRAFT'),
    };
  }),
}));

export default useStore; 
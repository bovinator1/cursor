import { prisma } from '../lib/db'
import type { Post, PostStatus, Platform, Prisma } from '@prisma/client'

export type CreatePostInput = {
  title: string
  content: string
  rawContent: string
  authorId: string
  excerpt?: string
  featuredImage?: string
  published?: boolean
  status?: PostStatus
  platforms?: Platform[]
}

export const postService = {
  /**
   * Create a new post
   */
  async createPost(data: CreatePostInput): Promise<Post> {
    // Generate a unique slug from the title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + 
      '-' + 
      Date.now().toString().slice(-6);
    
    return prisma.post.create({
      data: {
        ...data,
        slug
      }
    })
  },

  /**
   * Get post by ID
   */
  async getPostById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true
      }
    })
  },

  /**
   * Get posts by user ID
   */
  async getPostsByUserId(
    userId: string, 
    options?: { 
      status?: PostStatus,
      limit?: number,
      offset?: number
    }
  ): Promise<Post[]> {
    return prisma.post.findMany({
      where: { 
        authorId: userId,
        ...(options?.status ? { status: options.status } : {})
      },
      include: {
        author: true
      },
      orderBy: { createdAt: 'desc' },
      ...(options?.limit ? { take: options.limit } : {}),
      ...(options?.offset ? { skip: options.offset } : {})
    })
  },

  /**
   * Get published posts
   */
  async getPublishedPosts(
    options?: { 
      limit?: number,
      offset?: number
    }
  ): Promise<Post[]> {
    return prisma.post.findMany({
      where: { 
        published: true,
        status: 'PUBLISHED'
      },
      include: {
        author: true
      },
      orderBy: { createdAt: 'desc' },
      ...(options?.limit ? { take: options.limit } : {}),
      ...(options?.offset ? { skip: options.offset } : {})
    })
  },

  /**
   * Update post
   */
  async updatePost(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data
    })
  },

  /**
   * Delete post
   */
  async deletePost(id: string): Promise<Post> {
    return prisma.post.delete({
      where: { id }
    })
  },

  /**
   * Find post by slug
   */
  async findPostBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findFirst({
      where: { slug },
      include: {
        author: true
      }
    })
  },

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })
  }
}

export default postService 
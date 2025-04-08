import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import type { Platform, PostStatus } from '.prisma/client'

const isPrismaError = (error: unknown): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Error && 'code' in error && typeof (error as any).code === 'string'
}

export class PostService {
  static async createPost(
    authorId: string,
    data: {
      title: string
      content: string
      rawContent: string
      processedContent?: any
      platforms?: Platform[]
      status?: PostStatus
    }
  ) {
    try {
      // Generate a unique slug from the title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + 
        '-' + 
        Date.now().toString().slice(-6);

      // Validate platforms
      const validPlatforms = data.platforms?.filter(platform => 
        platform === 'TWITTER' || platform === 'LINKEDIN'
      ) || [];

      return await prisma.post.create({
        data: {
          ...data,
          slug,
          author: {
            connect: { id: authorId },
          },
          platforms: validPlatforms,
          status: data.status || 'DRAFT',
        },
        include: {
          author: true,
        },
      })
    } catch (error: unknown) {
      if (isPrismaError(error)) {
        if (error.code === 'P2002') {
          throw new Error('A post with this slug already exists')
        }
        if (error.code === 'P2003') {
          throw new Error('Invalid author ID')
        }
      }
      console.error('[PostService.createPost]', error)
      throw new Error('Failed to create post')
    }
  }

  static async getPostById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })
  }

  static async getUserPosts(authorId: string, status?: PostStatus) {
    return prisma.post.findMany({
      where: {
        authorId,
        ...(status && { status }),
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async updatePost(id: string, data: {
    title?: string;
    content?: string;
    rawContent?: string;
    processedContent?: any;
    platforms?: Platform[];
    status?: PostStatus;
  }) {
    try {
      // Validate platforms if provided
      const validPlatforms = data.platforms?.filter(platform => 
        platform === 'TWITTER' || platform === 'LINKEDIN'
      );

      const updateData = {
        ...data,
        platforms: validPlatforms || undefined,
      };

      return await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          author: true,
        },
      })
    } catch (error: unknown) {
      if (isPrismaError(error)) {
        if (error.code === 'P2025') {
          throw new Error('Post not found')
        }
        if (error.code === 'P2002') {
          throw new Error('A post with this slug already exists')
        }
      }
      console.error('[PostService.updatePost]', error)
      throw new Error('Failed to update post')
    }
  }

  static async deletePost(id: string) {
    return prisma.post.delete({
      where: { id },
    })
  }

  static async updatePostStatus(id: string, status: PostStatus) {
    return prisma.post.update({
      where: { id },
      data: { status },
    })
  }

  static async getScheduledPosts() {
    return prisma.post.findMany({
      where: {
        status: 'SCHEDULED',
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
} 
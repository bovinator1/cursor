import { prisma } from '@/lib/db'
import type { Post, Platform, PostStatus, Prisma } from '@prisma/client'

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
    return prisma.post.create({
      data: {
        ...data,
        author: {
          connect: { id: authorId },
        },
      },
    })
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

  static async updatePost(id: string, data: Prisma.PostUpdateInput) {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    })
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
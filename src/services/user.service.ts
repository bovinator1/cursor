import { prisma } from '@/lib/db'
import type { User } from '@prisma/client'

export class UserService {
  static async createUser(clerkId: string, email: string, firstName?: string, lastName?: string) {
    return prisma.user.create({
      data: {
        clerkId,
        email,
        firstName,
        lastName,
      },
    })
  }

  static async getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
    })
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  static async updateUser(id: string, data: Partial<User>) {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  }
} 
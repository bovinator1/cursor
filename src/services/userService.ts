import { prisma } from '../lib/db'
import type { User } from '@prisma/client'

export type CreateUserData = {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  profileImage?: string
}

export type UpdateUserData = Partial<Omit<User, 'id' | 'clerkId' | 'createdAt' | 'updatedAt'>>

export const userService = {
  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data
    })
  },

  /**
   * Get user by Clerk ID
   */
  async getUserByClerkId(clerkId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { clerkId }
    })
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    })
  },

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    })
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id }
    })
  }
}

export default userService 
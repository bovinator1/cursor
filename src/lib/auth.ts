import { userService } from "@/services/userService";
import type { User } from "@prisma/client";

/**
 * Get the current database user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  if (!clerkId) return null;

  try {
    return await userService.getUserByClerkId(clerkId);
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    return null;
  }
}

/**
 * Create or update a user from Clerk data
 */
export async function syncUserWithClerk(clerkData: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}): Promise<User | null> {
  try {
    // Check if user exists
    const existingUser = await userService.getUserByClerkId(clerkData.id);
    
    // If user exists, return it
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user
    return await userService.createUser({
      clerkId: clerkData.id,
      email: clerkData.email,
      firstName: clerkData.firstName,
      lastName: clerkData.lastName,
      profileImage: clerkData.imageUrl
    });
  } catch (error) {
    console.error('Error syncing user with Clerk:', error);
    return null;
  }
} 
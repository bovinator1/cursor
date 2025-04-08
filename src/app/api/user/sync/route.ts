import { NextRequest, NextResponse } from "next/server";
import { syncUserWithClerk } from "@/lib/auth";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // Get current user from Clerk
    const auth = getAuth(req);
    if (!auth.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user data from request body
    const userData = await req.json();
    
    // Ensure the user is syncing their own data
    if (userData.id !== auth.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Sync user with database
    const dbUser = await syncUserWithClerk({
      id: auth.userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      imageUrl: userData.imageUrl
    });

    // Return the database user
    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
} 
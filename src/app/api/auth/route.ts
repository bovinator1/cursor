import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuth(req);
    return NextResponse.json({
      isAuthenticated: !!auth.userId,
      userId: auth.userId
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
} 
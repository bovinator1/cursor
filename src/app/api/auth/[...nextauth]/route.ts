import { NextRequest, NextResponse } from "next/server";

// This is a placeholder for Clerk authentication
// In newer versions, Clerk automatically handles auth
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    status: "ok",
    message: "Auth service available" 
  });
} 
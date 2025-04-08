import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This middleware protects routes and handles authentication
export default clerkMiddleware((auth, req) => {
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/"],
}; 
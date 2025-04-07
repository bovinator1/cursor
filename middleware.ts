import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicPaths = [
  "/",
  "/sign-in",
  "/sign-up",
  "/api/webhook"
];

// Check if the pathname matches any public paths
const isPublic = (path: string) => {
  return publicPaths.find(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`)
  );
};

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;
  
  // If the route is public, allow access
  if (isPublic(pathname)) {
    return NextResponse.next();
  }
  
  // If the user is not authenticated and trying to access a private route,
  // redirect them to the sign-in page
  const { session } = auth;
  if (!session) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; 
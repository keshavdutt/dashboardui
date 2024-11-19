// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const publicRoutes = createRouteMatcher([
  "/",
  "/api/public",
  "/sign-in",
  "/sign-up",
  "/sign-in/(.*))",  // For nested sign-in routes
  "/sign-up/(.*))",  // For nested sign-up routes
]);

export default clerkMiddleware((auth, req) => {
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  // Check if user is not authenticated and trying to access protected route
//   if (!auth.userId) {
//     const signInUrl = new URL('/sign-in', req.url);
//     signInUrl.searchParams.set('redirect_url', req.url);
//     return NextResponse.redirect(signInUrl);
//   }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/", 
    "/(api|trpc)(.*)"
  ],
};
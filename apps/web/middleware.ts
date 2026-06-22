import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isPublicAdminRoute = createRouteMatcher(['/admin/sign-in(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && !isPublicAdminRoute(req)) {
    const { userId } = await auth();
    // Send signed-out admins to the in-house /admin/sign-in page — not Clerk's
    // hosted Account Portal, which auth.protect() falls back to in production
    // when NEXT_PUBLIC_CLERK_SIGN_IN_URL isn't set in the environment.
    if (!userId) {
      const signInUrl = new URL('/admin/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};




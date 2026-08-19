import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isPublicAdminRoute = createRouteMatcher(['/admin/sign-in(.*)']);

/* As rotas que ficaram fora do segmento de idioma: mantêm os endereços antigos
   porque são o destino de retorno dos gateways de pagamento, ou são internas.
   O middleware do next-intl não lhes toca. */
const isUnprefixedRoute = createRouteMatcher([
  /* O sitemap e o robots são ficheiros, não páginas: prefixá-los devolvia um
     redirect para /en/sitemap.xml e o Google ficava sem sitemap. */
  '/sitemap.xml',
  '/robots.txt',
  '/admin(.*)',
  '/checkout(.*)',
  '/payment(.*)',
  '/preview-site(.*)',
  '/partnership-preview(.*)',
  '/checkout-preview(.*)',
  '/api(.*)',
]);

const intlMiddleware = createIntlMiddleware(routing);

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

  if (isUnprefixedRoute(req)) return NextResponse.next();

  // É aqui que os endereços antigos, sem prefixo, são reencaminhados para o
  // idioma certo: /tours passa a /en/tours, ou a /pt/tours para quem já tinha
  // escolhido português.
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

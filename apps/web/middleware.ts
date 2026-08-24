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
  '/admin(.*)',
  '/checkout(.*)',
  '/payment(.*)',
  '/preview-site(.*)',
  '/partnership-preview(.*)',
  '/checkout-preview(.*)',
  '/api(.*)',
]);

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Ficheiros servidos de public/, que não são páginas e não levam idioma.
 *
 * O `matcher` lá em baixo já exclui as extensões mais comuns, mas não todas: os
 * .mp4 passavam por aqui e eram reencaminhados para /en/video/..., que não
 * existe. Resultado: os vídeos das heros deixavam de tocar e ficava só o
 * poster, que é .webp e estava na lista.
 *
 * Em vez de ir acrescentando extensões a uma expressão regular que já é difícil
 * de ler, a regra fica aqui, onde se percebe e se estende.
 */
const STATIC_FILE = new RegExp(
  String.raw`\.(?:mp4|webm|mov|m4v|ogv|mp3|wav|m4a|avif|webp|jpe?g|png|gif|svg|ico|bmp|tiff?|pdf|txt|xml|json|csv|zip|woff2?|ttf|otf|eot|map|webmanifest|html?|css|js)$`,
  "i",
);

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

  const { pathname } = req.nextUrl;
  /* O /sitemap.xml e o /robots.txt entram aqui pela regra dos ficheiros: são
     servidos por rotas de metadata do Next, mas para o Google são ficheiros e
     um redirect para /en/sitemap.xml deixava-o sem sitemap. */
  if (STATIC_FILE.test(pathname) || isUnprefixedRoute(req)) {
    return NextResponse.next();
  }

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

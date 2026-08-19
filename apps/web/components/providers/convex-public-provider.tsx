'use client'

import { ReactNode } from 'react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL.replace(/\/+$/, ''),
)

/**
 * O cliente Convex das páginas públicas, sem autenticação.
 *
 * O outro provider usa o ConvexProviderWithClerk, e por isso obrigava o
 * ClerkProvider — o SDK de autenticação inteiro — a ser carregado por cada
 * visitante anónimo do site. Nenhuma query pública precisa de sessão: as que
 * precisam vivem no /admin, que tem a sua própria raiz e continua com o Clerk.
 */
export function ConvexPublicProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}

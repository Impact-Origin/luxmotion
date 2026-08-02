"use client"

import { useMemo } from "react"
import { useQueries, type RequestForQueries } from "convex/react"
import type { FunctionReference } from "convex/server"
import type { Value } from "convex/values"

/**
 * `useQuery` que não derruba a página quando a função ainda não está no
 * deployment.
 *
 * O frontend vai ao ar pelo Vercel e o backend só com `npx convex deploy` — são
 * dois deploys independentes, e nada no build apanha a diferença, porque o `api`
 * gerado é um Proxy (`anyApi`) que aceita qualquer caminho sem validar.
 *
 * Nessa janela, o `useQuery` do convex/react **re-lança** o erro do servidor
 * durante o render. Um hook destes na raiz de uma página leva a página inteira
 * atrás dele. O `useQueries` devolve o mesmo erro como VALOR, e é isso que este
 * wrapper expõe: `{ data, error }`, para quem chama decidir se degrada em
 * silêncio ou avisa.
 *
 * Passar `"skip"` como args suspende a subscrição, tal como no `useQuery`.
 */
export function useSafeQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: Query["_args"] | "skip",
): { data: Query["_returnType"] | undefined; error: Error | undefined } {
  const skip = args === "skip"
  /* O objecto TEM de ser memoizado: um literal a cada render volta a subscrever
     e entra em ciclo (React #301).

     E `query` NÃO pode entrar nas dependências. O `api` gerado é `anyApi`, um
     Proxy — `api.x.y` constrói uma referência NOVA a cada acesso, portanto a
     identidade muda em todos os renders e o memo nunca acertava. Comparamos
     pelo caminho serializado dos args e assumimos que quem chama passa sempre a
     mesma função (é sempre um literal no sítio da chamada). */
  const argsKey = skip ? "skip" : JSON.stringify(args)
  const queries = useMemo(
    (): RequestForQueries =>
      skip ? {} : { result: { query, args: JSON.parse(argsKey) as Record<string, Value> } },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [argsKey, skip],
  )
  const raw = useQueries(queries).result as
    | Query["_returnType"]
    | Error
    | undefined

  return useMemo(
    () =>
      raw instanceof Error
        ? { data: undefined, error: raw }
        : { data: raw, error: undefined },
    [raw],
  )
}

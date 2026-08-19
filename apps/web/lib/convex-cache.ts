import { unstable_cache } from "next/cache";

/**
 * Leituras do Convex que o Next pode guardar em cache.
 *
 * O `fetchQuery` do convex/nextjs faz um pedido sem cache, e basta um numa
 * página para a rota inteira passar a dinâmica: a tabela do build dizia
 * "estático" e a produção respondia `cache-control: no-store` em tudo o que
 * lesse da base de dados — que é precisamente o conteúdo do site.
 *
 * Envolver a leitura aqui devolve a decisão ao Next: o resultado fica guardado
 * pelo tempo indicado e a página volta a poder ser pré-gerada.
 *
 * A janela é a mesma das rotas (cinco minutos): uma alteração no admin demora
 * até esse tempo a aparecer, em troca de não ir à base de dados a cada visita.
 */
export const CONVEX_CACHE_SECONDS = 300;

export function cachedQuery<T>(
  /** Identifica o resultado. Tem de incluir tudo o que o distingue — o slug,
   *  o destino, o idioma — senão duas páginas diferentes partilham a mesma
   *  entrada de cache. */
  keyParts: string[],
  fn: () => Promise<T>,
  options?: { revalidate?: number; tags?: string[] },
): Promise<T> {
  return unstable_cache(fn, keyParts, {
    revalidate: options?.revalidate ?? CONVEX_CACHE_SECONDS,
    tags: options?.tags,
  })();
}

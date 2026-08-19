/**
 * O artigo já resolvido para um idioma.
 *
 * Existe para o servidor e o cliente chegarem exactamente ao mesmo resultado: a
 * página renderiza o artigo com isto, e o `useBlogBySlug` volta a passar por
 * aqui quando o Convex envia uma actualização. Se as duas regras divergissem, a
 * hidratação estoirava em todos os artigos.
 */

type BlogTranslation = {
  locale: string;
  title?: string;
  excerpt?: string;
  content?: unknown;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogRecord = {
  originalLanguage?: string;
  title: string;
  excerpt?: string;
  content?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  translations?: BlogTranslation[];
};

export type BlogView<T extends BlogRecord = BlogRecord> = {
  blog: T;
  content: unknown;
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
};

/**
 * A tradução do idioma de origem não existe — e se existisse seria uma cópia.
 * Daí a comparação com `originalLanguage` antes de a procurar.
 */
export function resolveBlogView<T extends BlogRecord>(
  blog: T,
  locale: string,
): BlogView<T> {
  const translation =
    locale && locale !== blog.originalLanguage
      ? blog.translations?.find((t) => t.locale === locale)
      : undefined;

  return {
    blog,
    content: translation?.content ?? blog.content,
    title: translation?.title ?? blog.title,
    excerpt: translation?.excerpt ?? blog.excerpt ?? "",
    seoTitle: translation?.seoTitle ?? blog.seoTitle,
    seoDescription: translation?.seoDescription ?? blog.seoDescription,
  };
}

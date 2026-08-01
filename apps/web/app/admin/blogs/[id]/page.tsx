"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@workspace/convex/api";
import type { Id } from "@workspace/convex/dataModel";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { StatusBadge } from "@/components/admin/status-badge";
import { LANGUAGES } from "@/components/admin/constants";
import { toast } from "sonner";

/**
 * Ficha do artigo: tudo o que o blog tem, num sítio só.
 *
 * A tabela do admin só mostra título, categoria, idiomas, estado e data. Para
 * ver o resto era preciso abrir o formulário de edição, que é um assistente de
 * três passos e não serve para consultar.
 */

/** Texto corrido do documento TipTap, para a pré-visualização. */
function plainText(content: unknown): string {
  const parts: string[] = [];
  const walk = (node: any) => {
    if (!node || typeof node !== "object") return;
    if (typeof node.text === "string") parts.push(node.text);
    if (Array.isArray(node.content)) node.content.forEach(walk);
  };
  walk(content);
  return parts.join(" ");
}

/** Contagem por tipo de nó, para se perceber a forma do artigo num relance. */
function nodeCounts(content: any): { headings: number; tables: number; paragraphs: number } {
  const blocks: any[] = Array.isArray(content?.content) ? content.content : [];
  return {
    headings: blocks.filter((b) => b.type === "heading").length,
    tables: blocks.filter((b) => b.type === "table").length,
    paragraphs: blocks.filter((b) => b.type === "paragraph").length,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
        {label}
      </p>
      <div className="text-sm text-foreground">{children || "—"}</div>
    </div>
  );
}

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const blog = useQuery(api.blogs.getById, { id: id as Id<"blogs"> });
  const publish = useMutation(api.blogs.publish);
  const unpublish = useMutation(api.blogs.unpublish);
  const toggleFeatured = useMutation(api.blogs.toggleFeatured);
  const removeBlog = useMutation(api.blogs.remove);
  const retryImage = useAction(api.blogAutomation.retryHeroImage);

  useEffect(() => {
    if (blog === null) router.replace("/admin/blogs");
  }, [blog, router]);

  if (!blog) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const counts = nodeCounts(blog.content);
  const body = plainText(blog.content);
  const words = body.split(/\s+/).filter(Boolean).length;

  const handleDelete = async () => {
    if (!confirm(`Apagar "${blog.title}"? Não há como recuperar.`)) return;
    try {
      await removeBlog({ id: blog._id });
      toast.success("Artigo apagado.");
      router.push("/admin/blogs");
    } catch {
      toast.error("Não foi possível apagar.");
    }
  };

  const handleRetryImage = async () => {
    try {
      const res = await retryImage({ blogId: blog._id });
      if (res.ok) toast.success("A gerar a imagem de capa.");
      else toast.error(res.error ?? "Não foi possível.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falhou.");
    }
  };

  const togglePublished = async () => {
    try {
      if (blog.status === "published") {
        await unpublish({ id: blog._id });
        toast.success("Artigo despublicado.");
      } else {
        await publish({ id: blog._id });
        toast.success("Artigo publicado.");
      }
    } catch {
      toast.error("Não foi possível mudar o estado.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => router.push("/admin/blogs")}>
          <ArrowLeft className="mr-2 size-4" />
          Blogs
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/blogs/${blog.slug}`} target="_blank">
              <ExternalLink className="mr-2 size-4" />
              Ver no site
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleFeatured({ id: blog._id }).catch(() => toast.error("Limite de destaques atingido."))}
          >
            <Star
              className={`mr-2 size-4 ${blog.isFeatured ? "fill-current" : ""}`}
            />
            {blog.isFeatured ? "Remover destaque" : "Destacar"}
          </Button>
          <Button variant="outline" onClick={togglePublished}>
            {blog.status === "published" ? (
              <EyeOff className="mr-2 size-4" />
            ) : (
              <Eye className="mr-2 size-4" />
            )}
            {blog.status === "published" ? "Despublicar" : "Publicar"}
          </Button>
          {!blog.heroImageUrl && (
            <Button variant="outline" onClick={handleRetryImage}>
              <RefreshCw className="mr-2 size-4" />
              Gerar capa
            </Button>
          )}
          <Button onClick={() => router.push(`/admin/blogs/${blog._id}/edit`)}>
            <Pencil className="mr-2 size-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Apagar
          </Button>
        </div>
      </div>

      {blog.heroImageUrl && (
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-border">
          <Image
            src={blog.heroImageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={blog.status} label={blog.status} />
          <Badge variant="secondary">{blog.category}</Badge>
          {blog.isFeatured && <Badge>Destaque</Badge>}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {blog.readTimeMinutes} min
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">{blog.title}</h1>
        <p className="text-sm text-muted-foreground">{blog.excerpt}</p>
      </div>

      <div className="grid gap-6 rounded-xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Slug">
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{blog.slug}</code>
        </Field>
        <Field label="Autor">
          {blog.author}
          {blog.authorRole && (
            <span className="block text-muted-foreground">{blog.authorRole}</span>
          )}
        </Field>
        <Field label="Idioma original">{blog.originalLanguage.toUpperCase()}</Field>
        <Field label="Traduções">
          {blog.translations.length === 0 ? (
            <span className="text-muted-foreground">nenhuma</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {blog.translations.map((t) => (
                <Badge key={t.locale} variant="secondary">
                  {LANGUAGES.find((l) => l.value === t.locale)?.label ??
                    t.locale.toUpperCase()}
                </Badge>
              ))}
            </div>
          )}
        </Field>
        <Field label="Etiquetas">
          {blog.tags?.length ? (
            <div className="flex flex-wrap gap-1">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </Field>
        <Field label="Dimensão">
          {words} palavras · {counts.headings} títulos · {counts.tables} tabelas
        </Field>
        <Field label="Criado">
          {new Date(blog.createdAt).toLocaleString("pt-PT")}
        </Field>
        <Field label="Publicado">
          {blog.publishedAt
            ? new Date(blog.publishedAt).toLocaleString("pt-PT")
            : null}
        </Field>
        <Field label="Atualizado">
          {new Date(blog.updatedAt).toLocaleString("pt-PT")}
        </Field>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
          SEO
        </h2>
        <Field label="Título SEO">{blog.seoTitle}</Field>
        <Field label="Descrição SEO">{blog.seoDescription}</Field>
      </div>

      {blog.faq && blog.faq.length > 0 && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
            FAQ ({blog.faq.length})
          </h2>
          <div className="space-y-3">
            {blog.faq.map((pair, i) => (
              <div key={i} className="space-y-1 border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-foreground">{pair.question}</p>
                <p className="text-sm text-muted-foreground">{pair.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
          Conteúdo
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {body.slice(0, 4000)}
          {body.length > 4000 && "…"}
        </p>
      </div>
    </div>
  );
}

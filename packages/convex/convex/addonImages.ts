import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Biblioteca de imagens dos extras: carrega-se o ficheiro uma vez e depois
 * associa-se a quantos extras se quiser, em vez de repetir o upload em cada
 * tour e em cada evento.
 */

type ItemDaBiblioteca = {
  /** Presente só nas imagens registadas; as herdadas dos extras não têm linha. */
  libraryId?: Id<"addonImages">;
  storageId: Id<"_storage">;
  label: string;
  url: string;
  createdAt: number;
  /** Quantos extras apontam para este ficheiro. A página de gestão avisa com
   *  base nisto antes de apagar; o selector ignora-o. */
  usageCount: number;
};

/**
 * Tudo o que se pode associar a um extra: as imagens registadas na biblioteca
 * mais as que já estão em uso pelos extras e nunca foram registadas — sem isso
 * a biblioteca abria vazia e obrigava a carregar de novo aquilo que já cá está.
 *
 * A desduplicação é por `storageId`, e o rótulo da biblioteca ganha ao título do
 * extra quando a mesma imagem aparece nos dois lados.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const registadas = await ctx.db.query("addonImages").collect();
    const extras = await ctx.db.query("tourAddons").collect();

    const porStorage = new Map<string, ItemDaBiblioteca>();

    // Contagem primeiro, num ciclo só: as duas passagens abaixo já precisam dela.
    const usos = new Map<string, number>();
    for (const extra of extras) {
      if (!extra.imageId) continue;
      usos.set(extra.imageId, (usos.get(extra.imageId) ?? 0) + 1);
    }

    for (const img of registadas) {
      const url = await ctx.storage.getUrl(img.storageId);
      // Ficheiro apagado do storage: a linha fica órfã e não vale mostrá-la.
      if (!url) continue;
      porStorage.set(img.storageId, {
        libraryId: img._id,
        storageId: img.storageId,
        label: img.label,
        url,
        createdAt: img.createdAt,
        usageCount: usos.get(img.storageId) ?? 0,
      });
    }

    for (const extra of extras) {
      if (!extra.imageId) continue;
      if (porStorage.has(extra.imageId)) continue;
      const url = await ctx.storage.getUrl(extra.imageId);
      if (!url) continue;
      porStorage.set(extra.imageId, {
        storageId: extra.imageId,
        label: extra.title,
        url,
        createdAt: extra.createdAt,
        usageCount: usos.get(extra.imageId) ?? 0,
      });
    }

    return [...porStorage.values()].sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** Regista um ficheiro já carregado. Idempotente por `storageId`. */
export const add = mutation({
  args: {
    storageId: v.id("_storage"),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const existente = await ctx.db
      .query("addonImages")
      .withIndex("by_storage", (q) => q.eq("storageId", args.storageId))
      .first();

    if (existente) {
      if (args.label && args.label !== existente.label) {
        await ctx.db.patch(existente._id, { label: args.label });
      }
      return existente._id;
    }

    return await ctx.db.insert("addonImages", {
      storageId: args.storageId,
      label: args.label,
      createdAt: Date.now(),
    });
  },
});

export const rename = mutation({
  args: {
    id: v.id("addonImages"),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { label: args.label });
    return args.id;
  },
});

/**
 * Tira a imagem do catálogo. O ficheiro em si só desaparece se nenhum extra o
 * estiver a usar — os extras guardam o `_storage` id directamente e ficariam sem
 * imagem. Devolve `ficheiroMantido` para a página poder explicar porquê.
 */
export const remove = mutation({
  args: { id: v.id("addonImages") },
  handler: async (ctx, args) => {
    const linha = await ctx.db.get(args.id);
    if (!linha) return { ficheiroMantido: false };

    const extras = await ctx.db.query("tourAddons").collect();
    const emUso = extras.some((a) => a.imageId === linha.storageId);

    await ctx.db.delete(args.id);
    if (!emUso) await ctx.storage.delete(linha.storageId);

    return { ficheiroMantido: emUso };
  },
});

/** URL de upload próprio, para a biblioteca não depender de `blogs`. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

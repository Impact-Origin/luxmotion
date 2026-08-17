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
 * Tira a imagem do catálogo **sem** apagar o ficheiro: os extras que a estejam a
 * usar guardam o `_storage` id directamente e ficariam sem imagem.
 */
export const remove = mutation({
  args: { id: v.id("addonImages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/** URL de upload próprio, para a biblioteca não depender de `blogs`. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

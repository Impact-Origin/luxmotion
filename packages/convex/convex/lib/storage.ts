import type { MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

// A missing/stale storage file must never abort a cascade delete: ctx.storage.delete
// throws when the file is already gone, and because Convex mutations are transactional
// that would roll back the ENTIRE deletion. Swallow it so the parent row still deletes.
export async function safeStorageDelete(ctx: MutationCtx, id: Id<"_storage">) {
  try {
    await ctx.storage.delete(id);
  } catch {
    // File already removed or never existed — ignore and continue.
  }
}

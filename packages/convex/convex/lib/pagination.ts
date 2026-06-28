import { v } from "convex/values";

/* Shared args for an admin `listPaged` query: page (0-based), pageSize (default 10),
   plus optional search / sort / filters the query applies server-side. The client
   receives only one page of rows + the total count. */
export const pagedArgs = {
  page: v.number(),
  pageSize: v.optional(v.number()),
  search: v.optional(v.string()),
  sortBy: v.optional(v.string()),
  sortDir: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  filters: v.optional(v.record(v.string(), v.string())),
} as const;

export type PagedResult<T> = { rows: T[]; total: number; page: number; pageSize: number };

export function paginate<T>(all: T[], page: number, pageSize?: number): PagedResult<T> {
  const size = pageSize && pageSize > 0 ? pageSize : 10;
  const start = Math.max(0, page) * size;
  return { rows: all.slice(start, start + size), total: all.length, page, pageSize: size };
}

/** Case-insensitive substring match across the given accessors. */
export function applySearch<T>(
  rows: T[],
  search: string | undefined,
  fields: ((row: T) => string | null | undefined)[],
): T[] {
  const q = search?.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => fields.some((f) => (f(row) ?? "").toLowerCase().includes(q)));
}

/** Sort by a named accessor from `sorters`; no-op if sortBy is unknown. */
export function applySort<T>(
  rows: T[],
  sortBy: string | undefined,
  sortDir: "asc" | "desc" | undefined,
  sorters: Record<string, (row: T) => string | number>,
): T[] {
  if (!sortBy || !sorters[sortBy]) return rows;
  const acc = sorters[sortBy];
  const dir = sortDir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const av = acc(a);
    const bv = acc(b);
    if (av < bv) return -dir;
    if (av > bv) return dir;
    return 0;
  });
}

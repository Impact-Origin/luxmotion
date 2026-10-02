import { v } from "convex/values";

// Optional fields allow a partially translated item to fall back field by field.
export const catalogTranslationsValidator = v.array(
  v.object({
    locale: v.string(),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.string()),
    examples: v.optional(v.string()),
  }),
);

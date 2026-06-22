// Convex functions can read `process.env.*` at runtime — Convex injects the
// environment variables configured in the dashboard / via `convex env set`.
// The Convex tsconfig only ships the ES2021 + DOM libs (no @types/node), so
// declare a minimal `process` here so `convex deploy`'s tsc typecheck doesn't
// fail with "Cannot find name 'process'". Declaration-only: Convex's bundler
// ignores .d.ts files, so this ships no runtime code.
declare const process: {
  env: Record<string, string | undefined>;
};

"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import { Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

/**
 * Linhas das gerações a decorrer, por cima da tabela de artigos.
 *
 * A geração demora vários minutos e acontece em passos separados (artigo,
 * imagem, cinco traduções). Sem isto o admin não teria como saber que há
 * trabalho a decorrer, e o diálogo tinha de ficar preso à espera.
 */

const LOCALES = ["pt", "de", "nl", "fr", "es"] as const;
/** artigo + imagem + 5 traduções */
const TOTAL_STEPS = 2 + LOCALES.length;

function stepsDone(run: {
  blogId?: string | null;
  localesDone: string[];
  localesFailed: string[];
}): number {
  const article = run.blogId ? 1 : 0;
  const locales = run.localesDone.length + run.localesFailed.length;
  // A imagem não é reportada em separado na listagem; deduz-se de o artigo já
  // existir e de haver traduções a andar.
  return Math.min(TOTAL_STEPS, article + locales);
}

export function BlogGeneratingRows() {
  const runs = useQuery(api.blogAutomation.listRuns, { limit: 5 });
  const active = (runs ?? []).filter(
    (r) => r.status === "running" && Date.now() - r.startedAt < 30 * 60_000,
  );
  const recentProblem = (runs ?? []).find(
    (r) =>
      (r.status === "failed" || r.status === "needsReview") &&
      Date.now() - r.startedAt < 60 * 60_000,
  );

  if (active.length === 0 && !recentProblem) return null;

  return (
    <div className="mb-3 space-y-2">
      {active.map((run) => {
        const done = stepsDone(run);
        const pct = Math.max(6, Math.round((done / TOTAL_STEPS) * 100));
        return (
          <div
            key={run._id}
            className="rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {run.title || run.topic || "A escolher o tópico…"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {run.blogId
                    ? `Artigo escrito. Imagem e traduções: ${run.localesDone.length}/${LOCALES.length}`
                    : "A escrever o artigo…"}
                </p>
              </div>
              <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
            </div>
            <div className="mt-2.5 h-1 w-full overflow-hidden rounded bg-muted">
              <div
                className="h-1 rounded bg-primary transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}

      {recentProblem && active.length === 0 && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3",
            recentProblem.status === "failed"
              ? "border-destructive/40 bg-destructive/5"
              : "border-amber-500/40 bg-amber-500/5",
          )}
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 text-sm">
            <p className="font-medium text-foreground">
              {recentProblem.status === "failed"
                ? "A última geração falhou"
                : "A última geração precisa de revisão"}
            </p>
            <p className="text-xs text-muted-foreground">
              {recentProblem.error ??
                `Traduções em falta: ${recentProblem.localesFailed.join(", ")}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

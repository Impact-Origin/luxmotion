"use client";

import * as React from "react";
import { useAction } from "convex/react";
import { api } from "@workspace/convex/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ICPS = ["Weddings", "Corporate & MICE", "Luxury"] as const;

/**
 * Gera um artigo à mão, sem esperar pelo cron. Deixar os dois campos vazios
 * entrega a escolha do tópico ao modelo, que é o que o cron faz.
 *
 * A geração demora vários minutos: o artigo, a imagem e as cinco traduções
 * correm em passos separados. O diálogo fecha assim que o pedido é aceite e o
 * resultado aparece na lista quando estiver pronto.
 */
export function BlogGenerateDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const generate = useAction(api.blogAutomation.generateNow);
  const [topic, setTopic] = React.useState("");
  const [icp, setIcp] = React.useState<string>("");
  const [keepDraft, setKeepDraft] = React.useState(true);
  const [isRunning, setIsRunning] = React.useState(false);

  const run = async () => {
    try {
      setIsRunning(true);
      const res = await generate({
        topic: topic.trim() || undefined,
        icp: icp || undefined,
        keepDraft,
      });
      if (res.ok) {
        toast.success(
          keepDraft
            ? "Geração iniciada. O artigo fica em rascunho para leres antes de publicar."
            : "Geração iniciada. O artigo é publicado assim que a imagem e as traduções estiverem prontas.",
        );
        setTopic("");
        setIcp("");
        onClose();
      } else {
        toast.error(res.error ?? "Não foi possível iniciar a geração.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha ao contactar o servidor.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Gerar artigo com IA</DialogTitle>
          <DialogDescription>
            Deixa os campos vazios para o modelo escolher o tópico a partir do que
            já foi publicado. O artigo sai em inglês e é traduzido para os outros
            cinco idiomas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blog-topic">Tópico (opcional)</Label>
            <Input
              id="blog-topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Wedding transport for destination weddings in Portugal"
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label>Público-alvo (opcional)</Label>
            <Select value={icp} onValueChange={setIcp} disabled={isRunning}>
              <SelectTrigger>
                <SelectValue placeholder="O modelo decide" />
              </SelectTrigger>
              <SelectContent>
                {ICPS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3">
            <Checkbox
              checked={keepDraft}
              onCheckedChange={(v) => setKeepDraft(v === true)}
              disabled={isRunning}
              className="mt-0.5"
            />
            <span className="text-sm">
              <span className="font-medium">Deixar em rascunho</span>
              <span className="block text-muted-foreground">
                Sem isto o artigo vai para o ar sozinho no fim. Para o primeiro
                teste, convém ficar ligado.
              </span>
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isRunning}>
            Cancelar
          </Button>
          <Button onClick={run} disabled={isRunning}>
            {isRunning ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-4" />
            )}
            {isRunning ? "A gerar…" : "Gerar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
